"use client";
import Breadcrumb from "@components/Breadcrumb";
import { Pagination } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { apiHandler } from "@api/apiHandler";
import { CustomCheckBox } from "@assets/index";
import NoData from "@components/NoData";
import RequestAQuoteModal from "@components/RequestAQuoteModal";
import VendorDetailsBox from "@components/VendorDetailsBox";
import { selectUser, setVisibleLoginModal } from "@redux/slices/authSlice";
import { selectSelectedCity } from "@redux/slices/lookupSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { useSelector } from "react-redux";
import { BUSINESS_CATEGORY, ROUTES } from "src/utils/Constant";
import {
  convertMediaUrl,
  isEmpty,
  showToast,
  StyledCheckbox,
  StyledFormControlLabel,
} from "src/utils/helper";
import { customEncodeURIComponent } from "src/utils/helper.server";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const Venues = () => {
  const DATA_LENGTH = 20;

  const dispatch = useAppDispatch();
  const selectedCity = useSelector(selectSelectedCity);
  const userData = useSelector(selectUser);

  const [vendorId, setVendorId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [artistData, setArtistData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [businessSubCategory, setBusinessSubCategory] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [totalRecordCount, setTotalRecordsCount] = useState(0);

  useEffect(() => {
    const changeFilterMenuVisibility = () => {
      setIsOpen(false);
    };

    window.addEventListener("resize", changeFilterMenuVisibility);

    return () => {
      window.removeEventListener("resize", changeFilterMenuVisibility);
    };
  }, []);

  useEffect(() => {
    fetchVenues();
  }, [currentPage, businessSubCategory, selectedCity]);

  const fetchVenues = async () => {
    dispatch(setIsLoading(true));
    try {
      const response = await apiHandler.category.getCategoryWiseVendorList(
        `value_code=${BUSINESS_CATEGORY.VENUES}&page=${currentPage}&limit=${DATA_LENGTH}&location_id=${selectedCity?._id}&business_sub_category_ids=${businessSubCategory?.join(",")}&user_id=${userData?.user_id}`,
      );
      if (response.status === 200) {
        const { data } = response.data;
        setArtistData(data?.records);
        setTotalRecordsCount(data?.totalRecords);
        setTotalPages(data?.totalPages || 1);
      }
    } catch (error) {
      showToast("error", error?.message);
    }
    dispatch(setIsLoading(false));
  };

  const handlePageChange = (_e, newPage) => {
    setCurrentPage(newPage);
  };

  const handleCheck = (e, obj) => {
    setCurrentPage(1);
    if (e.target.checked === true) {
      setBusinessSubCategory((prevData) => [...prevData, obj?._id]);
    } else {
      setBusinessSubCategory((prevData) => {
        let data = [...prevData];

        let findIndex = data?.findIndex((item) => item === obj?._id);
        if (findIndex !== -1) {
          data?.splice(findIndex, 1);
        }

        return data;
      });
    }
  };

  useEffect(() => {
    fetchFilter();
  }, [currentPage, selectedCity]);

  const fetchFilter = async () => {
    try {
      const { data, status } =
        await apiHandler.businessSubCategory.getBusinessSubCategoryFilterList(
          `value_code=${BUSINESS_CATEGORY.VENUES}&location_id=${selectedCity?._id}`,
        );
      if (status === 200 || status === 201) {
        setFilterData(data?.data);
      }
    } catch (error) {
      showToast("error", error?.message);
    }
  };

  const onClickRequestAQuote = (item) => {
    if (isEmpty(userData)) {
      dispatch(setVisibleLoginModal(true));
    } else {
      setVendorId(item?._id);
      setVisible(true);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-y-12 px-6 py-6 sm:px-12 md:px-24">
        <div className="flex w-full gap-5">
          <div className="hidden min-w-[16%] flex-col gap-8 border-r-2 pr-5 lg:flex">
            <p className="text-2xl font-semibold">Filters</p>
            <div className="flex flex-col divide-y-[1px] py-2 text-xs font-semibold">
              {filterData?.map((submenuItem, index) => (
                <div
                  key={submenuItem?._id}
                  className="flex w-full items-center justify-between"
                >
                  <StyledFormControlLabel
                    id={`filter-checkbox-${index}`}
                    className="!rounded !border-gray-300 text-green-400"
                    classes={{ label: "!w-full" }}
                    label={submenuItem?.business_sub_category_name}
                    control={
                      <StyledCheckbox
                        icon={<CustomCheckBox className="h-5 w-5" />}
                        checkedIcon={
                          <CustomCheckBox checked className="h-5 w-5" />
                        }
                        checked={businessSubCategory?.includes(
                          submenuItem?._id,
                        )}
                        onChange={(e) => handleCheck(e, submenuItem)}
                      />
                    }
                  />
                  <div className="text-gray-600">
                    ({submenuItem?.totalVendor || 0})
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex h-full w-full flex-col gap-4">
            <div className="flex w-full items-center justify-between gap-4">
              <div>
                <Breadcrumb />
                <div className="text-[38px] font-medium capitalize">Venues</div>
              </div>
              <div className={`relative bg-white ${isOpen ? "shadow-sm" : ""}`}>
                <div className="flex justify-between">
                  <div className="flex gap-2 lg:hidden">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="flex items-center justify-center rounded-md"
                      aria-expanded="false"
                    >
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={
                            isOpen
                              ? "M6 18L18 6M6 6l12 12"
                              : "M4 6h16M4 12h16M4 18h16"
                          }
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {isOpen ? (
              <div className="sticky left-0 z-50 flex max-h-[350px] w-full flex-col gap-6 overflow-y-auto bg-white p-6 shadow-lg xl:hidden">
                <div className="bg-inherit font-semibold shadow-none">
                  <div className="flex flex-col text-xs font-semibold">
                    {filterData?.map((submenuItem, index) => (
                      <div
                        key={submenuItem?._id}
                        className="flex justify-between"
                      >
                        <StyledFormControlLabel
                          id={`filter-checkbox-${index}`}
                          className="!rounded !border-gray-300 text-green-400"
                          classes={{ label: "!w-full" }}
                          label={submenuItem?.business_sub_category_name}
                          control={
                            <StyledCheckbox
                              icon={<CustomCheckBox className="h-5 w-5" />}
                              checkedIcon={
                                <CustomCheckBox checked className="h-5 w-5" />
                              }
                              checked={businessSubCategory?.includes(
                                submenuItem?._id,
                              )}
                              onChange={(e) => handleCheck(e, submenuItem)}
                            />
                          }
                        />
                        <div className="text-gray-600">
                          ({submenuItem?.totalVendor})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {isEmpty(artistData) ? (
              <NoData isFromVendorList />
            ) : (
              <Fragment>
                <div className="flex flex-col gap-8 py-8">
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {artistData?.map((item) => (
                      <VendorDetailsBox
                        vendor_id={item?._id}
                        isFavorite={item?.isFavorite}
                        key={item?._id}
                        image={convertMediaUrl(item?.image)}
                        name={item?.company_name}
                        city={item?.city}
                        state={item?.state}
                        star={item?.averageRating || 0}
                        reviewsCount={item?.totalReview || 0}
                        pricing={item?.budget}
                        planData={item?.planData}
                        showButton
                        imageClassName="!max-h-96"
                        href={`${ROUTES.client.venues}/${customEncodeURIComponent(item?.company_name)}-${item?._id}`}
                        buttonLabel="Request a Quote"
                        buttonAction={() => onClickRequestAQuote(item)}
                      />
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
      </div>
      <RequestAQuoteModal
        vendorId={vendorId}
        visible={visible}
        setVisible={setVisible}
        fromArtist={false}
      />
    </div>
  );
};

export default Venues;
