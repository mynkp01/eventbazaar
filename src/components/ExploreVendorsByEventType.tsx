"use client";
import { selectVerticalsAndEventTypes } from "@redux/slices/lookupSlice";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ROUTES } from "src/utils/Constant";
import { convertMediaUrl } from "src/utils/helper";
import { customEncodeURIComponent } from "src/utils/helper.server";
import CustomImage from "./CustomImage";

function ExploreVendorsByEventType() {
  const eventVerticalsData = useSelector(selectVerticalsAndEventTypes);

  return (
    <div className="grid w-full grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
      {eventVerticalsData.map((vertical) => (
        <Link
          key={vertical?._id}
          href={`${ROUTES.client.events}/${customEncodeURIComponent(vertical?.event_vertical_name)}`}
          className="group flex flex-col gap-2"
        >
          <div className="flex aspect-[4/5] justify-center overflow-hidden rounded-xl">
            <CustomImage
              src={convertMediaUrl(vertical?.vertical_path)}
              alt="Image"
              width={"100%"}
              className="!h-full !w-full !object-cover !transition-all !duration-300 group-hover:!scale-105"
            />
          </div>
          <p className="text-base font-medium text-black md:text-lg">
            {`${vertical?.event_vertical_name} Events`}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default ExploreVendorsByEventType;
