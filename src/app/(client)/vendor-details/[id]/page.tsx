"use client";
import { apiHandler } from "@api/apiHandler";
import {
  CloseLight,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  HeartIcon,
  LeftArrowIcon,
  Location,
  NumberOfRooms,
  PlusMinusIcon,
  RightTickIcon,
  ShareIcon,
  Star,
  ThreeDots,
  VendorPlanBadge,
  VenueCapacity,
  VenueSize,
  VenueType,
  VerifiedLogo,
} from "@assets/index";
import CustomImage from "@components/CustomImage";
import CustomInput from "@components/CustomInput";
import CustomVideo from "@components/CustomVideo";
import DeleteModal from "@components/DeleteModal";
import DragAndDrop from "@components/DragAndDrop";
import LabelField from "@components/LabelField";
import NoData from "@components/NoData";
import Rating from "@components/Rating";
import { setDeep } from "@components/SetDeep";
import SocialMediaShareModal from "@components/SocialMediaShareModal";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Modal,
  Pagination as PaginationComponent,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import { selectUser, setVisibleLoginModal } from "@redux/slices/authSlice";
import {
  selectSelectedCity,
  selectSubCategories,
  selectVerticalsAndEventTypes,
} from "@redux/slices/lookupSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { Image, Rate } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  forwardRef,
  Fragment,
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import useDownloader from "react-use-downloader";
import { PLAN_CODE } from "src/utils/Constant";
import {
  convertMediaUrl,
  convertVideoUrl,
  getObjectIdFromString,
  isEmpty,
  showToast,
} from "src/utils/helper";
import {
  customDecodeURIComponent,
  customEncodeURIComponent,
} from "src/utils/helper.server";
import "swiper/css";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const CKEditorComp = dynamic(() => import("@components/CKEditorComp"), {
  ssr: false,
});

const mainTabs = [
  { _id: "overview", event_vertical_name: "Overview" },
  { _id: "venues", event_vertical_name: "Venues" },
  { _id: "portfolio", event_vertical_name: "Portfolio" },
  { _id: "about", event_vertical_name: "About us" },
  { _id: "service-we-provide", event_vertical_name: "Services We Provide" },
  { _id: "policies", event_vertical_name: "Policies" },
  { _id: "reviews", event_vertical_name: "Reviews" },
  { _id: "faqs", event_vertical_name: "FAQ's" },
];

const reviewPopupTabs = [
  { _id: "view-contact", event_vertical_name: "View Contact" },
  { _id: "send-message", event_vertical_name: "Send Message" },
];

const portfolioTabs = [
  { _id: "albums", event_vertical_name: "Albums" },
  { _id: "companyVideo", event_vertical_name: "Company Video" },
];

const getIsReadMore = (ref: MutableRefObject<HTMLDivElement>) => {
  const element = ref.current;
  if (!element) return false;

  const lineHeight =
    (parseInt(window.getComputedStyle(element).lineHeight) || 0) * 2;
  const height = element.scrollHeight;

  return height > lineHeight;
};

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
          className="!h-[211px] !w-full !object-cover"
          loaderClasses={{ container: "!max-h-[211px]" }}
        />
      </div>
      <div className="flex text-base font-medium text-gray-700 group-hover:text-green-400 md:text-lg">
        {projectName} <LeftArrowIcon />
      </div>
    </div>
  );
};

const AlbumCarousel = ({ albums, slidesPerView = 5 }) => {
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
        <Swiper
          navigation
          modules={[Pagination, Navigation]}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1440: { slidesPerView: 4 },
            1536: { slidesPerView },
          }}
          className="eb-swiper w-full overflow-hidden"
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
                      <Image.PreviewGroup>
                        {getNonCoverMedia(selectedAlbum)?.images?.map(
                          (image) => (
                            <CustomImage
                              key={image?._id}
                              src={convertMediaUrl(image?.doc_path)}
                              preview
                              width="100%"
                              height="100%"
                              className="!aspect-video !h-full !w-full !rounded-md !object-cover"
                            />
                          ),
                        )}
                      </Image.PreviewGroup>
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

const ReviewReplyComponent = ({ reply }) => {
  const replyRef = useRef<HTMLDivElement | null>(null);

  const [expandedReplies, setExpandedReplies] = useState(true);
  const [shouldShowReplyReadMore, setShouldShowReplyReadMore] = useState(false);

  useEffect(() => {
    const checkReplyReadMore = () => {
      if (replyRef.current) {
        setShouldShowReplyReadMore(getIsReadMore(replyRef));
      }
    };

    checkReplyReadMore();

    window.addEventListener("resize", checkReplyReadMore);

    return () => window.removeEventListener("resize", checkReplyReadMore);
  }, [replyRef, reply]);

  const toggleReplyReadMore = () => {
    setExpandedReplies((prev) => !prev);
  };

  return (
    <div
      key={reply?._id}
      className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-white p-4 text-sm shadow-sm md:text-base"
    >
      <p className="text-xs font-medium md:text-sm">{reply?.customerName}</p>
      <div
        ref={replyRef}
        className={`ck-content ${
          expandedReplies ? "h-fit" : "line-clamp-1 overflow-hidden"
        }`}
        dangerouslySetInnerHTML={{ __html: reply?.comments }}
      />
      {shouldShowReplyReadMore ? (
        <button
          className="text-left text-sm text-blue-500 hover:text-blue-600"
          onClick={toggleReplyReadMore}
        >
          {expandedReplies ? "Read Less" : "Read More"}
        </button>
      ) : null}
    </div>
  );
};

