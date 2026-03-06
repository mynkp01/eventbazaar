"use client";
import { apiHandler } from "@api/apiHandler";
import {
  DefaultVendorLogo,
  DeleteIcon,
  EBLogoRounded,
  Reply,
  Star,
} from "@assets/index";
import CustomButton from "@components/CustomButton";
import CustomImage from "@components/CustomImage";
import DeleteModal from "@components/DeleteModal";
import InfiniteScrollWrapper from "@components/InfiniteScrollWrapper";
import LabelField from "@components/LabelField";
import { selectUser } from "@redux/slices/authSlice";
import { selectLimit, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import moment from "moment";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES } from "src/utils/Constant";
import {
  convertMediaUrl,
  copyToClipboard,
  isEmpty,
  showToast,
} from "src/utils/helper";
import { customEncodeURIComponent } from "src/utils/helper.server";

const ReviewReplyItem = ({ childItem, childIndex, data, mainFunc }) => {
  const dispatch = useAppDispatch();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteReview = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.reviewComment.delete(
        childItem?._id,
      );
      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        mainFunc();
        setDeleteModalOpen(false);
      } else {
        showToast("error", data?.message);
      }
    } catch (error) {
      showToast("error", error?.message);
    }
    dispatch(setIsLoading(false));
  };

  return (
    <div
      key={childIndex}
      className={`flex flex-col items-start gap-2 pr-4 pt-4 ${childIndex < data?.length - 1 ? "border-b border-gray-200 pb-4" : ""}`}
    >
      <div className="flex w-full items-start gap-4">
        <div className="ml-4 flex flex-col gap-2 md:ml-0">
          <div className="flex justify-between gap-3">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center rounded-full sm:h-10 sm:w-10">
                <CustomImage
                  src={
                    childItem?.vendor_logo?.doc_path
                      ? convertMediaUrl(childItem.vendor_logo?.doc_path)
                      : convertMediaUrl(childItem?.customer_logo?.doc_path)
                        ? convertMediaUrl(childItem.customer_logo?.doc_path)
                        : DefaultVendorLogo.src
                  }
                  alt="vendor logo"
                  className={`max-h-8 min-h-8 min-w-8 max-w-8 rounded-full object-cover sm:max-h-10 sm:min-h-10 sm:min-w-10 sm:max-w-10`}
                />
              </div>
              <h3 className="text-15-600 text-primary-800">
                {childItem?.vendor?.full_name || childItem?.customer?.full_name}
              </h3>
            </div>
          </div>

          <p
            className="text-15-500 text-primary-600"
            dangerouslySetInnerHTML={{
              __html: childItem?.comments,
            }}
          />

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="text-12-600 flex items-center gap-2 text-primary-400 hover:text-gray-700"
          >
            <DeleteIcon />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <DeleteModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        func={handleDeleteReview}
      />
    </div>
  );
};

const CKEditorComp = dynamic(() => import("@components/CKEditorComp"), {
  ssr: false,
});

