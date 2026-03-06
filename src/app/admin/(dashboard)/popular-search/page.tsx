"use client";
import { apiHandler } from "@api/apiHandler";
import { DeleteIcon, PlusIcon } from "@assets/index";
import HideModel from "@components/HideModel";
import Table from "@components/Table";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { selectLimit, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PERMISSIONS, ROUTES } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

const Page = () => {
  const popularSearchColumns = [
    {
      name: "Business Category Name",
      key: "business_category_name",
      sort: "business_category_name",
      tdClassName: "text-wrap",
    },

    // { name: "Status", key: "status", sort: "" },
  ];

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [pagePermissions, setPagePermissions] = useState(null);
  const limit = useSelector(selectLimit);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [popularSearch, setPopularSearch] = useState(null);

  const [popularSearchData, setpopularSearchData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [sort, setSort] = useState({
    sort_type: "business_category_name",
    sort: 1,
  });
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

  const fetchPopularSearchData = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.popularSearch.list(
        `page=${page}&sort_type=${sort.sort_type}&sort=${sort.sort}`,
      );

      if (status === 200 || status === 201) {
        setpopularSearchData(data?.data?.records);
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

  const handleView = (popularSearch) => {
    // router.push(
    //   `${ROUTES.admin.popularSearch}/option?id=${popularSearch._id}&view=1`,
    // );
    window.open(
      `${ROUTES.admin.popularSearch}/option?id=${popularSearch._id}&view=1`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleDelete = (popularSearch) => {
    setPopularSearch(popularSearch);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchPopularSearchData();
  }, []);
  const handleDeletePopularSearch = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.popularSearch.delete(
        popularSearch._id,
      );
      if (status === 200 || status === 204) {
        showToast("success", data?.message);
        fetchPopularSearchData();
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

  const handleUpdate = (popularSearch) => {
    // router.push(`${ROUTES.admin.popularSearch}/option?id=${popularSearch._id}`);
    window.open(
      `${ROUTES.admin.popularSearch}/option?id=${popularSearch._id}`,
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
    fetchPopularSearchData();
  }, [page, sort.sort_type, sort.sort]);

  return (
    <div className="border-wh-300 flex flex-col !gap-4 rounded-2xl border bg-white !p-4 md:!p-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Manage Popular Search</h1>
        {pagePermissions?.[PERMISSIONS.CREATE] ? (
          <button
            onClick={() => router.push(`${ROUTES.admin.popularSearch}/option`)}
            className="text-15-700 btn-outline-hover flex h-fit w-fit justify-between rounded-xl border border-blue-100 bg-primary-100 px-1 py-1 text-blue-100 sm:px-3 sm:py-2"
          >
            <PlusIcon />
            <span className="text-body-xs ml-2 flex">Add</span>
          </button>
        ) : null}
      </div>
      <Table
        columns={popularSearchColumns}
        data={popularSearchData}
        actions={{
          onUpdate: handleUpdate,
          onView: handleView,
          showDelete: false,
          customAction: (popularSearch) => (
            <>
              <button
                className="flex items-center justify-center rounded-md p-2 text-red-300"
                onClick={() => handleDelete(popularSearch)}
              >
                <DeleteIcon className="h-5 w-5" />
              </button>
            </>
          ),
        }}
        totalPages={totalPages}
        currentPage={page}
        handlePageChange={handlePageChange}
        onSort={handleSort}
        isResultElement={
          totalRecordCount ? (
            <p className="text-xs text-grey-1300 md:text-sm">{`Showing ${page * limit - limit + 1} – ${page === totalPages || totalRecordCount <= limit ? totalRecordCount : page * limit} of ${totalRecordCount} results`}</p>
          ) : null
        }
      />
      <HideModel
        open={isModalOpen}
        heading={`Are you sure want to delete this ?`}
        btnTitle={"Delete"}
        setOpen={setIsModalOpen}
        func={handleDeletePopularSearch}
      />
    </div>
  );
};

export default Page;
