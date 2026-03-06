"use client";
import { apiHandler } from "@api/apiHandler";
import NoData from "@components/NoData";
import VendorDetailsBox from "@components/VendorDetailsBox";
import { Pagination } from "@mui/material";
import { selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES } from "src/utils/Constant";
import { convertMediaUrl, isEmpty, showToast } from "src/utils/helper";
import { customEncodeURIComponent } from "src/utils/helper.server";

const FavoriteVendors = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userData = useSelector(selectUser);

  const [favoriteVendors, setFavoriteVendors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isEmpty(userData)) {
      loadFavoriteVendors();
    }
  }, [userData, currentPage]);

  const loadFavoriteVendors = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.client.customerFavorite(
        `page=${currentPage}`,
      );

      if (status === 200 || status === 201) {
        setFavoriteVendors(data?.data || []);
        setTotalPages(data?.totalPages || 1);
      } else {
        showToast("error", data?.message);
      }
    } catch (error) {
      showToast("error", error.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handlePageChange = (_e, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex flex-col gap-y-10">
      <div className="min-h-screen">
        <div className="flex flex-col gap-6 px-10 py-6 md:gap-12 md:px-20 md:py-12">
          <div className="flex flex-col gap-10">
            <p className="heading-40">Shortlisted Vendors</p>
            {isEmpty(favoriteVendors) ? (
              <NoData text="You haven't added any vendors to your shortlisted yet." />
            ) : (
              <Fragment>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {favoriteVendors?.map((vendor) => (
                    <VendorDetailsBox
                      key={vendor?._id}
                      vendor_id={vendor?._id}
                      isFavorite={vendor?.isFavorite}
                      image={convertMediaUrl(vendor?.image)}
                      name={vendor?.company_name}
                      star={vendor?.averageRating}
                      reviewsCount={vendor?.totalReview}
                      city={vendor?.city}
                      state={vendor?.state}
                      pricing={vendor?.budget}
                      planData={vendor?.planData}
                      showButton
                      href={`${ROUTES.client.shortlists}/${customEncodeURIComponent(vendor?.company_name)}-${vendor?._id}`}
                    />
                  ))}
                </div>
                <div className="ml-auto mt-auto">
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
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteVendors;
