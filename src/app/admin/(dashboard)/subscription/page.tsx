"use client";
import { apiHandler } from "@api/apiHandler";
import { DownloadIcon } from "@assets/index";
import CustomInput from "@components/CustomInput";
import FetchDropdown from "@components/FetchDropdown";
import Table from "@components/Table";
import { selectLimit, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useDownloader from "react-use-downloader";
import { SearchObj } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

const Page = () => {
  const subscriptionColumns = [
    {
      name: "Company Name",
      key: "company_name",
      sort: "company_name",
      tdClassName: "text-wrap",
    },
    {
      name: "Vendor Name",
      key: "full_name",
      sort: "full_name",
      tdClassName: "text-wrap",
    },
    { name: "Plan Name", key: "plan_name", sort: "plan_name" },
    {
      name: "City",
      key: "location_name",
      sort: "location_name",
      tdClassName: "!text-wrap",
    },
    { name: "Amount", key: "amount", sort: "amount" },
    {
      name: "Subscribed At",
      key: "createdAt",
      sort: "createdAt",
      isDate: true,
      format: "DD/MM/YYYY",
    },
    {
      name: "Expire At",
      key: "expire_at",
      sort: "expire_at",
      isDate: true,
      format: "DD-MM-YYYY",
    },
    { name: "Coupon", key: "coupon", sort: "coupon" },
    { name: "GST Number", key: "gst_number", sort: "gst_number" },
    { name: "Status", key: "status", sort: "" },
  ];

  const router = useRouter();
  const [dropDownValues, setDropDownValues] = useState({
    location_id: "",
    plan_id: "",
  });
  const [searchKeys, setSearchKey] = useState(SearchObj);
  const { download } = useDownloader();
  const limit = useSelector(selectLimit);

  const dispatch = useAppDispatch();
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [sort, setSort] = useState({
    sort_type: "company_name",
    sort: 1,
  });

  const fetchSubscriptions = async (currentPage, keyword = "") => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${currentPage}&search=${keyword}&location_id=${dropDownValues.location_id}&plan_id=${dropDownValues.plan_id}`;
      const { data, status } = await apiHandler.subscriptions.list(query);
      if (status === 200 || status === 201) {
        const updatedData = data?.data?.data.map((item) => ({
          ...item,
          expire_at: item.expire_at || "Unlimited",
          location_name: item.location_name.join(", "),
        }));
        setSubscriptionData(updatedData);
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
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&search=${searchKeys.search}&location_id=${dropDownValues.location_id}&plan_id=${dropDownValues.plan_id}`;
      const { data, status } = await apiHandler.subscriptions.excel(query);
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
  const handleFetchDropdownChange = useCallback((name: string, value: any) => {
    setDropDownValues((prev) => ({ ...prev, [name]: value?._id || "" }));
  }, []);

  const handleSearch = (e) => {
    setSearchKey((prev) => ({ ...prev, search: e.target.value }));
    setPage(1);
  };

  const handleSort = (sortObj) => {
    setSort(sortObj);
  };

  const handleReset = () => {
    setDropDownValues({
      location_id: "",
      plan_id: "",
    });
    setSearchKey(SearchObj);
    setPage(1);
    setSort({
      sort_type: "business_category_name",
      sort: 1,
    });
  };

  useEffect(() => {
    fetchSubscriptions(page, searchKeys.search);
  }, [page, searchKeys.search, sort.sort, sort.sort_type, dropDownValues]);

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
      key="dropDownValues.location_id"
      className="w-full sm:w-[30%] md:w-[20%]"
    >
      <FetchDropdown
        placeholder="Select city"
        value={dropDownValues.location_id}
        endPoints={apiHandler.values.cities}
        filterStr="NA"
        func={handleFetchDropdownChange}
        objKey="location_id"
        display="name"
      />
    </div>,
    <div key="dropDownValues.plan_id" className="w-full sm:w-[30%] md:w-[20%]">
      <FetchDropdown
        placeholder="Select plan"
        value={dropDownValues.plan_id}
        endPoints={apiHandler.plans.lookup}
        filterStr="NA"
        func={handleFetchDropdownChange}
        objKey="plan_id"
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
        <h1 className="text-xl font-bold">Manage Subscribers</h1>
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
        columns={subscriptionColumns}
        data={subscriptionData}
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
