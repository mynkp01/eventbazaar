"use client";
import { apiHandler } from "@api/apiHandler";
import { VideoPlayerIcon } from "@assets/index";
import Breadcrumb from "@components/Breadcrumb";
import CustomImage from "@components/CustomImage";
import NoData from "@components/NoData";
import SearchInputButton from "@components/SearchInputButton";
import { Pagination } from "@mui/material";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { ROUTES } from "src/utils/Constant";
import { convertMediaUrl, isEmpty, showToast } from "src/utils/helper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const TrendGalleryItem = ({ item }) => {
  const route = useRouter();

  return (
    <Link
      href={`${ROUTES.client.trendGallery}/${item?._id}`}
      target="_blank"
      className="my-1 flex w-full cursor-pointer flex-col gap-2"
      // onClick={() => route.push(`${ROUTES.client.trendGallery}/${item?._id}`)}
    >
      <div className="relative aspect-[3/4] w-full">
        <CustomImage
          src={convertMediaUrl(item?.thumbnail)}
          height="100%"
          width="100%"
          className="!aspect-[3/4] !w-full !rounded-lg !object-cover"
        />
        <div className="absolute left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 items-center text-green-400">
          <VideoPlayerIcon className="size-16 min-h-14 min-w-14" />
        </div>
      </div>
      <div>
        <p className="flex text-base font-bold md:text-lg">{item?.reel_name}</p>
        <p className="text-wrap text-xs font-normal text-grey-50">
          {item.description}
        </p>
      </div>
    </Link>
  );
};

const TrendGallery = () => {
  const DATA_LENGTH = 20;
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
      const { data, status } = await apiHandler.trendGallery.list(
        `page=${currentPage}&limit=${DATA_LENGTH}&search=${search}`,
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
            <div className="text-[38px] font-medium capitalize">
              Trend Gallery
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
              <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 md:gap-6 xl:grid-cols-4 2xl:grid-cols-5">
                {trendGalleryData?.map((item) => (
                  <TrendGalleryItem key={item?._id} item={item} />
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
                <p className="text-xs text-grey-1300 md:text-sm">{`Showing ${currentPage * DATA_LENGTH - DATA_LENGTH + 1} – ${currentPage === totalPages || totalRecordCount <= DATA_LENGTH ? totalRecordCount : currentPage * DATA_LENGTH} of ${totalRecordCount} results`}</p>
              ) : null}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default TrendGallery;