const Review = ({ item, index, dataLength, anyCollapsedFunc, mainFunc }) => {
  const dispatch = useAppDispatch();
  const limit = useSelector(selectLimit);
  const userData = useSelector(selectUser);

  const latestRef = useRef(0);

  const [isReplying, setIsReplying] = useState(false);
  const [comment, setComment] = useState("");
  const [childItems, setChildItems] = useState([]);
  const [childPage, setChildPage] = useState(1);
  const [childHasMore, setChildHasMore] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (!isCollapsed) childMainFunc();
  }, [isCollapsed]);

  const childMainFunc = async () => {
    setChildItems([]);
    setChildHasMore(true);
    setChildPage(1);
    loadReviewsComments(1);
  };

  const loadReviewsComments = async (currentPage) => {
    const requestId = ++latestRef.current;
    dispatch(setIsLoading(true));
    try {
      const { data, status } = await apiHandler.reviewComment.list(
        item?._id,
        `page=${currentPage}`,
      );
      if (requestId === latestRef.current) {
        if (status === 200 || status === 201) {
          setChildItems(
            currentPage === 1
              ? data?.data?.records
              : [...childItems, ...data?.data?.records],
          );
          setChildHasMore(data?.data?.records?.length >= limit);
        } else {
          showToast("error", data?.message);
        }
      }
    } catch (error) {
      if (requestId === latestRef.current) {
        showToast("error", error?.response?.data?.message || error.message);
      }
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const childCallNext = async () => {
    const currentPage = childPage + 1;
    setChildPage(currentPage);
    loadReviewsComments(currentPage);
  };

  const handleCommentSubmit = async () => {
    try {
      if (!comment.trim()) {
        setComment("");
        return;
      }

      dispatch(setIsLoading(true));
      const res = await apiHandler.reviewComment.post({
        user_id: userData.user_id,
        review_id: item._id,
        comments: comment,
      });

      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data?.message);
        mainFunc();
        childMainFunc();
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    }

    setComment("");
    setIsReplying(false);
    dispatch(setIsLoading(false));
  };

  return (
    <div>
      <div className="flex flex-row items-start gap-4">
        <div className="w-full flex-grow">
          <div className="flex w-full gap-2 xs:gap-4">
            <div
              className={`flex h-fit min-h-8 w-fit min-w-8 items-center justify-center overflow-hidden rounded-full bg-primary-200 sm:min-h-10 sm:min-w-10`}
            >
              {isEmpty(item?.customer?.customer_logo?.doc_path) ? (
                <EBLogoRounded className="max-h-8 min-h-6 min-w-6 max-w-8" />
              ) : (
                <CustomImage
                  src={convertMediaUrl(item?.customer?.customer_logo?.doc_path)}
                  alt="vendor logo"
                  className={`max-h-8 min-h-8 min-w-8 max-w-8 rounded-full object-cover sm:max-h-10 sm:min-h-10 sm:min-w-10 sm:max-w-10`}
                />
              )}
            </div>
            <div className="w-full">
              <div className="flex w-full items-start justify-between">
                <div className="flex gap-3">
                  <div>
                    <h3 className="text-15-600 text-primary-800">
                      {item?.customer?.full_name}
                    </h3>
                    <p className="sm:text-12-500 mt-1 text-wrap text-[11px] font-medium text-primary-500">
                      {item?.createdAt
                        ? moment(item.createdAt).format("DD-MM-YYYY hh:mm A")
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 md:mt-0">
                  <p className="text-14-600 text-primary-800">
                    {item.rating.toFixed(1)}
                  </p>
                  <Star fill="#FFC554" className="!w-4 xs:w-auto" />
                </div>
              </div>
              {/* ---------Review Message section----------- */}
              <div>
                <p
                  className="text-15-500 mt-2 text-primary-600"
                  dangerouslySetInnerHTML={{ __html: item?.review }}
                />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-6">
                  <button
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-12-600 flex items-center gap-2 text-primary-400 hover:text-gray-700"
                  >
                    <Reply />
                    <span>Reply</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsCollapsed(!isCollapsed);
                      anyCollapsedFunc(item._id);
                    }}
                    className="text-12-600 flex gap-2 text-primary-400 hover:text-gray-700"
                  >
                    <span>{isCollapsed ? "View more" : "View less"}</span>
                  </button>
                </div>
                {isReplying && (
                  <div className="mt-4 pl-0">
                    <LabelField
                      labelText="Reply"
                      toolTipText="Reply to Review"
                      className="mb-1.5"
                    />
                    <div className="">
                      <CKEditorComp
                        onChange={(data) => setComment(data)}
                        value={comment}
                        maxChars={500}
                      />
                    </div>
                    <CustomButton
                      text="Comment"
                      className={`text-12-500 mt-4 rounded-lg px-4 py-2 text-white ${comment ? "btn-fill-hover border-blue-100 bg-blue-100 hover:bg-blue-600" : "cursor-not-allowed bg-gray-400"}`}
                      onClick={handleCommentSubmit}
                      disabled={!comment}
                    />
                  </div>
                )}
                {isCollapsed
                  ? !isEmpty(item?.review_comments) && (
                      <div className="mt-4 border-t border-gray-200">
                        {item?.review_comments?.map((childItem, childIndex) => (
                          <ReviewReplyItem
                            key={childItem?._id}
                            data={item?.review_comments}
                            childIndex={childIndex}
                            childItem={childItem}
                            mainFunc={mainFunc}
                          />
                        ))}
                      </div>
                    )
                  : !isEmpty(childItems) && (
                      <div
                        className="mt-4 max-h-[25vh] overflow-y-scroll border-t border-gray-200"
                        id="scrollable_review_comments"
                      >
                        <InfiniteScrollWrapper
                          hasMore={childHasMore}
                          dataLength={childItems.length}
                          callNext={childCallNext}
                          parentDivId="scrollable_review_comments"
                        >
                          {childItems.map((childItem, childIndex) => (
                            <ReviewReplyItem
                              key={childItem?._id}
                              data={childItems}
                              childIndex={childIndex}
                              childItem={childItem}
                              mainFunc={mainFunc}
                            />
                          ))}
                        </InfiniteScrollWrapper>
                      </div>
                    )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {index !== dataLength - 1 ? (
        <hr className="my-2 border-gray-200" />
      ) : null}
    </div>
  );
};

