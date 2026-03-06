"use client";
import { apiHandler } from "@api/apiHandler";
import { PlusIcon } from "@assets/index";
import CustomInput from "@components/CustomInput";
import DeleteModal from "@components/DeleteModal";
import Table from "@components/Table";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { selectLimit, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PERMISSIONS, ROUTES, SearchObj } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

const Page = () => {
  const userColumns = [
    {
      name: "Full Name",
      key: "full_name",
      sort: "full_name",
      tdClassName: "text-wrap",
    },
    { name: "Primary Email", key: "primary_email", sort: "primary_email" },
    {
      name: "Primary Contact",
      key: "primary_contact",
      sort: "primary_contact",
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
  ];

  const router = useRouter();
  const dispatch = useAppDispatch();
  const limit = useSelector(selectLimit);

  // const permissions = checkCurrentSelectedTabPermission();
  const [searchKeys, setSearchKey] = useState(SearchObj);
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [sort, setSort] = useState({
    sort_type: "full_name",
    sort: 1,
  });
  const [pagePermissions, setPagePermissions] = useState(null);
  const permissions = useSelector(selectPermissions);
  const pathname = usePathname();
  const sidebar = useSelector(selectAdminSideBar);

  useEffect(() => {
    fetchUsers(page, searchKeys.search);
  }, [page, searchKeys.search, sort.sort, sort.sort_type]);

  useEffect(() => {
    setPagePermissions(
      permissions?.find(
        (n) =>
          n?.module?.value_code ===
          sidebar?.find((v) => pathname.includes(v?.path))?.value_code,
      )?.permissions,
    );
  }, [permissions]);

  const fetchUsers = async (currentPage, keyword = "") => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${currentPage}&search=${keyword}`;
      const { data, status } = await apiHandler.admin.list(query);

      if (status === 200 || status === 201) {
        const formattedData = data?.data?.data?.map((user) => ({
          ...user,
          role_name: user?.role?.name,
        }));
        setUserData(formattedData);
        setTotalPages(data?.data?.totalPages || 1);
        setTotalRecordCount(data?.data?.totalRecords || 1);
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

  const handleView = (user) => {
    // router.push(`${ROUTES.admin.user}/option?id=${user._id}&view=1`);
    window.open(
      `${ROUTES.admin.user}/option?id=${user._id}&view=1`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleUpdate = (user) => {
    // router.push(`${ROUTES.admin.user}/option?id=${user._id}`);
    window.open(
      `${ROUTES.admin.user}/option?id=${user._id}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleDelete = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.admin.delete(userId);
      if (status === 200 || status === 204) {
        showToast("success", data?.message);
        fetchUsers(page);
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
    setUserId(item?._id);
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
          <h1 className="text-xl font-bold">Manage Users</h1>
          {pagePermissions?.[PERMISSIONS.CREATE] ? (
            <button
              onClick={() =>
                window.open(
                  `${ROUTES.admin.user}/option`,
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
        </div>
        <Table
          columns={userColumns}
          data={userData}
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
