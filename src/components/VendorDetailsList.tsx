"use client";
import { selectSelectedCity } from "@redux/slices/lookupSlice";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES } from "src/utils/Constant";
import { convertMediaUrl, isEmpty, showToast } from "src/utils/helper";
import { customEncodeURIComponent } from "src/utils/helper.server";
import NoData from "./NoData";
import VendorDetailsBox from "./VendorDetailsBox";

interface VendorDetailsListProps {
  title?: string;
  endpoint?: (query: string) => Promise<AxiosResponse<any, any>>;
  endpointString?: string;
  displayNameKey?: string;
  displayImageKey?: string;
  vendorIdKey?: string;
  href?: ((item: any) => string) | string;
  onClickViewAll?: () => void;
}

const VendorDetailsList = ({
  title,
  endpoint,
  endpointString,
  displayNameKey,
  displayImageKey,
  vendorIdKey,
  href,
  onClickViewAll,
}: VendorDetailsListProps) => {
  const selectedCity = useSelector(selectSelectedCity);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (endpoint) {
      loadData();
    }
  }, [endpointString, selectedCity]);

  const loadData = async () => {
    try {
      const { data, status } = await endpoint(endpointString);
      if (status === 200 || status === 201) {
        setData(data?.data);
      } else {
        showToast("error", data?.message);
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-2xl font-semibold text-black-50 sm:text-left md:text-center">
          {title}
        </p>
        {isEmpty(data) ? null : (
          <div className="hidden justify-center sm:justify-end md:flex">
            <button
              onClick={onClickViewAll}
              className="whitespace-nowrap rounded-full border border-green-500 px-6 py-2 text-green-500 transition-all hover:bg-green-400 hover:text-white"
            >
              View All
            </button>
          </div>
        )}
      </div>
      {isEmpty(data) ? (
        <NoData isFromVendorList />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {data?.map((item, index) => (
            <VendorDetailsBox
              vendor_id={item?.vendor_id}
              isFavorite={item?.isFavorite}
              key={`vendor-list-${index}`}
              image={convertMediaUrl(item?.[displayImageKey] || item?.image)}
              name={item?.[displayNameKey] || item?.company_name}
              city={item?.city}
              state={item?.state}
              star={item?.averageRating}
              reviewsCount={item?.totalReview}
              planData={item?.planData}
              href={
                (typeof href === "string" ? href : href(item)) ||
                `${ROUTES.client.vendorDetails}/${customEncodeURIComponent(item?.[displayNameKey] || item?.company_name)}-${item?.[vendorIdKey] || item?.vendor_id}`
              }
            />
          ))}
        </div>
      )}
      <div className="flex justify-center sm:justify-end md:hidden">
        <button
          onClick={onClickViewAll}
          className="w-full whitespace-nowrap rounded-full border border-green-500 px-6 py-2 text-green-500 transition-all hover:bg-green-400 hover:text-white"
        >
          View All
        </button>
      </div>
    </div>
  );
};

export default VendorDetailsList;
