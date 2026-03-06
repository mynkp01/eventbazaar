"use client";
import { apiHandler } from "@api/apiHandler";
import {
  CloseLight,
  LeftArrowIcon,
  PlusIcon,
  Star,
  VerifiedLogo,
} from "@assets/index";
import CustomImage from "@components/CustomImage";
import CustomVideo from "@components/CustomVideo";
import LabelField from "@components/LabelField";
import NoData from "@components/NoData";
import VendorDetailsBox from "@components/VendorDetailsBox";
import { Box, Modal } from "@mui/material";
import { selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import {
  removeCompareData,
  selectCompareData,
} from "@redux/slices/vendorSlice";
import { useAppDispatch } from "@redux/store/store";
import moment from "moment";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BUSINESS_CATEGORY, PLAN_CODE, ROUTES } from "src/utils/Constant";
import {
  convertMediaUrl,
  convertVideoUrl,
  isEmpty,
  showToast,
} from "src/utils/helper";
import { customEncodeURIComponent } from "src/utils/helper.server";
import "swiper/css";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const TestimonialCard = ({ album, setIsOpen, setSelectedAlbum }) => {
  const projectName = album?.project_name;

  const openModal = (album) => {
    setSelectedAlbum(album);
    setIsOpen(true);
  };

  const getCoverPhoto = (album) => {
    return album?.projectDocs?.find((doc) => doc?.cover_photo)?.doc_path || "";
  };

  return (
    <div
      key={album?._id}
      onClick={() => openModal(album)}
      className="group flex h-full w-full cursor-pointer flex-col gap-4 px-5"
    >
      <div className="h-full w-full overflow-hidden rounded-lg shadow-[8px_8px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-none">
        <CustomImage
          src={convertMediaUrl(getCoverPhoto(album))}
          alt={projectName}
          width="100%"
          height="100%"
          className="!h-44 !max-h-60 !w-full !object-cover lg:!h-52"
          loaderClasses={{ container: "!h-44 !max-h-60 !w-full lg:!h-52" }}
        />
      </div>
      <div className="flex text-base font-medium text-gray-700 group-hover:text-green-400 md:text-lg">
        {projectName} <LeftArrowIcon />
      </div>
    </div>
  );
};

