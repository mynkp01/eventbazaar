"use client";
import { apiHandler } from "@api/apiHandler";
import {
  FullScreen,
  NextArrow,
  PreviousArrow,
  SpeakerOff,
  SpeakerOn,
  VideoPlayerIcon,
} from "@assets/index";
import CustomVideo from "@components/CustomVideo";
import NoData from "@components/NoData";
import { setSelectedCity } from "@redux/slices/lookupSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ROUTES } from "src/utils/Constant";
import { convertVideoUrl, isEmpty, showToast } from "src/utils/helper";
import { customEncodeURIComponent } from "src/utils/helper.server";
import { Mousewheel, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

const TrendGalleryDetailsVideo = ({
  item,
  isPlaying = true,
  sliderRef,
  preference,
  setPreference,
}) => {
  const dispatch = useAppDispatch();

  const mainContainerRef = useRef<HTMLDivElement>(null);
  const trendGalleryDescriptionRef = useRef<HTMLDivElement>(null);
  const detailsContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [readMore, setReadMore] = useState(false);
  const [paused, setPaused] = useState(false);
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(0);

  const getIsReadMore = useCallback((ref: MutableRefObject<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return false;

    const lineHeight =
      parseInt(window.getComputedStyle(element).lineHeight) * 2;
    const height = element.scrollHeight;

    return height > lineHeight;
  }, []);

  useEffect(() => {
    if (trendGalleryDescriptionRef.current) {
      setShouldShowReadMore(getIsReadMore(trendGalleryDescriptionRef));
    }
  }, [getIsReadMore, item.description, trendGalleryDescriptionRef]);

  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasUserInteracted((prev) => prev++);
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoReady(true);
    };

    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (!isVideoReady || !videoRef.current) return;

    const playVideo = async () => {
      const video = videoRef.current;
      if (!video) return;

      if (isPlaying) {
        try {
          video.muted = preference?.muted;
          await video.play();
          setPaused(false);
        } catch (innerError) {
          console.log("Error playing even muted video:", innerError);
          video.pause();
          setPaused(true);
        }
      } else {
        video.pause();
        setPaused(true);
      }
    };

    playVideo();
  }, [isPlaying, isVideoReady, hasUserInteracted, preference?.muted]);

  const handleMuteToggle = async () => {
    if (!videoRef.current) return;
    setHasUserInteracted((prev) => prev++);

    try {
      if (preference?.muted) {
        videoRef.current.muted = false;
        setPreference((prev) => ({
          ...prev,
          muted: false,
        }));

        if (paused) {
          await videoRef.current.play();
          setPaused(false);
        }
      } else {
        videoRef.current.muted = true;
        setPreference((prev) => ({
          ...prev,
          muted: true,
        }));
      }
    } catch (error) {
      console.log("Error toggling mute:", error);
      // If we can't unmute, stay muted
      videoRef.current.muted = true;
      setPreference((prev) => ({
        ...prev,
        muted: true,
      }));
    }
  };

  const handleDetailsTouch = (e: React.UIEvent) => {
    if (!readMore) return;

    const container = detailsContainerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop === container.clientHeight;

    if (!isAtBottom) {
      e.stopPropagation();
      sliderRef?.current?.swiper?.disable();
    } else {
      sliderRef?.current?.swiper?.enable();
    }
  };

  const videoPlayPause = async () => {
    if (!videoRef.current) return;
    setHasUserInteracted((prev) => prev++);

    try {
      if (paused) {
        videoRef.current.muted = preference?.muted;
        await videoRef.current.play();
        setPaused(false);
      } else {
        videoRef.current.pause();
        setPaused(true);
      }
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  };

  return (
    <div
      ref={mainContainerRef}
      onScrollCapture={() => sliderRef?.current?.swiper?.enable()}
      className="!relative h-full w-full xs:aspect-[9/16] xs:w-fit"
    >
      <div className="relative flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing">
        <CustomVideo
          id={`video-${item?._id}`}
          ref={videoRef}
          src={convertVideoUrl(item?.doc_path)}
          onClick={videoPlayPause}
          controls={false}
          autoPlay={true}
          muted={preference?.muted}
          preload="auto"
          loop
          playsInline
          height="100%"
          width="100%"
          className="!h-full !w-full !bg-white !object-contain xs:aspect-[9/16]"
          onLoadedData={() => setIsVideoReady(true)}
        />
        {paused && (
          <div
            onClick={videoPlayPause}
            className="absolute left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 items-center text-green-400"
          >
            <VideoPlayerIcon className="size-16 min-h-14 min-w-14" />
          </div>
        )}
        <div className="absolute left-[30px] right-[30px] top-[30px] z-50 flex justify-between text-green-400">
          {preference?.muted ? (
            <SpeakerOff
              onClick={handleMuteToggle}
              className="size-9 min-h-9 cursor-pointer"
            />
          ) : (
            <SpeakerOn
              onClick={handleMuteToggle}
              className="size-9 min-h-9 cursor-pointer"
            />
          )}
          <FullScreen
            isFullScreen={preference?.fullScreen}
            onClick={() => {
              setHasUserInteracted((prev) => prev++);
              if (document.fullscreenElement) {
                document.exitFullscreen();
                setPreference((prev) => ({
                  ...prev,
                  fullScreen: false,
                }));
              } else {
                document
                  .getElementById("scrollable_inbox_search")
                  ?.requestFullscreen();
                setPreference((prev) => ({
                  ...prev,
                  fullScreen: true,
                }));
              }
            }}
            className="size-9 min-h-9 cursor-pointer"
          />
        </div>
      </div>
      <div
        ref={detailsContainerRef}
        className="absolute bottom-0 z-20 flex max-h-80 w-full flex-col gap-2.5 overflow-y-auto bg-[linear-gradient(0deg,rgba(0,0,0,.4),transparent)] p-5"
        onScroll={handleDetailsTouch}
      >
        <style jsx>{`
          ::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="flex items-center justify-between gap-5">
          <div>
            {!isEmpty(item?.vendorData?.company_name) ? (
              <Link
                href={`${ROUTES.client.vendorDetails}/${customEncodeURIComponent(item?.vendorData?.company_name)}-${item?.vendor_id}`}
                target="_blank"
                className="text-lg font-semibold text-white underline md:text-xl"
                onClick={() => {
                  videoRef.current.pause();
                  setPaused(true);
                  dispatch(setSelectedCity(item?.vendorData?.location_id));
                }}
              >
                {item?.vendorData?.company_name}
              </Link>
            ) : null}
            {!isEmpty(item?.vendorData?.business_category_id) ? (
              <p className="text-wrap text-xs font-normal text-white md:text-sm">
                {item?.vendorData?.business_category_name}
              </p>
            ) : null}
          </div>

          {!isEmpty(item?.category_id) ? (
            <p className="w-fit max-w-[40%] text-wrap rounded-full bg-white px-3 py-1 text-center text-xs font-normal text-black md:px-5 md:py-1.5 md:text-sm">
              {item?.category_id?.name}
            </p>
          ) : null}
        </div>

        <hr className="!border-t-[0.5px] !border-t-white opacity-50" />

        {!isEmpty(item?.reel_name) ? (
          <p className="text-sm font-medium text-white md:text-base">
            {item?.reel_name}
          </p>
        ) : null}

        {!isEmpty(item?.description) ? (
          <div>
            <p
              ref={trendGalleryDescriptionRef}
              className={`w-full ${readMore ? "" : "line-clamp-2 truncate"} text-wrap text-sm font-normal text-white-200 md:text-base`}
            >
              {item?.description}
            </p>

            {shouldShowReadMore ? (
              <p
                className="cursor-pointer text-green-400"
                onClick={() => {
                  setReadMore(!readMore);
                  if (readMore) {
                    sliderRef?.current?.swiper?.enable();
                  } else {
                    sliderRef?.current?.swiper?.disable();
                  }
                }}
              >
                {readMore ? "Read Less" : "Read More"}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const TrendGalleryDetails = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams();

  const sliderRef = useRef<SwiperRef>(null);
  const latestRef = useRef(0);

  const [trendGalleryData, setTrendGalleryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [clientHeight, setClientHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [preference, setPreference] = useState({
    muted: true,
    fullScreen: false,
  }); // Start unmuted by default

  useEffect(() => {
    if (activeIndex >= 0 && id) {
      const url = `${ROUTES.client.trendGallery}/${customEncodeURIComponent(trendGalleryData?.[activeIndex]?._id ?? id)}`;
      window.history.replaceState(null, "", url);
    }
  }, [activeIndex]);

  useEffect(() => {
    const getHeaderHeight = () => {
      if (document) {
        const element = document.getElementById("client-header");
        setClientHeight(element?.clientHeight || 0);
      }
    };

    getHeaderHeight();

    window.addEventListener("resize", getHeaderHeight);
    return () => {
      window.removeEventListener("resize", getHeaderHeight);
    };
  }, []);

  useEffect(() => {
    if (id) fetchTrendGallery();
  }, [id]);

  const fetchTrendGallery = async (page = 1) => {
    setLoading(true);
    dispatch(setIsLoading(true));

    if (page <= totalPages) {
      const requestId = ++latestRef.current;

      try {
        const { data, status } = await apiHandler.trendGallery.list(
          `page=${page}&firstOrderId=${id}`,
        );
        if (requestId === latestRef.current) {
          if (status === 200 || status === 201) {
            if (page === 1) {
              setTrendGalleryData(data?.data?.records);
              setCurrentPage(page + 1);
              setTotalPages(data?.data?.totalPages);
            } else if (page <= data?.data?.totalPages) {
              setTrendGalleryData((prevData) => [
                ...prevData,
                ...data?.data?.records,
              ]);
              setCurrentPage(page + 1);
            }
          }
        }
      } catch (error) {
        if (requestId === latestRef.current) {
          showToast("error", error?.message);
        }
      }
    }
    setLoading(false);
    dispatch(setIsLoading(false));
  };

  return isEmpty(trendGalleryData) && !loading ? (
    <NoData text="Not Available Any Trend Gallery" />
  ) : (
    <div
      id="scrollable_inbox_search"
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-white"
      style={{
        height: `calc(100vh - ${clientHeight}px)`,
        maxHeight: `calc(100vh - ${clientHeight}px)`,
      }}
    >
      <Swiper
        ref={sliderRef}
        speed={900}
        spaceBetween={10}
        direction="vertical"
        modules={[Pagination, Mousewheel, Navigation]}
        onReachEnd={() => fetchTrendGallery(currentPage)}
        mousewheel
        slidesPerView={1}
        onSlideChange={(event) => {
          setActiveIndex(event.activeIndex);

          trendGalleryData.forEach((item, index) => {
            if (index !== event.activeIndex) {
              const video = document.querySelector(
                `#video-${item?._id}`,
              ) as HTMLVideoElement;
              if (video) {
                video.pause();
                video.currentTime = 0;
                video.muted = true;
              }
            }
          });
        }}
        className="eb-swiper !mt-6 !h-full !w-full !pb-10"
        wrapperClass="!h-full"
        navigation={{ nextEl: ".arrowright", prevEl: ".arrowleft" }}
      >
        {trendGalleryData?.map((item, index) => (
          <SwiperSlide
            key={item._id || index}
            className="!flex !h-full !w-full !items-center !justify-center"
            style={{ height: "100%", width: "100%" }}
          >
            <div className="h-full w-full overflow-hidden rounded-lg shadow-xl xs:aspect-[9/16] xs:w-fit">
              <TrendGalleryDetailsVideo
                item={item}
                isPlaying={activeIndex === index}
                sliderRef={sliderRef}
                preference={preference}
                setPreference={setPreference}
              />
            </div>
          </SwiperSlide>
        ))}
        {!isEmpty(trendGalleryData) ? (
          <div className="absolute right-[30px] top-1/2 -z-50 hidden -translate-y-1/2 flex-col items-end justify-center gap-[30px] text-green-400 md:z-50 md:flex">
            <div className="arrowleft size-9 min-h-9">
              {activeIndex !== 0 ? (
                <PreviousArrow className="size-9 min-h-9 cursor-pointer" />
              ) : null}
            </div>
            <div className="arrowright size-9 min-h-9">
              {activeIndex !== trendGalleryData.length - 1 ? (
                <NextArrow className="size-9 min-h-9 cursor-pointer" />
              ) : null}
            </div>
          </div>
        ) : null}
      </Swiper>
    </div>
  );
};

export default TrendGalleryDetails;