const RepliesModal = ({
  isRepliesModalOpen,
  setIsRepliesModalOpen,
  testimonial,
}) => {
  return (
    <Modal
      open={isRepliesModalOpen}
      onClose={() => setIsRepliesModalOpen(false)}
      aria-labelledby="replies-modal"
      aria-describedby="review-replies-modal"
      className="flex h-full w-full items-center justify-center md:py-4"
    >
      <div className="relative z-50 flex h-full w-full max-w-xl flex-col gap-4 bg-white py-4 shadow-lg md:max-h-[80%] md:rounded-xl md-h:xs:max-w-5xl">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-lg font-semibold md:text-xl">Replies</h2>
          <button
            onClick={() => setIsRepliesModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <CloseLight fill="currentColor" />
          </button>
        </div>

        {/* Original review */}
        <div className="rounded-lg bg-gray-50 p-4">
          <Rate value={testimonial?.rating} disabled allowHalf />
          <p className="font-semibold">{testimonial?.customerName}</p>
          <div
            className="ck-content text-gray-700"
            dangerouslySetInnerHTML={{ __html: testimonial?.review }}
          />
        </div>

        {/* Replies list */}
        <div className="flex flex-col gap-4 overflow-y-auto px-4">
          {testimonial?.reviewsComments?.map((reply) => (
            <ReviewReplyComponent key={reply?._id} reply={reply} />
          ))}
        </div>
      </div>
    </Modal>
  );
};

const FeedbackCard = ({ review, setData, loadReviewsData }) => {
  const dispatch = useAppDispatch();
  const userData = useSelector(selectUser);

  const testimonialsRef = useRef<HTMLDivElement>(null);

  const [readMore, setReadMore] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);
  const [isRepliesModalOpen, setIsRepliesModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement>(null);

  useEffect(() => {
    const checkReadMore = () => {
      if (testimonialsRef.current) {
        setShouldShowReadMore(getIsReadMore(testimonialsRef));
      }
    };

    checkReadMore();

    window.addEventListener("resize", checkReadMore);

    return () => window.removeEventListener("resize", checkReadMore);
  }, [review?.review]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteReview = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.review.delete(review?._id);
      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        loadReviewsData();
        setDeleteModalOpen(false);
      } else {
        showToast("error", data?.message);
      }
    } catch (error) {
      showToast("error", error?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div
      key={review?._id}
      className="flex h-auto w-full flex-col gap-3 rounded-lg border-[1px] p-4"
    >
      <div className="flex justify-between gap-1">
        <Rate value={review?.rating} disabled allowHalf />
        {review?.user_id === userData?.user_id ? (
          <Fragment>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <ThreeDots className="size-6" />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              onClick={handleClose}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem
                className="md:!text-md !text-center !text-sm"
                onClick={() => setData(review)}
              >
                <ListItemIcon>
                  <EditIcon className="size-4 min-h-3 min-w-3" />
                </ListItemIcon>
                Edit
              </MenuItem>
              <MenuItem
                className="md:!text-md !text-center !text-sm"
                onClick={() => setDeleteModalOpen(true)}
              >
                <ListItemIcon>
                  <DeleteIcon className="size-4.5 min-h-3.5 min-w-3.5" />
                </ListItemIcon>
                Delete
              </MenuItem>
            </Menu>

            <DeleteModal
              open={deleteModalOpen}
              setOpen={setDeleteModalOpen}
              func={handleDeleteReview}
            />
          </Fragment>
        ) : null}
      </div>
      {!isEmpty(review?.customerName || review?.vendorName) ? (
        <p className="text-wrap font-semibold text-gray-800">
          {review?.customerName || review?.vendorName}
        </p>
      ) : null}
      <div className="flex flex-col gap-2 text-gray-700">
        {!isEmpty(review?.doc_path) ? (
          <div className="!h-20 !min-h-20 !w-20 !min-w-20 !overflow-hidden !rounded">
            <CustomImage
              src={convertMediaUrl(review?.doc_path)}
              preview
              height={"100%"}
              width={"100%"}
              className="!object-cover"
            />
          </div>
        ) : null}
        <p
          ref={testimonialsRef}
          className={`ck-content text-wrap ${
            readMore ? "h-fit" : "line-clamp-2"
          }`}
          dangerouslySetInnerHTML={{ __html: review?.review }}
        />
        {shouldShowReadMore ? (
          <p
            className="md:text-md cursor-pointer text-sm text-blue-300 !no-underline"
            onClick={() => setReadMore(!readMore)}
          >
            {readMore ? "Read Less" : "Read More"}
          </p>
        ) : null}

        {/* Show Replies Button */}
        {!isEmpty(review?.reviewsComments) && (
          <button
            className="mt-2 text-left text-sm text-blue-500 hover:text-blue-600"
            onClick={() => setIsRepliesModalOpen(true)}
          >
            Show Replies ({review?.reviewsComments?.length})
          </button>
        )}

        {/* Replies Modal */}
        <RepliesModal
          isRepliesModalOpen={isRepliesModalOpen}
          setIsRepliesModalOpen={setIsRepliesModalOpen}
          testimonial={review}
        />
      </div>
    </div>
  );
};

const FeedbackCarousel = ({ loadReviewsData, reviews, setData }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (_e, newPage) => {
    setCurrentPage(newPage);
    loadReviewsData(newPage);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:grid lg:grid-cols-2 xl:grid-cols-4">
        {reviews?.data?.map((review) => (
          <FeedbackCard
            key={review?._id}
            review={review}
            setData={setData}
            loadReviewsData={loadReviewsData}
          />
        ))}
      </div>

      <PaginationComponent
        shape="rounded"
        count={reviews?.totalPages}
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
  );
};

const ViewContactTab = ({
  sendMessageForm,
  setSendMessageForm,
  onClickSendMessage,
  showVendorDetails,
  vendorContactDetails,
}) => {
  const user = useSelector(selectUser);
  const dispatch = useAppDispatch();

  const handleViewContactChange = (e) => {
    const { name, value } = e?.target;
    setSendMessageForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewContactAndSendMessage = async () => {
    if (isEmpty(user)) {
      dispatch(setVisibleLoginModal(true));
    } else {
      if (!showVendorDetails) {
        await onClickSendMessage(true);
      }
    }
  };

  return (
    <div className="gap-3 p-1 text-gray-700">
      <div className="flex-1">
        <CustomInput
          name="name"
          value={sendMessageForm?.name}
          onChange={handleViewContactChange}
          placeholder="Enter your name"
          disabled={!isEmpty(user)}
        />
      </div>
      <div className="flex-1">
        <CustomInput
          name="email"
          value={sendMessageForm?.email}
          onChange={handleViewContactChange}
          placeholder="Enter your email"
          disabled={!isEmpty(user)}
        />
      </div>
      <div className="flex-1">
        <CustomInput
          name="contact"
          type="number"
          value={sendMessageForm?.contact}
          onChange={handleViewContactChange}
          placeholder="Enter your contact"
          maxLength={10}
          disabled={!isEmpty(user)}
        />
      </div>
      <button
        onClick={handleViewContactAndSendMessage}
        className="mt-3 flex h-12 w-full items-center justify-center rounded-md border bg-green-400 p-1.5 text-white transition-all duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400"
      >
        View Contact
      </button>

      {showVendorDetails && (
        <>
          <h3 className="text-lg font-semibold">Vendor Details</h3>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="font-medium">
              <span className="font-medium">Vendor Phone Number:</span>{" "}
              {[
                vendorContactDetails?.primary_contact,
                ...vendorContactDetails?.contacts,
              ]
                .filter((contact) => contact)
                .map((contact, index) => (
                  <p key={index}>{contact}</p>
                ))}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

const SendMessageTab = ({
  onClickSendMessage,
  sendMessageForm,
  setSendMessageForm,
}) => {
  const user = useSelector(selectUser);
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState({});

  const validateFields = (name, value) => {
    let error = "";
    if (name === "message" && !value?.trim()) {
      error = "Message is required.";
    }
    return error;
  };

  const handleSendMessageChange = (e) => {
    const { name, value } = e?.target;
    setSendMessageForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateFields(name, value),
    }));
  };

  const handleSendMessageClick = async () => {
    if (isEmpty(user)) {
      dispatch(setVisibleLoginModal(true));
      return;
    }

    const messageError = validateFields("message", sendMessageForm?.message);
    if (messageError) {
      setErrors({ message: messageError });
      return;
    }

    await onClickSendMessage();
    setErrors({});
  };

  return (
    <div className="gap-3 p-1 text-gray-700">
      <div className="flex-1">
        <CustomInput
          name="name"
          value={sendMessageForm?.name}
          onChange={handleSendMessageChange}
          placeholder="Enter your name"
          disabled={!isEmpty(user)}
        />
      </div>
      <div className="flex-1">
        <CustomInput
          name="email"
          type="text"
          value={sendMessageForm?.email}
          onChange={handleSendMessageChange}
          placeholder="Enter your email"
          disabled={!isEmpty(user)}
        />
      </div>
      <div className="flex-1">
        <CustomInput
          name="contact"
          type="number"
          value={sendMessageForm?.contact}
          onChange={handleSendMessageChange}
          maxLength={10}
          placeholder="Enter your contact"
          disabled={!isEmpty(user)}
        />
      </div>
      <div className="p-1">
        <CustomInput
          name="message"
          type="text"
          value={sendMessageForm?.message}
          onChange={handleSendMessageChange}
          className="!mt-1 w-full rounded !p-2"
          isTextArea
          label="Message"
          required
        />
        {errors?.message && (
          <p className="error-text mt-1 text-sm text-red-500">
            {errors?.message}
          </p>
        )}
      </div>
      <button
        onClick={handleSendMessageClick}
        className="flex h-12 w-full items-center justify-center rounded-md border bg-green-400 p-1.5 text-white transition-all duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400"
      >
        Send Message
      </button>
    </div>
  );
};

const ReviewTabContent = ({ vendorData, ids }) => {
  const { id } = useParams();
  const vendorId = getObjectIdFromString(id as string);

  const user = useSelector(selectUser);

  const dispatch = useAppDispatch();
  const selectedCity = useSelector(selectSelectedCity);
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const [vendorContactDetails, setVendorContactDetails] = useState({
    full_name: vendorData?.full_name || "",
    primary_contact: vendorData?.primary_contact || "",
    contacts: vendorData?.contacts || [],
  });
  const [sendMessageForm, setSendMessageForm] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });
  const [currentPopupTab, setCurrentPopupTab] = useState("view-contact");

  useEffect(() => {
    if (!isEmpty(user)) {
      setSendMessageForm({
        name: user?.full_name,
        email: user?.primary_email,
        contact: user?.contact || user?.primary_contact,
        message: "",
      });
    } else {
      setSendMessageForm({
        name: "",
        email: "",
        contact: "",
        message: "",
      });
    }
  }, [user]);

  const onClickSendMessage = async (showDetail = false) => {
    try {
      if (isEmpty(selectedCity)) {
        showToast("error", "Please select a city first");
        return;
      }

      dispatch(setIsLoading(true));

      const { data, status } = await apiHandler.client.customerLead({
        message: sendMessageForm?.message,
        location_id: selectedCity?._id,
        sub_category_id:
          ids?.sub_category_id || vendorData?.business_category_id,
        vendor_id: vendorId,
      });

      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        setVendorContactDetails((prev) => ({
          ...prev,
          full_name: vendorData?.full_name,
          ...data?.data,
        }));
        if (showDetail) setShowVendorDetails(true);
        setSendMessageForm((prev) => ({ ...prev, message: "" }));
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className="w-full lg:w-1/2 xl:w-1/4">
      <div className="rounded-lg bg-white p-4 shadow-lg">
        <div>
          <Tabs
            variant="scrollable"
            value={currentPopupTab}
            onChange={(e, newValue) => setCurrentPopupTab(newValue)}
            aria-label="Review Popup Tabs"
            style={{ borderRadius: "8px" }}
            sx={{
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#5E8C3A",
              },
              "& .MuiTab-root": {
                textTransform: "capitalize",
              },
            }}
          >
            {reviewPopupTabs.map((tab) => (
              <Tab
                key={tab?._id}
                label={tab?.event_vertical_name}
                value={tab?._id}
                className={`rounded-lg font-semibold normal-case ${
                  currentPopupTab === tab?._id
                    ? "!text-green-400"
                    : "!text-black-50"
                }`}
              />
            ))}
          </Tabs>
        </div>
        {(() => {
          switch (currentPopupTab) {
            case "view-contact":
              return (
                <ViewContactTab
                  sendMessageForm={sendMessageForm}
                  setSendMessageForm={setSendMessageForm}
                  onClickSendMessage={onClickSendMessage}
                  showVendorDetails={showVendorDetails}
                  vendorContactDetails={vendorContactDetails}
                />
              );
            case "send-message":
              return (
                <SendMessageTab
                  onClickSendMessage={onClickSendMessage}
                  sendMessageForm={sendMessageForm}
                  setSendMessageForm={setSendMessageForm}
                />
              );
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
};

const OverView = forwardRef(
  (
    { vendorData, isOpen, setIsOpen, editReviewData, ids, loadReviewsData },
    ref,
  ) => {
    const user = useSelector(selectUser);
    const dispatch = useAppDispatch();

    const { id } = useParams();
    const vendorId = getObjectIdFromString(id as string);

    const { download } = useDownloader();

    const bioRef = useRef<HTMLParagraphElement>(null);

    const [errors, setErrors] = useState<any>({});
    const [image, setImage] = useState(null);
    const [readMore, setReadMore] = useState(true);
    const [reviewData, setReviewData] = useState({ rating: 0, review: "" });
    const [shouldShowReadMore, setShouldShowReadMore] = useState(false);

    useEffect(() => {
      if (!isEmpty(editReviewData)) {
        setReviewData({
          rating: editReviewData?.rating,
          review: editReviewData?.review,
        });
        if (editReviewData?.doc_path) {
          setImage({ doc_path: editReviewData?.doc_path });
        }
      }
    }, [editReviewData]);

    useEffect(() => {
      const checkReadMore = () => {
        if (bioRef.current) {
          setShouldShowReadMore(getIsReadMore(bioRef));
        }
      };

      checkReadMore();

      window.addEventListener("resize", checkReadMore);

      return () => window.removeEventListener("resize", checkReadMore);
    }, [vendorData?.bio, bioRef]);

    const handleInputChange = (path: string, value: any) => {
      setReviewData((prevState) => {
        const newState = { ...prevState };
        setDeep(newState, path, value);
        return newState;
      });

      setErrors((prevState) => {
        const newState = { ...prevState };
        setDeep(newState, path, "");
        return newState;
      });
    };

    const handleFiles = (files) => {
      if (!isEmpty(files)) {
        setImage({
          files: files[0],
          preview: URL?.createObjectURL(files[0]),
        });
      }
    };

    const removeImage = () => {
      URL?.revokeObjectURL(image);
      setImage(null);
    };

    const validateFields = (label: string, value: any) => {
      let error = "";

      switch (label) {
        case "review":
          if (!value.trim()) error = "Please provide a review";
          break;
        case "rating":
          if (!value || value === 0) error = "Please provide a rating";
          break;
        default:
          break;
      }

      setErrors((prevErrors) => ({ ...prevErrors, [label]: error }));
      return { ...errors, [label]: error };
    };

    const createReview = async () => {
      if (isEmpty(user)) {
        dispatch(setVisibleLoginModal(true));
        return;
      }

      const newErrors = {};
      const requiredFields = ["review", "rating"];
      requiredFields.forEach((field) => {
        const err = validateFields(field, reviewData[field]);
        if (err[field]) {
          newErrors[field] = err[field];
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      try {
        dispatch(setIsLoading(true));
        const formData = new FormData();
        formData?.append("vendor_id", vendorId as string);
        formData?.append("rating", reviewData?.rating as unknown as string);
        formData?.append("review", reviewData?.review);
        formData?.append(`images[0]`, image?.files);

        const res = await apiHandler.client.customerReview(formData);

        if (res?.status === 200 || res?.status === 201) {
          showToast("success", res?.data?.message);
          loadReviewsData();
          setReviewData({ rating: 0, review: "" });
          setImage(null);
          setIsOpen(false);
          const url = window.location.href
            .split(vendorId as string)[0]
            .concat(vendorId as string);
          window.history.replaceState(null, "", url);
        } else {
          showToast("error", res?.data?.message);
        }
      } catch (error) {
        showToast("error", error.response?.data?.message || error.message);
      } finally {
        dispatch(setIsLoading(false));
      }
    };

    return (
      <>
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
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
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <div className="flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-grey-200 p-2"
              >
                <CloseLight fill="white" />
              </button>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h3 className="heading-40">{`${isEmpty(editReviewData) ? "Write" : "Update"} a Review`}</h3>
                {isEmpty(editReviewData) ? (
                  <p className="text-sm md:text-base">
                    Verifying your number so the vendor can connect with you
                    easily!!
                  </p>
                ) : null}
              </div>
              <hr className="solid" />
              <div>
                <Rating
                  value={reviewData?.rating}
                  onChange={(e) => handleInputChange("rating", e)}
                />
                {errors?.rating ? (
                  <p className="error-text">{errors?.rating}</p>
                ) : null}
              </div>
              <div className="flex h-[20vh] w-full flex-wrap gap-2 md:h-[25vh] lg:h-[30vh] xl:h-[25vh]">
                {!isEmpty(image) ? (
                  <div className="relative h-full">
                    <CustomImage
                      src={
                        !isEmpty(image?.doc_path)
                          ? convertMediaUrl(image?.doc_path)
                          : image?.preview
                      }
                      alt="preview"
                      height="100%"
                      className="!aspect-square rounded-lg !object-cover"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow-md"
                    >
                      <CloseLight className="!size-2" />
                    </button>
                  </div>
                ) : (
                  <DragAndDrop
                    accept="image/*"
                    onFilesSelected={handleFiles}
                    text="Upload Images (not compulsory)"
                    text2="Drag Your Image Here or Click To Browse"
                    className="!h-full !w-full"
                  />
                )}
              </div>
              <div>
                <CKEditorComp
                  value={reviewData?.review}
                  onChange={(data) => {
                    handleInputChange("review", data);
                  }}
                  maxChars={200}
                />
                {errors?.review ? (
                  <p className="error-text">{errors?.review}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={createReview}
                  className="flex h-12 w-full items-center justify-center rounded-md border bg-green-400 p-1.5 text-sm text-white transition-all duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400 md:text-base"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </Box>
        </Modal>

        <div ref={ref} className="flex flex-col gap-6 lg:flex-row">
          {/* <div ref={ref => ref.scrollTo({top: ref.clientTop})} className="flex flex-col gap-6 md:flex-row"> */}
          <div className="w-full lg:w-1/2 xl:w-3/4">
            <div className="flex flex-col gap-5">
              {/* {!isEmpty(vendorData?.planData) &&
              vendorData?.planData?.plan_code !== PLAN_CODE.lite ? (
                <VendorPlanBadge text={vendorData?.planData?.plan_name} />
              ) : null} */}
              <div className="flex flex-col gap-2">
                <div className="flex w-full items-center gap-1.5">
                  {!isEmpty(vendorData?.planData) &&
                  vendorData?.planData?.plan_code !== PLAN_CODE.lite ? (
                    <VerifiedLogo className="md:size-7" />
                  ) : null}
                  <h2 className="text-wrap text-2xl font-bold text-gray-800 md:text-3xl">
                    {vendorData?.company_name}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-1">
                  {vendorData?.totalReview >= 1 && (
                    <div className="flex gap-1">
                      <Star fill="#FFC554" w-6 h-6 />
                      <span className="md:text-md text-sm font-medium">
                        {vendorData?.averageRating
                          ? vendorData?.averageRating?.toFixed(1)
                          : 0}
                      </span>
                      <span className="md:text-md text-sm font-medium text-primary-400">
                        ({vendorData?.totalReview} reviews)
                      </span>
                    </div>
                  )}

                  {!isEmpty(vendorData?.city) || !isEmpty(vendorData?.state) ? (
                    <>
                      <Location className="text-black" />
                      <Tooltip
                        title={`${!isEmpty(vendorData?.city) ? vendorData?.city : null}${!isEmpty(vendorData?.city) && !isEmpty(vendorData?.state) ? ", " : null}${!isEmpty(vendorData?.state) ? vendorData?.state : null}`}
                        placement="top"
                      >
                        <p className="md:text-md truncate text-wrap text-sm font-medium">
                          {!isEmpty(vendorData?.city) ? vendorData?.city : null}
                          {!isEmpty(vendorData?.city) &&
                          !isEmpty(vendorData?.state) ? (
                            <span>, </span>
                          ) : null}
                          {!isEmpty(vendorData?.state) ? (
                            <span>{vendorData?.state}</span>
                          ) : null}
                        </p>
                      </Tooltip>
                    </>
                  ) : null}
                </div>
              </div>

              {!isEmpty(vendorData?.keyWords) ? (
                <div className="flex w-full flex-wrap gap-1 lg:w-1/2">
                  {vendorData?.keyWords?.map((item) => (
                    <p
                      key={item?._id}
                      className="whitespace-nowrap rounded-md bg-white-50 px-3 py-1 text-[10px] text-grey-100 md:text-xs"
                    >
                      {item?.event_type_name}
                    </p>
                  ))}
                </div>
              ) : null}
              {!isEmpty(vendorData?.bio) ? (
                <div className="flex flex-col gap-3">
                  <p
                    ref={bioRef}
                    className={`ck-content overflow-hidden ${readMore ? "h-fit" : "line-clamp-1"}`}
                    dangerouslySetInnerHTML={{ __html: vendorData?.bio }}
                  />
                  {/* {shouldShowReadMore ? (
                    <p
                      className="md:text-md cursor-pointer text-sm text-blue-300 !no-underline"
                      onClick={() => setReadMore(!readMore)}
                    >
                      {readMore ? "Read Less" : "Read More"}
                    </p>
                  ) : null} */}
                </div>
              ) : null}
              <div className="grid h-full sm:flex sm:divide-x-[1px]">
                {!isEmpty(vendorData?.establishment_year) ? (
                  <div className="flex flex-col gap-2 py-3.5 first:pl-0 sm:px-3.5 sm:py-0">
                    <h3 className="text-lg font-medium">Establishment Year</h3>
                    <p className="font-light">
                      {moment(vendorData?.establishment_year).format("YYYY")}
                    </p>
                  </div>
                ) : null}
                {!isEmpty(vendorData?.no_of_employees) ? (
                  <div className="flex flex-col gap-2 py-3.5 first:pl-0 sm:px-3.5 sm:py-0">
                    <h3 className="text-lg font-medium">Number of employee</h3>
                    <p className="font-light">{vendorData?.no_of_employees}</p>
                  </div>
                ) : null}
                {!isEmpty(vendorData?.budget) ? (
                  <div className="flex flex-col gap-2 py-3.5 sm:px-3.5 sm:py-0">
                    <h3 className="text-lg font-medium">Budget</h3>
                    <p className="font-light">
                      ₹ {vendorData?.budget}{" "}
                      <span className="w-full items-center text-[10px] md:text-xs">
                        onwards
                      </span>
                    </p>
                    {/* <p className="font-light">{`Starts From ₹ ${convertToIndianWords(vendorData?.budget)}`}</p> */}
                  </div>
                ) : null}
                {!isEmpty(vendorData?.top3_client_name) &&
                !isEmpty(
                  vendorData?.top3_client_name?.filter((_) => !isEmpty(_)),
                ) ? (
                  <div className="flex flex-col gap-2 py-3.5 last:pr-0 sm:px-3.5 sm:py-0">
                    <h3 className="text-lg font-medium">Top 3 Client Names</h3>
                    <p className="font-light">
                      {vendorData?.top3_client_name?.join(", ")}
                    </p>
                  </div>
                ) : null}
              </div>
              {!isEmpty(vendorData?.brochures) ? (
                <div className="flex flex-col flex-wrap gap-5">
                  {vendorData?.brochures?.map((v) => (
                    <div
                      key={v?._id}
                      className="flex h-fit w-fit flex-row justify-between gap-3 border border-primary-50 px-3 py-2.5"
                    >
                      <span className="text-sm md:text-base">Brochure.pdf</span>
                      <div className="flex flex-row items-center gap-3">
                        <Tooltip title="View" placement="top">
                          {!isEmpty(v?.doc_path) ? (
                            <Link
                              href={convertMediaUrl(v?.doc_path)}
                              target="_blank"
                              className="!flex rounded-lg text-green-300"
                            >
                              <button className="rounded-lg">
                                <EyeIcon />
                              </button>
                            </Link>
                          ) : (
                            <button
                              className="!flex cursor-not-allowed rounded-lg text-gray-400"
                              disabled
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                          )}
                        </Tooltip>
                        <Tooltip title="Download" placement="top">
                          <button
                            className="rounded-lg text-blue-300"
                            onClick={async () => {
                              dispatch(setIsLoading(true));
                              await download(
                                convertMediaUrl(v?.doc_path),
                                v?.doc_path?.split("/")[
                                  v?.doc_path?.split("/")?.length - 1
                                ],
                              );
                              dispatch(setIsLoading(false));
                            }}
                          >
                            <DownloadIcon />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <>
                {isEmpty(user) || user?.user_id !== vendorId ? (
                  <div className="flex items-center md:order-2 md:hidden">
                    <button
                      type="button"
                      onClick={() => {
                        if (isEmpty(user)) {
                          dispatch(setVisibleLoginModal(true));
                        } else {
                          setIsOpen(true);
                        }
                      }}
                      className="shadow-outer h-fit w-full rounded-xl border border-green-500 p-1.5 text-green-500 md:w-auto md:px-3 md:py-2.5"
                    >
                      Write a Review
                    </button>
                  </div>
                ) : null}
              </>
            </div>
          </div>
          {isEmpty(user) || user?.user_id !== vendorId ? (
            <ReviewTabContent vendorData={vendorData} ids={ids} />
          ) : null}
        </div>
      </>
    );
  },
);
OverView.displayName = "OverView";

const VendorVenues = forwardRef(({ vendorData }, ref) => {
  const [viewMore, setViewMore] = useState(false);

  return !isEmpty(vendorData?.venues) ? (
    <div ref={ref} className="flex w-full flex-col">
      <p className="rounded-md bg-primary-300 p-3 text-3xl font-bold text-gray-800">
        Venues
      </p>
      <div className="grid w-full grid-cols-1 gap-4 pb-4 xl:grid-cols-2">
        {vendorData?.venues
          ?.slice(0, viewMore ? vendorData?.venues?.length : 4)
          ?.map((item) => (
            <div
              key={item?._id}
              className="rounded-lg bg-primary-100 py-4 text-black-50 transition-all duration-300"
            >
              <div className="flex flex-col gap-4">
                <h3 className="flex items-center justify-between gap-2 truncate px-4 text-lg font-medium md:text-xl">
                  {item?.name}
                </h3>

                <hr />

                <div className="grid grid-cols-1 gap-2 text-xs font-light xs:grid-cols-2 md:grid-cols-4 md:text-sm xl:grid-cols-2 2xl:grid-cols-4">
                  {isEmpty(item?.business_sub_category_name) ? null : (
                    <div className="flex w-full items-start gap-3 px-4 even:border-r-0 xs:border-r md:border-r md:last:border-r-0 md:even:border-r">
                      <VenueType className="size-5 min-h-5 min-w-5 md:size-6" />
                      <div className="flex flex-col gap-2.5">
                        <p className="font-medium">Venue Type</p>
                        <p>{item?.business_sub_category_name}</p>
                      </div>
                    </div>
                  )}

                  {isEmpty(item?.noOfRoom) ? null : (
                    <div className="flex w-full items-start gap-3 px-4 even:border-r-0 xs:border-r md:border-r md:last:border-r-0 md:even:border-r">
                      <NumberOfRooms className="size-5 min-h-5 min-w-5 md:size-6" />
                      <div className="flex flex-col gap-2.5">
                        <p className="font-medium">No. of Rooms</p>
                        <p>{item?.noOfRoom}</p>
                      </div>
                    </div>
                  )}

                  {isEmpty(item?.noOfPeople) ? null : (
                    <div className="flex w-full items-start gap-3 px-4 even:border-r-0 xs:border-r md:border-r md:last:border-r-0 md:even:border-r">
                      <VenueCapacity className="size-5 min-h-5 min-w-5 md:size-6" />
                      <div className="flex flex-col gap-2.5">
                        <p className="font-medium">Venue Capacity</p>
                        <p>{item?.noOfPeople}</p>
                      </div>
                    </div>
                  )}

                  {isEmpty(item?.size) ? null : (
                    <div className="flex w-full items-start gap-3 px-4">
                      <VenueSize className="size-5 min-h-5 min-w-5 md:size-6" />
                      <div className="flex flex-col gap-2.5">
                        <p className="font-medium">Venue Size</p>
                        <p>{item?.size} Sq Ft</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      {vendorData?.venues?.length > 4 ? (
        <button
          className="text-green-400"
          onClick={() => setViewMore((prev) => !prev)}
        >
          {viewMore ? "View Less" : "View More"}
        </button>
      ) : null}
    </div>
  ) : null;
});
VendorVenues.displayName = "VendorVenues";

const ServicesWeProvide = forwardRef(({ vendorData }, ref) => {
  return !isEmpty(vendorData?.eventType) ? (
    <div ref={ref} className="flex flex-col gap-3">
      <p className="rounded-md bg-primary-300 p-3 text-3xl font-bold text-gray-800">
        Services we provide
      </p>
      <div className="mr-auto grid grid-cols-1 gap-2 gap-x-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {vendorData?.eventType?.map((item) => (
          <span
            key={item?._id}
            className="flex items-center gap-2 text-sm lg:text-base"
          >
            <RightTickIcon className="size-2.5 min-h-2.5 min-w-2.5 text-[#69D0BC]" />
            {item?.event_type_name}
          </span>
        ))}
      </div>
    </div>
  ) : null;
});
ServicesWeProvide.displayName = "ServicesWeProvide";

const Portfolio = forwardRef(({ vendorData }, ref) => {
  const [currentPortfolioTab, setCurrentPortfolioTab] = useState("albums");
  const trustedByContainerRef = useRef<HTMLDivElement>(null);

  const AlbumsTab = () => {
    return (
      <div
        ref={trustedByContainerRef}
        id="event-section-for-credibility"
        className="overflow-hidden"
      >
        {!isEmpty(vendorData?.album) ? (
          <AlbumCarousel albums={vendorData?.album} />
        ) : (
          <NoData text="No albums available" />
        )}
      </div>
    );
  };

  const ShowreelTab = () => {
    return (
      <div
        ref={trustedByContainerRef}
        id="event-section-for-credibility"
        className="overflow-hidden"
      >
        {!isEmpty(vendorData?.show_reel) ? (
          <AlbumCarousel albums={vendorData?.show_reel} />
        ) : (
          <NoData text="No company video available" />
        )}
      </div>
    );
  };

  return !isEmpty(vendorData?.album) || !isEmpty(vendorData?.show_reel) ? (
    <div id="portfolio" ref={ref} className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <p className="rounded-md bg-primary-300 p-3 text-3xl font-bold text-gray-800">
          Portfolio
        </p>
        <div className="flex flex-col justify-between gap-6">
          <Tabs
            variant="scrollable"
            value={currentPortfolioTab}
            onChange={(e, newValue) => setCurrentPortfolioTab(newValue)}
            aria-label="Main Tabs"
            style={{
              borderRadius: "8px",
            }}
            sx={{
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#040D08",
              },
              "& .MuiTab-root": {
                textTransform: "capitalize",
              },
            }}
          >
            {portfolioTabs?.map((tab) => (
              <Tab
                key={tab?._id}
                label={tab?.event_vertical_name}
                value={tab?._id}
                className="rounded-lg font-semibold normal-case !text-black-50"
              />
            ))}
          </Tabs>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {(() => {
          switch (currentPortfolioTab) {
            case "albums":
              return <AlbumsTab />;
            case "companyVideo":
              return <ShowreelTab />;
            default:
              return null;
          }
        })()}
      </div>
    </div>
  ) : null;
});
Portfolio.displayName = "Portfolio";

const AboutUs = forwardRef(({ vendorData }, ref) => {
  const aboutUsRef = useRef<HTMLParagraphElement>(null);

  const [readMore, setReadMore] = useState(true);
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);

  useEffect(() => {
    const checkReadMore = () => {
      if (aboutUsRef.current) {
        setShouldShowReadMore(getIsReadMore(aboutUsRef));
      }
    };

    checkReadMore();

    window.addEventListener("resize", checkReadMore);

    return () => window.removeEventListener("resize", checkReadMore);
  }, [vendorData?.aboutUs?.about_us]);

  return !isEmpty(vendorData?.aboutUs?.about_us) ? (
    <div ref={ref} id="about" className="flex flex-col gap-3">
      <p className="rounded-md bg-primary-300 p-3 text-3xl font-bold text-gray-800">
        About Us
      </p>
      <div className="flex flex-col gap-3">
        <p
          ref={aboutUsRef}
          className={`ck-content overflow-hidden text-wrap ${readMore ? "h-fit" : "line-clamp-1"}`}
          dangerouslySetInnerHTML={{ __html: vendorData?.aboutUs?.about_us }}
        />
        {/* {shouldShowReadMore ? (
          <p
            className="cursor-pointer text-xs text-blue-300 !no-underline md:text-sm"
            onClick={() => setReadMore(!readMore)}
          >
            {readMore ? "Read Less" : "Read More"}
          </p>
        ) : null} */}
      </div>
    </div>
  ) : null;
});
AboutUs.displayName = "AboutUs";

const Policies = forwardRef(({ vendorData }, ref) => {
  const paymentPolicyRef = useRef<HTMLParagraphElement>(null);
  const cancellationPolicyRef = useRef<HTMLParagraphElement>(null);

  const [readMore, setReadMore] = useState({
    paymentPolicies: true,
    cancellationPolicies: true,
  });
  const [shouldShowReadMore, setShouldShowReadMore] = useState({
    paymentPolicies: false,
    cancellationPolicies: false,
  });

  useEffect(() => {
    const checkReadMore = () => {
      if (paymentPolicyRef.current || cancellationPolicyRef.current) {
        setShouldShowReadMore({
          paymentPolicies: getIsReadMore(paymentPolicyRef),
          cancellationPolicies: getIsReadMore(cancellationPolicyRef),
        });
      }
    };

    checkReadMore();

    window.addEventListener("resize", checkReadMore);

    return () => window.removeEventListener("resize", checkReadMore);
  }, [vendorData?.payment_policies]);

  return (
    <>
      {!isEmpty(vendorData?.payment_policies?.payment_policy) ||
      !isEmpty(vendorData?.payment_policies?.cancellation_policy) ? (
        <div ref={ref} id="policies" className="flex flex-col gap-3">
          <p className="rounded-md bg-primary-300 p-3 text-3xl font-bold text-gray-800">
            Policies
          </p>

          {!isEmpty(vendorData?.payment_policies?.payment_policy) ? (
            <div className="flex flex-col gap-3">
              <p className="text-xl font-medium md:text-2xl">
                Payment Policies
              </p>
              <p
                ref={paymentPolicyRef}
                className={`ck-content overflow-hidden text-wrap ${readMore.paymentPolicies ? "h-fit" : "line-clamp-1"}`}
                dangerouslySetInnerHTML={{
                  __html: vendorData?.payment_policies?.payment_policy,
                }}
              />
              {/* {shouldShowReadMore.paymentPolicies ? (
                <p
                  className="cursor-pointer text-xs text-blue-300 !no-underline md:text-sm"
                  onClick={() =>
                    setReadMore((prevValue) => ({
                      ...prevValue,
                      paymentPolicies: !prevValue.paymentPolicies,
                    }))
                  }
                >
                  {readMore.paymentPolicies ? "Read Less" : "Read More"}
                </p>
              ) : null} */}
            </div>
          ) : null}

          {!isEmpty(vendorData?.payment_policies?.cancellation_policy) ? (
            <div className="flex flex-col gap-3">
              <p className="text-xl font-medium md:text-2xl">
                Cancellation Policies
              </p>
              <p
                ref={cancellationPolicyRef}
                className={`ck-content overflow-hidden text-wrap ${readMore.cancellationPolicies ? "h-fit" : "line-clamp-1"}`}
                dangerouslySetInnerHTML={{
                  __html: vendorData?.payment_policies?.cancellation_policy,
                }}
              />
              {/* {shouldShowReadMore.cancellationPolicies ? (
                <p
                  className="cursor-pointer text-xs text-blue-300 !no-underline md:text-sm"
                  onClick={() =>
                    setReadMore((prevValue) => ({
                      ...prevValue,
                      cancellationPolicies: !prevValue.cancellationPolicies,
                    }))
                  }
                >
                  {readMore.cancellationPolicies ? "Read Less" : "Read More"}
                </p>
              ) : null} */}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
});
Policies.displayName = "Policies";

const Reviews = forwardRef(({ reviews, loadReviewsData, setData }, ref) => {
  return !isEmpty(reviews?.data) ? (
    <div ref={ref} id="reviews" className="flex flex-col gap-3">
      <p className="rounded-md bg-primary-300 p-3 text-3xl font-bold text-gray-800">
        Reviews
      </p>
      <div className="flex flex-col gap-3">
        <div id="event-section-for-credibility" className="overflow-hidden">
          <FeedbackCarousel
            reviews={reviews}
            loadReviewsData={loadReviewsData}
            setData={setData}
          />
        </div>
      </div>
    </div>
  ) : null;
});
Reviews.displayName = "Reviews";

const ConnectWithUs = forwardRef(({ vendorData }, ref) => {
  const { id } = useParams();
  const vendorId = getObjectIdFromString(id as string);

  const user = useSelector(selectUser);
  const selectedCity = useSelector(selectSelectedCity);
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
    location_id: selectedCity?._id,
    sub_category_id: vendorData?.business_category_id,
    vendor_id: vendorId,
  });

  useEffect(() => {
    if (!isEmpty(user)) {
      setFormData({
        name: user?.full_name,
        email: user?.primary_email,
        contact: user?.contact || user?.primary_contact,
        message: "",
        location_id: selectedCity?._id,
        sub_category_id: vendorData?.business_category_id,
        vendor_id: vendorId,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        contact: "",
        message: "",
        location_id: selectedCity?._id,
        sub_category_id: vendorData?.business_category_id,
        vendor_id: vendorId,
      });
    }
  }, [user, selectedCity, vendorData, vendorId]);

  const validateFields = (name, value) => {
    let error = "";
    switch (name) {
      case "message":
        if (!value.trim()) {
          error = "Message is required";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateFields(name, value),
    }));
  };

  const handleSendMessage = async () => {
    if (isEmpty(user)) {
      dispatch(setVisibleLoginModal(true));
      return;
    }

    const messageError = validateFields("message", formData?.message);
    if (messageError) {
      setErrors({ message: messageError });
      return;
    }
    if (!selectedCity?._id) {
      showToast("error", "Please select a city first");
      return;
    }
    try {
      dispatch(setIsLoading(true));
      const leadData = { ...formData };
      const { data, status } = await apiHandler.client.customerLead(leadData);

      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        setFormData((prev) => ({
          ...prev,
          message: "",
        }));
        setErrors({});
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div ref={ref} id="ConnectWithUs" className="flex flex-col gap-3">
      <p className="rounded-md bg-primary-300 p-3 text-3xl font-bold text-gray-800">
        Connect with {vendorData?.company_name}
      </p>
      <p className="text-sm font-semibold md:text-base">
        Want your special events to be captured?
      </p>
      <div className="fle flex flex-col gap-3 p-1 text-gray-700">
        <div className="flex-1">
          <CustomInput
            name="name"
            value={formData?.name}
            onChange={handleChange}
            className="border border-primary-500 bg-white"
            label="Name"
            placeholder="Enter your name"
            disabled={!isEmpty(user)}
            required
          />
        </div>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <CustomInput
              name="email"
              value={formData?.email}
              onChange={handleChange}
              className="border border-primary-500 bg-white"
              label="Email"
              placeholder="Enter your email"
              disabled={!isEmpty(user)}
              required
            />
          </div>
          <div className="flex-1">
            <CustomInput
              name="contact"
              type="number"
              value={formData?.contact}
              onChange={handleChange}
              className="border border-primary-500 bg-white"
              label="Phone Number"
              placeholder="Enter your phone number"
              maxLength={10}
              disabled={!isEmpty(user)}
              required
            />
          </div>
        </div>
        <div className="flex-1">
          <CustomInput
            name="message"
            value={formData?.message}
            onChange={handleChange}
            className="border border-primary-500 bg-white"
            label="Type your message"
            placeholder="Enter your message"
            isTextArea
            required
          />
          {errors?.message && (
            <p className="error-text mt-1 text-sm text-red-500">
              {errors?.message}
            </p>
          )}
        </div>
        <button
          onClick={handleSendMessage}
          className="mt-3 flex h-fit w-fit items-center justify-center rounded-md border bg-green-400 p-1.5 text-white transition-all duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400 sm:px-3 sm:py-2.5"
        >
          Send Message
        </button>
      </div>
    </div>
  );
});
ConnectWithUs.displayName = "ConnectWithUs";

const FAQs = forwardRef(({ vendorData }, ref) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return !isEmpty(vendorData?.faq) ? (
    <div id="faqs" ref={ref} className="flex flex-col gap-3">
      <p className="rounded-md bg-primary-300 p-3 text-3xl font-bold text-gray-800">
        Frequently Asked Questions
      </p>
      <p className="my-3 text-lg">
        Ask everything you need to know about our products and services.
      </p>
      <div className="gap-8 rounded-[10px] border border-white-100 before:!bg-white-100">
        {vendorData?.faq?.map((item) => (
          <Accordion
            key={item?._id}
            expanded={expanded === item?._id}
            onChange={() =>
              setExpanded(expanded === item?._id ? null : item?._id)
            }
          >
            <AccordionSummary>
              {item?.question}
              <PlusMinusIcon
                isFocused={expanded === item?._id}
                className="ml-auto flex size-5 items-center justify-center rounded-full p-0.5"
              />
            </AccordionSummary>
            <AccordionDetails className="m-0 py-2 text-grey-200">
              <div
                className="ck-content"
                dangerouslySetInnerHTML={{ __html: item?.answer }}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  ) : null;
});
FAQs.displayName = "FAQs";

const VendorDetails = () => {
  const { verticals, types, types_category, id }: { [key: string]: string } =
    useParams();
  const VENDOR_ID = getObjectIdFromString(id);
  const params = useSearchParams();
  const isFromShareLink = params.get("review") === "true";

  const EVENT_VERTICAL_NAME = customDecodeURIComponent(verticals as string);
  const EVENT_TYPE_NAME = customDecodeURIComponent(types as string);
  const EVENT_TYPE_CATEGORY_NAME = customDecodeURIComponent(
    types_category as string,
  );

  const dispatch = useAppDispatch();
  const selectedCity = useSelector(selectSelectedCity);
  const user = useSelector(selectUser);
  const verticalsAndEventTypesData = useSelector(selectVerticalsAndEventTypes);
  const subCategoriesData = useSelector(selectSubCategories);

  const connectWithUsRef = useRef(null);
  const overviewRef = useRef(null);
  const vendorVenuesRef = useRef(null);
  const portfolioRef = useRef(null);
  const aboutRef = useRef(null);
  const serviceWeProvideRef = useRef(null);
  const policiesRef = useRef(null);
  const reviewsRef = useRef(null);
  const faqsRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [reviews, setReviews] = useState(null);
  const [editReviewData, setEditReviewData] = useState(null);
  const [vendorData, setVendorData] = useState<{
    company_name?: string;
    reviews?: any[];
    faq?: any[];
    rating?: number;
    location?: string;
    brochure?: null;
  }>(null);
  const [ids, setIds] =
    useState<
      Record<
        "vendor_id" | "vertical_id" | "category_id" | "sub_category_id",
        string
      >
    >(null);

  useEffect(() => {
    if (isFromShareLink) {
      if (isEmpty(user)) {
        showToast("error", "Please Login First To Submit A Review");
        dispatch(setVisibleLoginModal(true));
      } else {
        overviewRef?.current?.scrollIntoView({ behavior: "smooth" });
        setIsOpen(true);
      }
    }
  }, [isFromShareLink, user]);

  useEffect(() => {
    const verticalsDataByFind = verticalsAndEventTypesData?.find(
      (i) =>
        i?.event_vertical_name?.toLowerCase() ===
        EVENT_VERTICAL_NAME?.toLowerCase(),
    );

    if (!isEmpty(verticalsDataByFind)) {
      setIds((prevData) => ({
        ...prevData,
        vertical_id: verticalsDataByFind?._id,
      }));
      const eventTypeByFind = verticalsDataByFind?.["event-types"]?.find(
        (i) =>
          i?.event_type_name?.toLowerCase() === EVENT_TYPE_NAME?.toLowerCase(),
      );

      if (!isEmpty(eventTypeByFind)) {
        setIds((prevData) => ({
          ...prevData,
          category_id: eventTypeByFind?._id,
        }));
        const subCategoriesByFind = subCategoriesData?.find(
          (i) =>
            i?.name?.toLowerCase() === EVENT_TYPE_CATEGORY_NAME?.toLowerCase(),
        );

        if (!isEmpty(subCategoriesByFind)) {
          setIds((prevData) => ({
            ...prevData,
            sub_category_id: subCategoriesByFind?._id,
          }));
        }
      }
    }
  }, [
    verticalsAndEventTypesData,
    subCategoriesData,
    EVENT_VERTICAL_NAME,
    EVENT_TYPE_NAME,
    EVENT_TYPE_CATEGORY_NAME,
    selectedCity,
  ]);

  useEffect(() => {
    if (VENDOR_ID) {
      fetchVendorDetails();
    }
  }, [VENDOR_ID, user, selectedCity]);

  // const handleLoadReviewsData = () => {
  //   const screenWidth = window.innerWidth;

  //   if (screenWidth < 640) {
  //     loadReviewsData(1, 3);
  //   } else if (screenWidth >= 640 && screenWidth < 768) {
  //     loadReviewsData(1, 2);
  //   } else if (screenWidth >= 768 && screenWidth < 1024) {
  //     loadReviewsData(1, 3);
  //   } else if (screenWidth >= 1024 && screenWidth < 1536) {
  //     loadReviewsData(1, 4);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("resize", handleLoadReviewsData);
  //   return () => {
  //     window.removeEventListener("resize", handleLoadReviewsData);
  //   };
  // }, []);

  const fetchVendorDetails = async () => {
    try {
      dispatch(setIsLoading(true));
      setIds((prevData) => ({ ...prevData, vendor_id: VENDOR_ID }));
      const { data, status } = await apiHandler.client.vendorDetails(
        `vendor_id=${VENDOR_ID}&location_id=${selectedCity?._id}&customer_id=${user?.user_id}`,
      );
      if (status === 200 || status === 201) {
        const formattedData = {
          ...data?.data,
          eventType: !isEmpty(data?.data?.eventType)
            ? data?.data?.eventType?.filter((v) => !isEmpty(v?.event_type_name))
            : [],
        };
        setVendorData(formattedData);
        loadReviewsData(1);

        const pathName = window.location.pathname?.split("/");
        pathName.pop();

        const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}${pathName.join("/")}/${customEncodeURIComponent(formattedData?.company_name)}-${formattedData?._id}`;
        window.history.replaceState(null, "", url);
      }
    } catch (err) {
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const loadReviewsData = async (page = 1, limit = 4) => {
    if (page <= Number(reviews?.totalPages || 1)) {
      try {
        const { data, status } =
          await apiHandler.review.reviewsListWithPagination(
            `vendor_id=${VENDOR_ID}&page=${page}&limit=${limit}&user_id=${user?.user_id}`,
          );

        if (status === 200 || status === 201) {
          setReviews(data?.data);
        } else {
          showToast("error", data?.message);
        }
      } catch (err) {
        showToast("error", err?.message);
      }
    }
  };

  const renderUploadSlot = (slotId: number) => {
    const uploadedFile = vendorData?.heroBanner?.documents?.[slotId];

    return (
      <div className={`flex h-full w-full items-center justify-center`}>
        <div className={`relative flex h-full w-full`}>
          <CustomImage
            src={convertMediaUrl(uploadedFile?.doc_path)}
            alt="Preview"
            height="100%"
            width="100%"
            className={`!rounded-md !object-cover`}
          />
        </div>
      </div>
    );
  };

  const scrollToSection = (sectionRef: RefObject<HTMLDivElement>) => {
    if (sectionRef.current) {
      const { clientHeight } = document.getElementById("client-header");

      const PADDING = 20;
      const elementPosition = sectionRef.current.getBoundingClientRect().top;
      const top =
        elementPosition + window.pageYOffset - (clientHeight + PADDING);

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  const onClickLike = async () => {
    try {
      if (isEmpty(user?.user_id)) {
        dispatch(setVisibleLoginModal(true));
      } else {
        setVendorData((prevState) => ({
          ...prevState,
          isFavorite: !prevState?.isFavorite,
        }));
        await apiHandler.client.customerToggleLike(VENDOR_ID);
      }
    } catch (error) {
      console.error("Err: customerToggleLike", error);
    }
  };

  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex flex-col gap-6 p-6 !pb-0 md:px-10 lg:gap-12 lg:px-20 lg:py-12">
        <style jsx>{`
          ::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {isEmpty(vendorData) ? (
          <NoData text="No Vendor Found" />
        ) : (
          <Fragment>
            {/* photoSection */}
            <div className="relative flex flex-col gap-6">
              {!isEmpty(vendorData?.planData) &&
              vendorData?.planData?.plan_code !== PLAN_CODE.lite ? (
                <div className="absolute left-0 top-8 z-[1]">
                  <VendorPlanBadge
                    text={vendorData?.planData?.plan_name}
                    fontSize={14}
                  />
                </div>
              ) : null}

              {!isEmpty(vendorData?.heroBanner) ? (
                <>
                  {vendorData?.heroBanner?.banner_style === "1" && (
                    <div className="flex !aspect-[48/18] items-center justify-center overflow-hidden bg-primary-300">
                      {renderUploadSlot(0)}
                    </div>
                  )}

                  {vendorData?.heroBanner?.banner_style === "2" && (
                    <div className="flex h-full w-full gap-2">
                      <div className="!aspect-[16/9] h-full w-full bg-primary-300">
                        {renderUploadSlot(0)}
                      </div>
                      <div className="!aspect-[16/9] h-full w-full bg-primary-300">
                        {renderUploadSlot(1)}
                      </div>
                    </div>
                  )}
                  {vendorData?.heroBanner?.banner_style === "3" && (
                    <div className="flex h-full w-full gap-2">
                      <div className="flex h-full w-2/3 flex-col gap-2">
                        <div className="!aspect-[16/9] h-full w-full bg-primary-300">
                          {renderUploadSlot(0)}
                        </div>
                      </div>
                      <div className="flex h-full w-1/3 flex-col gap-2">
                        <div className="flex flex-col gap-0.5 overflow-hidden">
                          <div className="!aspect-[16/9] h-1/2 w-full bg-primary-300">
                            {renderUploadSlot(1)}
                          </div>
                          <div className="!aspect-[16/9] h-1/2 w-full bg-primary-300">
                            {renderUploadSlot(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {vendorData?.heroBanner?.banner_style === "4" && (
                    <div className="flex h-full w-full gap-2">
                      <div className="flex h-full w-1/3 flex-col gap-2">
                        <div className="flex flex-col gap-2 overflow-hidden">
                          <div className="!aspect-[16/9] h-1/2 w-full bg-primary-300">
                            {renderUploadSlot(0)}
                          </div>
                          <div className="!aspect-[16/9] h-1/2 w-full bg-primary-300">
                            {renderUploadSlot(1)}
                          </div>
                        </div>
                      </div>
                      <div className="flex h-full w-1/3 flex-col gap-2">
                        <div className="flex flex-col gap-2 overflow-hidden">
                          <div className="!aspect-[16/9] h-1/2 w-full bg-primary-300">
                            {renderUploadSlot(2)}
                          </div>
                          <div className="!aspect-[16/9] h-1/2 w-full bg-primary-300">
                            {renderUploadSlot(3)}
                          </div>
                        </div>
                      </div>
                      <div className="flex h-full w-1/3 flex-col gap-2">
                        <div className="flex flex-col gap-2 overflow-hidden">
                          <div className="!aspect-[16/9] h-1/2 w-full bg-primary-300">
                            {renderUploadSlot(4)}
                          </div>
                          <div className="!aspect-[16/9] h-1/2 w-full bg-primary-300">
                            {renderUploadSlot(5)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex !aspect-[48/18] items-center justify-center overflow-hidden bg-primary-300">
                  {renderUploadSlot(0)}
                </div>
              )}
              <div className="absolute right-3 top-3 flex flex-col items-center gap-3">
                {isEmpty(user) || user?.user_id !== VENDOR_ID ? (
                  <button
                    onClick={onClickLike}
                    className="flex size-10 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:scale-110"
                  >
                    <HeartIcon
                      className={`size-4 ${
                        vendorData?.isFavorite
                          ? "fill-red-500 text-red-500"
                          : "text-black"
                      }`}
                    />
                  </button>
                ) : null}
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex size-10 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:scale-110"
                >
                  <ShareIcon className="size-4 text-black" />
                </button>
              </div>
            </div>

            <SocialMediaShareModal
              visible={showShareModal}
              setVisible={setShowShareModal}
              vendorData={vendorData}
            />

            <div className="flex flex-col gap-3">
              <div className="flex flex-col rounded-lg bg-primary-300 md:flex-row md:justify-between">
                <div className="flex flex-col items-center gap-2 overflow-x-auto whitespace-nowrap px-3 py-2.5 md:flex-row md:gap-4">
                  {mainTabs
                    ?.filter((tab) => {
                      if (tab?._id === "overview") {
                        return true;
                      }

                      if (tab?._id === "venues") {
                        return !isEmpty(vendorData?.venues);
                      }

                      if (tab?._id === "portfolio") {
                        return !(
                          isEmpty(vendorData?.album) &&
                          isEmpty(vendorData?.show_reel)
                        );
                      }

                      if (tab?._id === "service-we-provide") {
                        return !isEmpty(vendorData?.eventType);
                      }

                      if (tab?._id === "about") {
                        return (
                          !isEmpty(vendorData?.aboutUs) &&
                          !isEmpty(vendorData?.aboutUs?.about_us)
                        );
                      }

                      if (tab?._id === "policies") {
                        return (
                          !isEmpty(
                            vendorData?.payment_policies?.payment_policy,
                          ) ||
                          !isEmpty(
                            vendorData?.payment_policies?.cancellation_policy,
                          )
                        );
                      }

                      if (tab?._id === "reviews") {
                        return reviews?.data && !isEmpty(reviews?.data);
                      }

                      if (tab?._id === "faqs") {
                        return vendorData?.faq && !isEmpty(vendorData?.faq);
                      }
                      return false;
                    })
                    .map((tab) => (
                      <button
                        key={tab?._id}
                        onClick={() => {
                          switch (tab?._id) {
                            case "overview":
                              scrollToSection(overviewRef, tab?._id);
                              break;
                            case "venues":
                              scrollToSection(vendorVenuesRef, tab?._id);
                              break;
                            case "portfolio":
                              scrollToSection(portfolioRef, tab?._id);
                              break;
                            case "about":
                              scrollToSection(aboutRef, tab?._id);
                              break;
                            case "service-we-provide":
                              scrollToSection(serviceWeProvideRef, tab?._id);
                              break;
                            case "policies":
                              scrollToSection(policiesRef, tab?._id);
                              break;
                            case "reviews":
                              scrollToSection(reviewsRef, tab?._id);
                              break;
                            case "faqs":
                              scrollToSection(faqsRef, tab?._id);
                              break;
                            default:
                              break;
                          }
                        }}
                        className="w-full rounded-lg border-[1px] px-4 py-2 text-sm font-medium md:border-0"
                      >
                        {tab?.event_vertical_name}
                      </button>
                    ))}
                </div>
                {isEmpty(user) || user?.user_id !== VENDOR_ID ? (
                  <div className="hidden items-center md:flex">
                    <button
                      type="button"
                      onClick={() => {
                        if (isEmpty(user)) {
                          dispatch(setVisibleLoginModal(true));
                        } else {
                          setIsOpen(true);
                        }
                      }}
                      className="shadow-outer h-fit w-full rounded-xl border border-green-500 p-1.5 text-green-500 md:w-auto md:px-3 md:py-2.5"
                    >
                      Write a review
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            {/* BridalWearSection */}
            <OverView
              ref={overviewRef}
              vendorData={vendorData}
              isOpen={isOpen}
              editReviewData={editReviewData}
              setIsOpen={setIsOpen}
              ids={ids}
              loadReviewsData={loadReviewsData}
            />

            {/* PortfolioSection */}
            <VendorVenues ref={vendorVenuesRef} vendorData={vendorData} />

            {/* PortfolioSection */}
            <Portfolio ref={portfolioRef} vendorData={vendorData} />

            {/* AboutUsSection */}
            <AboutUs ref={aboutRef} vendorData={vendorData} />

            {/* ServicesWeProvideSection */}
            <ServicesWeProvide
              ref={serviceWeProvideRef}
              vendorData={vendorData}
            />

            <Policies ref={policiesRef} vendorData={vendorData} />

            {/* ReviewSection */}
            <Reviews
              ref={reviewsRef}
              reviews={reviews}
              loadReviewsData={loadReviewsData}
              setData={(data) => {
                setIsOpen(!isEmpty(data));
                setEditReviewData(data);
              }}
            />

            {/* ConnectUsSection */}
            {isEmpty(user) || user?.user_id !== VENDOR_ID ? (
              <ConnectWithUs ref={connectWithUsRef} vendorData={vendorData} />
            ) : null}
            {/* FAQsSection */}
            <FAQs ref={faqsRef} vendorData={vendorData} />
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default VendorDetails;
