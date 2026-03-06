"use client";
import { apiHandler } from "@api/apiHandler";
import { ProfileCircled, ZapLight } from "@assets/index";
import ChatBox from "@components/ChatBox";
import CustomImage from "@components/CustomImage";
import InfiniteScrollWrapper from "@components/InfiniteScrollWrapper";
import NewChat from "@components/NewChat";
import NoData from "@components/NoData";
import SearchInputButton from "@components/SearchInputButton";
import { selectUser } from "@redux/slices/authSlice";
import {
  selectChat,
  selectInboxType,
  selectLimit,
  setChat,
  setInboxType,
} from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { motion } from "framer-motion";
import moment from "moment";
import { notFound } from "next/navigation";
import { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { InboxTabList } from "src/app/global";
import { USER_TYPES } from "src/utils/Constant";
import { convertMediaUrl, isEmpty, showToast } from "src/utils/helper";

const InboxPage = () => {
  const dispatch = useAppDispatch();
  const limit = useSelector(selectLimit);
  const selectedTab = useSelector(selectInboxType);
  const userData = useSelector(selectUser);
  const activeChat = useSelector(selectChat);

  const latestRef = useRef(0);

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [chatSearch, setChatSearch] = useState("");
  const [newChatSearch, setNewChatSearch] = useState("");

  async function loadChats(currentPage, isActiveChat = false) {
    const requestId = ++latestRef.current;
    try {
      const res = await apiHandler.chat.list(
        `user_type=${selectedTab.value}&page=${currentPage}&search=${chatSearch}`,
      );
      if (requestId === latestRef.current) {
        if (res.status === 200 || res.status === 201) {
          if (
            isActiveChat &&
            res?.data?.data?.records?.[0]?._id !== activeChat?._id
          ) {
            dispatch(setChat(res?.data?.data?.records?.[0] || null));
          }
          setItems(
            currentPage === 1
              ? [...res.data.data.records]
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
    // dispatch(setIsLoading(false));
  }

  useEffect(() => {
    if (
      userData?.user_type !== USER_TYPES.VENDOR &&
      selectedTab.value !== "vendor"
    ) {
      dispatch(setInboxType(InboxTabList[1]));
    }
    mainFunc();
  }, [selectedTab, chatSearch]);

  useEffect(() => {
    return notFound();
    dispatch(setChat(null));
  }, []);

  async function mainFunc(isActiveChat = false) {
    setItems([]);
    setHasMore(true);
    setPage(1);
    loadChats(1, isActiveChat);
  }

  async function callNext() {
    const currentPage = page + 1;
    setPage(currentPage);
    loadChats(currentPage);
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="heading-40 hidden xs:block">Inbox</h3>
      <div className="grid min-h-[calc(100vh-67px)] grid-cols-12 rounded-lg bg-primary-100 p-1 pt-2 sm:min-h-[calc(100vh-220px)] sm:p-2.5">
        <div className="col-span-12 sm:py-5 sm:pr-2.5 lg:col-span-4">
          <div className="relative grid gap-2">
            {userData?.user_type === USER_TYPES.VENDOR && (
              <div className="mx-auto w-fit rounded-full bg-gray-200 p-1">
                {InboxTabList.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setChatSearch("");
                      dispatch(setChat(null));
                      dispatch(setInboxType(item));
                    }}
                    className={`relative rounded-full px-1 py-1 text-sm font-medium transition-colors duration-200 ease-in-out sm:px-4 sm:py-1.5 ${
                      selectedTab.value === item.value
                        ? "text-gray-900 shadow-switchButton"
                        : "text-gray-500"
                    }`}
                    style={{ minWidth: "80px" }}
                  >
                    {selectedTab.value === item.value && (
                      <motion.div
                        layoutId="bubble"
                        className="absolute inset-0 rounded-full bg-white"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <span className="relative flex items-center justify-center">
                      {item.value === "customer" ? (
                        <ProfileCircled className="mr-1 h-5 w-5" />
                      ) : (
                        <ZapLight className="mr-1 h-5 w-5" />
                      )}
                      {item.key}
                    </span>
                  </button>
                ))}
              </div>
            )}
            <SearchInputButton
              search={chatSearch}
              setSearch={setChatSearch}
              searchMessage={"Search name here"}
            />
            <div
              className="max-h-[30vh] min-h-[30vh] space-y-2 overflow-y-scroll px-1 sm:px-2 lg:max-h-[50vh] lg:min-h-[50vh]"
              id="scrollable_inbox"
            >
              <InfiniteScrollWrapper
                hasMore={hasMore}
                dataLength={items.length}
                callNext={callNext}
                parentDivId="scrollable_inbox"
              >
                {items.map((item, i) => (
                  <div
                    key={item._id}
                    className={`my-1 flex items-center gap-2.5 rounded-xl p-2 hover:bg-primary-50 xs:p-3 ${activeChat && activeChat._id === item._id ? "bg-primary-50" : ""}`}
                    onClick={() => dispatch(setChat(item))}
                  >
                    <div className="h-12 w-12 flex-shrink-0">
                      <CustomImage
                        src={
                          userData?.user_id === item?.user_id_1 &&
                          !isEmpty(item?.user_2?.logo)
                            ? convertMediaUrl(item?.user_2?.logo?.doc_path)
                            : userData?.user_id === item?.user_id_2 &&
                                !isEmpty(item?.user_1?.logo)
                              ? convertMediaUrl(item?.user_1?.logo?.doc_path)
                              : ""
                        }
                        alt="user logo"
                        className={`max-h-12 min-h-12 min-w-12 max-w-12 rounded-full object-cover`}
                      />
                    </div>
                    <div className="w-full min-w-0">
                      <div className="flex items-center justify-between">
                        <h2 className="text-15-700 truncate">
                          {userData?.user_id === item?.user_id_1
                            ? item?.user_2?.full_name
                            : userData?.user_id === item?.user_id_2
                              ? item?.user_1?.full_name
                              : ""}
                        </h2>
                        {/* <p className="text-14-500 rounded-lg bg-orange-100 px-2 py-1">
                          {userData?.user_id === item?.user_id_1
                            ? item?.user_2?.plan?.plan_name
                            : userData?.user_id === item?.user_id_2
                              ? item?.user_1?.plan?.plan_name
                              : ""}
                        </p> */}
                        <div className="flex items-center gap-2 xs:gap-3">
                          <p className="xs:text-12-600 w-[55px] truncate text-wrap text-right text-[10px] text-primary-400 xs:w-fit">
                            {item?.last_message?.createdAt
                              ? moment(item.last_message.createdAt).format(
                                  "DD-MM-YYYY hh:mm A",
                                )
                              : ""}
                          </p>
                          <p
                            className={`rounded-full p-1 ${!item?.last_message?.mark_read && userData?.user_id === item?.last_message?.receiver_id ? "bg-blue-300" : "bg-primary-400"}`}
                          ></p>
                        </div>
                      </div>
                      <p className="text-15-500 truncate text-primary-500">
                        {item?.last_message?.message}
                      </p>
                    </div>
                  </div>
                ))}
              </InfiniteScrollWrapper>
              {items.length === 0 && !hasMore && (
                <NoData text="No Recent Messages" />
              )}
            </div>
            {/* {selectedTab.value === "vendor" && (
              <div className="absolute bottom-0 right-0 flex">
                <button
                  type="button"
                  className={`btn-fill-hover m-2 flex h-8 w-8 items-center justify-center rounded-full border-blue-100 bg-blue-100 text-primary-100 sm:h-12 sm:w-12`}
                  onClick={() => {
                    setNewChatSearch("");
                    setOpen(true);
                  }}
                >
                  <PlusIcon className="w-4 sm:w-7" />
                </button>
              </div>
            )} */}
          </div>
        </div>
        <ChatBox reloadChatList={mainFunc} />
      </div>
      <NewChat
        open={open}
        setOpen={setOpen}
        newChatSearch={newChatSearch}
        setNewChatSearch={setNewChatSearch}
      />
    </div>
  );
};

export default memo(InboxPage);
