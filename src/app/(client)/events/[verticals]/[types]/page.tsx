"use client";
import { apiHandler } from "@api/apiHandler";
import { CloseLight } from "@assets/index";
import Breadcrumb from "@components/Breadcrumb";
import CustomImage from "@components/CustomImage";
import NoData from "@components/NoData";
import RequestAQuoteModal from "@components/RequestAQuoteModal";
import VendorDetailsBox from "@components/VendorDetailsBox";
import { Modal, Pagination, Tab, Tabs } from "@mui/material";
import { selectUser, setVisibleLoginModal } from "@redux/slices/authSlice";
import {
  selectSelectedCity,
  selectVerticalsAndEventTypes,
} from "@redux/slices/lookupSlice";
import { selectLimit } from "@redux/slices/utilSlice";
import {
  clearCompareData,
  removeCompareData,
  selectCompareData,
  setCompareData,
} from "@redux/slices/vendorSlice";
import { useAppDispatch } from "@redux/store/store";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BUSINESS_CATEGORY, ROUTES } from "src/utils/Constant";
import { convertMediaUrl, isEmpty, showToast } from "src/utils/helper";
import {
  customDecodeURIComponent,
  customEncodeURIComponent,
} from "src/utils/helper.server";

interface CompareItem {
  _id: string;
  image: string;
  name: string;
}

const VendorsList = ({
  item,
  EVENT_VERTICAL_NAME,
  EVENT_TYPE_NAME,
  toggleCompare,
  compareItems,
  filterId,
}) => {
  const dispatch = useAppDispatch();
  const selectedCity = useSelector(selectSelectedCity);
  const userData = useSelector(selectUser);
  const limit = useSelector(selectLimit);
  const [viewRequestQuote, setViewRequestQuote] = useState({
    visible: false,
    vendorId: "",
  });

  const [totalRecordCount, setTotalRecordCount] = useState(1);
  const [totalPages, setTotalPage] = useState(1);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadData();
  }, [currentPage, selectedCity, item]);

  const loadData = async () => {
    try {
      const { data, status } =
        await apiHandler.eventType.eventCategoryWiseVendor(
          `location_id=${selectedCity?._id}&page=${currentPage}&business_sub_category_id=${item?.business_sub_category_id}&user_id=${userData?.user_id}&event_type_id=${filterId?.event_type_id}&vertical_id=${filterId?.vertical_id}`,
        );
      if (status === 200 || status === 201) {
        setData(data?.data);
        setTotalPage(data?.totalPages);
        setTotalRecordCount(data?.totalRecords);
      } else {
        showToast("error", data?.message);
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const handlePageChange = (_e, newPage) => {
    setCurrentPage(newPage);
  };
  const onClickRequestAQuote = (item) => {
    if (isEmpty(userData)) {
      dispatch(setVisibleLoginModal(true));
    } else {
      setViewRequestQuote({ visible: true, vendorId: item?._id });
    }
  };

  return (
    <>
      <div className="flex h-[100vh] w-full flex-col">
        <div className="flex h-full w-full flex-col gap-8">
          <p className="heading-40 capitalize">
            {item?.business_sub_category_name}
          </p>
          {isEmpty(data) ? (
            <NoData isFromVendorList />
          ) : (
            <div className="relative h-full w-full overflow-y-auto">
              <div className="absolute grid w-full grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {data?.map((vendor, index) => (
                  <VendorDetailsBox
                    vendor_id={vendor?._id}
                    key={`vendor-list-${index}`}
                    image={`${process.env.NEXT_PUBLIC_BACKEND_API}${vendor?.image}`}
                    name={vendor?.company_name}
                    city={vendor?.city}
                    state={vendor?.state}
                    pricing={vendor?.budget}
                    star={vendor?.averageRating}
                    reviewsCount={vendor?.totalReview}
                    planData={vendor?.planData}
                    isFavorite={vendor?.isFavorite}
                    href={`${ROUTES.client.events}/${customEncodeURIComponent(EVENT_VERTICAL_NAME)}/${customEncodeURIComponent(EVENT_TYPE_NAME)}/${customEncodeURIComponent(item?.business_sub_category_name)}/${customEncodeURIComponent(vendor?.company_name)}-${vendor?._id}`}
                    showButton
                    buttonAction={() => {
                      [BUSINESS_CATEGORY.ARTIST].includes(
                        vendor?.businessCategories?.value_code,
                      )
                        ? onClickRequestAQuote(vendor)
                        : toggleCompare(vendor);
                    }}
                    buttonLabel={
                      [BUSINESS_CATEGORY.ARTIST].includes(
                        vendor?.businessCategories?.value_code,
                      )
                        ? "Request Quote"
                        : compareItems.some(
                              (compare) => vendor?._id === compare._id,
                            )
                          ? "Added to Compare"
                          : "Compare"
                    }
                  />
                ))}
              </div>
            </div>
          )}
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
            <p className="text-xs text-grey-1300 md:text-sm">{`Showing ${currentPage * limit - limit + 1} – ${currentPage === totalPages || totalRecordCount <= limit ? totalRecordCount : currentPage * limit} of ${totalRecordCount} results`}</p>
          ) : null}
        </div>
      </div>
      <RequestAQuoteModal
        vendorId={viewRequestQuote?.vendorId}
        visible={viewRequestQuote?.visible}
        fromArtist
        setVisible={(e) => setViewRequestQuote({ vendorId: null, visible: e })}
      />
    </>
  );
};

