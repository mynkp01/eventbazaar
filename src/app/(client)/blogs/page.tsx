"use client";
import Query from "@api/Query";
import Breadcrumb from "@components/Breadcrumb";
import CustomImage from "@components/CustomImage";
import CustomInput from "@components/CustomInput";
import NoData from "@components/NoData";
import { Pagination } from "@mui/material";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import axios from "axios";
import Link from "next/link";
import { SetStateAction, useEffect, useState } from "react";
import { isEmpty } from "src/utils/helper";

const RenderBlogPost = ({ post }) => {
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0];
  const link = post?.link?.replace(process.env.NEXT_PUBLIC_WORDPRESS_URL, "");
  const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "";

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <Link href={link} className="group" target="_blank">
        <div className="relative">
          <div className="aspect-[16/9] overflow-hidden">
            <CustomImage
              src={featuredImage?.source_url}
              alt={featuredImage?.alt_text || post.title?.rendered}
              className="!h-full !w-full !object-cover !transition-all !duration-300 group-hover:!scale-105"
            />
          </div>
          <div className="p-4">
            {category && (
              <span className="mb-1 block text-xs text-gray-500">
                {category}
              </span>
            )}
            <h3
              dangerouslySetInnerHTML={{ __html: post.title?.rendered }}
              className="line-clamp-2 text-base font-medium text-black md:text-lg"
            />
            <p
              className="mt-2 line-clamp-2 text-sm text-gray-600"
              dangerouslySetInnerHTML={{ __html: post.excerpt?.rendered || "" }}
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

const BlogsPage = () => {
  const dispatch = useAppDispatch();
  const limitPerPage = 12;

  const [ourBlogsData, setOurBlogsData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecordCount, setTotalRecordsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState({
    input: "",
    value: "",
  });

  useEffect(() => {
    getPosts();
  }, [currentPage, search?.value]);

  const getPosts = async () => {
    dispatch(setIsLoading(true));
    try {
      const { data, status, headers } = await axios.get(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2${Query.posts}?_embed&per_page=${limitPerPage}&page=${currentPage}${search?.value ? `&search=${search?.value}` : ""}`,
      );
      if ([200, 201].includes(status)) {
        setOurBlogsData(data);

        setTotalPages(parseInt(headers["x-wp-totalpages"]) || 1);
        setTotalRecordsCount(parseInt(headers["x-wp-total"]) || 0);
      }
    } catch (e) {
      console.error("Error while getting blogs list:", e);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handlePageChange = (_e: any, newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch((prev) => ({ ...prev, input: e.target.value }));
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:gap-6 md:px-12 lg:gap-8 lg:px-24 lg:py-12">
      <div className="flex w-full flex-col justify-between gap-6 md:gap-6 lg:flex-row lg:items-center lg:gap-8">
        <div>
          <p className="heading-40">Event Blogs & Insights</p>
          <Breadcrumb />
        </div>

        <div className="w-full md:max-w-md">
          <CustomInput
            type="text"
            placeholder="Search blogs..."
            value={search?.input}
            onChange={handleSearch}
            className="w-full rounded-lg border border-gray-300 duration-300 focus:border-black"
            containerClass="mt-0"
            onBlur={(e) => {
              setSearch((prev) => ({ ...prev, value: e.target.value }));
              setCurrentPage(1);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch((prev) => ({ ...prev, value: search?.input }));
                setCurrentPage(1);
              }
            }}
          />
        </div>
      </div>

      {!isEmpty(ourBlogsData) ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ourBlogsData.map((post) => (
              <RenderBlogPost post={post} key={post.id} />
            ))}
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
              <p className="text-xs text-grey-1300 md:text-sm">{`Showing ${currentPage * limitPerPage - limitPerPage + 1} – ${currentPage === totalPages || totalRecordCount <= limitPerPage ? totalRecordCount : currentPage * limitPerPage} of ${totalRecordCount} results`}</p>
            ) : null}
          </div>
        </>
      ) : (
        <NoData text="No Blogs Found" />
      )}
    </div>
  );
};

export default BlogsPage;
