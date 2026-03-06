import { apiHandler } from "@api/apiHandler";
import { DefaultVendorLogo } from "@assets/index";
import { Modal } from "@mui/material";
import { selectLimit, setChat } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { convertMediaUrl, isEmpty, showToast } from "src/utils/helper";
import CustomImage from "./CustomImage";
import InfiniteScrollWrapper from "./InfiniteScrollWrapper";
import SearchInputButton from "./SearchInputButton";

function NewChat({ open, setOpen, newChatSearch, setNewChatSearch }) {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const limit = useSelector(selectLimit);
  const latestRef = useRef(0);

  async function searchChats(currentPage) {
    const requestId = ++latestRef.current;
    try {
      const res = await apiHandler.chat.search(
        `page=${currentPage}&search=${newChatSearch}`,
      );
      if (requestId === latestRef.current) {
        if (res.status === 200 || res.status === 201) {
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
  }

  useEffect(() => {
    if (newChatSearch?.trim()?.length >= 2) {
      mainFunc();
    } else {
      setItems([]);
      setHasMore(false);
      setPage(1);
      // dispatch(setChat(null));
    }
  }, [newChatSearch]);

  async function mainFunc() {
    setItems([]);
    setHasMore(true);
    setPage(1);
    // dispatch(setChat(null));
    searchChats(1);
  }

  async function callNext() {
    const currentPage = page + 1;
    setPage(currentPage);
    searchChats(currentPage);
  }

  return (
    <Modal
      autoFocus={false}
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4">
        <div className="flex flex-col items-center justify-between">
          <SearchInputButton
            search={newChatSearch}
            setSearch={setNewChatSearch}
            searchMessage={"Search name here"}
            autoFocus={true}
          />

          <div
            className="my-1 max-h-[30vh] min-h-[30vh] w-full space-y-2 overflow-y-scroll px-1 sm:my-2 sm:px-2 lg:max-h-[59vh] lg:min-h-[59vh]"
            id="scrollable_inbox_search"
          >
            <InfiniteScrollWrapper
              hasMore={hasMore}
              dataLength={items.length}
              callNext={callNext}
              parentDivId="scrollable_inbox_search"
            >
              {items.map((item, i) => (
                <div
                  key={item?._id || i}
                  className={`my-1 flex gap-2.5 rounded-xl p-3 hover:bg-primary-50`}
                  onClick={() => {
                    dispatch(setChat(item));
                    setOpen(false);
                  }}
                >
                  <div className="h-12 w-12 flex-shrink-0">
                    <CustomImage
                      src={
                        !isEmpty(item?.user_1?.logo)
                          ? convertMediaUrl(item?.user_1?.logo?.doc_path)
                          : DefaultVendorLogo.src
                      }
                      alt="user logo"
                      className={`max-h-12 min-h-12 min-w-12 max-w-12 rounded-full object-cover`}
                    />
                  </div>
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <h2 className="text-15-700 truncate">
                        {item?.user_1?.full_name}
                      </h2>
                    </div>
                  </div>
                </div>
              ))}
            </InfiniteScrollWrapper>
            {items.length === 0 && (
              <p className="text-center">
                <strong>{`Search vendor's name`}</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default NewChat;
