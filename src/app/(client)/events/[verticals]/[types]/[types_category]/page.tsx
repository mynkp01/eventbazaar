"use client";
import { apiHandler } from "@api/apiHandler";
import { CloseLight } from "@assets/index";
import Breadcrumb from "@components/Breadcrumb";
import CustomImage from "@components/CustomImage";
import NoData from "@components/NoData";
import RequestAQuoteModal from "@components/RequestAQuoteModal";
import VendorDetailsBox from "@components/VendorDetailsBox";
import { Pagination } from "@mui/material";
import { selectUser, setVisibleLoginModal } from "@redux/slices/authSlice";
import {
  selectSelectedCity,
  selectSubCategories,
  selectVerticalsAndEventTypes,
} from "@redux/slices/lookupSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import {
  clearCompareData,
  removeCompareData,
  selectCompareData,
  setCompareData,
} from "@redux/slices/vendorSlice";
import { useAppDispatch } from "@redux/store/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BUSINESS_CATEGORY, ROUTES } from "src/utils/Constant";
import { convertMediaUrl, isEmpty, showToast } from "src/utils/helper";
import {
  customDecodeURIComponent,
  customEncodeURIComponent,
} from "src/utils/helper.server";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface CompareItem {
  _id: string;
  image: string;
  name: string;
}

