"use client";
import { apiHandler } from "@api/apiHandler";
import { CloseLight } from "@assets/index";
import CustomImage from "@components/CustomImage";
import CustomInput from "@components/CustomInput";
import DeleteModal from "@components/DeleteModal";
import Table from "@components/Table";
import { Box, Modal } from "@mui/material";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { Rate } from "antd";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SearchObj } from "src/utils/Constant";
import { convertMediaUrl, isEmpty, showToast } from "src/utils/helper";
import tailwindConfig from "tailwind.config";

const Page = () => {
  const reviewColumns = [
    {
      name: "Rating",
      key: "rating",
      sort: "rating",
    },
    {
      name: "User Name",
      key: "customer.full_name",
      tdClassName: "text-wrap",
    },
    {
      name: "Review",
      key: "review",
      tdClassName: "text-wrap",
    },
    {
      name: "Review Date",
      key: "createdAt",
      isDate: true,
      format: "DD-MM-YYYY",
    },
  ];

  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("id");
  const pathname = usePathname();

  const dispatch = useAppDispatch();
  const sidebar = useSelector(selectAdminSideBar);
  const permissions = useSelector(selectPermissions);

  const [deleteModalOpen, setDeleteModalOpen] = useState({
    visible: false,
    data: null,
  });
  const [searchKeys, setSearchKey] = useState(SearchObj);
  const [review, setReviewData] = useState([]);
  const [isOpen, setIsOpen] = useState({
    visible: false,
    data: null,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState({
    sort_type: "createdAt",
    sort: -1,
  });
  const [pagePermissions, setPagePermissions] = useState(null);

  useEffect(() => {
    setPagePermissions(
      permissions?.find(
        (n) =>
          n?.module?.value_code ===
          sidebar?.find((v) => pathname.includes(v?.path))?.value_code,
      )?.permissions,
    );
  }, [permissions]);

  const fetchReview = async (currentPage = 1, keyword = "") => {
    try {
      dispatch(setIsLoading(true));
      let query = `sort_type=${sort.sort_type}&sort=${sort.sort}&page=${currentPage}&search=${keyword}&vendor_id=${vendorId}`;

      const { data, status } = await apiHandler.review.list(query);

      if (status === 200 || status === 201) {
        let formattedData = data?.data?.records;
        formattedData = formattedData?.map((item) => {
          return {
            ...item,
            rating: <Rate value={item?.rating} disabled allowHalf />,
            review: <p dangerouslySetInnerHTML={{ __html: item?.review }} />,
          };
        });

        setReviewData(formattedData);
        setTotalPages(data?.data?.totalPages || 1);
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = (e) => {
    setSearchKey((prev) => ({ ...prev, search: e.target.value }));
    setPage(1);
  };
  const handleView = (data) => {
    setIsOpen({ visible: true, data: data });
  };

  const handleSort = (sortObj) => {
    setSort(sortObj);
  };

  useEffect(() => {
    fetchReview(page, searchKeys.search);
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

  const handleDeleteReview = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.review.delete(
        deleteModalOpen.data?._id,
      );
      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        fetchReview();
        setDeleteModalOpen((prev) => ({ ...prev, visible: false }));
      } else {
        showToast("error", data?.message);
      }
    } catch (error) {
      showToast("error", error?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <>
      <DeleteModal
        open={deleteModalOpen.visible}
        setOpen={(_) => setDeleteModalOpen({ visible: _, data: null })}
        func={handleDeleteReview}
      />
      <Modal
        open={isOpen.visible}
        onClose={() => setIsOpen({ visible: false, data: null })}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 4,
            width: "90%",
            maxWidth: 600,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-1">
              <h3 className="heading-40">View Review</h3>

              <button onClick={() => setIsOpen({ visible: false, data: null })}>
                <CloseLight
                  fill={tailwindConfig.theme.extend.colors["grey"][200]}
                />
              </button>
            </div>
            <hr className="solid" />
            <div>{isOpen.data?.rating}</div>
            {!isEmpty(isOpen.data?.image) ? (
              <div className="flex h-[20vh] w-full flex-wrap gap-2 md:h-[25vh] lg:h-[30vh] xl:h-[25vh]">
                <CustomImage
                  src={
                    !isEmpty(isOpen.data?.doc_path)
                      ? convertMediaUrl(isOpen.data?.doc_path)
                      : null
                  }
                  alt="preview"
                  height="100%"
                  className="!aspect-square rounded-lg !object-cover"
                />
              </div>
            ) : null}
            <div>{isOpen.data?.review}</div>
          </div>
        </Box>
      </Modal>

      <div className="border-wh-300 flex flex-col !gap-4 rounded-2xl border bg-white !p-4 md:!p-6">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold">Review</h1>
        </div>
        <Table
          columns={reviewColumns}
          data={review}
          totalPages={totalPages}
          actions={{
            onView: handleView,
            showUpdate: false,
            onDelete: (item) =>
              setDeleteModalOpen({ visible: true, data: item }),
          }}
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
