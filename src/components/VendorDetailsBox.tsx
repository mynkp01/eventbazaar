"use client";
import { apiHandler } from "@api/apiHandler";
import {
  HeartIcon,
  Location,
  StarIcon,
  VendorPlanBadge,
  VerifiedLogo,
} from "@assets/index";
import { Tooltip } from "@mui/material";
import { selectUser, setVisibleLoginModal } from "@redux/slices/authSlice";
import { useAppDispatch } from "@redux/store/store";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PLAN_CODE } from "src/utils/Constant";
import { isEmpty } from "src/utils/helper";
import CustomImage from "./CustomImage";

interface VendorDetailsBoxProps {
  vendor_id?: string;
  image?: string;
  name?: string;
  star?: number;
  className?: string;
  reviewsCount?: number;
  pricing?: string;
  planData?: object;
  city?: string;
  state?: string;
  showButton?: boolean;
  buttonLabel?: string;
  buttonClass?: string;
  buttonAction?: () => void;
  href?: string;
  imageClassName?: string;
  isFavorite?: boolean;
  lookupCardButtons?: any;
}

const VendorDetailsBox = ({
  vendor_id,
  image,
  name,
  star,
  className,
  reviewsCount,
  pricing,
  planData,
  showButton = false,
  buttonLabel,
  buttonClass,
  city,
  state,
  buttonAction,
  href,
  imageClassName,
  isFavorite = false,
  lookupCardButtons = null,
}: VendorDetailsBoxProps) => {
  const dispatch = useAppDispatch();
  const userData = useSelector(selectUser);

  const [likedItem, setLikedItem] = useState<boolean>(false);

  useEffect(() => {
    setLikedItem(isFavorite);
  }, [isFavorite]);

  const onClickLike = async () => {
    try {
      if (isEmpty(userData?.user_id)) {
        dispatch(setVisibleLoginModal(true));
      } else {
        setLikedItem((prevState) => !prevState);
        await apiHandler.client.customerToggleLike(vendor_id);
      }
    } catch (error) {
      console.error("Err on Click Like", error);
    }
  };

  return (
    <div
      className={`relative flex h-auto w-full min-w-44 max-w-96 flex-col overflow-hidden rounded-xl bg-gray-100 hover:bg-green-400/10 ${href ? "cursor-pointer" : "pointer-events-none"} ${className || ""}`}
    >
      <div className="flex h-full w-full flex-col">
        <Link href={href} target="_blank">
          <div
            className={`relative h-44 max-h-60 w-full lg:h-52 ${imageClassName || ""}`}
          >
            <CustomImage
              src={image}
              height="100%"
              width="100%"
              className="!min-h-full !min-w-full !rounded-xl !object-cover"
            />
            {!isEmpty(planData) && planData?.plan_code !== PLAN_CODE.lite ? (
              <div className="absolute left-0 top-3">
                <VendorPlanBadge text={planData?.plan_name} />
              </div>
            ) : null}
          </div>

          <div className="flex w-full flex-col items-start gap-2 p-2.5">
            {!isEmpty(star) || !isEmpty(reviewsCount) || !isEmpty(name) ? (
              <Fragment>
                <div className="flex w-full items-center gap-1.5">
                  {!isEmpty(planData) &&
                  planData?.plan_code !== PLAN_CODE.lite ? (
                    <VerifiedLogo />
                  ) : null}
                  {!isEmpty(name) ? (
                    <Tooltip title={name} placement="top">
                      <p className="truncate text-base font-semibold text-black-50 md:text-lg">
                        {name}
                      </p>
                    </Tooltip>
                  ) : null}
                </div>

                {!isEmpty(star) || !isEmpty(reviewsCount) ? (
                  <div className="flex items-center space-x-1 whitespace-nowrap text-[10px] font-normal text-black md:text-xs">
                    {!isEmpty(star) ? (
                      <>
                        <StarIcon
                          strokeWidth="none"
                          className="size-4 fill-yellow-500"
                        />
                        <p>{star ? star?.toFixed(1) : star}</p>
                      </>
                    ) : null}
                    {!isEmpty(reviewsCount) ? (
                      <p className="text-gray-600">({reviewsCount} reviews)</p>
                    ) : null}
                  </div>
                ) : null}
              </Fragment>
            ) : null}

            {!isEmpty(city) || !isEmpty(state) ? (
              <div className="flex w-full items-center gap-1 text-[10px] md:text-xs">
                <div>
                  <Location />
                </div>
                <Tooltip
                  title={`${!isEmpty(city) ? city : null}${!isEmpty(city) && !isEmpty(state) ? ", " : null}${!isEmpty(state) ? state : null}`}
                  placement="top"
                >
                  <p className="truncate font-normal text-grey-700">
                    {!isEmpty(city) ? city : null}
                    {!isEmpty(city) && !isEmpty(state) ? <span>, </span> : null}
                    {!isEmpty(state) ? <span>{state}</span> : null}
                  </p>
                </Tooltip>
              </div>
            ) : null}

            {!isEmpty(pricing) ? (
              <p className="text-gray-600">
                ₹ {pricing}{" "}
                <span className="w-full items-center text-[10px] md:text-xs">
                  onwards
                </span>
              </p>
            ) : null}
          </div>
        </Link>

        {showButton && !isEmpty(buttonLabel) ? (
          <button
            onClick={buttonAction}
            className={`m-2.5 mt-auto flex h-12 w-auto items-center justify-center rounded-md bg-green-400 text-xs text-white transition-all duration-300 md:text-sm ${buttonClass || ""}`}
          >
            {buttonLabel}
          </button>
        ) : null}
        {lookupCardButtons ? lookupCardButtons : ""}
      </div>
      {isEmpty(userData) || userData?.user_id !== vendor_id ? (
        <button
          onClick={onClickLike}
          className="absolute right-3 top-3 rounded-full bg-white p-3 shadow-md transition-all duration-200 hover:scale-110"
        >
          <HeartIcon
            className={`h-4 w-4 ${
              likedItem ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
          />
        </button>
      ) : null}
    </div>
  );
};

export default VendorDetailsBox;
