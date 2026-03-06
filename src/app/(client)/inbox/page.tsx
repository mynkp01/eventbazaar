"use client";
import { apiHandler } from "@api/apiHandler";
import { DefaultVendorLogo } from "@assets/index";
import ChatBox from "@components/ChatBox";
import CustomImage from "@components/CustomImage";
import InfiniteScrollWrapper from "@components/InfiniteScrollWrapper";
import NewChat from "@components/NewChat";
import SearchInputButton from "@components/SearchInputButton";
import { selectUser } from "@redux/slices/authSlice";
import {
  selectChat,
  selectInboxType,
  selectLimit,
  setChat,
  setInboxType,
  setIsLoading,
} from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import moment from "moment";
import { notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { InboxTabList } from "src/app/global";
import { USER_TYPES } from "src/utils/Constant";
import {
  convertMediaUrl,
  isEmpty,
  showNotFoundPage,
  showToast,
} from "src/utils/helper";

const Inbox = () => {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [chatSearch, setChatSearch] = useState("");
  const [newChatSearch, setNewChatSearch] = useState("");
  const [notFoundPage, setNotFoundPage] = useState(false);
  const limit = useSelector(selectLimit);
  const selectedTab = useSelector(selectInboxType);
  const userData = useSelector(selectUser);
  const activeChat = useSelector(selectChat);
  const latestRef = useRef(0);

  async function loadChats(currentPage, isActiveChat = false) {
    const requestId = ++latestRef.current;
    try {
      const res = await apiHandler.chat.list(
        `user_type=customer&page=${currentPage}&search=${chatSearch}`,
      );
      if (requestId === latestRef.current) {
        if (res.status === 200 || res.status === 201) {
          if (isActiveChat) {
            dispatch(setChat(res?.data?.data?.records?.[0] || null));
          }
          setItems(
            currentPage === 1
              ? res?.data?.data?.records
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
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  useEffect(() => {
    if (userData?.user_type !== USER_TYPES.CUSTOMER) {
      setNotFoundPage(true);
      return;
    } else {
      dispatch(setInboxType(InboxTabList[1]));
    }
    mainFunc();
  }, [selectedTab, chatSearch]);

  useEffect(() => {
    return notFound();
    dispatch(setChat(null));
  }, []);

  useEffect(() => {
    if (notFoundPage) {
      showNotFoundPage();
    }
  }, [notFoundPage]);

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
    <div className="flex flex-col gap-3 p-6">
      <h3 className="heading-40 hidden xs:block">Inbox</h3>
      <div className="grid min-h-[calc(100vh-67px)] grid-cols-12 rounded-lg bg-primary-100 p-1 pt-2 sm:min-h-[calc(100vh-220px)] sm:p-2.5">
        <div className="col-span-12 sm:py-5 sm:pr-2.5 lg:col-span-4">
          <div className="relative grid gap-2">
            <SearchInputButton
              search={chatSearch}
              setSearch={setChatSearch}
              searchMessage={"Search vendor name here"}
            />
            <div
              className="max-h-[30vh] min-h-[30vh] space-y-2 overflow-y-scroll px-1 sm:px-2 lg:max-h-[59vh] lg:min-h-[59vh]"
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
                    className={`my-1 flex items-center gap-2.5 rounded-xl p-2 hover:bg-primary-50 xs:p-3 ${
                      activeChat && activeChat._id === item._id
                        ? "bg-primary-50"
                        : ""
                    }`}
                    onClick={() => dispatch(setChat(item))}
                  >
                    <div className="h-12 w-12 flex-shrink-0">
                      <CustomImage
                        src={
                          userData?.user_id === item?.user_id_2 &&
                          item?.user_2?.logo
                            ? convertMediaUrl(item?.user_2?.logo?.doc_path)
                            : userData?.user_id === item?.user_id_2 &&
                                !isEmpty(item?.vendor_2?.logo)
                              ? convertMediaUrl(item?.vendor_2?.logo?.doc_path)
                              : DefaultVendorLogo.src
                        }
                        alt="user logo"
                        className={`max-h-12 min-h-12 min-w-12 max-w-12 rounded-full object-cover`}
                      />
                    </div>
                    <div className="w-full min-w-0">
                      <div className="flex items-center justify-between">
                        <h2 className="text-15-700 truncate">
                          {item?.vendor_2?.full_name}
                        </h2>
                        <div className="flex items-center gap-2 xs:gap-3">
                          <p className="xs:text-12-600 w-[55px] truncate text-wrap text-right text-[10px] text-primary-400 xs:w-fit">
                            {item?.last_message?.createdAt
                              ? moment(item.last_message.createdAt).format(
                                  "DD-MM-YYYY hh:mm A",
                                )
                              : ""}
                          </p>
                          <p
                            className={`rounded-full p-1 ${
                              !item?.last_message?.mark_read &&
                              userData?.user_id ===
                                item?.last_message?.receiver_id
                                ? "bg-blue-300"
                                : "bg-primary-400"
                            }`}
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
                <p className="text-center text-sm">
                  <strong>{`No Recent Messages`}</strong>
                </p>
              )}
            </div>
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

export default Inbox;
