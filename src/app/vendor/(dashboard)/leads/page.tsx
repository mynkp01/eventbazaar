"use client";
import { apiHandler } from "@api/apiHandler";
import CustomInput from "@components/CustomInput";
import DateRangePicker from "@components/DateRangePicker";
import InfoBox from "@components/InfoBox";
import LabelField from "@components/LabelField";
import PageAction from "@components/PageAction";
import Table from "@components/Table";
import { Modal } from "@mui/material";
import { selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { leadStatus, PLAN_CODE } from "src/utils/Constant";
import { isEmpty, showToast } from "src/utils/helper";

const DATA_LENGTH = 20;
const leadsListColumns = [
  {
    name: "Client Name",
    key: "client_name",
    sort: "client_name",
    tdClassName: "text-wrap",
  },
  { name: "Client Email", key: "client_email", sort: "client_email" },
  { name: "Client Phone", key: "client_phone", sort: "client_phone" },
  { name: "City", key: "city", sort: "city" },
  {
    name: "Contact Type",
    key: "contactType",
    tdClassName: "text-wrap",
    sort: "contactType",
  },
  {
    name: "Contact Status",
    key: "contactStatus.name",
    sort: "contactStatus",
    tdClassName: "text-wrap",
  },
  { name: "Message", key: "message", tdClassName: "text-wrap" },
  {
    name: "Lead Generation Date",
    key: "createdAt",
    isDate: true,
    format: "DD-MM-YYYY hh:mm A",
    sort: "createdAt",
  },
];

const Leads = () => {
  const userData = useSelector(selectUser);
  const [openModal, setOpenModal] = useState(false);
  const [contactStatus, setContactStatus] = useState(leadStatus[0]);
  const [leadId, setLeadId] = useState("");
  const dispatch = useAppDispatch();
  const [leadsData, setLeadsData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterByDate, setFilterByDate] = useState<{
    start_date: dayjs.Dayjs;
    end_date: dayjs.Dayjs;
  } | null>(null);
  const [sort, setSort] = useState({ sort_type: "createdAt", sort: -1 });

  useEffect(() => {
    loadLeads(page);
  }, [page, sort?.sort, sort?.sort_type]);

  const handleDropdownChange = (data: any) => {
    setContactStatus(data);
  };

  const loadLeads = async (currentPage, start_date = null, end_date = null) => {
    try {
      let query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${currentPage}`;
      if (!isEmpty(start_date)) {
        query += `&startDate=${dayjs(filterByDate?.start_date).format(
          "YYYY-MM-DD",
        )}`;
      }
      if (!isEmpty(end_date)) {
        query += `&endDate=${dayjs(filterByDate?.end_date).format(
          "YYYY-MM-DD",
        )}`;
      }

      const { data, status } = await apiHandler.vendor.leadsListing(query);
      if (status === 200 || status === 201) {
        let formattedData = data?.data?.records;
        formattedData.map((ele) => {
          ele.contactStatus =
            leadStatus.find((item) => item._id === ele.contactStatus) ||
            leadStatus[0];
          return ele;
        });
        setLeadsData(formattedData);
        setTotalPages(Math.ceil(data?.data?.noOfRecords / DATA_LENGTH) || 1);
      } else {
        showToast("error", data?.message);
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.vendor.updateLeadStatus(
        leadId,
        {
          contactStatus: contactStatus._id,
        },
      );
      if ([200, 201].includes(status)) {
        showToast("success", data?.message);
        setOpenModal(false);
        loadLeads(page);
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSort = (sortObj) => {
    setSort(sortObj);
  };

  const handleSearch = useCallback(() => {
    loadLeads(page, filterByDate?.start_date, filterByDate?.end_date);
  }, [page, filterByDate?.start_date, filterByDate?.end_date]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="heading-40">Leads</h3>
      <div className="rounded-xl bg-primary-100 p-2 sm:m-0 sm:p-6">
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-4">
            <p className="flex flex-col items-center justify-center gap-4 p-2 text-center font-sans text-[20px] font-bold">
              Enquiries
            </p>
          </div>

          {/* <button className="w-full rounded-md border border-x-2 border-primary-50 p-2 text-[15px] font-bold">
            Start Date - End Date
          </button> */}
          <div className="w-full rounded-md border border-x-2 border-primary-50 p-2 text-[15px] font-bold">
            <DateRangePicker
              value={
                !isEmpty(filterByDate?.start_date) ||
                !isEmpty(filterByDate?.end_date)
                  ? [filterByDate?.start_date, filterByDate?.end_date]
                  : []
              }
              onChange={(dates) =>
                setFilterByDate({
                  start_date: dates?.[0],
                  end_date: dates?.[1],
                })
              }
              format="YYYY-MM-DD"
              className="!w-full !border-none !px-0 !py-0"
              placeholder={["Start Date", "End Date"]}
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-full rounded-md border border-blue-100 p-2 text-[15px] text-blue-100 transition-all duration-300 ease-in-out hover:bg-blue-100 hover:text-white"
          >
            Search
          </button>
        </div>
        {}
        {userData?.plan_code === PLAN_CODE.lite ? (
          <InfoBox
            text={
              "To view complete user details, please consider a plan upgrade"
            }
          />
        ) : null}

        <div className="w-full overflow-x-auto">
          <Table
            columns={leadsListColumns}
            data={leadsData}
            totalPages={totalPages}
            currentPage={page}
            handlePageChange={handlePageChange}
            onSort={handleSort}
            actions={{
              customAction: (lead) => (
                <>
                  <button
                    className="flex items-center justify-center text-nowrap rounded-md border bg-green-400 px-3 py-1 text-sm font-bold text-white transition-all duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400"
                    onClick={() => {
                      setOpenModal(true);
                      setLeadId(lead?._id);
                      setContactStatus(
                        () =>
                          leadStatus?.find(
                            (ele) => ele?._id === lead?.contactStatus?._id,
                          ) || leadStatus[0],
                      );
                    }}
                  >
                    {lead?.contactStatus?.name
                      ? lead?.contactStatus?.name
                      : leadStatus[0].name}
                  </button>
                </>
              ),
            }}
          />
        </div>
      </div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        className="flex h-full w-full items-center justify-center !p-6"
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          className={`"h-fit" relative z-50 flex w-full max-w-2xl flex-col overflow-y-auto rounded-xl bg-white shadow-lg`}
        >
          <div className="sticky top-0 z-50 flex items-center justify-between bg-white p-4 sm:p-6">
            <h3 className="text-xl font-semibold">
              {/* {payload?._id ? "Update Reels" : "Add New Reels"} */}
            </h3>
          </div>
          <div className="flex flex-col gap-4 p-4 !pt-0 sm:p-6">
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <div className="flex w-full flex-col gap-3">
                <div>
                  <LabelField
                    labelText="Select Category"
                    toolTipText="Select Category"
                    className="mb-1.5"
                  />

                  <div className="flex flex-col gap-4">
                    <CustomInput
                      value={contactStatus.name}
                      disabled
                      className="!text-black"
                    />
                    <div className="flex max-h-32 flex-col divide-y overflow-y-auto rounded-lg shadow-md">
                      {leadStatus.map((i) => (
                        <button
                          className={`w-full px-4 py-2 text-left ${i._id === contactStatus._id ? "bg-gray-200" : ""}`}
                          key={i._id}
                          onClick={() => handleDropdownChange(i)}
                        >
                          <p>{i.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <PageAction
              className="!mt-0"
              btnPrimaryClassName="w-full !mt-0 hover:!text-primary-100"
              btnPrimaryFun={() => {
                handleUpdateStatus();
              }}
              btnPrimaryLabel="Upload"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Leads;