const AlbumCarousel = ({ albums }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const closeModal = () => {
    setIsOpen(false);
    setSelectedAlbum(null);
  };

  const getNonCoverMedia = (album) => {
    const media = album?.projectDocs
      ?.filter((doc) => !doc?.cover_photo)
      ?.sort((a, b) => a?.sort_order - b?.sort_order);

    const videos = media?.filter((item) => item?.video);
    const images = media?.filter((item) => !item?.video);

    return { videos, images };
  };

  return (
    <>
      <div className="relative w-full">
        {isEmpty(albums) ? (
          <NoData
            text={`No ${!isEmpty(getNonCoverMedia(selectedAlbum)?.videos) ? "Videos" : "Albums"}`}
            isTextOnly
          />
        ) : (
          <>
            {albums?.length > 1 ? (
              <>
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[rgba(0,0,0,0.4)] from-[-90%] to-transparent to-20%" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[rgba(0,0,0,0.4)] from-[-90%] to-transparent to-20%" />
              </>
            ) : null}
            <Swiper
              modules={[Pagination]}
              slidesPerView={albums?.length > 1 ? 1.2 : 1}
            >
              {albums?.map((album) => (
                <SwiperSlide key={album?._id} className="!h-auto">
                  <TestimonialCard
                    album={album}
                    setIsOpen={setIsOpen}
                    setSelectedAlbum={setSelectedAlbum}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}
      </div>

      <Modal open={isOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 4,
            width: "90%",
            maxWidth: 600,
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="rounded-full bg-grey-200 p-2"
            >
              <CloseLight fill="white" />
            </button>
          </div>
          {selectedAlbum && (
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="heading-40">{selectedAlbum?.project_name}</h3>
                <p className="text-sm md:text-base">
                  {selectedAlbum?.description}
                </p>
              </div>
              <hr className="solid" />
              <div className="flex max-h-[400px] flex-col gap-2 overflow-auto">
                {!isEmpty(getNonCoverMedia(selectedAlbum)?.videos) && (
                  <div className="flex flex-col gap-2">
                    <LabelField labelText="Videos" toolTipText="videos" />
                    <div className="flex flex-col gap-2">
                      {getNonCoverMedia(selectedAlbum)?.videos?.map((video) => (
                        <CustomVideo
                          key={video?._id}
                          src={convertVideoUrl(video?.doc_path)}
                          controls
                          width="100%"
                          height="100%"
                          className="!aspect-video !h-full !w-full !rounded-md !object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}
                {!isEmpty(getNonCoverMedia(selectedAlbum)?.images) && (
                  <div className="flex flex-col gap-2">
                    <LabelField labelText="Photos" toolTipText="photos" />
                    <div className="flex flex-col gap-2">
                      {getNonCoverMedia(selectedAlbum)?.images?.map((image) => (
                        <CustomImage
                          key={image?._id}
                          src={convertMediaUrl(image?.doc_path)}
                          preview
                          width="100%"
                          height="100%"
                          className="!aspect-video !h-full !w-full !rounded-md !object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </>
  );
};

const Compare = () => {
  const route = useRouter();

  const userData = useSelector(selectUser);
  const dispatch = useAppDispatch();

  const [compareDetailsKeys, setCompareDetailsKeys] = useState([
    {
      title: "Establishment Year",
      key: "establishment_year",
      isDate: true,
      format: "YYYY",
    },
    { title: "No of Employees", key: "no_of_employees" },
    { title: "Budget", key: "budget" },
    { title: "Top Clients", key: "top3_client_name", isArray: true },
    {
      title: "Rating",
      key: "averageRating",
      className: "font-medium",
      icon: <Star fill="#eab308" className="h-4 w-4" />,
    },
    { title: "", key: "verified" },
  ]);
  const compareVendorsData = useSelector(selectCompareData);

  const [compareData, setCompareData] = useState([]);

  useEffect(() => {
    fetchCompareVendorsData();
  }, []);

  const fetchCompareVendorsData = async () => {
    dispatch(setIsLoading(true));
    try {
      let filterString = `vendor_ids=${compareVendorsData.vendorData?.map((i) => i?._id).toString()}`;
      if (userData?.user_id) {
        filterString += `&user_id=${userData?.user_id}`;
      }
      const { data, status } =
        await apiHandler.vendor.compareVendor(filterString);
      if (status === 200 || status === 201) {
        setCompareData(
          Array(3)
            .fill({})
            .map((_, i) => (isEmpty(data?.data?.[i]) ? {} : data?.data?.[i])),
        );
        if (
          [
            BUSINESS_CATEGORY.EVENT_VENUE,
            BUSINESS_CATEGORY.HOTELS_RESORTS,
          ].includes(data?.data?.[0]?.businessCategory?.value_code)
        ) {
          setCompareDetailsKeys(
            compareDetailsKeys.map((v) => {
              if (v?.key === "no_of_employees") {
                return { title: "No of Venues", key: "venueCount" };
              }
              return v;
            }),
          );
        }
      } else {
        showToast("error", data?.message);
      }
    } catch (e) {}
    dispatch(setIsLoading(false));
  };

  const onClickRemoveVendor = (item: { _id: any }) => {
    let prev = [...compareData];

    const exists = prev.find((_) => _?._id === item?._id);

    if (exists) {
      const filtered = prev.filter((_) => _?._id !== item?._id);
      const index = prev.findIndex((_) => _?._id === item?._id);
      if (index !== -1) {
        dispatch(removeCompareData(index));
      }
      prev = Array(3)
        .fill({})
        .map((_, i) => (isEmpty(filtered?.[i]) ? {} : filtered?.[i]));
    }

    setCompareData(prev);
  };

  return isEmpty(compareVendorsData?.vendorData) ? (
    <NoData text="No data for compare" />
  ) : (
    <div className="flex flex-col items-center gap-10 px-5 py-6 sm:px-12 md:gap-16 md:px-16 lg:gap-20 lg:px-24">
      {/* Heading */}
      <h1 className="heading-40 w-full capitalize">
        Comparing vendors of {compareVendorsData?.subCategoryName} category
      </h1>

      {/* Compare Table */}
      <div className="flex w-full flex-col gap-4">
        <div className="!overflow-x-auto">
          <table className="mx-auto flex w-fit table-auto flex-col gap-5 text-black-300">
            <thead className="w-full min-w-max">
              <tr className="grid w-full min-w-max grid-cols-[180px_auto_auto_auto] justify-center gap-5 md:grid-cols-[200px_auto_auto_auto] lg:grid-cols-[288px_auto_auto_auto]">
                <th className="flex h-full w-full min-w-[180px] items-center break-words text-4xl font-medium capitalize md:min-w-[200px] lg:min-w-[288px]" />
                {compareData?.map((item, index) => (
                  <th
                    key={index}
                    className="relative flex w-auto min-w-44 max-w-44 justify-center font-medium sm:min-w-52 sm:max-w-52 md:min-w-60 md:max-w-60 lg:min-w-72 lg:max-w-72 xl:min-w-96 xl:max-w-full"
                  >
                    {isEmpty(item) ? (
                      <button
                        onClick={() => route.back()}
                        className="flex flex-col items-center justify-center gap-2"
                      >
                        <PlusIcon className="size-full h-1/2 rounded-full border-[10px] border-green-400 p-4 text-green-400" />
                        <p className="text-center text-xl font-semibold text-green-400 md:text-2xl">
                          Add Vendor
                        </p>
                      </button>
                    ) : (
                      <div className="flex w-full flex-col gap-2">
                        <VendorDetailsBox
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
                          className="!h-full"
                          href={`${ROUTES.client.compare}/${customEncodeURIComponent(item?.company_name)}-${item?._id}`}
                        />
                        <button
                          onClick={() => onClickRemoveVendor(item)}
                          className="flex w-full items-center justify-center gap-3 rounded-lg bg-grey-200/40 py-2.5 text-sm font-normal text-white duration-300 hover:bg-grey-200/60 md:text-base"
                        >
                          <CloseLight
                            className="size-2.5 min-h-2.5 min-w-2.5"
                            fill="white"
                          />
                          <p>Remove Vendor</p>
                        </button>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="w-full min-w-max overflow-hidden rounded-2xl shadow-[inset_0px_0px_0px_1px] shadow-gray-100">
              <tr className="grid w-full min-w-max grid-cols-[180px_auto_auto_auto] gap-5 bg-grey-500 md:grid-cols-[200px_auto_auto_auto] lg:grid-cols-[288px_auto_auto_auto]">
                <td className="flex w-full min-w-[180px] p-5 text-center text-sm font-medium md:min-w-[200px] md:text-base lg:min-w-[288px]">
                  <p>Company Name</p>
                </td>
                {compareData.map((i, index) => (
                  <td
                    key={index}
                    className="flex w-full min-w-44 justify-center py-5 text-center text-sm font-medium sm:min-w-52 md:min-w-60 md:text-base lg:min-w-72 xl:min-w-96"
                  >
                    <p>{i?.company_name}</p>
                  </td>
                ))}
              </tr>

              {compareDetailsKeys.map((i, ind) => (
                <Fragment key={i?.key}>
                  <tr className="grid w-full min-w-max grid-cols-[180px_auto_auto_auto] gap-5 md:grid-cols-[200px_auto_auto_auto] lg:grid-cols-[288px_auto_auto_auto]">
                    <td className="flex w-full min-w-[180px] items-center border-r border-r-gray-100 p-5 pr-0 text-left text-sm font-normal capitalize text-gray-500 md:min-w-[200px] lg:min-w-[288px]">
                      <p>{i?.title}</p>
                    </td>

                    {compareData.map((j, index) => (
                      <td
                        key={index}
                        className="flex w-full min-w-44 items-center justify-center py-5 text-sm font-normal sm:min-w-52 md:min-w-60 md:text-base lg:min-w-72 xl:min-w-96"
                      >
                        {isEmpty(j) ? null : (
                          <div className="flex flex-col items-center text-center">
                            <div className="flex items-center gap-1">
                              {/* <p> */}
                              {i?.key === "verified" ? (
                                isEmpty(j?.planData) ||
                                j?.planData?.plan_code === PLAN_CODE.lite ? (
                                  <p className={i?.className || ""}>-</p>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <VerifiedLogo />
                                    <p>Verified</p>
                                  </div>
                                )
                              ) : i?.isDate && !isEmpty(j?.[i?.key]) ? (
                                <p className={i?.className || ""}>
                                  {moment(j?.[i?.key]).format(i?.format)}
                                </p>
                              ) : i?.isArray ? (
                                isEmpty(j?.[i?.key]) ? (
                                  <p className={i?.className || ""}>-</p>
                                ) : (
                                  <ul>
                                    {j?.[i?.key]?.map((client) => (
                                      <li
                                        key={client}
                                        className={i?.className || ""}
                                      >
                                        {client}
                                      </li>
                                    ))}
                                  </ul>
                                )
                              ) : (
                                <p className={i?.className || ""}>
                                  {i?.key === "averageRating"
                                    ? j?.[i?.key]
                                      ? j?.[i?.key]?.toFixed(1)
                                      : 0
                                    : i?.key === "budget"
                                      ? j?.[i?.key]
                                        ? `₹ ${(j?.[i?.key] || "")?.toString()}`
                                        : "-"
                                      : (j?.[i?.key] || "-")?.toString()}
                                </p>
                              )}
                              {i?.icon}
                            </div>
                            {j?.reviews && i?.icon ? (
                              <p className="text-xs sm:text-sm">
                                Based on {j?.totalReview} Reviews
                              </p>
                            ) : null}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                  {ind < compareDetailsKeys.length - 1 ? (
                    <tr className="grid w-full min-w-max">
                      <td
                        colSpan={compareDetailsKeys.length + 1}
                        className="border-t border-t-gray-100"
                      />
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {isEmpty(compareData?.filter((i) => !isEmpty(i?.album))) &&
        isEmpty(compareData?.filter((i) => !isEmpty(i?.show_reel))) ? null : (
          <Fragment>
            <p className="heading-40 w-full">Portfolio</p>

            <div className="overflow-x-auto">
              <table className="mx-auto flex w-fit table-auto flex-col gap-5 text-black-300">
                <thead className="w-full min-w-max">
                  <tr className="grid w-full min-w-max">
                    <th colSpan={compareData.length + 1} />
                  </tr>
                </thead>

                <tbody className="w-full min-w-max rounded-2xl shadow-[inset_0px_0px_0px_1px] shadow-gray-100">
                  {!isEmpty(compareData?.filter((i) => i?.album)) ? (
                    <tr className="grid w-full min-w-max grid-cols-[180px_auto_auto_auto] justify-center gap-5 md:grid-cols-[200px_auto_auto_auto] lg:grid-cols-[288px_auto_auto_auto]">
                      <td className="flex w-full min-w-[180px] items-center justify-center border-r border-r-gray-100 text-left text-sm font-normal capitalize text-gray-500 md:min-w-[200px] lg:min-w-[288px]">
                        <p>Albums</p>
                      </td>
                      {compareData.map((i, index) => (
                        <td
                          key={index}
                          className="flex w-full min-w-44 max-w-44 items-center justify-center py-5 text-sm font-normal sm:min-w-52 md:min-w-60 md:text-base lg:min-w-72 xl:min-w-96"
                        >
                          {isEmpty(i) ? null : (
                            <AlbumCarousel albums={i?.album} />
                          )}
                        </td>
                      ))}
                    </tr>
                  ) : null}

                  <tr className="grid w-full min-w-max">
                    <td
                      colSpan={compareData.length + 1}
                      className="border-t border-t-gray-100"
                    />
                  </tr>

                  {!isEmpty(compareData?.filter((i) => i?.show_reel)) ? (
                    <tr className="grid w-full min-w-max grid-cols-[180px_auto_auto_auto] justify-center gap-5 md:grid-cols-[200px_auto_auto_auto] lg:grid-cols-[288px_auto_auto_auto]">
                      <td className="flex w-full min-w-[180px] items-center justify-center border-r border-r-gray-100 text-left text-sm font-normal capitalize text-gray-500 md:min-w-[200px] lg:min-w-[288px]">
                        <p>Videos</p>
                      </td>
                      {compareData.map((i, index) => (
                        <td
                          key={index}
                          className="flex w-full min-w-44 max-w-44 items-center justify-center py-5 text-sm font-normal sm:min-w-52 md:min-w-60 md:text-base lg:min-w-72 xl:min-w-96"
                        >
                          {isEmpty(i) ? null : (
                            <AlbumCarousel albums={i?.show_reel} />
                          )}
                        </td>
                      ))}
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default Compare;
