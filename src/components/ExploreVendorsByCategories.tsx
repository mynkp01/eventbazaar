"use client";
import Link from "next/link";
import { ROUTES } from "src/utils/Constant";
import { convertMediaUrl, isEmpty } from "src/utils/helper";
import { customEncodeURIComponent } from "src/utils/helper.server";
import CustomImage from "./CustomImage";

const ExploreVendorsByCategories = ({
  isInteractive = true,
  data = [],
  link = (i) => "",
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-6 lg:gap-6 xl:grid-cols-8 xl:gap-8">
      {data.map((category, index) => (
        <Link
          href={
            isInteractive
              ? !isEmpty(link)
                ? link(category)
                : `${ROUTES.client.category}/${customEncodeURIComponent(category?.name || category?.business_sub_category_name)}`
              : ""
          }
          key={category?._id || index}
          className={`group h-auto w-full rounded-3xl bg-transparent p-[1px] text-black-100 transition-colors duration-300 ease-in-out ${isInteractive ? "hover:border-green-600 hover:bg-green-600 hover:bg-opacity-5 hover:bg-[linear-gradient(137.74deg,rgb(2,66,136)_5.25%,rgb(170,254,105)_129.56%)]" : "pointer-events-none"}`}
        >
          <div
            className={`flex h-full w-auto max-w-full flex-col items-center gap-3 overflow-hidden rounded-[23px] bg-white px-6 py-4 ${isInteractive ? "group-hover:bg-green-10" : ""}`}
          >
            <div className="flex size-16 justify-center rounded-xl border border-grey-300 p-2 md:size-20">
              <CustomImage
                src={
                  category?.icon?.src
                    ? category?.icon?.src
                    : convertMediaUrl(category?.vector_path)
                }
                height="100%"
                width="100%"
              />
            </div>
            <p className="text-center text-sm md:text-base">
              {category?.name || category?.business_sub_category_name}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ExploreVendorsByCategories;
