"use client";
import { apiHandler } from "@api/apiHandler";
import { DownloadIcon } from "@assets/index";
import CustomInput from "@components/CustomInput";
import FetchDropdown from "@components/FetchDropdown";
import FetchStyledDropdown from "@components/FetchStyledDropdown";
import Table from "@components/Table";
import { selectLimit, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useDownloader from "react-use-downloader";
import { SearchObj } from "src/utils/Constant";
import { showPopup, showToast } from "src/utils/helper";

const Page = () => {
  const enquiryColumns = [
    {
      name: "Plan Name",
      key: "plan.plan_name",
      sort: "plan.plan_name",
      tdClassName: "text-wrap",
    },
    {
      name: "Full Name",
      key: "full_name",
      sort: "full_name",
      tdClassName: "text-wrap",
    },
    { name: "Contact Number", key: "contact_number", sort: "contact_number" },
    { name: "Email", key: "email", sort: "email" },
    {
      name: "Event Date",
      key: "date",
      isDate: true,
      format: "DD/MM/YYYY",
      sort: "date",
    },
    {
      name: "Inquiry Date",
      key: "createdAt",
      isDate: true,
      format: "DD/MM/YYYY",
      sort: "createdAt",
    },
  ];
  const status = [
    { _id: "1", name: "Pending" },
    { _id: "2", name: "	Connected" },
  ];
  const { download } = useDownloader();

  const router = useRouter();
  const limit = useSelector(selectLimit);

  const dispatch = useAppDispatch();
  const [searchKeys, setSearchKey] = useState(SearchObj);
  const [dropDownValues, setDropDownValues] = useState({
    status: null,
    bazar_buddy_plan_id: "",
  });
  const [enquiryData, setEnquiryData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState({
    sort_type: "",
    sort: 1,
  });

  const fetchEnquiries = async (currentPage, keyword = "") => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${currentPage}&search=${keyword}&status=${dropDownValues?.status?.name || ""}&bazar_buddy_plan_id=${dropDownValues.bazar_buddy_plan_id}`;
      const { data, status } =
        await apiHandler.bazaarBuddyConsultant.list(query);

      if (status === 200 || status === 201) {
        setEnquiryData(data?.data?.records || []);
        setTotalPages(data?.data?.totalPages || 1);
        setTotalRecordCount(data?.data?.totalRecords);
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      if (err?.error?.status === 406) {
        showToast("error", err.message);
        return router.back();
      }
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleExcel = async (keyword = "") => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&search=${keyword}&status=${dropDownValues?.status?.name || ""}&bazar_buddy_plan_id=${dropDownValues.bazar_buddy_plan_id}`;
      const { data, status } =
        await apiHandler.bazaarBuddyConsultant.excel(query);

      if (status === 200 || status === 201) {
        await download(
          data?.data,

          data?.data?.split("/")[data?.data?.split("/")?.length - 1],
        );
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      if (err?.error?.status === 406) {
        showToast("error", err.message);
        return router.back();
      }
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = (e) => {
    setSearchKey((prev) => ({ ...prev, search: e.target.value }));
    setPage(1);
  };

  const handleSort = (sortObj) => {
    setSort(sortObj);
  };

  const handleUpdateConnectionStatus = async (customer) => {
    try {
      showPopup("info", `Mark Customer as contacted`, {
        confirmButtonText: "OK",
        showCancelButton: true,
        onClickConfirm: async () => {
          dispatch(setIsLoading(true));
          try {
            const { data, status } =
              await apiHandler.bazaarBuddyConsultant.updateStatus(customer._id);

            if (status === 200 || status === 201) {
              showToast("success", data?.message);
              fetchEnquiries(page, searchKeys.search);
            } else {
              showToast("error", data?.message);
            }
          } catch (err) {
            showToast("error", err.message);
          } finally {
            dispatch(setIsLoading(false));
          }
        },
      });
    } catch (err) {
      showToast("error", err.message);
    }
  };

  useEffect(() => {
    fetchEnquiries(page, searchKeys.search);
  }, [page, searchKeys.search, sort.sort, sort.sort_type, dropDownValues]);

  const handleFetchDropdownChange = useCallback((name: string, value: any) => {
    if (name === "bazar_buddy_plan_id")
      setDropDownValues((prev) => ({ ...prev, [name]: value._id || "" }));
    else setDropDownValues((prev) => ({ ...prev, [name]: value || "" }));
  }, []);

  const handleReset = () => {
    setDropDownValues({
      status: null,
      bazar_buddy_plan_id: "",
    });
    setSearchKey(SearchObj);
    setPage(1);
    setSort({
      sort_type: "",
      sort: 1,
    });
  };

  const filters = [
    <div key="searchKeys.searchValue" className="w-full sm:w-[30%] md:w-[20%]">
      <CustomInput
        value={searchKeys.searchValue}
        onChange={(e) =>
          setSearchKey((prev) => ({ ...prev, searchValue: e.target.value }))
        }
        onKeyDown={handleSearch}
        onBlur={handleSearch}
        placeholder="Search..."
      />
    </div>,
    <div
      key="dropDownValues?.status?._id"
      className="w-full sm:w-[30%] md:w-[20%]"
    >
      <FetchStyledDropdown
        placeholder="Select status"
        func={handleFetchDropdownChange}
        display="name"
        arr={status}
        objKey="status"
        value={dropDownValues?.status?._id}
        isComponentDisabled={false}
        multiple={false}
      />
    </div>,
    <div
      key="dropDownValues?.status?._id"
      className="w-full sm:w-[30%] md:w-[20%]"
    >
      <FetchDropdown
        placeholder="Select plan"
        value={dropDownValues.bazar_buddy_plan_id}
        endPoints={apiHandler.bazaarBuddyPlan.lookup}
        filterStr="NA"
        func={handleFetchDropdownChange}
        objKey="bazar_buddy_plan_id"
        display="plan_name"
      />
    </div>,
    <div key="handleReset" className="w-full sm:w-fit">
      <button
        onClick={handleReset}
        className="text-15-700 btn-outline-hover h-fit w-full rounded-xl border border-blue-100 bg-primary-100 px-6 py-2 text-blue-100"
      >
        <span className="text-body-xs">Reset</span>
      </button>
    </div>,
  ];

  return (
    <div className="border-wh-300 flex flex-col !gap-4 rounded-2xl border bg-white !p-4 md:!p-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Manage Bazaar Buddy Enquiries</h1>
        <button
          key="handleReset"
          onClick={() => handleExcel(searchKeys.search)}
          className="text-15-700 btn-outline-hover flex h-fit w-fit justify-between rounded-xl border border-green-300 bg-green-50 px-1 py-1 text-green-300 sm:px-3 sm:py-2"
        >
          <DownloadIcon className={"h-6 w-6"} />
          <span className="text-body-xs ml-2">Export</span>
        </button>
      </div>
      <Table
        actions={{
          showView: false,
          showUpdate: false,
          showDelete: false,
          customAction: (customer) =>
            customer.connectionStatus === "Pending" ? (
              <button
                className="flex items-center justify-center rounded-md border bg-green-400 px-2 py-1 text-sm font-bold text-white transition-all duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400"
                onClick={() => handleUpdateConnectionStatus(customer)}
              >
                Mark Contacted
              </button>
            ) : null,
        }}
        columns={enquiryColumns}
        data={enquiryData}
        totalPages={totalPages}
        currentPage={page}
        handlePageChange={handlePageChange}
        onSearch={handleSearch}
        onSort={handleSort}
        filters={filters}
        isResultElement={
          totalRecordCount ? (
            <p className="text-xs text-grey-1300 md:text-sm">{`Showing ${page * limit - limit + 1} – ${page === totalPages || totalRecordCount <= limit ? totalRecordCount : page * limit} of ${totalRecordCount} results`}</p>
          ) : null
        }
      />
    </div>
  );
};

export default Page;