const EventTypeCarousel = ({ data }) => (
  <Swiper
    loop
    modules={[Autoplay]}
    autoplay={{ delay: 3000, disableOnInteraction: false }}
    spaceBetween={20}
    className="!w-full !rounded-lg"
    style={{ zIndex: 0 }}
  >
    {data?.map((heroBanner) => (
      <SwiperSlide key={heroBanner?._id}>
        <div className="w-full overflow-hidden">
          <CustomImage
            src={convertMediaUrl(heroBanner?.doc_path)}
            width="100%"
            height="100%"
            className="!h-72 !object-cover md:!h-96"
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);

const TypesCategoryPage = () => {
  const DATA_LENGTH = 20;
  const dispatch = useAppDispatch();
  const routes = useRouter();

  const compareData = useSelector(selectCompareData);
  const verticalsAndEventTypesData = useSelector(selectVerticalsAndEventTypes);
  const subCategoriesData = useSelector(selectSubCategories);
  const selectedCity = useSelector(selectSelectedCity);
  const userData = useSelector(selectUser);

  const { verticals, types, types_category, category } = useParams();

  const EVENT_VERTICAL_NAME = customDecodeURIComponent(verticals as string);
  const EVENT_TYPE_NAME = customDecodeURIComponent(types as string);
  const EVENT_TYPE_CATEGORY_NAME = customDecodeURIComponent(
    types_category as string,
  );
  const CATEGORY_NAME = customDecodeURIComponent(category as string);

  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);
  const [notFoundMessage, setNotFoundMessage] = useState("");
  const [totalPages, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [vendorsList, setVendorsList] = useState([]);
  const [totalRecordCount, setTotalRecordCount] = useState(1);
  const [heroBanners, setHeroBanners] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [viewRequestQuote, setViewRequestQuote] = useState({
    visible: false,
    vendorId: "",
  });
  const [compareContainerHeight, setCompareContainer] = useState(0);

  const displayName = useMemo(
    () =>
      !isEmpty(CATEGORY_NAME) && CATEGORY_NAME !== "undefined"
        ? CATEGORY_NAME
        : EVENT_TYPE_CATEGORY_NAME,
    [CATEGORY_NAME, EVENT_TYPE_CATEGORY_NAME],
  );

  useEffect(() => {
    if (
      !isEmpty(compareData.subCategoryId) &&
      compareData.subCategoryId === categoryData?._id
    ) {
      setCompareItems(compareData.vendorData);
    }
  }, [compareData, categoryData?._id]);

  useEffect(() => {
    const initializeData = async () => {
      if (category) {
        await handleCategoryRoute();
      } else {
        await handleVerticalsRoute();
      }
    };

    initializeData();
  }, [selectedCity, currentPage, category]);

  const onClickRequestAQuote = (item) => {
    if (isEmpty(userData)) {
      dispatch(setVisibleLoginModal(true));
    } else {
      setViewRequestQuote({ visible: true, vendorId: item?._id });
    }
  };

  useEffect(() => {
    const headerElement = document.getElementById("client-header");
    const compareContainerElement =
      document.getElementById("compare-container");

    if (headerElement) {
      setHeaderHeight(headerElement.offsetHeight);
    }

    if (isEmpty(compareItems)) {
      setCompareContainer(0);
    } else {
      if (compareContainerElement) {
        setCompareContainer(compareContainerElement.offsetHeight);
      }
    }

    const handleResize = () => {
      const headerElement = document.getElementById("client-header");
      if (headerElement) {
        setHeaderHeight(headerElement.offsetHeight);
      }

      const compareContainerElement =
        document.getElementById("compare-container");
      if (isEmpty(compareItems)) {
        setCompareContainer(0);
      } else {
        if (compareContainerElement) {
          setCompareContainer(compareContainerElement.offsetHeight);
        }
      }
    };

    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos === 0) {
        setVisible(true);
        return;
      }

      const isScrollingDown = prevScrollPos < currentScrollPos;

      setVisible(!isScrollingDown);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [prevScrollPos, compareItems, compareData]);

  const handleCategoryRoute = async () => {
    const subCategoriesByFind = subCategoriesData?.find(
      (i) => i?.name?.toLowerCase() === CATEGORY_NAME?.toLowerCase(),
    );

    if (isEmpty(subCategoriesByFind)) {
      setNotFoundMessage(`${CATEGORY_NAME} Category Not Available`);
      return;
    }

    setNotFoundMessage("");
    setCategoryData(subCategoriesByFind);
    await loadCategories(subCategoriesByFind?._id);
  };

  const handleVerticalsRoute = async () => {
    const verticalsDataByFind = verticalsAndEventTypesData?.find(
      (i) =>
        i?.event_vertical_name?.toLowerCase() ===
        EVENT_VERTICAL_NAME?.toLowerCase(),
    );

    if (isEmpty(verticalsDataByFind)) {
      setNotFoundMessage(`${EVENT_VERTICAL_NAME} Vertical Not Available`);
      return;
    }

    const eventTypeByFind = verticalsDataByFind?.["event-types"]?.find(
      (i) =>
        i?.event_type_name?.toLowerCase() === EVENT_TYPE_NAME?.toLowerCase(),
    );

    if (isEmpty(eventTypeByFind)) {
      setNotFoundMessage(`${EVENT_TYPE_NAME} Category Not Available`);
      return;
    }

    const subCategoriesByFind = subCategoriesData?.find(
      (i) => i?.name?.toLowerCase() === EVENT_TYPE_CATEGORY_NAME?.toLowerCase(),
    );

    if (isEmpty(subCategoriesByFind)) {
      setNotFoundMessage(
        `${EVENT_TYPE_CATEGORY_NAME} Sub Category Not Available`,
      );
      return;
    }

    setNotFoundMessage("");
    setCategoryData(subCategoriesByFind);
    await loadCategories(subCategoriesByFind?._id);
  };

  const loadCategories = async (subCategoryId) => {
    try {
      dispatch(setIsLoading(true));
      const [vendorResponse, bannerResponse] = await Promise.all([
        apiHandler.eventType.eventCategoryWiseVendor(
          `page=${currentPage}&location_id=${selectedCity?._id}&business_sub_category_id=${subCategoryId}&user_id=${userData?.user_id}`,
        ),
        apiHandler.businessSubCategory.businessSubCategoryDetails(
          `business_sub_category_id=${subCategoryId}`,
        ),
      ]);

      if (bannerResponse.status === 200 || bannerResponse.status === 201) {
        setHeroBanners(bannerResponse.data?.data?.heroBanner);
      }

      if (vendorResponse.status === 200 || vendorResponse.status === 201) {
        const { data, totalRecords, totalPages } = vendorResponse.data;
        setVendorsList(data);
        setTotalRecordCount(totalRecords);
        setTotalPage(totalPages);
      } else {
        showToast("error", vendorResponse.data?.message);
      }
    } catch (error) {
      showToast("error", error.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const toggleCompare = (item: CompareItem) => {
    setCompareItems((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      if (exists) {
        const filtered = prev.filter((i) => i._id !== item._id);
        const index = prev.findIndex((j) => j._id === item._id);
        if (index !== -1) dispatch(removeCompareData(index));
        return filtered;
      }
      return prev.length < 3 ? [...prev, item] : prev;
    });
  };

  const clearAll = () => {
    setCompareItems([]);
    dispatch(clearCompareData());
  };

  const onClickCompare = () => {
    if (
      !isEmpty(compareData.subCategoryId) &&
      compareData.subCategoryId !== categoryData?._id
    ) {
      dispatch(clearCompareData());
    }

    dispatch(
      setCompareData({
        id: categoryData?._id,
        name: displayName,
        data: compareItems,
      }),
    );

    routes.push(ROUTES.client.compare);
  };

  const handlePageChange = (_e, newPage) => setCurrentPage(newPage);

  const renderCompareItems = () =>
    !isEmpty(compareItems) && (
      <div
        id="compare-container"
        className="fixed left-0 right-0 top-0 z-[1100] flex w-full flex-col justify-between gap-3 bg-white py-3 shadow-[3px_36px_80px_0px_#403F3F1A] transition-transform duration-300 xxs:px-6 xs:px-0 sm:flex-row sm:items-center md:px-6 lg:px-24"
        style={{ transform: `translateY(${visible ? headerHeight : 0}px)` }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <p className="text-xs font-medium md:text-sm">
            Compare {compareItems.length} of 3 items
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-7">
            {compareItems.map((item) => (
              <div key={item?._id} className="relative h-12 w-16">
                <CustomImage
                  src={convertMediaUrl(item?.image)}
                  alt={item?.name}
                  height="100%"
                  width="100%"
                  className="!h-full !w-full !overflow-hidden !rounded-lg !object-cover"
                />
                <button
                  onClick={() => toggleCompare(item)}
                  className="absolute -right-1.5 -top-1.5 size-5 rounded-full bg-grey-200 p-1.5 shadow-md"
                >
                  <CloseLight height="100%" width="100%" fill="white" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={clearAll}
            className="rounded px-4 py-1.5 text-xs md:text-sm"
          >
            Clear all
          </button>
          <button
            disabled={compareItems.length < 2}
            onClick={onClickCompare}
            className={`rounded px-4 py-1.5 text-xs md:text-sm ${
              compareItems.length < 2
                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                : "bg-green-400 text-white hover:bg-green-700"
            }`}
          >
            Compare
          </button>
        </div>
      </div>
    );

  const renderContent = () => {
    if (!isEmpty(notFoundMessage)) {
      return <NoData text={notFoundMessage} />;
    }

    return (
      <>
        {!isEmpty(heroBanners) ? (
          <div className="flex min-w-full flex-col gap-2 md:gap-4 lg:gap-6 xl:gap-8">
            <EventTypeCarousel data={heroBanners} />
          </div>
        ) : null}

        {isEmpty(vendorsList) ? (
          <NoData isFromVendorList />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {vendorsList.map((item) => (
                  <VendorDetailsBox
                    key={item?._id}
                    vendor_id={item?._id}
                    isFavorite={item?.isFavorite}
                    image={convertMediaUrl(item?.image)}
                    name={item?.company_name}
                    star={item?.averageRating}
                    reviewsCount={item?.totalReview}
                    city={item?.city}
                    state={item?.state}
                    pricing={item?.budget}
                    planData={item?.planData}
                    showButton
                    href={
                      !isEmpty(CATEGORY_NAME) && CATEGORY_NAME !== "undefined"
                        ? `${ROUTES.client.category}/${customEncodeURIComponent(CATEGORY_NAME)}/${customEncodeURIComponent(item?.company_name)}-${item?._id}`
                        : `${ROUTES.client.events}/${customEncodeURIComponent(EVENT_VERTICAL_NAME)}/${customEncodeURIComponent(EVENT_TYPE_NAME)}/${customEncodeURIComponent(EVENT_TYPE_CATEGORY_NAME)}/${customEncodeURIComponent(item?.company_name)}-${item?._id}`
                    }
                    buttonAction={() => {
                      [BUSINESS_CATEGORY.ARTIST].includes(
                        item?.businessCategories?.value_code,
                      )
                        ? onClickRequestAQuote(item)
                        : toggleCompare(item);
                    }}
                    buttonLabel={
                      [BUSINESS_CATEGORY.ARTIST].includes(
                        item?.businessCategories?.value_code,
                      )
                        ? "Request Quote"
                        : compareItems.some(
                              (compare) => item?._id === compare?._id,
                            )
                          ? "Added to Compare"
                          : "Compare"
                    }
                    className="!max-w-full"
                  />
                ))}
              </div>
            </div>

            <hr className="border-grey-800" />

            <div className="grid flex-col gap-5 sm:flex sm:flex-row sm:items-center sm:justify-between">
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
                <p className="text-xs text-grey-1300 md:text-sm">
                  {`Showing ${currentPage * DATA_LENGTH - DATA_LENGTH + 1} – ${
                    currentPage === totalPages ||
                    totalRecordCount <= DATA_LENGTH
                      ? totalRecordCount
                      : currentPage * DATA_LENGTH
                  } of ${totalRecordCount} results`}
                </p>
              ) : null}
            </div>
          </div>
        )}

        <RequestAQuoteModal
          vendorId={viewRequestQuote?.vendorId}
          visible={viewRequestQuote?.visible}
          fromArtist
          setVisible={(e) =>
            setViewRequestQuote({ vendorId: null, visible: e })
          }
        />
      </>
    );
  };

  return (
    <>
      {renderCompareItems()}

      <div
        className="flex flex-col gap-y-10 transition-transform duration-300"
        style={{ marginTop: compareContainerHeight || 0 }}
      >
        <div className="flex flex-col gap-6 px-6 pt-4 md:gap-12 md:px-20 md:pt-8">
          <div className="flex flex-col gap-1.5">
            <Breadcrumb />
            <p className="heading-40 capitalize">{displayName}</p>
          </div>
          {renderContent()}

          {isEmpty(categoryData?.description) ? null : (
            <p
              className="ck-content h-fit text-wrap"
              dangerouslySetInnerHTML={{ __html: categoryData?.description }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TypesCategoryPage;
