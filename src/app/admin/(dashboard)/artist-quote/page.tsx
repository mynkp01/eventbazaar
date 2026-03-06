"use client";
import { apiHandler } from "@api/apiHandler";
import { DownloadIcon } from "@assets/index";
import CustomInput from "@components/CustomInput";
import DateRangePicker from "@components/DateRangePicker";
import FetchDropdown from "@components/FetchDropdown";
import Table from "@components/Table";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { selectLimit, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useDownloader from "react-use-downloader";
import { ARTIST_VALUES, QUOTE_TYPE, SearchObj } from "src/utils/Constant";
import { isEmpty, showToast } from "src/utils/helper";

const Page = () => {
  const quoteColumns = [
    {
      name: "Event Type",
      key: "event_vertical.event_vertical_name",
      sort: "event_vertical.event_vertical_name",
      tdClassName: "text-wrap",
    },
    {
      name: "Customer Name",
      key: "userData.full_name",
      sort: "userData.full_name",
      tdClassName: "text-wrap",
    },
    {
      name: "Vendor Name",
      key: "vendor.full_name",
      sort: "vendor.full_name",
      tdClassName: "text-wrap",
    },
    {
      name: "Company Name",
      key: "vendor.company_name",
      sort: "vendor.company_name",
      tdClassName: "text-wrap",
    },
    { name: "City", key: "city", sort: "city" },
    {
      name: "Venue Type",
      key: "venue.business_sub_category_name",
      sort: "venue.business_sub_category_name",
      tdClassName: "text-wrap",
    },
    { name: "No Of People", key: "noOfPeople.name", sort: "noOfPeople.name" },
    { name: "Event Time", key: "event_time.name", sort: "event_time.name" },
    {
      name: "Event Date",
      key: "event_date",
      sort: "event_date",
      isDate: true,
      format: "DD-MM-YYYY",
    },
    {
      name: "Inquiry Date",
      key: "createdAt",
      sort: "createdAt",
      isDate: true,
      format: "DD-MM-YYYY",
    },
  ];

  const router = useRouter();
  const dispatch = useAppDispatch();
  const sidebar = useSelector(selectAdminSideBar);

  const pathname = usePathname();
  const { download } = useDownloader();
  const limit = useSelector(selectLimit);

  const [searchKeys, setSearchKey] = useState(SearchObj);
  const [quoteData, setQuoteData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(null);
  const [filterByDate, setFilterByDate] = useState<{
    start_date: dayjs.Dayjs;
    end_date: dayjs.Dayjs;
  } | null>(null);
  const [sort, setSort] = useState({
    sort_type: "venue",
    sort: 1,
  });
  const [pagePermissions, setPagePermissions] = useState(null);
  const permissions = useSelector(selectPermissions);
  const [dropDownValues, setDropDownValues] = useState({
    event_time: "",
    venue: "",
    event_vertical: "",
  });
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
  const handleReset = () => {
    setDropDownValues({
      event_time: "",
      venue: "",
      event_vertical: "",
    });
    setFilterByDate({
      start_date: null,
      end_date: null,
    });
    setSearchKey(SearchObj);
    setPage(1);
    setSort({
      sort_type: "venue",
      sort: 1,
    });
  };

  const fetchQuote = async (
    currentPage,
    keyword = "",
    start_date = null,
    end_date = null,
  ) => {
    try {
      dispatch(setIsLoading(true));
      let query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${currentPage}&search=${keyword}&event_time=${dropDownValues?.event_time}&venue=${dropDownValues?.venue}&event_vertical=${dropDownValues?.event_vertical}&list_type=${QUOTE_TYPE.ARTIST}`;
      if (!isEmpty(start_date)) {
        query += `&start_date=${dayjs(filterByDate?.start_date).format(
          "YYYY-MM-DD",
        )}`;
      }
      if (!isEmpty(end_date)) {
        query += `&end_date=${dayjs(filterByDate?.end_date).format(
          "YYYY-MM-DD",
        )}`;
      }
      const { data, status } = await apiHandler.requestQuote.list(query);

      if (status === 200 || status === 201) {
        const formattedData = data?.data?.data;

        setQuoteData(formattedData);
        setTotalPages(data?.data?.totalPages || 1);
        setTotalRecordCount(data?.data?.totalRecords || 0);
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      if (err?.error?.status === 406) {
        showToast("error", err.message);
        return router.back();
      }
      showToast("error", err.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleExcel = async (
    keyword = "",
    start_date = null,
    end_date = null,
  ) => {
    try {
      dispatch(setIsLoading(true));
      let query = `sort_type=${sort.sort_type}&sort=${sort.sort}&search=${keyword}&event_time=${dropDownValues?.event_time}&venue=${dropDownValues?.venue}&event_vertical=${dropDownValues?.event_vertical}&list_type=${QUOTE_TYPE.ARTIST}`;
      if (!isEmpty(start_date)) {
        query += `&start_date=${dayjs(filterByDate?.start_date).format(
          "YYYY-MM-DD",
        )}`;
      }
      if (!isEmpty(end_date)) {
        query += `&end_date=${dayjs(filterByDate?.end_date).format(
          "YYYY-MM-DD",
        )}`;
      }
      const { data, status } = await apiHandler.requestQuote.excel(query);

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
      }
      showToast("error", err.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleFetchDropdownChange = useCallback((name: string, value: any) => {
    setDropDownValues((prev) => ({ ...prev, [name]: value?._id || "" }));
  }, []);

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

  useEffect(() => {
    fetchQuote(
      page,
      searchKeys.search,
      filterByDate?.start_date,
      filterByDate?.end_date,
    );
  }, [
    page,
    searchKeys.search,
    sort.sort,
    sort.sort_type,
    dropDownValues,
    filterByDate?.start_date,
    filterByDate?.end_date,
  ]);

  const filters = [
    <div key="searchKeys.searchValue" className="w-full">
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
    <div key="dropDownValues.event_time" className="w-full">
      <FetchDropdown
        endPoints={apiHandler.values.lookup}
        filterStr={`value=${ARTIST_VALUES.ARTIST_EVENT_TIME}`}
        placeholder="Event Time"
        value={dropDownValues?.event_time}
        display="name"
        objKey="event_time"
        func={handleFetchDropdownChange}
      />
    </div>,
    <div key="dropDownValues.venue" className="w-full">
      <FetchDropdown
        endPoints={apiHandler.eventType.eventVenueLookup}
        filterStr={`value=${ARTIST_VALUES.ARTIST_VENUE_TYPE}`}
        placeholder="Venue"
        value={dropDownValues?.venue}
        display="name"
        objKey="venue"
        func={handleFetchDropdownChange}
      />
    </div>,
    <div key="dropDownValues.event_time" className="w-full">
      <FetchDropdown
        endPoints={apiHandler.eventVertical.lookup}
        filterStr="NA"
        placeholder="Event Vertical"
        value={dropDownValues?.event_vertical}
        objKey="event_vertical"
        display="event_vertical_name"
        func={handleFetchDropdownChange}
      />
    </div>,
    <div
      key="dateRangePicker"
      className="mt-2 w-full rounded-lg border border-x-2 border-primary-20 bg-primary-50 p-3"
    >
      <DateRangePicker
        value={
          !isEmpty(filterByDate?.start_date) || !isEmpty(filterByDate?.end_date)
            ? [filterByDate?.start_date, filterByDate?.end_date]
            : []
        }
        onChange={(dates) =>
          setFilterByDate({
            start_date: dates?.[0],
            end_date: dates?.[1],
          })
        }
        format="DD-MM-YYYY"
        className="!w-full !border-none bg-primary-50 !px-0 !py-0 !font-bold"
        placeholder={["Start Date", "End Date"]}
      />
    </div>,

    <button
      key="handleReset"
      onClick={handleReset}
      className="text-15-700 btn-outline-hover mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-blue-100 bg-primary-100 text-blue-100"
    >
      <span className="text-body-xs">Reset</span>
    </button>,
  ];

  return (
    <>
      <div className="border-wh-300 flex flex-col !gap-4 rounded-2xl border bg-white !p-4 md:!p-6">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold">Request Quote for Artist</h1>
          <button
            key="handleReset"
            onClick={() =>
              handleExcel(
                searchKeys.search,
                filterByDate?.start_date,
                filterByDate?.end_date,
              )
            }
            className="text-15-700 btn-outline-hover flex h-fit w-fit justify-between rounded-xl border border-green-300 bg-green-50 px-1 py-1 text-green-300 sm:px-3 sm:py-2"
          >
            <DownloadIcon className={"h-6 w-6"} />
            <span className="text-body-xs ml-2">Export</span>
          </button>
        </div>
        <Table
          columns={quoteColumns}
          data={quoteData}
          totalPages={totalPages}
          currentPage={page}
          handlePageChange={handlePageChange}
          onSearch={handleSearch}
          onSort={handleSort}
          filters={filters}
          filterClass="sm:!grid sm:!grid-cols-3 lg:!grid-cols-6 !h-fit"
          isResultElement={
            totalRecordCount ? (
              <p className="text-xs text-grey-1300 md:text-sm">{`Showing ${page * limit - limit + 1} – ${page === totalPages || totalRecordCount <= limit ? totalRecordCount : page * limit} of ${totalRecordCount} results`}</p>
            ) : null
          }
        />
      </div>
    </>
  );
};

export default Page;
