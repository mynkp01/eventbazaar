"use client";
import { apiHandler } from "@api/apiHandler";
import CustomInput from "@components/CustomInput";
import DateRangePicker from "@components/DateRangePicker";
import Table from "@components/Table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { leadStatus, SearchObj } from "src/utils/Constant";
import { isEmpty, showToast } from "src/utils/helper";

const DATA_LENGTH = 20;
const leadsListColumns = [
  {
    name: "Vendor Name",
    key: "vendor_name",
    sort: "vendor_name",
    tdClassName: "text-wrap",
  },
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
    sort: "contactType",
    tdClassName: "text-wrap",
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
  const [leadsData, setLeadsData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeys, setSearchKey] = useState(SearchObj);
  const [filterByDate, setFilterByDate] = useState<{
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
  } | null>(null);
  const [sort, setSort] = useState({
    sort_type: "createdAt",
    sort: -1,
  });

  useEffect(() => {
    loadLeads(page, filterByDate?.startDate, filterByDate?.endDate);
  }, [
    page,
    sort?.sort,
    sort?.sort_type,
    filterByDate?.startDate,
    filterByDate?.endDate,
    searchKeys.searchValue,
  ]);

  const loadLeads = async (currentPage, startDate = null, endDate = null) => {
    try {
      let query = `search=${searchKeys.searchValue}&sort_type=${sort.sort_type}&sort=${sort.sort}&page=${currentPage}`;
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

  const handleReset = () => {
    setFilterByDate({
      startDate: null,
      endDate: null,
    });
    setSearchKey(SearchObj);
    setPage(1);
    setSort({
      sort_type: "createdAt",
      sort: -1,
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSort = (sortObj) => {
    setSort(sortObj);
  };

  const handleSearch = (e) => {
    setSearchKey((prev) => ({ ...prev, searchValue: e.target.value }));
    setPage(1);
  };

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
    <div
      key="dateRangePicker"
      className="mt-2 w-full rounded-lg border border-x-2 border-primary-20 bg-primary-50 p-3"
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
    <div className="border-wh-300 flex flex-col !gap-4 rounded-2xl border bg-white !p-4 md:!p-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Manage Lead</h1>
      </div>
      <Table
        columns={leadsListColumns}
        data={leadsData}
        totalPages={totalPages}
        currentPage={page}
        handlePageChange={handlePageChange}
        onSearch={handleSearch}
        onSort={handleSort}
        filters={filters}
      />
    </div>
  );
};

export default Leads;
