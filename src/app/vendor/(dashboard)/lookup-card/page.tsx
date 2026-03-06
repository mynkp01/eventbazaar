"use client";
import { apiHandler } from "@api/apiHandler";
import VendorDetailsBox from "@components/VendorDetailsBox";
import { selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES } from "src/utils/Constant";
import { convertMediaUrl } from "src/utils/helper";
import { customEncodeURIComponent } from "src/utils/helper.server";

const LookupCard = () => {
  let [vendor, setVendor] = useState(null);
  const userData = useSelector(selectUser);
  const dispatch = useAppDispatch();

  const fetchVendorDetails = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.client.vendorDetails(
        `vendor_id=${userData?.user_id}`,
      );
      if (status === 200 || status === 201) {
        setVendor(data?.data);
      }
    } catch (err) {
    } finally {
      dispatch(setIsLoading(false));
    }
  };
  useEffect(() => {
    fetchVendorDetails();
  }, []);

  return (
    <div className="flex h-full flex-1 flex-col gap-4">
      <h3 className="heading-40">Lookup Card</h3>
      <div className="flex h-full flex-col gap-8 rounded-xl bg-primary-100 p-2 sm:p-3 lg:p-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <VendorDetailsBox
            key={vendor?._id}
            vendor_id={vendor?._id}
            isFavorite={vendor?.isFavorite}
            image={convertMediaUrl(
              vendor?.heroBanner?.documents?.["0"]?.doc_path,
            )}
            name={vendor?.company_name}
            star={vendor?.averageRating}
            reviewsCount={vendor?.totalReview}
            city={vendor?.city}
            state={vendor?.state}
            pricing={vendor?.budget}
            planData={vendor?.planData}
            href={`${ROUTES.client.vendorDetails}/${customEncodeURIComponent(vendor?.company_name)}-${vendor?._id}`}
            className="!max-w-full"
            lookupCardButtons={
              <div className="m-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Link
                  href={`${ROUTES.vendor.coverImage}`}
                  className={`flex h-10 items-center justify-center rounded-md border bg-green-400 p-2 text-xs text-white transition-all duration-300 hover:border-green-400 hover:bg-white hover:text-green-400 md:h-12 md:text-sm`}
                >
                  Update Cover Image
                </Link>
                <Link
                  href={`${ROUTES.vendor.profile}`}
                  className={`flex h-10 items-center justify-center rounded-md border bg-green-400 p-2 text-xs text-white transition-all duration-300 hover:border-green-400 hover:bg-white hover:text-green-400 md:h-12 md:text-sm`}
                >
                  Update Profile Details
                </Link>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default LookupCard;
