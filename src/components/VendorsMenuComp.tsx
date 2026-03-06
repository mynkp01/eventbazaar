import { LeftArrowIcon } from "@assets/index";
import Link from "next/link";
import { ROUTES } from "src/utils/Constant";
import { customEncodeURIComponent } from "src/utils/helper.server";

export const EventServicesTab = ({
  currentVendorsMenu,
  eventHover,
  setEventHover,
}) => {
  return (
    <div className="max-h-[370px] columns-4 gap-5 bg-[linear-gradient(to_right,#FFFFFF_0%,#FFFFFF_25%,#F7F7F7_25%,#F7F7F7_50%,#FFFFFF_50%,#FFFFFF_75%,#F7F7F7_75%,#F7F7F7_100%)] p-4">
      {currentVendorsMenu?.category_1?.map((category, index) => (
        <div key={category?.key_2} className="mb-4">
          <p
            onMouseEnter={() => setEventHover(null)}
            className="mb-2 rounded p-2 font-semibold uppercase text-green-400 xl:text-nowrap"
          >
            {category?.key_2}
          </p>
          {category?.category_2?.map((item) => (
            <Link
              key={item?.business_sub_category_name}
              onMouseEnter={() => setEventHover(item)}
              href={`${ROUTES.client.category}/${customEncodeURIComponent(item?.business_sub_category_name)}`}
              className="group flex items-center justify-between gap-2 rounded-md px-2 py-1 hover:text-green-400"
            >
              <p className="py-1">{item?.business_sub_category_name}</p>
              <div
                className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!min-size-5 !size-5" : ""} size-0 overflow-hidden`}
              >
                <LeftArrowIcon
                  key={item?.business_sub_category_name}
                  className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!size-5 !-rotate-45" : ""} size-full rotate-0 transition-all duration-300 ease-in-out`}
                />
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export const EntertainmentTab = ({
  currentVendorsMenu,
  eventHover,
  setEventHover,
}) => {
  return (
    <div className="max-h-[490px] columns-4 gap-5 bg-[linear-gradient(to_right,#FFFFFF_0%,#FFFFFF_25%,#F7F7F7_25%,#F7F7F7_50%,#FFFFFF_50%,#FFFFFF_75%,#F7F7F7_75%,#F7F7F7_100%)] p-4">
      {currentVendorsMenu?.category_1?.map((category, index) => (
        <div key={category?.key_2} className={`mb-4`}>
          <p
            onMouseEnter={() => setEventHover(null)}
            className="mb-2 rounded bg-green-400 p-2 font-semibold uppercase text-green-400 xl:text-nowrap"
          >
            {category?.key_2}
          </p>
          {category?.category_2?.map((item) => (
            <Link
              key={item?.business_sub_category_name}
              onMouseEnter={() => setEventHover(item)}
              href={`${ROUTES.client.category}/${customEncodeURIComponent(item?.business_sub_category_name)}`}
              className="flex items-center justify-between gap-2 rounded-md px-2 py-1 hover:text-green-400"
            >
              <p className="py-1">{item?.business_sub_category_name}</p>
              <div
                className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!min-size-5 !size-5" : ""} size-0 overflow-hidden`}
              >
                <LeftArrowIcon
                  key={item?.business_sub_category_name}
                  className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!size-5 !-rotate-45" : ""} size-full rotate-0 transition-all duration-300 ease-in-out`}
                />
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export const DecorSetupRentals = ({
  currentVendorsMenu,
  eventHover,
  setEventHover,
}) => {
  return (
    <div className="grid max-h-[490px] grid-cols-2 gap-5 bg-[linear-gradient(to_right,#FFFFFF_0%,#FFFFFF_25%,#F7F7F7_25%,#F7F7F7_50%,#FFFFFF_50%,#FFFFFF_75%,#F7F7F7_75%,#F7F7F7_100%)] p-4">
      {/* <div className={`mb-4 grid grid-cols-2`}> */}
      {/* {currentVendorsMenu?.category_1?.map((category, index) => ( */}
      <div
        key={currentVendorsMenu?.category_1?.[0]?.key_2}
        className={`mb-4 columns-2`}
      >
        <p
          onMouseEnter={() => setEventHover(null)}
          className="mb-2 rounded p-2 font-semibold uppercase text-green-400 xl:text-nowrap"
        >
          {currentVendorsMenu?.category_1?.[0]?.key_2}
        </p>
        {currentVendorsMenu?.category_1?.[0]?.category_2?.map((item) => (
          <Link
            key={item?.business_sub_category_name}
            onMouseEnter={() => setEventHover(item)}
            href={`${ROUTES.client.category}/${customEncodeURIComponent(item?.business_sub_category_name)}`}
            className="flex items-center justify-between gap-2 rounded-md px-2 py-1 hover:text-green-400"
          >
            <p className="py-1">{item?.business_sub_category_name}</p>
            <div
              className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!min-size-5 !size-5" : ""} size-0 overflow-hidden`}
            >
              <LeftArrowIcon
                key={item?.business_sub_category_name}
                className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!size-5 !-rotate-45" : ""} size-full rotate-0 transition-all duration-300 ease-in-out`}
              />
            </div>
          </Link>
        ))}
      </div>
      <div
        key={currentVendorsMenu?.category_1?.[1]?.key_2}
        className={`mb-4 columns-2`}
      >
        <p
          onMouseEnter={() => setEventHover(null)}
          className="mb-2 rounded p-2 font-semibold uppercase text-green-400 xl:text-nowrap"
        >
          {currentVendorsMenu?.category_1?.[1]?.key_2}
        </p>
        {currentVendorsMenu?.category_1?.[1]?.category_2?.map((item) => (
          <Link
            key={item?.business_sub_category_name}
            onMouseEnter={() => setEventHover(item)}
            href={`${ROUTES.client.category}/${customEncodeURIComponent(item?.business_sub_category_name)}`}
            className="flex items-center justify-between gap-2 rounded-md px-2 py-1 hover:text-green-400"
          >
            <p className="py-1">{item?.business_sub_category_name}</p>
            <div
              className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!min-size-5 !size-5" : ""} size-0 overflow-hidden`}
            >
              <LeftArrowIcon
                key={item?.business_sub_category_name}
                className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!size-5 !-rotate-45" : ""} size-full rotate-0 transition-all duration-300 ease-in-out`}
              />
            </div>
          </Link>
        ))}
      </div>
      {/* ))} */}
      {/* </div> */}
    </div>
  );
};

export const Venues = ({ currentVendorsMenu, eventHover, setEventHover }) => {
  return (
    <div className="grid max-h-[490px] grid-cols-2 gap-5 bg-[linear-gradient(to_right,#FFFFFF_0%,#FFFFFF_25%,#F7F7F7_25%,#F7F7F7_50%,#FFFFFF_50%,#FFFFFF_75%,#F7F7F7_75%,#F7F7F7_100%)] p-4">
      {/* {currentVendorsMenu?.category_1?.map((category, index) => ( */}
      <div
        key={currentVendorsMenu?.category_1?.[0]?.key_2}
        className={`mb-4 columns-2`}
      >
        <p
          onMouseEnter={() => setEventHover(null)}
          className="mb-2 rounded p-2 font-semibold uppercase text-green-400 xl:text-nowrap"
        >
          {currentVendorsMenu?.category_1?.[0]?.key_2}
        </p>
        {currentVendorsMenu?.category_1?.[0]?.category_2?.map((item) => (
          <Link
            key={item?.business_sub_category_name}
            onMouseEnter={() => setEventHover(item)}
            href={`${ROUTES.client.category}/${customEncodeURIComponent(item?.business_sub_category_name)}`}
            className="flex items-center justify-between gap-2 rounded-md px-2 py-1 hover:text-green-400"
          >
            <p className="py-1">{item?.business_sub_category_name}</p>
            <div
              className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!min-size-5 !size-5" : ""} size-0 overflow-hidden`}
            >
              <LeftArrowIcon
                key={item?.business_sub_category_name}
                className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!size-5 !-rotate-45" : ""} size-full rotate-0 transition-all duration-300 ease-in-out`}
              />
            </div>
          </Link>
        ))}
      </div>
      <div key={currentVendorsMenu?.category_1?.[1]?.key_2} className={`mb-4`}>
        <p
          onMouseEnter={() => setEventHover(null)}
          className="mb-2 rounded p-2 font-semibold uppercase text-green-400 xl:text-nowrap"
        >
          {currentVendorsMenu?.category_1?.[1]?.key_2}
        </p>
        {currentVendorsMenu?.category_1?.[1]?.category_2?.map((item) => (
          <Link
            key={item?.business_sub_category_name}
            onMouseEnter={() => setEventHover(item)}
            href={`${ROUTES.client.category}/${customEncodeURIComponent(item?.business_sub_category_name)}`}
            className="flex items-center justify-between gap-2 rounded-md px-2 py-1 hover:text-green-400"
          >
            <p className="py-1">{item?.business_sub_category_name}</p>
            <div
              className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!min-size-5 !size-5" : ""} size-0 overflow-hidden`}
            >
              <LeftArrowIcon
                key={item?.business_sub_category_name}
                className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!size-5 !-rotate-45" : ""} size-full rotate-0 transition-all duration-300 ease-in-out`}
              />
            </div>
          </Link>
        ))}
      </div>
      {/* ))} */}
    </div>
  );
};

export const FashionStyling = ({
  currentVendorsMenu,
  eventHover,
  setEventHover,
}) => {
  return (
    <div className="max-h-[490px] columns-4 gap-5 bg-[linear-gradient(to_right,#FFFFFF_0%,#FFFFFF_25%,#F7F7F7_25%,#F7F7F7_50%,#FFFFFF_50%,#FFFFFF_75%,#F7F7F7_75%,#F7F7F7_100%)] p-4">
      {currentVendorsMenu?.category_1?.map((category, index) => (
        <div key={category?.key_2} className={`mb-4 break-inside-avoid`}>
          <p
            onMouseEnter={() => setEventHover(null)}
            className="mb-2 rounded p-2 font-semibold uppercase text-green-400 xl:text-nowrap"
          >
            {category?.key_2}
          </p>
          {category?.category_2?.map((item) => (
            <Link
              key={item?.business_sub_category_name}
              onMouseEnter={() => setEventHover(item)}
              href={`${ROUTES.client.category}/${customEncodeURIComponent(item?.business_sub_category_name)}`}
              className="flex items-center justify-between gap-2 rounded-md px-2 py-1 hover:text-green-400"
            >
              <p className="py-1">{item?.business_sub_category_name}</p>
              <div
                className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!min-size-5 !size-5" : ""} size-0 overflow-hidden`}
              >
                <LeftArrowIcon
                  key={item?.business_sub_category_name}
                  className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!size-5 !-rotate-45" : ""} size-full rotate-0 transition-all duration-300 ease-in-out`}
                />
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export const Corporate = ({
  currentVendorsMenu,
  eventHover,
  setEventHover,
}) => {
  return (
    <div className="max-h-[490px] columns-4 gap-5 bg-[linear-gradient(to_right,#FFFFFF_0%,#FFFFFF_25%,#F7F7F7_25%,#F7F7F7_50%,#FFFFFF_50%,#FFFFFF_75%,#F7F7F7_75%,#F7F7F7_100%)] p-4">
      {currentVendorsMenu?.category_1?.map((category, index) => (
        <div key={category?.key_2} className={`mb-4 break-inside-avoid`}>
          <p
            onMouseEnter={() => setEventHover(null)}
            className="mb-2 rounded p-2 font-semibold uppercase text-green-400 xl:text-nowrap"
          >
            {category?.key_2}
          </p>
          {category?.category_2?.map((item) => (
            <Link
              key={item?.business_sub_category_name}
              onMouseEnter={() => setEventHover(item)}
              href={`${ROUTES.client.category}/${customEncodeURIComponent(item?.business_sub_category_name)}`}
              className="flex items-center justify-between gap-2 rounded-md px-2 py-1 hover:text-green-400"
            >
              <p className="py-1">{item?.business_sub_category_name}</p>
              <div
                className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!min-size-5 !size-5" : ""} size-0 overflow-hidden`}
              >
                <LeftArrowIcon
                  key={item?.business_sub_category_name}
                  className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!size-5 !-rotate-45" : ""} size-full rotate-0 transition-all duration-300 ease-in-out`}
                />
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};
export const SpecialServices = ({
  currentVendorsMenu,
  eventHover,
  setEventHover,
}) => {
  return (
    <div className="columns-4 gap-5 bg-[linear-gradient(to_right,#FFFFFF_0%,#FFFFFF_25%,#F7F7F7_25%,#F7F7F7_50%,#FFFFFF_50%,#FFFFFF_75%,#F7F7F7_75%,#F7F7F7_100%)] p-4">
      {currentVendorsMenu?.category_1?.map((category, index) => (
        <div
          key={category?.key_2}
          className={`mb-4 break-before-auto xl:break-inside-avoid`}
        >
          <p
            onMouseEnter={() => setEventHover(null)}
            className="mb-2 rounded p-2 font-semibold uppercase text-green-400"
          >
            {category?.key_2}
          </p>
          {category?.category_2?.map((item) => (
            <Link
              key={item?.business_sub_category_name}
              onMouseEnter={() => setEventHover(item)}
              href={`${ROUTES.client.category}/${customEncodeURIComponent(item?.business_sub_category_name)}`}
              className="flex items-center justify-between gap-2 rounded-md px-2 py-1 hover:text-green-400"
            >
              <p className="py-1">{item?.business_sub_category_name}</p>
              <div
                className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!min-size-5 !size-5" : ""} size-0 overflow-hidden`}
              >
                <LeftArrowIcon
                  key={item?.business_sub_category_name}
                  className={`${item?.business_sub_category_name === eventHover?.business_sub_category_name ? "!size-5 !-rotate-45" : ""} size-full rotate-0 transition-all duration-300 ease-in-out`}
                />
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};
