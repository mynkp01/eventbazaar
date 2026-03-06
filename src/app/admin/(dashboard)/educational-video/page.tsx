"use client";
import { apiHandler } from "@api/apiHandler";
import { PlusIcon } from "@assets/index";
import CustomInput from "@components/CustomInput";
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
  const educationalVideoColumns = [
    {
      name: "Title",
      key: "title",
      sort: "title",
      tdClassName: "text-wrap",
    },
    {
      name: "Description",
      key: "description",
      sort: "description",
      tdClassName: "text-wrap",
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
  // const permissions = checkCurrentSelectedTabPermission();
  const limit = useSelector(selectLimit);

  const [educationalVideoData, setEducationalVideoData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [sort, setSort] = useState({
    sort_type: "title",
    sort: 1,
  });
  const [searchKeys, setSearchKey] = useState(SearchObj);
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

  const fetchEducationalVideo = async (currentPage, keyword = "") => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${currentPage}&search=${keyword}`;
      const { data, status } = await apiHandler.educationalVideo.list(query);

      if (status === 200 || status === 201) {
        const formattedData = data?.data?.records;
        setEducationalVideoData(formattedData);
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

  const handleView = (educationalVideo) => {
    // router.push(
    //   `${ROUTES.admin.educationalVideo}/option?id=${educationalVideo._id}&view=1`,
    // );
    window.open(
      `${ROUTES.admin.educationalVideo}/option?id=${educationalVideo._id}&view=1`,
      "_blank",
      "noopener,noreferrer",
    );
  };
  const handleUpdate = (educationalVideo) => {
    // router.push(
    //   `${ROUTES.admin.educationalVideo}/option?id=${educationalVideo._id}`,
    // );
    window.open(
      `${ROUTES.admin.educationalVideo}/option?id=${educationalVideo._id}`,
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
    fetchEducationalVideo(page, searchKeys.search);
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
    <div className="border-wh-300 flex flex-col !gap-4 rounded-2xl border bg-white !p-4 md:!p-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Manage Educational Video</h1>
        {pagePermissions?.[PERMISSIONS.CREATE] ? (
          <button
            onClick={() =>
              window.open(
                `${ROUTES.admin.educationalVideo}/option`,
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
        columns={educationalVideoColumns}
        data={educationalVideoData}
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
