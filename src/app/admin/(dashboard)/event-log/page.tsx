"use client";
import { apiHandler } from "@api/apiHandler";
import CustomInput from "@components/CustomInput";
import DateRangePicker from "@components/DateRangePicker";
import Table from "@components/Table";
import { selectAdminSideBar } from "@redux/slices/authSlice";
import { selectLimit, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useDownloader from "react-use-downloader";
import { SearchObj } from "src/utils/Constant";
import { isEmpty, showToast } from "src/utils/helper";

const Page = () => {
  const logColumns = [
    {
      name: "User Name",
      key: "userdata.full_name",
    },
    {
      name: "User Type",
      key: "userType",
    },
    {
      name: "Module",
      key: "module",
    },
    {
      name: "Description",
      key: "description",
    },
    {
      name: "Event Log Date",
      key: "createdAt",
      isDate: true,
      format: "DD-MM-YYYY",
    },
  ];

  const router = useRouter();
  const dispatch = useAppDispatch();
  const sidebar = useSelector(selectAdminSideBar);
  const limit = useSelector(selectLimit);

  const pathname = usePathname();
  const { download } = useDownloader();

  const [searchKeys, setSearchKey] = useState(SearchObj);
  const [eventLogData, setEventLogData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [filterByDate, setFilterByDate] = useState<{
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
  } | null>(null);
  const [sort, setSort] = useState({
    sort_type: "createdAt",
    sort: -1,
  });

  const handleReset = () => {
    setFilterByDate({
      startDate: null,
      endDate: null,
    });
    setSearchKey(SearchObj);
    setPage(1);
    setSort({
      sort_type: "venue",
      sort: 1,
    });
  };

  const fetchEventLog = async (
    currentPage,
    keyword = "",
    startDate = null,
    endDate = null,
  ) => {
    try {
      dispatch(setIsLoading(true));
      let query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${currentPage}&search=${keyword}`;
      if (!isEmpty(startDate)) {
        query += `&startDate=${dayjs(filterByDate?.startDate).format(
          "YYYY-MM-DD",
        )}`;
      }
      if (!isEmpty(endDate)) {
        query += `&endDate=${dayjs(filterByDate?.endDate).format(
          "YYYY-MM-DD",
        )}`;
      }
      const { data, status } = await apiHandler.eventLog.list(query);

      if (status === 200 || status === 201) {
        const formattedData = data?.data?.data;

        setEventLogData(formattedData);
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
      showToast("error", err.message);
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

  useEffect(() => {
    fetchEventLog(
      page,
      searchKeys.search,
      filterByDate?.startDate,
      filterByDate?.endDate,
    );
  }, [
    page,
    searchKeys.search,
    sort.sort,
    sort.sort_type,
    filterByDate?.startDate,
    filterByDate?.endDate,
  ]);

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
      key="dateRangePicker"
      className="mt-2 w-full rounded-lg border border-x-2 border-none bg-primary-200 p-3 sm:w-[30%] md:w-[20%]"
    >
      <DateRangePicker
        value={
          !isEmpty(filterByDate?.startDate) || !isEmpty(filterByDate?.endDate)
            ? [filterByDate?.startDate, filterByDate?.endDate]
            : []
        }
        onChange={(dates) =>
          setFilterByDate({
            startDate: dates?.[0],
            endDate: dates?.[1],
          })
        }
        format="DD-MM-YYYY"
        className="w-full !border-none bg-primary-50 !px-0 !py-0 !font-bold"
        placeholder={["Start Date", "End Date"]}
      />
    </div>,
    <button
      key="handleReset"
      onClick={handleReset}
      className="text-15-700 btn-outline-hover mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-blue-100 bg-primary-100 text-blue-100 sm:w-[30%] md:w-[20%]"

      // className="text-15-700 btn-outline-hover mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-blue-100 bg-primary-100 text-blue-100"
    >
      <span className="text-body-xs">Reset</span>
    </button>,
  ];

  return (
    <>
      <div className="border-wh-300 flex flex-col !gap-4 rounded-2xl border bg-white !p-4 md:!p-6">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold">Event Log</h1>
        </div>
        <Table
          columns={logColumns}
          data={eventLogData}
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
    </>
  );
};

export default Page;
