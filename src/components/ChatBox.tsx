"use client";
import { apiHandler } from "@api/apiHandler";
import { DownloadIcon, FileAddLight, PlanIcon } from "@assets/index";
import { Button } from "@mui/material";
import { selectUser } from "@redux/slices/authSlice";
import {
  selectChat,
  selectInboxType,
  selectLimit,
  setIsLoading,
} from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { Tooltip } from "antd";
import moment from "moment";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useDownloader from "react-use-downloader";
import { imgExtList, videoExtList } from "src/app/global";
import { useSocket } from "src/hooks/UseSocket";
import { USER_TYPES } from "src/utils/Constant";
import {
  convertMediaUrl,
  convertVideoUrl,
  isEmpty,
  showToast,
} from "src/utils/helper";
import CustomButton from "./CustomButton";
import CustomImage from "./CustomImage";
import CustomInput from "./CustomInput";
import CustomVideo from "./CustomVideo";
import InfiniteScrollWrapper from "./InfiniteScrollWrapper";

const ChatBox = ({ reloadChatList }) => {
  const { download } = useDownloader();
  const { socket, isConnected, error } = useSocket();

  const dispatch = useAppDispatch();
  const limit = useSelector(selectLimit);
  const userData = useSelector(selectUser);
  const chat = useSelector(selectChat);

  const latestRef = useRef(0);

  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const selectedUser = useSelector(selectInboxType);

  async function loadChats(currentPage, chat_id = chat?._id) {
    const requestId = ++latestRef.current;
    try {
      const res = await apiHandler.chatMessage.list(
        chat_id,
        `page=${currentPage}`,
      );
      if (requestId === latestRef.current) {
        if (res.status === 200 || res.status === 201) {
          for (let i = 0; i < res.data.data.records.length; i++) {
            let item = res.data.data.records[i];
            if (item?.doc_path) {
              let fileExt =
                item?.doc_path.split(".")[item?.doc_path.split(".").length - 1];

              if (imgExtList.includes(fileExt.toLowerCase())) {
                item["loadFile"] = (
                  <Link href={convertMediaUrl(item?.doc_path)} target="_blank">
                    <CustomImage
                      src={convertMediaUrl(item?.doc_path)}
                      alt="user logo"
                      width={"100%"}
                      height={"100%"}
                      className="!object-cover"
                    />
                  </Link>
                );
              } else if (videoExtList.includes(fileExt.toLowerCase())) {
                item["loadFile"] = (
                  <Link href={convertVideoUrl(item?.doc_path)} target="_blank">
                    <CustomVideo
                      src={convertVideoUrl(item?.doc_path)}
                      controls
                      controlsList="nodownload noplaybackrate"
                      className="h-full w-full object-cover"
                    />
                  </Link>
                );
              }
            }
          }

          setItems(
            currentPage === 1
              ? [...res.data.data.records]
              : [...items, ...res.data.data.records],
          );
          setHasMore(res.data.data.records.length >= limit);
          setPage(currentPage);
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
  }

  useEffect(() => {
    if (chat?._id) {
      mainFunc();
    } else {
      setItems([]);
      setHasMore(false);
    }
  }, [chat]);

  async function mainFunc(chat_id = chat?._id) {
    setItems([]);
    setHasMore(true);
    loadChats(1, chat_id);
  }

  async function callNext() {
    const currentPage = page + 1;
    loadChats(currentPage);
  }

  const sendMessage = async (e, chat_id) => {
    // dispatch(setIsLoading(true));
    try {
      const formData = new FormData();

      if (e?.target?.files && e.target.files[0]) {
        formData.append(
          userData?.user_id === chat?.user_id_1
            ? chat?.user_id_2
            : chat?.user_id_1,
          e.target.files[0],
        );
      }

      formData.append(
        "data",
        JSON.stringify({
          message: message,
          receiver_id:
            userData?.user_id === chat?.user_id_1
              ? chat?.user_id_2
              : chat?.user_id_1,
          sender_id: userData?.user_id,
          chat_id: chat_id,
        }),
      );

      const res = await apiHandler.chatMessage.post(formData);

      if (res.status === 200 || res.status === 201) {
        // mainFunc(chat_id);
        reloadChatList(true);
        socket.emit("req_chat_messages_list", {
          room: chat?._id,
          params: { chat_id: chat_id },
          query: {
            page: 1,
            limit: 20,
          },
        });
      } else {
        showToast("error", res?.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    // dispatch(setIsLoading(false));
  };

  const startChat = async (e) => {
    e.preventDefault();
    if (!socket || !isConnected || isEmpty(chat?._id)) {
      return;
    }

    if ((e?.target?.files && e.target.files[0]) || message) {
      if (e?.target?.files?.[0]?.size > 1024 * 1024 * 5) {
        showToast("error", "File size can not exceed 5 MB");
        return;
      }
    }

    if (!chat?._id) {
      // dispatch(setIsLoading(true));
      try {
        const res = await apiHandler.chat.post({
          user_id_1: chat?.user_id_1,
          user_type_1: selectedUser.value,
          user_id_2: userData.user_id,
        });

        if (res.status === 200 || res.status === 201) {
          sendMessage(e, res?.data?.data?._id);
        } else {
          showToast("error", res?.data.message);
        }
      } catch (error) {
        showToast("error", error.response?.data?.message || error.message);
      }
      // dispatch(setIsLoading(false));
    } else {
      sendMessage(e, chat?._id);
    }
  };

  useEffect(() => {
    if (!socket || !isConnected || isEmpty(chat?._id)) {
      return;
    }

    socket.emit("join-room", { room: chat?._id });
    const handleSocketConnected = (res) => {
      setPage(1);

      try {
        if (res.status === 200 || res.status === 201) {
          setMessage("");
          for (let i = 0; i < res.data.records.length; i++) {
            let item = res.data.records[i];
            if (item?.doc_path) {
              let fileExt =
                item?.doc_path.split(".")[item?.doc_path.split(".").length - 1];

              if (imgExtList.includes(fileExt.toLowerCase())) {
                item["loadFile"] = (
                  <Link href={convertMediaUrl(item?.doc_path)} target="_blank">
                    <div className="h-full w-full">
                      <CustomImage
                        src={convertMediaUrl(item?.doc_path)}
                        alt="user logo"
                        width={"100%"}
                        height={"100%"}
                        className="h-full w-full !object-cover"
                      />
                    </div>
                  </Link>
                );
              } else if (videoExtList.includes(fileExt.toLowerCase())) {
                item["loadFile"] = (
                  <Link href={convertVideoUrl(item?.doc_path)} target="_blank">
                    <div className="h-full w-full">
                      <CustomVideo
                        src={convertVideoUrl(item?.doc_path)}
                        controls
                        controlsList="nodownload noplaybackrate"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </Link>
                );
              }
            }
          }

          setItems([...res.data.records]);
          setHasMore(res.data.records.length >= limit);
        } else {
          showToast("error", res?.message);
        }
      } catch (error) {
        setHasMore(false);
        showToast("error", error?.response?.data?.message || error.message);
      }
    };

    socket.on("res_chat_messages_list", handleSocketConnected);

    return () => {
      socket.off("res_chat_messages_list");
      socket.emit("leave-room", { room: chat?._id });
    };
  }, [isConnected, socket, chat?._id, limit]);

  const onClickDownload = async (item) => {
    dispatch(setIsLoading(true));
    await download(
      convertMediaUrl(item?.doc_path),
      item?.doc_path?.split("/")[item?.doc_path?.split("/").length - 1],
    );
    dispatch(setIsLoading(false));
  };

  return (
    <>
      {chat && (
        <div className="col-span-12 mt-3 rounded-lg border border-primary-50 lg:col-span-8 lg:mt-0">
          <div className="bg-primary-200 p-2 sm:p-6">
            <div className="items-center justify-between gap-4 xs:flex">
              <h2 className="text-20-600">
                {userData?.user_id === chat?.user_id_1
                  ? chat?.user_2?.full_name
                  : userData?.user_id === chat?.user_id_2
                    ? chat?.user_1?.full_name
                    : chat?.user_1?.full_name}
              </h2>
              {userData?.user_id === chat?.user_id_1 &&
              chat?.user_type_2 === USER_TYPES.VENDOR ? (
                <p className="text-14-500 rounded-lg py-1 xs:bg-[#ddd] xs:px-2">
                  {chat?.user_2?.business_category_name}
                </p>
              ) : userData?.user_id === chat?.user_id_2 &&
                chat?.user_type_1 === USER_TYPES.VENDOR ? (
                <p className="text-14-500 rounded-lg py-1 xs:bg-[#ddd] xs:px-2">
                  {chat?.user_1?.business_category_name}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col items-start gap-1 sm:flex-row">
              {userData?.user_id === chat?.user_id_1 &&
              chat?.user_type_2 === USER_TYPES.VENDOR ? (
                <p className="text-14-500 text-primary-500">
                  {chat?.user_2?.company_name}
                </p>
              ) : userData?.user_id === chat?.user_id_2 &&
                chat?.user_type_1 === USER_TYPES.VENDOR ? (
                <p className="text-14-500 text-primary-500">
                  {chat?.user_1?.company_name}
                </p>
              ) : null}
            </div>
            {/* <div className="flex items-center gap-4">
              <h2 className="text-20-600">
                {userData?.user_id === chat?.user_id_1
                  ? chat?.user_2?.full_name
                  : userData?.user_id === chat?.user_id_2
                    ? chat?.user_1?.full_name
                    : chat?.user_1?.full_name}
              </h2>
              <p className="text-14-500 rounded-lg bg-orange-100 px-2 py-1">
                {userData?.user_id === chat?.user_id_1
                  ? chat?.user_2?.business_category_name
                  : userData?.user_id === chat?.user_id_2
                    ? chat?.user_1?.business_category_name
                    : chat?.user_1?.business_category_name}
              </p>
              <p className="text-14-500 rounded-lg bg-orange-100 px-2 py-1">
                {userData?.user_id === chat?.user_id_1
                  ? chat?.user_2?.plan?.plan_name
                  : userData?.user_id === chat?.user_id_2
                    ? chat?.user_2?.plan?.plan_name
                    : chat?.user_1?.plan?.plan_name}
              </p>
            </div>
            <div className="mt-1 flex flex-col items-start gap-1 sm:flex-row">
              <p className="text-14-500 text-primary-500">
                {userData?.user_id === chat?.user_id_1
                  ? chat?.user_2?.primary_email || chat?.user_2?.email
                  : userData?.user_id === chat?.user_id_2
                    ? chat?.user_1?.primary_email || chat?.user_1?.email
                    : chat?.user_1?.primary_email}{" "}
                |
              </p>
              <p className="text-14-700 text-primary-600">
                {userData?.user_id === chat?.user_id_1
                  ? chat?.user_2?.primary_contact || chat?.user_2?.contact
                  : userData?.user_id === chat?.user_id_2
                    ? chat?.user_1?.primary_contact || chat?.user_1?.contact
                    : chat?.user_1?.primary_contact}
              </p>
            </div> */}
          </div>
          <div className="my-2 flex min-h-[calc(100vh-450px)] flex-col justify-end px-1.5 xs:px-3 sm:my-2 sm:px-6">
            <div
              className="flex max-h-[35vh] min-h-[35vh] flex-col-reverse space-y-2 overflow-y-scroll lg:max-h-[52vh] lg:min-h-[52vh]"
              id="scrollable_chatbox"
            >
              <InfiniteScrollWrapper
                hasMore={hasMore}
                dataLength={items.length}
                callNext={callNext}
                parentDivId="scrollable_chatbox"
                className="flex flex-col-reverse"
                inverse={true}
              >
                {items.map((item) => (
                  <div
                    className={`my-4 flex gap-2 sm:gap-3 ${userData?.user_id === item?.sender_id ? "flex-row-reverse" : ""}`}
                    key={item?._id}
                  >
                    <CustomImage
                      src={
                        userData?.user_id === item?.sender_id
                          ? convertMediaUrl(userData?.logo)
                          : userData?.user_id === chat?.user_id_1 &&
                              !isEmpty(chat?.user_2?.logo)
                            ? convertMediaUrl(chat?.user_2?.logo?.doc_path)
                            : userData?.user_id === chat?.user_id_2 &&
                                !isEmpty(chat?.user_1?.logo)
                              ? convertMediaUrl(chat?.user_1?.logo?.doc_path)
                              : null
                      }
                      alt="user logo"
                      className="!size-6 !max-h-10 !min-h-6 !min-w-6 !max-w-10 !overflow-hidden !rounded-full !object-cover md:!size-10"
                    />
                    <div
                      className={`w-fit rounded-lg md:max-w-[70%] ${userData?.user_id === item?.sender_id ? "bg-blue-300 bg-opacity-10" : "bg-primary-200"} p-2`}
                    >
                      {!isEmpty(item?.doc_path) ? (
                        <div className="relative w-32 overflow-hidden rounded-md sm:w-64">
                          {!isEmpty(item?.loadFile) ? (
                            <div className="h-20 w-full sm:h-36">
                              {item?.loadFile}
                            </div>
                          ) : null}

                          <div className="flex w-full items-center justify-between gap-2 p-2">
                            <Tooltip
                              title={
                                item.doc_path.split("/")[
                                  item.doc_path.split("/").length - 1
                                ]
                              }
                              placement="bottom"
                            >
                              <p className="text-15-500 w-full overflow-hidden text-ellipsis whitespace-nowrap text-primary-800">
                                {item?.doc_path
                                  ? item.doc_path.split("/")[
                                      item.doc_path.split("/").length - 1
                                    ]
                                  : ""}
                              </p>
                            </Tooltip>
                            <Tooltip title="Download" placement="bottom">
                              <button
                                className="h-fit rounded-lg p-1 text-blue-300 sm:p-2"
                                onClick={() => onClickDownload(item)}
                              >
                                <DownloadIcon className="h-5 w-5" />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      ) : (
                        <p className="text-15-500 text-wrap text-primary-800">
                          {item?.message}
                        </p>
                      )}
                      <div
                        className={`text-12-600 flex flex-col items-end justify-end text-wrap text-primary-400 md:flex-row`}
                      >
                        <h2>
                          {item?.createdAt
                            ? moment(item.createdAt).format("DD MMM YYYY")
                            : ""}
                        </h2>
                        <h2 className={`hidden text-wrap md:block`}>
                          &nbsp;|&nbsp;
                        </h2>
                        <h2>
                          {item?.createdAt
                            ? moment(item.createdAt).format("hh:mm A")
                            : ""}
                        </h2>
                      </div>
                    </div>
                  </div>
                ))}
              </InfiniteScrollWrapper>
            </div>
            <div className="flex items-center gap-1 py-3 xs:gap-2 sm:flex-row sm:gap-4">
              <div className="flex gap-2">
                <button className="relative rounded-full hover:bg-primary-50">
                  <input
                    type="file"
                    name="file"
                    className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                    accept="*"
                    onChange={startChat}
                  />
                  <FileAddLight />
                </button>
                {/* <button className="rounded-full p-2 hover:bg-primary-50">
                  <SmileLight />
                </button> */}
              </div>
              <div
                className="flex w-full items-center gap-1 sm:gap-3"
                onKeyDown={(e) => {
                  if (e.key === "Enter") startChat(e);
                }}
              >
                <CustomInput
                  maxLength={500}
                  placeholder="Type your message here"
                  className="!mt-0 !h-3 !py-5 sm:!py-6"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <CustomButton
                  type="button"
                  className={`text-15-700 text-15-700 btn-fill-hover hidden h-fit w-[80px] overflow-hidden rounded-xl bg-blue-100 px-4 py-2.5 text-primary-100 disabled:cursor-not-allowed disabled:border-inherit xs:block sm:py-2.5`}
                  text="Send"
                  onClick={startChat}
                  disabled={isEmpty(message)}
                />
                <Button
                  type="button"
                  className={`btn-fill-hover !bg-blue-100 disabled:cursor-not-allowed disabled:border-inherit xs:!hidden`}
                  sx={{
                    width: "35px",
                    height: "35px",
                    minWidth: "unset",
                    borderRadius: "20%",
                  }}
                  onClick={startChat}
                  disabled={isEmpty(message)}
                >
                  <PlanIcon className="h-5 w-5 text-primary-100" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
