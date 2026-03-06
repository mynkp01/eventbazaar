"use client";
import { apiHandler } from "@api/apiHandler";
import CustomInput from "@components/CustomInput";
import HideModel from "@components/HideModel";
import Table from "@components/Table";
import { selectLimit, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SearchObj } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

const deletedVendorsColumns = [
  {
    name: "Branch Name",
    key: "vendors.company_name",
    sort: "vendors.company_name",
    tdClassName: "text-wrap",
  },
  {
    name: "Full Name",
    key: "vendors.full_name",
    sort: "vendors.full_name",
    tdClassName: "text-wrap",
  },
  {
    name: "Primary Contact",
    key: "vendors.primary_contact",
    sort: "vendors.primary_contact",
  },
  {
    name: "Primary Email",
    key: "vendors.primary_email",
    sort: "vendors.primary_email",
  },
  {
    name: "Reason",
    key: "reason",
    sort: "reason",
    tdClassName: "text-wrap",
  },
  {
    name: "Requested Date",
    key: "createdAt",
    sort: "createdAt",
    isDate: true,
    format: "DD/MM/YYYY",
  },
  {
    name: "Deletion Date",
    key: "deletionDueDate",
    sort: "deletionDueDate",
    isDate: true,
    format: "DD/MM/YYYY",
  },
];
const Page = () => {
  // const { download } = useDownloader();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataObj, setDataObj] = useState({});

  const limit = useSelector(selectLimit);
  const [searchKeys, setSearchKey] = useState(SearchObj);
  const [deletedVendorData, setDeletedVendorData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [sort, setSort] = useState({
    sort_type: "createdAt",
    sort: 1,
  });

  const fetchDeleteVendor = async (currentPage) => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${currentPage}&search=${searchKeys.searchValue}`;
      const { data, status } = await apiHandler.vendor.deletedVendor(query);
      if (status === 200 || status === 201) {
        setDeletedVendorData(data?.data?.records || []);
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
  // const handleExcel = async () => {
  //   try {
  //     dispatch(setIsLoading(true));
  //     const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&search=${searchKeys.search}&status=${dropDownValues?.status?.name || ""}`;
  //     const { data, status } = await apiHandler.enterprise.excel(query);

  //     if (status === 200 || status === 201) {
  //       await download(
  //         data?.data,
  //         data?.data?.split("/")[data?.data?.split("/")?.length - 1],
  //       );
  //     } else {
  //       showToast("error", data?.message);
  //     }
  //   } catch (err) {
  //     if (err?.error?.status === 406) {
  //       showToast("error", err.message);
  //       return router.back();
  //     }
  //   } finally {
  //     dispatch(setIsLoading(false));
  //   }
  // };

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

  const handleRevoke = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.vendor.revokeVendor(
        dataObj.vendor_id,
      );
      if (status === 200 || status === 204) {
        showToast("success", data?.message);
        fetchDeleteVendor(page);
      } else {
        showToast("error", data?.message);
      }
    } catch (error) {
      showToast("error", error?.message);
    } finally {
      dispatch(setIsLoading(false));
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    fetchDeleteVendor(page);
  }, [page, searchKeys.search, sort.sort, sort.sort_type]);

  const handleReset = () => {
    setSearchKey(SearchObj);
    setPage(1);
    setSort({
      sort_type: "createdAt",
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
        <h1 className="text-xl font-bold">Manage Deleted Vendor</h1>
      </div>
      <Table
        actions={{
          showView: false,
          showUpdate: false,
          showDelete: false,
          customAction: (data) => (
            <button
              className="flex items-center justify-center rounded-md border bg-green-400 px-2 py-1 text-sm font-bold text-white transition-all duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400"
              onClick={() => {
                setIsModalOpen(true);
                setDataObj(data);
              }}
            >
              Revoke Vendor
            </button>
          ),
        }}
        columns={deletedVendorsColumns}
        data={deletedVendorData}
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
      <HideModel
        open={isModalOpen}
        heading={`Are you sure want to revoke this vendor ?`}
        btnTitle={"Revoke"}
        setOpen={setIsModalOpen}
        func={handleRevoke}
        btnSecondaryClassName="!bg-green-400 px-2 py-1 text-sm !font-bold !text-white transition-all duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400"
      />
    </div>
  );
};

export default Page;
