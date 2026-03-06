"use client";
import { apiHandler } from "@api/apiHandler";
import { CloseLight, VideoPlayerIcon } from "@assets/index";
import Breadcrumb from "@components/Breadcrumb";
import CustomImage from "@components/CustomImage";
import CustomVideo from "@components/CustomVideo";
import NoData from "@components/NoData";
import SearchInputButton from "@components/SearchInputButton";
import { Modal, Pagination } from "@mui/material";
import { selectLimit, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  convertMediaUrl,
  convertVideoUrl,
  isEmpty,
  showToast,
} from "src/utils/helper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const EducationalVideoItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const showModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div
        className="flex w-full cursor-pointer flex-col gap-1 overflow-hidden rounded-lg bg-primary-200"
        onClick={showModal}
      >
        <div className="relative flex aspect-[370/217] w-full items-center justify-center">
          <CustomImage
            src={convertMediaUrl(item?.thumbnail)}
            height="100%"
            width="100%"
            className="!aspect-[370/217] !w-full !object-cover"
          />
          <div className="absolute top-1/2 -translate-y-1/2 text-green-400">
            <VideoPlayerIcon className="size-16 min-h-14" />
          </div>
        </div>
        <div className="w-full p-3 text-black-50 md:p-5">
          <p className="truncate text-base font-semibold md:text-xl">
            {item?.title}
          </p>
          <p className="line-clamp-3 truncate text-xs font-normal text-grey-50 md:text-sm">
            {item.description}
          </p>
        </div>
      </div>

      <Modal
        open={isOpen}
        onClose={closeModal}
        className="flex h-full w-full items-center justify-center !p-6"
      >
        <div className="relative z-50 flex h-fit max-h-[80%] w-full max-w-xl flex-col overflow-hidden rounded-xl bg-white shadow-lg md-h:xs:max-w-5xl">
          <button onClick={closeModal} className="absolute right-5 top-5 z-50">
            <CloseLight className="h-3 w-3" fill="#1A1D1F" />
          </button>

          <div className="flex h-full w-full flex-col overflow-y-auto">
            <div className="aspect-video h-full max-h-fit w-full xs:w-auto">
              <CustomVideo
                src={convertVideoUrl(item?.doc_path)}
                controls
                autoPlay
                height="100%"
                width="100%"
                className="!h-full !w-full !object-cover"
              />
            </div>

            <div className="flex w-full flex-col gap-4 p-5">
              <p className="text-xl font-medium text-black-50 md:text-2xl">
                {item?.title}
              </p>

              <p className="text-sm font-normal text-grey-50 md:text-base">
                {item?.description}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const EducationalVideo = () => {
  const limit = useSelector(selectLimit);
  const dispatch = useAppDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [trendGalleryData, setTrendGalleryData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecordCount, setTotalRecordsCount] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTrendGallery();
  }, [currentPage]);

  const fetchTrendGallery = async (search = "") => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.educationalVideo.list(
        `page=${currentPage}&search=${search}`,
      );
      if (status === 200 || status === 201) {
        setTrendGalleryData(data?.data?.records);
        setTotalRecordsCount(data?.data?.noOfRecords);
        setTotalPages(data?.data?.totalPages);
      }
    } catch (error) {
      showToast("error", error?.message);
    }
    dispatch(setIsLoading(false));
  };

  const handlePageChange = (_e, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="relative flex h-full w-full flex-col gap-4 gap-y-12 px-6 py-6 sm:px-12 md:px-24">
        <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <Breadcrumb />
            <div className="heading-40 font-medium capitalize">
              Educational Video
            </div>
          </div>
          <div>
            <SearchInputButton
              search={search}
              setSearch={setSearch}
              searchMessage={"Search Here"}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchTrendGallery(e.currentTarget.value);
                }
              }}
              onBlur={(e) => {
                fetchTrendGallery(e.currentTarget.value);
              }}
            />
          </div>
        </div>

        {isEmpty(trendGalleryData) ? (
          <NoData text="No Data Found" />
        ) : (
          <Fragment>
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {trendGalleryData?.map((item) => (
                  <EducationalVideoItem key={item?._id} item={item} />
                ))}
              </div>
            </div>
            <div className="relative mt-auto flex w-full flex-col items-center justify-between gap-5 bg-white py-3 sm:flex-row">
              <Pagination
                shape="rounded"
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                sx={{
                  "& .Mui-selected": {
                    backgroundColor: "black !important",
                    color: "white !important",
                  },
                }}
              />
              {totalRecordCount ? (
                <p className="text-xs text-grey-1300 md:text-sm">{`Showing ${currentPage * limit - limit + 1} – ${currentPage === totalPages || totalRecordCount <= limit ? totalRecordCount : currentPage * limit} of ${totalRecordCount} results`}</p>
              ) : null}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default EducationalVideo;
