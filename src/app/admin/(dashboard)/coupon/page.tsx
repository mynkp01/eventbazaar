"use client";
import { apiHandler } from "@api/apiHandler";
import { DownloadIcon, PlusIcon } from "@assets/index";
import CustomInput from "@components/CustomInput";
import DeleteModal from "@components/DeleteModal";
import Table from "@components/Table";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { selectLimit, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useDownloader from "react-use-downloader";
import { PERMISSIONS, ROUTES, SearchObj } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

const Page = () => {
  const couponColumns = [
    // { name: "Plan Rule", key: "plan_rule_id", sort: "plan_rule_id" },
    { name: "Coupon Code", key: "coupon_code", sort: "coupon_code" },
    { name: "Amount", key: "amount", sort: "amount" },
    { name: "Percent", key: "percent", sort: "percent" },
    { name: "Max Redemption", key: "max_redemptions", sort: "max_redemptions" },
    { name: "Redemption", key: "redeemed_count", sort: "redeemed_count" },
    { name: "Tagline", key: "tagline", sort: "", tdClassName: "text-wrap" },
    { name: "Description", key: "desc", sort: "", tdClassName: "text-wrap" },
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
  const { download } = useDownloader();

  const [couponData, setCouponData] = useState([]);
  const [couponId, setCouponId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [sort, setSort] = useState({
    sort_type: "coupon_code",
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

  const fetchCoupons = async (currentPage, keyword = "") => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${currentPage}&search=${keyword}`;
      const { data, status } = await apiHandler.couponCode.list(query);

      if (status === 200 || status === 201) {
        const formattedData = data?.data?.records;

        setCouponData(formattedData);
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

  const handleView = (coupon) => {
    // router.push(`${ROUTES.admin.coupon}/option?id=${coupon._id}&view=1`);
    window.open(
      `${ROUTES.admin.coupon}/option?id=${coupon._id}&view=1`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleUpdate = (coupon) => {
    // router.push(`${ROUTES.admin.coupon}/option?id=${coupon._id}`);
    window.open(
      `${ROUTES.admin.coupon}/option?id=${coupon._id}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleDelete = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.couponCode.delete(couponId);
      if (status === 200 || status === 204) {
        showToast("success", data?.message);
        fetchCoupons(page);
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

  const handleExcel = async (keyword = "") => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${page}&search=${keyword}`;
      const { data, status } = await apiHandler.couponCode.excel(query);

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

  const handleDeleteClick = (item) => {
    setIsModalOpen(true);
    setCouponId(item?._id);
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
    fetchCoupons(page, searchKeys.search);
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
          <h1 className="text-xl font-bold">Manage Coupons</h1>
          <div className="flex items-center justify-end gap-2">
            {pagePermissions?.[PERMISSIONS.CREATE] ? (
              <button
                onClick={() =>
                  window.open(
                    `${ROUTES.admin.coupon}/option`,
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
          columns={couponColumns}
          data={couponData}
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