const ReviewsList = () => {
  const dispatch = useAppDispatch();
  const userData = useSelector(selectUser);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const limit = useSelector(selectLimit);
  const latestRef = useRef(0);
  const [blankMessage, setBlankMessage] = useState("");
  const [anyCollapsed, setAnyCollapsed] = useState([]);

  async function loadReviews(currentPage) {
    const requestId = ++latestRef.current;
    try {
      const res = await apiHandler.review.list(
        `page=${currentPage}&vendor_id=${userData?.user_id}`,
      );
      if (requestId === latestRef.current) {
        if (res.status === 200 || res.status === 201) {
          setBlankMessage(
            currentPage === 1 && res.data.data.records.length === 0
              ? "Currently, there are no reviews available"
              : "",
          );
          setItems(
            currentPage === 1
              ? res.data.data.records
              : [...items, ...res.data.data.records],
          );
          setHasMore(res.data.data.records.length >= limit);
        } else {
          showToast("error", res?.data?.message);
        }
      }
    } catch (error) {
      if (requestId === latestRef.current) {
        setHasMore(false);
        showToast("error", error?.response?.data?.message || error.message);
      }
    }
    dispatch(setIsLoading(false));
  }

  useEffect(() => {
    mainFunc();
  }, []);

  async function mainFunc() {
    setItems([]);
    setHasMore(true);
    setPage(1);
    loadReviews(1);
    setBlankMessage("");
  }

  async function callNext() {
    const currentPage = page + 1;
    setPage(currentPage);
    loadReviews(currentPage);
  }

  async function anyCollapsedFunc(id) {
    let arr = [...anyCollapsed];

    let findIndex = arr.findIndex((item) => item === id);
    if (findIndex !== -1) {
      arr.splice(findIndex, 1);
    } else {
      arr.push(id);
    }
    setAnyCollapsed(arr);
  }

  return (
    <div className="flex min-h-[calc(100vh-145px)] flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="heading-40">Reviews</h3>
        <CustomButton
          text="Share Review Link"
          className="btn-fill-hover border-blue-100 bg-blue-100 px-2 py-1.5 text-primary-100 hover:bg-primary-100 hover:text-blue-100 sm:px-3.5 sm:py-1.5"
          onClick={(e) => {
            copyToClipboard(
              `${process.env.NEXT_PUBLIC_FRONTEND_URL}${ROUTES.client.vendorDetails}/${customEncodeURIComponent(userData?.company_name)}-${userData?.user_id}?review=true`,
            )
              .then(() => showToast("success", "Copied to clipboard"))
              .catch(() => console.error("error", "Please copy again"));
          }}
        />
      </div>
      <div
        id="scrollable_review"
        className={`max-h-[75vh] overflow-y-auto rounded-lg bg-primary-100 px-2 py-3 xs:p-3 ${anyCollapsed.length > 0 ? "scrollbar-none" : ""}`}
      >
        {items.length == 0 && (
          <p className="text-center">
            <strong>{blankMessage}</strong>
          </p>
        )}
        {items.length > 0 && (
          <InfiniteScrollWrapper
            hasMore={hasMore}
            dataLength={items.length}
            callNext={callNext}
            parentDivId="scrollable_review"
          >
            {items.map((item, index) => (
              <Review
                key={item._id}
                item={item}
                dataLength={items.length}
                index={index}
                anyCollapsedFunc={anyCollapsedFunc}
                mainFunc={mainFunc}
              />
            ))}
          </InfiniteScrollWrapper>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