const EventType = () => {
  const routes = useRouter();

  const dispatch = useAppDispatch();
  const verticalsAndEventTypesData = useSelector(selectVerticalsAndEventTypes);
  const selectedCity = useSelector(selectSelectedCity);
  const compareData = useSelector(selectCompareData);

  const params = useSearchParams();
  const subCategoryId = params.get("id");
  const subCategoryName = params.get("name");
  const { verticals, types }: { [key: string]: string } = useParams();
  const EVENT_VERTICAL_NAME = customDecodeURIComponent(verticals as string);
  const EVENT_TYPE_NAME = customDecodeURIComponent(types as string);

  const [notFoundMessage, setNotFoundMessage] = useState("");
  const [eventCategoriesData, setEventCategoriesData] = useState([]);
  const [currentPopupTab, setCurrentPopupTab] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [compareContainerHeight, setCompareContainer] = useState(0);
  const [filterId, setFilterId] = useState({
    vertical_id: "",
    event_type_id: "",
  });

  useEffect(() => {
    if (!isEmpty(currentPopupTab)) {
      const url = `${ROUTES.client.events}/${verticals}/${types}?name=${customEncodeURIComponent(currentPopupTab?.business_sub_category_name)}&id=${currentPopupTab?.business_sub_category_id}`;
      window.history.replaceState(null, "", url);
    }
  }, [currentPopupTab, verticals, types, subCategoryId, subCategoryName]);

  useEffect(() => {
    if (
      !isEmpty(compareData.subCategoryId) &&
      compareData.subCategoryId === currentPopupTab?.subCategoryId
    ) {
      setCompareItems(compareData.vendorData);
    }
  }, [compareData, currentPopupTab?.subCategoryId]);

  useEffect(() => {
    setCurrentPopupTab(
      eventCategoriesData?.find(
        (i) => i?.business_sub_category_id === subCategoryId,
      ),
    );
  }, [eventCategoriesData, subCategoryId]);

  useEffect(() => {
    const verticalsDataByFind = verticalsAndEventTypesData?.find(
      (i) =>
        i?.event_vertical_name?.toLowerCase() ===
        EVENT_VERTICAL_NAME?.toLowerCase(),
    );

    if (isEmpty(verticalsDataByFind)) {
      setNotFoundMessage(
        `${EVENT_VERTICAL_NAME} Vertical Not Available In ${selectedCity?.name}`,
      );
    } else {
      setFilterId((prev) => ({
        ...prev,
        vertical_id: verticalsDataByFind?._id,
      }));
      setNotFoundMessage("");
      const eventTypeByFind = verticalsDataByFind?.["event-types"]?.find(
        (i) =>
          i?.event_type_name?.toLowerCase() === EVENT_TYPE_NAME?.toLowerCase(),
      );

      if (isEmpty(eventTypeByFind)) {
        setNotFoundMessage(
          `${EVENT_TYPE_NAME} Category Not Available In ${selectedCity?.name}`,
        );
      } else {
        setFilterId((prev) => ({
          ...prev,
          event_type_id: eventTypeByFind?._id,
        }));
        setNotFoundMessage("");
        loadCategories(eventTypeByFind?._id);
      }
    }
  }, [
    verticalsAndEventTypesData,
    verticals,
    EVENT_VERTICAL_NAME,
    selectedCity?.name,
    EVENT_TYPE_NAME,
  ]);

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
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        setIsOpen(false);
      }

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

  const loadCategories = async (ids) => {
    try {
      const { data, status } =
        await apiHandler.eventType.eventTypeWiseSubCategory(
          `location_id=${selectedCity?._id}&event_type_id=${ids}&limit=500`,
        );

      if (status === 200 || status === 201) {
        setEventCategoriesData(data?.data);
        if (isEmpty(subCategoryId)) {
          setCurrentPopupTab(data?.data?.[0]);
        }
      } else {
        showToast("error", data?.message);
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     const isMobile = window.innerWidth <= 768;
  //     if (
  //       isMobile &&
  //       sidebarRef.current &&
  //       !sidebarRef.current.contains(event.target)
  //     ) {
  //       setIsOpen(false);
  //       document.body.classList.remove("no-scroll");
  //     }
  //   };

  //   const handleSidebarToggle = () => {
  //     const isMobile = window.innerWidth <= 768;
  //     if (isMobile && isOpen) {
  //       document.body.classList.add("no-scroll");
  //     } else {
  //       document.body.classList.remove("no-scroll");
  //     }
  //   };

  //   handleSidebarToggle();

  //   document.addEventListener("mousedown", handleClickOutside);
  //   document.addEventListener("touchmove", handleClickOutside);
  //   document.addEventListener("scroll", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //     document.removeEventListener("touchmove", handleClickOutside);
  //     document.removeEventListener("scroll", handleClickOutside);
  //     document.body.classList.remove("no-scroll");
  //   };
  // }, [isOpen]);

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
      compareData.subCategoryId !== currentPopupTab?.business_sub_category_id
    ) {
      dispatch(clearCompareData());
    }

    dispatch(
      setCompareData({
        id: currentPopupTab?.business_sub_category_id,
        name: currentPopupTab?.business_sub_category_name,
        data: compareItems,
      }),
    );

    routes.push(ROUTES.client.compare);
  };

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
                  src={item?.image}
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

  return (
    <>
      {renderCompareItems()}

      <div
        className={`relative transition-transform duration-300`}
        style={{ marginTop: compareContainerHeight || 0 }}
      >
        <Modal
          open={isOpen}
          className="!z-[1100] flex h-full w-full items-end"
          onClose={() => setIsOpen(false)}
          // sx={{
          //   "& .MuiModal-root": {
          //     top: `calc(100vh-${headerHeight + compareContainerHeight}px) !important`,
          //   },
          // }}
        >
          <Tabs
            // variant="scrollable"
            // orientation="vertical"
            // value={eventCategoriesData?.findIndex(
            //   (i) =>
            //     i?.business_sub_category_id ===
            //     currentPopupTab?.business_sub_category_id,
            // )}
            // onChange={(_, newValue) =>
            //   setCurrentPopupTab(eventCategoriesData[newValue])
            // }
            // className="!overflow-y-auto"
            // aria-label="Review Popup Tabs"
            // sx={{
            //   height: "100vh !important",
            //   width: "400px !important",
            //   "@media (max-width: 767px)": {
            //     display: "none !important",
            //   },
            //   "& .MuiTabs-flexContainer": {
            //     gap: "8px !important",
            //   },
            //   "& .MuiTabs-indicator": {
            //     backgroundColor: "#ffffff !important",
            //   },
            //   "& .MuiTab-root": {
            //     textTransform: "capitalize !important",
            //     textAlign: "left !important",
            //     justifyContent: "flex-start !important",
            //     display: "block !important",
            //     borderRadius: "8px !important",
            //     "&.Mui-selected": {
            //       backgroundColor: "#EFF6F1 !important",
            //       color: "#000000 !important",
            //     },
            //   },
            // }}
            variant="scrollable"
            visibleScrollbar
            orientation="vertical"
            value={
              eventCategoriesData?.findIndex(
                (i) =>
                  i?.business_sub_category_id ===
                  currentPopupTab?.business_sub_category_id,
              ) === -1
                ? 0
                : eventCategoriesData?.findIndex(
                    (i) =>
                      i?.business_sub_category_id ===
                      currentPopupTab?.business_sub_category_id,
                  )
            }
            onChange={(e, newValue) => {
              setCurrentPopupTab(eventCategoriesData[newValue]);
              setIsOpen(false);
            }}
            aria-label="Review Popup Tabs"
            sx={{
              height: `calc(100dvh - ${headerHeight}px) !important`,
              width: "300px !important",
              bgcolor: "white !important",
              p: 2,
              "& .MuiTabs-flexContainer": {
                gap: "8px !important",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#ffffff !important",
              },
              "& .MuiTab-root": {
                textTransform: "capitalize !important",
                textAlign: "left !important",
                justifyContent: "flex-start !important",
                display: "block !important",
                borderRadius: "8px !important",
                "&.Mui-selected": {
                  backgroundColor: "#EFF6F1 !important",
                  color: "#000000 !important",
                },
              },
            }}
          >
            {eventCategoriesData.map((tab) => (
              <Tab
                onClick={() => {
                  if (
                    tab?.business_sub_category_id !== compareData?.subCategoryId
                  )
                    clearAll();
                }}
                key={tab?.business_sub_category_id}
                label={
                  <div className="flex items-center gap-3">
                    <div className="size-10 max-h-10 min-h-10 min-w-10 max-w-10">
                      <CustomImage
                        src={convertMediaUrl(tab?.vector_path)}
                        className="!rounded-full !bg-white"
                        height={"100%"}
                        width={"100%"}
                      />
                    </div>
                    <p>{tab?.business_sub_category_name}</p>
                  </div>
                }
                value={tab?._id}
                sx={{
                  "&.Mui-selected": {
                    color: "#5E8C3A",
                    backgroundColor: "#EFF6F1",
                  },
                }}
                className="!font-medium normal-case"
              />
            ))}
          </Tabs>
        </Modal>
        {/* ) : null} */}
        <div className="relative grid gap-6 px-6 pt-4 md:gap-12 md:px-20 md:pt-8">
          <div className="flex flex-col gap-1.5">
            <Breadcrumb />
            <div className="flex items-center justify-between gap-4 md:gap-0">
              <p className="heading-40 capitalize">{EVENT_TYPE_NAME}</p>
              <div className="flex gap-2 md:hidden">
                <button
                  onClick={() => setIsOpen(true)}
                  className="flex items-center justify-center rounded-md !p-2"
                  aria-expanded={isOpen}
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

          {!isEmpty(notFoundMessage) ? (
            <NoData text={notFoundMessage} />
          ) : isEmpty(eventCategoriesData) ? (
            <NoData
              text={`${EVENT_TYPE_NAME} Category Not Available In ${selectedCity?.name}`}
            />
          ) : (
            <div className="relative flex flex-col gap-4 md:gap-8">
              <div className="flex w-full gap-4">
                <Tabs
                  variant="scrollable"
                  orientation="vertical"
                  value={
                    eventCategoriesData?.findIndex(
                      (i) =>
                        i?.business_sub_category_id ===
                        currentPopupTab?.business_sub_category_id,
                    ) === -1
                      ? 0
                      : eventCategoriesData?.findIndex(
                          (i) =>
                            i?.business_sub_category_id ===
                            currentPopupTab?.business_sub_category_id,
                        )
                  }
                  onChange={(e, newValue) =>
                    setCurrentPopupTab(eventCategoriesData[newValue])
                  }
                  className="!overflow-y-auto"
                  aria-label="Review Popup Tabs"
                  sx={{
                    height: "100vh !important",
                    width: "400px !important",
                    "@media (max-width: 767px)": {
                      display: "none !important",
                    },
                    "& .MuiTabs-flexContainer": {
                      gap: "8px !important",
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#ffffff !important",
                    },
                    "& .MuiTab-root": {
                      textTransform: "capitalize !important",
                      textAlign: "left !important",
                      justifyContent: "flex-start !important",
                      display: "block !important",
                      borderRadius: "8px !important",
                      "&.Mui-selected": {
                        backgroundColor: "#EFF6F1 !important",
                        color: "#000000 !important",
                      },
                    },
                  }}
                >
                  {eventCategoriesData.map((tab) => (
                    <Tab
                      onClick={() => {
                        if (
                          tab?.business_sub_category_id !==
                          compareData?.subCategoryId
                        )
                          clearAll();
                      }}
                      key={tab?.business_sub_category_id}
                      label={
                        <div className="flex items-center gap-3">
                          <div className="size-10 max-h-10 min-h-10 min-w-10 max-w-10">
                            <CustomImage
                              src={convertMediaUrl(tab?.vector_path)}
                              className="!rounded-full !bg-white"
                              height={"100%"}
                              width={"100%"}
                            />
                          </div>
                          <p>{tab?.business_sub_category_name}</p>
                        </div>
                      }
                      value={tab?._id}
                      sx={{
                        "&.Mui-selected": {
                          color: "#5E8C3A",
                          backgroundColor: "#EFF6F1",
                        },
                      }}
                      className="!font-medium normal-case"
                    />
                  ))}
                </Tabs>
                <div className="hidden h-full border md:flex" />
                {!isEmpty(currentPopupTab) ? (
                  <div className="flex w-full flex-col gap-4">
                    <VendorsList
                      item={currentPopupTab}
                      EVENT_VERTICAL_NAME={EVENT_VERTICAL_NAME}
                      EVENT_TYPE_NAME={EVENT_TYPE_NAME}
                      toggleCompare={toggleCompare}
                      compareItems={compareItems}
                      filterId={filterId}
                    />
                    {isEmpty(currentPopupTab?.description) ? null : (
                      <p
                        className="ck-content mx-6 h-fit w-auto text-wrap"
                        dangerouslySetInnerHTML={{
                          __html: currentPopupTab?.description,
                        }}
                      />
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventType;
