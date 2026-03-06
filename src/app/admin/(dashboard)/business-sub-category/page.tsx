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
import { ROUTES, SearchObj } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

const Page = () => {
  const businessSubCategoryColumns = [
    {
      name: "Business Sub Category",
      key: "business_sub_category_name",
      sort: "business_sub_category_name",
    },
    {
      name: "Category",
      key: "business_category_id.business_category_name",
      sort: "business_category_id.business_category_name",
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
  const { download } = useDownloader();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const limit = useSelector(selectLimit);

  const [searchKeys, setSearchKey] = useState(SearchObj);
  const [businessSubCategoryData, setBusinessSubCategoryData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState({
    sort_type: "business_sub_category_name",
    sort: 1,
  });

  const handleFetchDropdownChange = useCallback((name: string, value: any) => {
    setDropDownValues((prev) => ({
      ...prev,
      [name]: value?._id || "",
    }));
  }, []);

  const [dropDownValues, setDropDownValues] = useState({
    business_category_id: "",
  });

  const [pagePermissions, setPagePermissions] = useState(null);
  const permissions = useSelector(selectPermissions);
  const pathname = usePathname();
  const sidebar = useSelector(selectAdminSideBar);
  useEffect(() => {
    setPagePermissions(
      permissions?.find(
        (n) =>
          n?.module?.value_code ===
          sidebar?.find((v) => pathname.includes(v?.path))?.value_code,
      )?.permissions,
    );
  }, [permissions]);

  const fetchBusinessSubCategories = async (currentPage, keyword = "") => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${currentPage}&search=${keyword}&business_category_id=${dropDownValues.business_category_id}`;
      const { data, status } = await apiHandler.businessSubCategory.list(query);

      if (status === 200 || status === 201) {
        const formattedData = data?.data?.data;

        setBusinessSubCategoryData(formattedData);
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

  const handleView = (subCategory) => {
    // router.push(
    //   `${ROUTES.admin.businessSubCategory}/option?id=${subCategory._id}&view=1`,
    // );
    window.open(
      `${ROUTES.admin.businessSubCategory}/option?id=${subCategory._id}&view=1`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleUpdate = (subCategory) => {
    // router.push(
    //   `${ROUTES.admin.businessSubCategory}/option?id=${subCategory._id}`,
    // );
    window.open(
      `${ROUTES.admin.businessSubCategory}/option?id=${subCategory._id}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSort = (sortObj) => {
    setSort(sortObj);
  };

  useEffect(() => {
    fetchBusinessSubCategories(page, searchKeys.search);
  }, [
    page,
    searchKeys.search,
    sort.sort,
    sort.sort_type,
    dropDownValues.business_category_id,
  ]);

  const handleExcel = async (keyword = "") => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${page}&search=${keyword}&business_category_id=${dropDownValues.business_category_id}`;
      const { data, status } =
        await apiHandler.businessSubCategory.excel(query);
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

  const handleReset = () => {
    setDropDownValues({
      business_category_id: "",
    });
    setSearchKey(SearchObj);
    setPage(1);
    setSort({
      sort_type: "business_sub_category_name",
      sort: 1,
    });
  };

  const handleSearch = (e) => {
    setSearchKey((prev) => ({ ...prev, search: e.target.value }));

    setPage(1);
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
      key="dropDownValues.business_category_id"
      className="w-full sm:w-[30%] md:w-[20%]"
    >
      <FetchDropdown
        placeholder="Select category"
        value={dropDownValues.business_category_id}
        endPoints={apiHandler.businessCategory.lookup}
        filterStr="NA"
        func={handleFetchDropdownChange}
        objKey="business_category_id"
        display="business_category_name"
      />
    </div>,
    <button
      key="handleReset"
      onClick={handleReset}
      className="text-15-700 btn-outline-hover h-fit rounded-xl border border-blue-100 bg-primary-100 px-6 py-2 text-blue-100"
    >
      <span className="text-body-xs">Reset</span>
    </button>,
  ];

  return (
    <div className="border-wh-300 flex flex-col !gap-4 rounded-2xl border bg-white !p-4 md:!p-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Manage Business Sub Categories</h1>
        <button
          key="handleExcel"
          onClick={() => handleExcel(searchKeys.search)}
          className="text-15-700 btn-outline-hover flex h-fit w-fit justify-between rounded-xl border border-green-300 bg-green-50 px-1 py-1 text-green-300 sm:px-3 sm:py-2"
        >
          <DownloadIcon className={"h-6 w-6"} />
          <span className="text-body-xs ml-2">Export</span>
        </button>
        {/* {pagePermissions?.[PERMISSIONS.CREATE] ? (
          <button
            onClick={() =>
              router.push(`${ROUTES.admin.businessSubCategory}/option`)
            }
            className="text-15-700 btn-outline-hover flex h-fit w-fit justify-between rounded-xl border border-blue-100 bg-primary-100 px-1 py-1 text-blue-100 sm:px-3 sm:py-2"
          >
            <PlusIcon />
            <span className="text-body-xs ml-2">Add</span>
          </button>
        ) : null} */}
      </div>
      <Table
        columns={businessSubCategoryColumns}
        data={businessSubCategoryData}
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
