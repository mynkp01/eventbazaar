"use client";
import { apiHandler } from "@api/apiHandler";
import { CloseLight, PlanIcon, ThreeDots } from "@assets/index";
import CustomButton from "@components/CustomButton";
import CustomImage from "@components/CustomImage";
import CustomInput from "@components/CustomInput";
import FetchDropdown from "@components/FetchDropdown";
import InfiniteScrollWrapper from "@components/InfiniteScrollWrapper";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { selectUser } from "@redux/slices/authSlice";
import { selectLimit, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "src/hooks/UseSocket";
import { convertMediaUrl, isEmpty, showToast } from "src/utils/helper";

const B2BPage = () => {
  const router = useRouter();
  const { socket, isConnected, error } = useSocket();

  const dispatch = useAppDispatch();
  const limit = useSelector(selectLimit);
  const userData = useSelector(selectUser);

  const latestRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState({ value: "", visible: false });
  const [isSearched, setSearched] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement>(null);
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(0);
  const [matchedItems, setMatchedItems] = useState<number[]>([]);

  useEffect(() => {
    setSelectedCity(userData?.location);
  }, [userData?.location?._id]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const loadChats = async (currentPage, isSearchChat = false) => {
    const requestId = ++latestRef.current;
    try {
      const res = await apiHandler.b2bCommunity.list(
        `page=${currentPage}&vendor_id=${userData?.user_id}&search=${search.value}&location_id=${selectedCity?._id}`,
      );
      if (requestId === latestRef.current) {
        if (res.status === 200 || res.status === 201) {
          const responseData =
            currentPage === 1
              ? [...res.data.data.records]
              : [...items, ...res.data.data.records];
          setItems(responseData);
          setHasMore(res.data.data.records.length >= limit);
          setPage(currentPage);
          setMessage("");
          if (isSearchChat) {
            handleSearch(responseData, currentMatchIndex);
          }
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
  };

  // useEffect(() => {
  //   const ruleValue = userData?.price_rule?.rules?.find(
  //     (i) => i?.rule_code === PLAN_RULE.B2B_COMMUNITY,
  //   )?.value;

  //   if (ruleValue === true) {
  //     mainFunc();
  //   } else {
  //     showToast(
  //       "error",
  //       `Want to be part of the largest B2B community. Upgrade Now`,
  //     );
  //     router.push(ROUTES.vendor.dashboard);
  //   }
  // }, [selectedCity]);

  const mainFunc = async () => {
    if (!isEmpty(selectedCity?._id)) {
      setItems([]);
      setHasMore(true);
      loadChats(1);
    }
  };

  async function callNext() {
    const currentPage = page + 1;
    loadChats(currentPage, true);
  }

  useEffect(() => {
    if (!socket || !isConnected || isEmpty(selectedCity?._id)) return;

    socket.emit("join-room", { room: selectedCity?._id?.toLowerCase() });

    const handleSocketConnected = (res) => {
      setPage(1);
      try {
        if (res.status === 200 || res.status === 201) {
          setItems([...res.data.records]);
          setHasMore(res.data.records.length >= limit);
          setMessage("");
        } else {
          showToast("error", res?.message);
        }
      } catch (error) {
        setHasMore(false);
        showToast("error", error?.response?.data?.message || error.message);
      }
    };

    socket.on("res_b2b_list", handleSocketConnected);

    return () => {
      socket.off("res_b2b_list");
      socket.emit("leave-room", { room: selectedCity?._id?.toLowerCase() });
    };
  }, [isConnected, socket, selectedCity?._id, limit]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!socket || !isConnected || isEmpty(selectedCity?._id)) return;

    try {
      // dispatch(setIsLoading(true));
      const res = await apiHandler.b2bCommunity.post({
        message: message,
        vendor_id: userData?.user_id,
        location_id: selectedCity?._id,
      });

      if (res.status === 200 || res.status === 201) {
        socket.emit("req_b2b_list", {
          room: selectedCity?._id?.toLowerCase(),
          query: {
            vendor_id: userData?.user_id,
            page: 1,
            limit: 20,
            location_id: selectedCity?._id,
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

  const handleChangeSearch = (e) => {
    setSearch((prevState) => ({ ...prevState, value: e.target.value }));
    setSearched(false);
    setMatchedItems([]);
  };

  const highlightSearchText = (text: string, searchTerm: string, i: number) => {
    if (!searchTerm || !text) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));

    return parts.map((part, index) => {
      if (part.toLowerCase() === searchTerm.toLowerCase()) {
        return (
          <span
            key={index}
            className={`${matchedItems[currentMatchIndex] === i ? "bg-yellow-200" : ""} rounded-[3px] bg-yellow-100 font-medium`}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const handleSearch = (data = items, prevIndex = 0) => {
    if (isEmpty(search.value)) return;
    setSearched(true);
    const matches: number[] = [];

    data?.forEach((item, index) => {
      if (item?.message?.toLowerCase()?.includes(search.value.toLowerCase())) {
        matches.push(index);
      }
    });

    setMatchedItems(matches);
    setCurrentMatchIndex(prevIndex);

    if (!isEmpty(matches)) {
      const element = document.getElementById(`message-${matches[0]}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const navigateSearch = (direction: "prev" | "next") => {
    if (matchedItems.length === 0) return;

    let newIndex = currentMatchIndex;
    if (direction === "next") {
      newIndex = (currentMatchIndex + 1) % matchedItems.length;
    } else {
      newIndex = currentMatchIndex - 1;
      if (newIndex < 0) newIndex = matchedItems.length - 1;
    }

    setSearched(true);
    setCurrentMatchIndex(newIndex);

    const element = document.getElementById(
      `message-${matchedItems[newIndex]}`,
    );
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h3 className="heading-40">B2B Community</h3>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <p className="whitespace-nowrap text-xs font-medium md:text-sm">
            All Chat From:
          </p>
          <div className="flex min-w-52">
            <FetchDropdown
              placeholder="All Cities"
              value={selectedCity?._id}
              endPoints={apiHandler.values.cities}
              filterStr="NA"
              display="name"
              className="!w-full !border"
              containerClass="!mt-0"
              func={(name, value) => {
                socket.off("res_b2b_list");
                socket.emit("leave-room", {
                  room: selectedCity?._id?.toLowerCase(),
                });
                setSelectedCity(value);
              }}
              required
            />
          </div>
        </div>
      </div>

      {!isEmpty(selectedCity) ? (
        <div className="h-full rounded-md border bg-primary-100 p-3">
          <div className="flex min-h-[calc(100vh-450px)] flex-col justify-end rounded-lg border border-primary-50">
            <div className="flex items-center justify-between bg-primary-200 p-2 sm:p-5">
              <h2 className="text-20-600">Community All Chat</h2>
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
                      "& .MuiList-root": {
                        height: 40,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        p: "0px",
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
                  onClick={() => {
                    setSearch({ visible: !search.visible, value: "" });
                    inputRef.current?.focus();
                  }}
                  className="md:!text-md !text-center !text-sm"
                >
                  Search
                </MenuItem>
              </Menu>
            </div>
            {search.visible ? (
              <div
                className="flex w-full flex-col items-center justify-end gap-2 border-b p-2 md:flex-row"
                onKeyDown={(e) => {
                  if (e.shiftKey && e.key === "Enter") {
                    navigateSearch("prev");
                  } else if (e.key === "Enter") {
                    if (!search.value) return;
                    if (isSearched && matchedItems.length > 0) {
                      navigateSearch("next");
                    } else {
                      handleSearch();
                    }
                  }
                  if (e.key === "Escape") {
                    setSearch({ visible: false, value: "" });
                    setMatchedItems([]);
                    setCurrentMatchIndex(0);
                  }
                }}
              >
                <div className="relative flex w-full items-center">
                  <CustomInput
                    placeholder="Search"
                    className="md:!text-md !m-0 !w-full !rounded-none !text-sm"
                    autoFocus
                    ref={inputRef}
                    value={search.value}
                    onChange={handleChangeSearch}
                  />
                  {matchedItems.length > 0 && (
                    <span className="absolute right-2 text-xs text-gray-500">
                      {currentMatchIndex + 1}/{matchedItems.length}
                    </span>
                  )}
                </div>

                <div className="flex h-full !w-full items-center gap-2 sm:!w-auto md:gap-0">
                  {!isEmpty(matchedItems) ? (
                    <div className="flex gap-2">
                      <IconButton
                        onClick={() => navigateSearch("next")}
                        className="!min-h-8 !min-w-8"
                      >
                        <span className="text-lg">↑</span>
                      </IconButton>
                      <IconButton
                        onClick={() => navigateSearch("prev")}
                        className="!min-h-8 !min-w-8"
                      >
                        <span className="text-lg">↓</span>
                      </IconButton>
                    </div>
                  ) : null}

                  <CustomButton
                    text="Search"
                    disabled={isEmpty(search.value)}
                    onClick={() => handleSearch()}
                    className="text-15-700 btn-fill-hover !w-full !rounded-none !border-blue-100 bg-blue-100 px-4 py-2 text-primary-100 disabled:cursor-not-allowed disabled:!border-primary-400 disabled:bg-primary-400 sm:!w-auto md:!w-auto md:!min-w-[80px]"
                  />

                  <CustomButton
                    text="Cancel"
                    onClick={() => {
                      setSearch({ visible: false, value: "" });
                      setMatchedItems([]);
                      setCurrentMatchIndex(0);
                    }}
                    className="text-15-700 !flex !w-full !items-center !justify-center !rounded-none px-4 py-2 disabled:cursor-not-allowed disabled:bg-primary-400 sm:!w-auto md:!hidden md:w-[80px]"
                  />

                  <IconButton
                    onClick={() => {
                      setSearch({ visible: false, value: "" });
                      setMatchedItems([]);
                      setCurrentMatchIndex(0);
                    }}
                    className="!hidden !min-h-4 !min-w-4 md:!flex"
                  >
                    <CloseLight fill="#C5C5C5" className="size-full" />
                  </IconButton>
                </div>
              </div>
            ) : null}
            <div className="my-2 flex min-h-[calc(100vh-550px)] flex-col justify-end px-3 sm:px-6">
              <div
                className="flex max-h-[45vh] min-h-[45vh] flex-col-reverse space-y-2 overflow-y-scroll"
                id="scrollable_b2b_community"
              >
                <InfiniteScrollWrapper
                  hasMore={hasMore}
                  dataLength={items.length}
                  callNext={callNext}
                  parentDivId="scrollable_b2b_community"
                  className="flex flex-col-reverse"
                  inverse={true}
                >
                  {items.map((item, i) => (
                    <div
                      id={`message-${i}`}
                      className={`my-4 flex gap-2 sm:gap-3 ${userData?.user_id === item?.vendor_id ? "flex-row-reverse" : ""}`}
                      key={item?._id}
                    >
                      {/* {isEmpty(item?.vendor_logo?.doc_link) ? (
                      <EBLogoRounded className="!size-6 !max-h-10 !min-h-6 !min-w-6 !max-w-10 !rounded-full !object-cover md:!size-10" />
                    ) : ( */}
                      <CustomImage
                        src={convertMediaUrl(item?.vendor_logo?.doc_path)}
                        alt="user logo"
                        className="!size-6 !max-h-10 !min-h-6 !min-w-6 !max-w-10 !overflow-hidden !rounded-full !object-cover md:!size-10"
                      />
                      {/* )} */}
                      <div
                        className={`w-fit rounded-lg p-2 md:max-w-[70%] ${userData?.user_id === item?.vendor_id ? "bg-blue-300 bg-opacity-10" : "bg-primary-200"}`}
                      >
                        <h2
                          className={`text-15-600 flex text-primary-500 ${userData?.user_id === item?.vendor_id ? "justify-end" : ""}`}
                        >
                          {item?.vendor?.full_name}{" "}
                        </h2>
                        <p className="text-15-500 w-fit text-wrap text-primary-800">
                          {isSearched &&
                          search.visible &&
                          matchedItems.includes(i)
                            ? highlightSearchText(
                                item?.message,
                                search.value,
                                i,
                              )
                            : item?.message}
                        </p>
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
              <div className="flex flex-col items-center gap-2 py-3 sm:flex-row sm:gap-4">
                <div
                  className="flex w-full items-center gap-1 sm:gap-3"
                  onKeyDown={(e) => {
                    if (!isEmpty(message) && e.key === "Enter") sendMessage(e);
                  }}
                >
                  <CustomInput
                    maxLength={500}
                    placeholder="Type your message here"
                    className="!mt-0"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <CustomButton
                    type="button"
                    className="text-15-700 btn-fill-hover !hidden !w-full !rounded-xl !border-blue-100 bg-blue-100 px-4 py-2 text-primary-100 disabled:cursor-not-allowed disabled:!border-primary-400 disabled:bg-primary-400 sm:!flex sm:!w-auto md:!w-auto md:!min-w-[80px]"
                    text="Send"
                    disabled={isEmpty(message)}
                    onClick={sendMessage}
                  />
                  <button
                    type="button"
                    className="btn-fill-hover !flex !rounded-xl !border-blue-100 bg-blue-100 !p-2.5 text-primary-100 disabled:cursor-not-allowed disabled:!border-primary-400 disabled:bg-primary-400 sm:!hidden"
                    onClick={sendMessage}
                    disabled={isEmpty(message)}
                  >
                    <PlanIcon className="size-5 text-primary-100" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default B2BPage;
