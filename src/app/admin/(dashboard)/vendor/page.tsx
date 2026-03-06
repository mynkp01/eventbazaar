"use client";
import { apiHandler } from "@api/apiHandler";
import { DownloadIcon } from "@assets/index";
import CustomInput from "@components/CustomInput";
import HideModel from "@components/HideModel";
import Table from "@components/Table";
import {
  selectAdminSideBar,
  selectPermissions,
  setUser,
} from "@redux/slices/authSlice";
import { selectLimit, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useDownloader from "react-use-downloader";
import { ROUTES, SearchObj } from "src/utils/Constant";
import { encrypt, showToast } from "src/utils/helper";

const Page = () => {
  const vendorColumns = [
    {
      name: "Company Name",
      key: "company_name",
      sort: "company_name",
      tdClassName: "text-wrap",
    },
    {
      name: "Full Name",
      key: "full_name",
      sort: "full_name",
      tdClassName: "text-wrap",
    },
    {
      name: "Primary Contact",
      key: "primary_contact",
      sort: "primary_contact",
    },
    {
      name: "Primary Email",
      key: "primary_email",
      sort: "primary_email",
      tdClassName: "text-wrap",
    },
    {
      name: "Business Category",
      key: "business_category_name",
      sort: "business_category_name",
      tdClassName: "text-wrap",
    },
    {
      name: "Business Sub Category",
      key: "subCategoryData",
      tdClassName: "text-wrap",
    },
    {
      name: "Base Location",
      key: "base_location",
      sort: "base_location",
    },
    {
      name: "Service Location",
      key: "service_location",
      tdClassName: "text-wrap",
    },
    {
      name: "Current Plan",
      key: "planName",
      sort: "planName",
    },
    {
      name: "Multiple Cities",
      key: "want_multiple_cities",
      sort: "want_multiple_cities",
    },
    {
      name: "Joined Date",
      key: "createdAt",
      isDate: true,
      sort: "createdAt",
      format: "DD-MM-YYYY",
    },
  ];

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { download } = useDownloader();

  // const permission = checkCurrentSelectedTabPermission();
  const limit = useSelector(selectLimit);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchKeys, setSearchKey] = useState(SearchObj);
  const [vendorData, setVendorData] = useState([]);
  const [vendor, setVendor] = useState<{ _id?: string; status?: boolean }>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [sort, setSort] = useState({
    sort_type: "company_name",
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

  useEffect(() => {
    fetchVendors(page, searchKeys.search);
  }, [page, searchKeys.search, sort.sort, sort.sort_type]);

  const fetchVendors = async (currentPage, keyword = "") => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${currentPage}&search=${keyword}`;
      const { data, status } = await apiHandler.vendor.vendorList(query);

      if (status === 200 || status === 201) {
        data?.data?.data?.forEach((vendor) => {
          if (!vendor?.want_multiple_cities) vendor.want_multiple_cities = "No";
          else vendor.want_multiple_cities = "Yes";
          vendor.service_location = vendor.service_location.join(", ");
          vendor.subCategoryData = vendor.subCategoryData.join(", ");
          return vendor;
        });
        setVendorData(data?.data?.data);
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
  const handleExcel = async () => {
    try {
      dispatch(setIsLoading(true));
      const query = `sort_type=${sort.sort_type}&sort=${sort.sort}&search=${searchKeys.search}`;
      const { data, status } = await apiHandler.vendor.excel(query);

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

  const handleUpdate = async (vendor) => {
    dispatch(setIsLoading(true));
    try {
      const { data, status } = await apiHandler.admin.adminVendor(vendor?._id);
      if (status === 200 || status === 201) {
        Cookies.set("token", encrypt(data?.data?.token), { expires: 30 });
        dispatch(setUser(data?.data));
        setTimeout(() => {
          dispatch(setIsLoading(false));
          // router.push(ROUTES.vendor.dashboard);
          window.open(
            `${ROUTES.vendor.dashboard}`,
            "_blank",
            "noopener,noreferrer",
          );
        }, 2000);
      } else {
        showToast("error", data?.message);
        dispatch(setIsLoading(false));
      }
    } catch (e) {
      dispatch(setIsLoading(false));
    }
  };

  const handleAddCity = (vendor) => {
    // router.push(`${ROUTES.admin.vendor}/add-city?id=${vendor?._id}`);
    window.open(
      `${ROUTES.admin.vendor}/add-city?id=${vendor?._id}`,
      "_blank",
      "noopener,noreferrer",
    );
  };
  const handleViewReview = (vendor) => {
    // router.push(`${ROUTES.admin.vendor}/review?id=${vendor?._id}`);
    window.open(
      `${ROUTES.admin.vendor}/review?id=${vendor?._id}`,
      "_blank",
      "noopener,noreferrer",
    );
  };
  const handleHide = (vendor) => {
    setVendor(vendor);
    setIsModalOpen(true);
  };

  const handleHideVendor = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.vendor.vendorBlockUnblock(
        vendor?._id,
      );
      if (status === 200 || status === 204) {
        showToast("success", data?.message);
        fetchVendors(page);
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

  const handleSearch = (e) => {
    setSearchKey((prev) => ({ ...prev, search: e.target.value }));
    setPage(1);
  };

  const handleSort = (sortObj) => {
    setSort(sortObj);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
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
    <div className="border-wh-300 flex flex-col !gap-4 rounded-2xl border bg-white !p-4 md:!p-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Manage Vendors</h1>
        <button
          key="handleReset"
          onClick={() => handleExcel()}
          className="text-15-700 btn-outline-hover flex h-fit w-fit justify-between rounded-xl border border-green-300 bg-green-50 px-1 py-1 text-green-300 sm:px-3 sm:py-2"
        >
          <DownloadIcon className={"h-6 w-6"} />
          <span className="text-body-xs ml-2">Export</span>
        </button>
      </div>
      <Table
        columns={vendorColumns}
        data={vendorData}
        actions={{
          onUpdate: handleUpdate,
          showView: false,
          showDelete: false,
          customAction: (vendor) => (
            <>
              <button
                disabled={vendor?.status == false}
                className={`flex items-center justify-center text-nowrap rounded-md border bg-green-400 px-3 py-1 text-sm font-bold text-white transition-all duration-300 ${vendor?.status == false ? "cursor-not-allowed" : "hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400"}`}
                onClick={() => handleAddCity(vendor)}
              >
                Add City
              </button>
              <button
                className={`flex items-center justify-center rounded-md border bg-gray-200 px-3 py-1 text-sm font-bold text-black transition-all duration-300 hover:!border-gray-400 hover:!bg-primary-100 hover:!text-black ${vendor?.status == false ? "bg-red-500" : ""}`}
                onClick={() => handleHide(vendor)}
              >
                {vendor?.status ? "Hide" : "Show"}
              </button>
              <button
                className="flex items-center justify-center rounded-md border bg-gray-200 px-3 py-1 text-sm font-bold text-black transition-all duration-300 hover:!border-gray-400 hover:!bg-primary-100 hover:!text-black"
                onClick={() => handleViewReview(vendor)}
              >
                Review
              </button>
            </>
          ),
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
      <HideModel
        open={isModalOpen}
        heading={`Are you sure want to ${vendor?.status ? "hide" : "unhide"} this Vendor`}
        subHeading={`You can ${vendor?.status ? "unhide" : "hide"} it whenever needed`}
        btnTitle={vendor?.status ? "Hide" : "Unhide"}
        setOpen={setIsModalOpen}
        func={handleHideVendor}
      />
    </div>
  );
};

export default Page;
