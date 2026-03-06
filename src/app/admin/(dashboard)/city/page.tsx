"use client";
import { apiHandler } from "@api/apiHandler";
import { DownloadIcon, PlusIcon } from "@assets/index";
import Table from "@components/Table";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { selectLimit, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useDownloader from "react-use-downloader";
import { PERMISSIONS, ROUTES } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

const Page = () => {
  const cityColumns = [
    { name: "City Name", key: "name", sort: "name" },
    { name: "Total Vendor", key: "totalVendor", sort: "totalVendor" },
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
    // { name: "Display", key: "display", sort: "" },
  ];

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { download } = useDownloader();

  // const permissions = checkCurrentSelectedTabPermission();
  const limit = useSelector(selectLimit);
  const [cityData, setCityData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sort, setSort] = useState({
    sort_type: "name",
    sort: 1,
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

  const fetchCities = async (currentPage, keyword = "") => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${currentPage}&search=${keyword}`;
      const { data, status } = await apiHandler.city.list(query);

      if (status === 200 || status === 201) {
        const formattedData = data?.data?.data;
        setCityData(formattedData);
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

  const handleExcel = async (keyword = "") => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${page}&search=${keyword}`;
      const { data, status } = await apiHandler.city.excel(query);

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

  const handleView = (city) => {
    // router.push(`${ROUTES.admin.city}/option?id=${city._id}&view=1`);
    window.open(
      `${ROUTES.admin.city}/option?id=${city._id}&view=1`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleUpdate = (city) => {
    // router.push(`${ROUTES.admin.city}/option?id=${city._id}`);
    window.open(
      `${ROUTES.admin.city}/option?id=${city._id}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    setPage(1);
  };

  const handleSort = (sortObj) => {
    setSort(sortObj);
  };

  useEffect(() => {
    fetchCities(page, searchKeyword);
  }, [page, searchKeyword, sort.sort, sort.sort_type]);

  return (
    <div className="border-wh-300 flex flex-col !gap-4 rounded-2xl border bg-white !p-4 md:!p-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Manage Cities</h1>
        <div className="flex items-center justify-end gap-2">
          {pagePermissions?.[PERMISSIONS.CREATE] ? (
            <button
              onClick={() =>
                window.open(
                  `${ROUTES.admin.city}/option`,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="text-15-700 btn-outline-hover flex h-fit w-fit justify-between rounded-xl border border-blue-100 bg-primary-100 px-1 py-1 text-blue-100 sm:px-3 sm:py-2"
            >
              <PlusIcon />
              <span className="text-body-xs ml-2 flex">Add</span>
            </button>
          ) : null}
          <button
            key="handleExcel"
            onClick={() => handleExcel()}
            className="text-15-700 btn-outline-hover flex h-fit w-fit justify-between rounded-xl border border-green-300 bg-green-50 px-1 py-1 text-green-300 sm:px-3 sm:py-2"
          >
            <DownloadIcon className={"h-6 w-6"} />
            <span className="text-body-xs ml-2">Export</span>
          </button>
        </div>
      </div>
      <Table
        columns={cityColumns}
        data={cityData}
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
