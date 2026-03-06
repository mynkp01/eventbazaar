"use client";
import { apiHandler } from "@api/apiHandler";
import { DownloadIcon } from "@assets/index";
import CustomInput from "@components/CustomInput";
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
      name: "Full Name",
      key: "full_name",
      sort: "full_name",
      tdClassName: "text-wrap",
    },
    {
      name: "Company Name",
      key: "company_name",
      sort: "company_name",
      tdClassName: "text-wrap",
    },
    { name: "Primary Email", key: "primary_email", sort: "primary_email" },
    {
      name: "Primary Contact",
      key: "primary_contact",
      sort: "primary_contact",
    },
    {
      name: "Address",
      key: "address",
      sort: "address",
      tdClassName: "text-wrap",
    },
    {
      name: "Enquiry Date",
      key: "createdAt",
      sort: "createdAt",
      isDate: true,
      format: "DD/MM/YYYY",
    },
    {
      name: "Connection Status",
      key: "connectionStatus",
      sort: "connectionStatus",
    },
  ];
  const status = [
    { _id: "1", name: "Pending" },
    { _id: "2", name: "	Connected" },
  ];
  const { download } = useDownloader();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const limit = useSelector(selectLimit);

  const [searchKeys, setSearchKey] = useState(SearchObj);
  const [dropDownValues, setDropDownValues] = useState({
    status: null,
  });
  const [enquiryData, setEnquiryData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [sort, setSort] = useState({
    sort_type: "full_name",
    sort: 1,
  });

  const fetchEnquiries = async (currentPage, keyword = "") => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${currentPage}&search=${keyword}&status=${dropDownValues?.status?.name || ""}`;
      const { data, status } = await apiHandler.enterprise.list(query);

      if (status === 200 || status === 201) {
        setEnquiryData(data?.data?.data || []);
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
  const handleExcel = async () => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&search=${searchKeys.search}&status=${dropDownValues?.status?.name || ""}`;
      const { data, status } = await apiHandler.enterprise.excel(query);

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

  const handleUpdateConnectionStatus = async (vendor) => {
    try {
      showPopup("info", `Mark vendor as contacted`, {
        confirmButtonText: "OK",
        showCancelButton: true,
        onClickConfirm: async () => {
          dispatch(setIsLoading(true));
          try {
            const { data, status } = await apiHandler.enterprise.updateStatus(
              vendor._id,
            );

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
    setDropDownValues((prev) => ({ ...prev, [name]: value || "" }));
  }, []);

  const handleReset = () => {
    setDropDownValues({
      status: null,
    });
    setSearchKey(SearchObj);
    setPage(1);
    setSort({
      sort_type: "business_category_name",
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
        <h1 className="text-xl font-bold">Manage Enterprise Enquiries</h1>
        <button
          key="handleReset"
          onClick={() => handleExcel()}
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
          customAction: (vendor) =>
            vendor.connectionStatus === "Pending" ? (
              <button
                className="flex items-center justify-center rounded-md border bg-green-400 px-2 py-1 text-sm font-bold text-white transition-all duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400"
                onClick={() => handleUpdateConnectionStatus(vendor)}
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
            <p className="text-xs text-grey-1300 md:text-sm">{`Showing ${page * limit - limit + 1} – ${page === totalPages || totalRecordCount <= limit ? totalRecordCount : page * 20} of ${totalRecordCount} results`}</p>
          ) : null
        }
      />
    </div>
  );
};

export default Page;
