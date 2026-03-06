"use client";
import { apiHandler } from "@api/apiHandler";
import { DownloadIcon, PlusIcon } from "@assets/index";
import CustomInput from "@components/CustomInput";
import Table from "@components/Table";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useDownloader from "react-use-downloader";
import { PERMISSIONS, ROUTES, SearchObj } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

const Page = () => {
  const bazaarBuddyPlanColumns = [
    {
      name: "Plan name",
      key: "plan_name",
      sort: "plan_name",
    },
    { name: "Plan Code", key: "plan_code", sort: "plan_code" },
    { name: "Price", key: "price", sort: "price" },
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
  ];
  const { download } = useDownloader();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [bazaarBuddyPlan, setBazaarBuddyPlan] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState({
    sort_type: "price",
    sort: 1,
  });
  const [pagePermissions, setPagePermissions] = useState(null);
  const permissions = useSelector(selectPermissions);
  const pathname = usePathname();
  const sidebar = useSelector(selectAdminSideBar);

  const [searchKeys, setSearchKey] = useState(SearchObj);

  const handleReset = () => {
    setSearchKey(SearchObj);
    setPage(1);
    setSort({
      sort_type: "price",
      sort: 1,
    });
  };
  useEffect(() => {
    setPagePermissions(
      permissions?.find(
        (n) =>
          n?.module?.value_code ===
          sidebar?.find((v) => pathname.includes(v?.path))?.value_code,
      )?.permissions,
    );
  }, [permissions]);

  const fetchBazaarBuddyPlan = async (currentPage) => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${currentPage}&search=${searchKeys.search}`;
      const { data, status } = await apiHandler.bazaarBuddyPlan.list(query);
      if (status === 200 || status === 201) {
        setBazaarBuddyPlan(data?.data?.records);
        setTotalPages(data?.data?.totalPages || 1);
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

  const handleView = (bazaarBuddyPlan) => {
    // router.push(
    //   `${ROUTES.admin.bazaarBuddyPlan}/option?id=${bazaarBuddyPlan._id}&view=1`,
    // );
    window.open(
      `${ROUTES.admin.bazaarBuddyPlan}/option?id=${bazaarBuddyPlan._id}&view=1`,
      "_blank",
      "noopener,noreferrer",
    );
  };
  const handleExcel = async (keyword = "") => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${page}&search=${searchKeys.search}`;
      const { data, status } =
        await apiHandler.bazaarBuddyPlan.planExcel(query);

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

  const handleUpdate = (bazaarBuddyPlan) => {
    // router.push(
    //   `${ROUTES.admin.bazaarBuddyPlan}/option?id=${bazaarBuddyPlan._id}`,
    // );
    window.open(
      `${ROUTES.admin.bazaarBuddyPlan}/option?id=${bazaarBuddyPlan._id}`,
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

  useEffect(() => {
    fetchBazaarBuddyPlan(page);
  }, [page, searchKeys.search, sort.sort, sort.sort_type]);

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
        <h1 className="text-xl font-bold">Manage Bazaar Buddy Plan</h1>
        <div className="flex items-center justify-end gap-2">
          {pagePermissions?.[PERMISSIONS.CREATE] ? (
            <button
              onClick={() =>
                window.open(
                  `${ROUTES.admin.bazaarBuddyPlan}/option`,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="text-15-700 btn-outline-hover flex h-fit w-fit justify-between rounded-xl border border-blue-100 bg-primary-100 px-1 py-1 text-blue-100 sm:px-3 sm:py-2"
            >
              <PlusIcon />
              <span className="text-body-xs ml-2">Add</span>
            </button>
          ) : null}
          <button
            key="handleExcel"
            onClick={() => handleExcel(searchKeys.search)}
            className="text-15-700 btn-outline-hover flex h-fit w-fit justify-between rounded-xl border border-green-300 bg-green-50 px-1 py-1 text-green-300 sm:px-3 sm:py-2"
          >
            <DownloadIcon className={"h-6 w-6"} />
            <span className="text-body-xs ml-2">Export</span>
          </button>
        </div>
      </div>
      <Table
        columns={bazaarBuddyPlanColumns}
        data={bazaarBuddyPlan}
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
      />
    </div>
  );
};

export default Page;
