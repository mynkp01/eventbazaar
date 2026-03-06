"use client";
import Query from "@api/Query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ROUTES } from "src/utils/Constant";
import { isEmpty } from "src/utils/helper";
import {
  A11y,
  Navigation,
  Scrollbar,
  Pagination as SwiperPagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CustomImage from "./CustomImage";

const RenderBlogPost = ({ post }) => {
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0];
  const link = post?.link?.replace(process.env.NEXT_PUBLIC_WORDPRESS_URL, "");

  return (
    <Link href={link} className="group flex flex-col gap-2">
      <div className="flex aspect-[4/5] justify-center overflow-hidden rounded-xl">
        <CustomImage
          src={featuredImage?.source_url}
          alt={featuredImage?.alt_text || post.title?.rendered}
          className="!h-full !w-full !object-cover !transition-all !duration-300 group-hover:!scale-105"
        />
      </div>
      <p
        dangerouslySetInnerHTML={{ __html: post.title?.rendered }}
        className="text-base font-medium text-black md:text-lg"
      />
    </Link>
  );
};

const BlogsList = () => {
  const routes = useRouter();

  const [ourBlogsData, setOurBlogsData] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const { data, status } = await axios.get(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2${Query.posts}?_embed`,
      );
      if ([200, 201].includes(status)) {
        setOurBlogsData(data);
      }
    } catch (e) {
      console.error("Error while getting blogs list:", e);
    }
  };

  const swiperBreakpoints = {
    0: { slidesPerView: 1 },
    640: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
  };

  return isEmpty(ourBlogsData) ? null : (
    <div className="flex flex-col gap-4 px-6 lg:gap-6 lg:px-24 xl:gap-8">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row lg:gap-6 xl:gap-8">
        <div>
          <p className="heading-40">Event Blogs & Insights</p>
          <p className="text-sm text-grey-50 md:text-base">
            Stay updated with expert tips, trends, and inspiration to make your
            event extraordinary.
          </p>
        </div>

        <button
          onClick={() => routes.push(ROUTES.client.blogs)}
          className="flex w-full items-center justify-center whitespace-nowrap rounded-full border border-green-500 px-6 py-2 text-green-500 transition-all hover:bg-green-400 hover:text-white md:w-auto"
        >
          View All
        </button>
      </div>

      <Swiper
        spaceBetween={20}
        speed={700}
        slidesPerView={4}
        navigation
        modules={[Navigation, SwiperPagination, Scrollbar, A11y]}
        breakpoints={swiperBreakpoints}
        className="eb-swiper w-full overflow-hidden"
      >
        {ourBlogsData.map((post) => (
          <SwiperSlide key={post.id}>
            <RenderBlogPost post={post} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BlogsList;
