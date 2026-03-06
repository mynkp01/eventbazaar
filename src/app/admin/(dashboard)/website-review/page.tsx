"use client";
import { apiHandler } from "@api/apiHandler";
import { PlusIcon } from "@assets/index";
import CustomInput from "@components/CustomInput";
import DeleteModal from "@components/DeleteModal";
import Table from "@components/Table";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PERMISSIONS, ROUTES, SearchObj } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

const Page = () => {
  const reviewColumns = [
    {
      name: "Full Name",
      key: "full_name",
      sort: "full_name",
    },
    {
      name: "Rating",
      key: "rating",
      sort: "rating",
    },
    {
      name: "Title",
      key: "title",
      sort: "title",
    },
    {
      name: "Description",
      key: "description",
      sort: "description",
    },
    {
      name: "Review Date",
      key: "createdAt",
      sort: "createdAt",
      isDate: true,
      format: "DD/MM/YYYY",
    },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const permissions = checkCurrentSelectedTabPermission();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [reviewData, setReviewData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState({
    sort_type: "",
    sort: 1,
  });
  const [pagePermissions, setPagePermissions] = useState(null);
  const [setReviewI, setReviewId] = useState("");
  const permissions = useSelector(selectPermissions);
  const pathname = usePathname();
  const sidebar = useSelector(selectAdminSideBar);

  const [searchKeys, setSearchKey] = useState(SearchObj);

  useEffect(() => {
    setPagePermissions(
      permissions?.find(
        (n) =>
          n?.module?.value_code ===
          sidebar?.find((v) => pathname.includes(v?.path))?.value_code,
      )?.permissions,
    );
  }, [permissions]);

  const fetchWebSiteReview = async () => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${page}&search=${searchKeys.search}`;
      const { data, status } = await apiHandler.webSiteReview.list(query);

      if (status === 200 || status === 201) {
        setReviewData(data?.data?.records);
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

  const handleView = (review) => {
    // router.push(`${ROUTES.admin.webSiteReview}/option?id=${review._id}&view=1`);
    window.open(
      `${ROUTES.admin.webSiteReview}/option?id=${review?._id}&view=1`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleUpdate = (review) => {
    // router.push(`${ROUTES.admin.webSiteReview}/option?id=${review._id}`);
    window.open(
      `${ROUTES.admin.webSiteReview}/option?id=${review?._id}`,
      "_blank",
      "noopener,noreferrer",
    );
  };
  const handleDelete = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } =
        await apiHandler.webSiteReview.delete(setReviewI);
      if (status === 200 || status === 204) {
        showToast("success", data?.message);
        fetchWebSiteReview();
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

  const handleDeleteClick = (item) => {
    setIsModalOpen(true);
    setReviewId(item?._id);
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
    fetchWebSiteReview();
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
  ];

  return (
    <>
      <DeleteModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        func={handleDelete}
      />
      <div className="border-wh-300 flex flex-col !gap-4 rounded-2xl border bg-white !p-4 md:!p-6">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold">Manage Web Site Review</h1>
          {pagePermissions?.[PERMISSIONS.CREATE] ? (
            <button
              onClick={() =>
                router.push(`${ROUTES.admin.webSiteReview}/option`)
              }
              className="text-15-700 btn-outline-hover flex h-fit w-fit justify-between rounded-xl border border-blue-100 bg-primary-100 px-1 py-1 text-blue-100 sm:px-3 sm:py-2"
            >
              <PlusIcon />
              <span className="text-body-xs ml-2">Add</span>
            </button>
          ) : null}
        </div>
        <Table
          columns={reviewColumns}
          data={reviewData}
          actions={{
            onUpdate: handleUpdate,
            onView: handleView,
            onDelete: handleDeleteClick,
          }}
          totalPages={totalPages}
          currentPage={page}
          handlePageChange={handlePageChange}
          onSearch={handleSearch}
          onSort={handleSort}
          filters={filters}
        />
      </div>
    </>
  );
};

export default Page;
