"use client";
import { apiHandler } from "@api/apiHandler";
import { DownloadIcon } from "@assets/index";
import CustomInput from "@components/CustomInput";
import FetchDropdown from "@components/FetchDropdown";
import Table from "@components/Table";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { selectLimit, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useDownloader from "react-use-downloader";
import { ARTIST_VALUES, ROUTES, SearchObj } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

const Page = () => {
  const eventTypeColumns = [
    { name: "Event Type", key: "event_type_name", sort: "event_type_name" },
    {
      name: "Event Vertical",
      key: "event_vertical_id.event_vertical_name",
      sort: "event_vertical_id.event_vertical_name",
    },
    {
      name: "Total Vendor",
      key: "totalVendor",
      sort: "totalVendor",
    },
    {
      name: "Create Date",
      key: "createdAt",
      sort: "createdAt",
      isDate: true,
      format: "DD/MM/YYYY",
    },
    {
      name: "Update Date",
      key: "updatedAt",
      sort: "updatedAt",
      isDate: true,
      format: "DD/MM/YYYY",
    },
    // { name: "Status", key: "status", sort: "" },
  ];

  const router = useRouter();
  const pathname = usePathname();
  const { download } = useDownloader();

  const dispatch = useAppDispatch();
  const permissions = useSelector(selectPermissions);
  const sidebar = useSelector(selectAdminSideBar);
  const limit = useSelector(selectLimit);

  // const permissions = checkCurrentSelectedTabPermission();
  const [searchKeys, setSearchKey] = useState(SearchObj);
  const [dropDownValues, setDropDownValues] = useState({
    event_vertical_id: "",
  });
  const [eventTypeData, setEventTypeData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [sort, setSort] = useState({
    sort_type: "event_type_name",
    sort: 1,
  });
  const [pagePermissions, setPagePermissions] = useState(null);
  const [eventTime, setEventTime] = useState([]);

  useEffect(() => {
    loadEventTime();
  }, []);

  useEffect(() => {
    setPagePermissions(
      permissions?.find(
        (n) =>
          n?.module?.value_code ===
          sidebar?.find((v) => pathname.includes(v?.path))?.value_code,
      )?.permissions,
    );
  }, [permissions]);

  const loadEventTime = async () => {
    try {
      const res = await apiHandler.values.lookup(
        `value=${ARTIST_VALUES.ARTIST_EVENT_TIME}`,
      );
      if (res?.status === 200 || res?.status === 201) {
        setEventTime(res?.data?.data);
      }
    } catch (error) {}
  };

  const fetchEventTypes = async (currentPage, keyword = "") => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${currentPage}&search=${keyword}&event_vertical_id=${dropDownValues.event_vertical_id}`;
      const { data, status } = await apiHandler.eventType.list(query);

      if (status === 200 || status === 201) {
        const formattedData = data?.data?.data;

        setEventTypeData(formattedData);
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

  const handleView = (eventType) => {
    // router.push(`${ROUTES.admin.eventType}/option?id=${eventType._id}&view=1`);
    window.open(
      `${ROUTES.admin.eventType}/option?id=${eventType._id}&view=1`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleUpdate = (eventType) => {
    // router.push(`${ROUTES.admin.eventType}/option?id=${eventType._id}`);
    window.open(
      `${ROUTES.admin.eventType}/option?id=${eventType._id}`,
      "_blank",
      "noopener,noreferrer",
    );
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

  const handleExcel = async (keyword = "") => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${page}&search=${keyword}&event_vertical_id=${dropDownValues.event_vertical_id}`;
      const { data, status } = await apiHandler.eventType.excel(query);

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

  useEffect(() => {
    fetchEventTypes(page, searchKeys.search);
  }, [page, searchKeys.search, sort.sort, sort.sort_type, dropDownValues]);

  const handleFetchDropdownChange = useCallback((name: string, value: any) => {
    setDropDownValues((prev) => ({ ...prev, [name]: value?._id || "" }));
  }, []);

  const handleReset = () => {
    setDropDownValues({
      event_vertical_id: "",
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
      key="dropDownValues.event_vertical_id"
      className="w-full sm:w-[30%] md:w-[20%]"
    >
      <FetchDropdown
        placeholder="Select Vertical"
        value={dropDownValues.event_vertical_id}
        endPoints={apiHandler.eventVertical.lookup}
        filterStr="NA"
        func={handleFetchDropdownChange}
        objKey="event_vertical_id"
        display="event_vertical_name"
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
        <h1 className="text-xl font-bold">Manage Event Types</h1>
        <button
          key="handleExcel"
          onClick={() => handleExcel()}
          className="text-15-700 btn-outline-hover flex h-fit w-fit justify-between rounded-xl border border-green-300 bg-green-50 px-1 py-1 text-green-300 sm:px-3 sm:py-2"
        >
          <DownloadIcon className={"h-6 w-6"} />
          <span className="text-body-xs ml-2">Export</span>
        </button>
        {/* {pagePermissions?.[PERMISSIONS.CREATE] ? (
          <button
            onClick={() => router.push(`${ROUTES.admin.eventType}/option`)}
            className="text-15-700 btn-outline-hover flex h-fit w-fit justify-between rounded-xl border border-blue-100 bg-primary-100 px-1 py-1 text-blue-100 sm:px-3 sm:py-2"
          >
            <PlusIcon />
            <span className="text-body-xs ml-2">Add</span>
          </button>
        ) : null} */}
      </div>
      <Table
        columns={eventTypeColumns}
        data={eventTypeData}
        actions={{
          onUpdate: handleUpdate,
          onView: handleView,
          showDelete: false,
        }}
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
