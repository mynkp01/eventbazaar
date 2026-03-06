"use client";
import { apiHandler } from "@api/apiHandler";
import { DownArrow } from "@assets/index";
import { selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty, showToast } from "src/utils/helper";

const EventVerticalAndTypes = () => {
  const userData = useSelector(selectUser);
  const dispatch = useAppDispatch();

  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [items, setItems] = useState([]);

  const getVerticalAndEvents = async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.vendor.vendorVerticalAndEvents(
        userData?.user_id,
      );
      if (res.status === 200 || res.status === 201) {
        setItems(res.data.data);
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    getVerticalAndEvents();
  }, []);

  return (
    <div className="m-2 flex flex-col sm:m-0">
      <div className="flex flex-shrink-0 flex-col justify-between sm:flex-row sm:items-center">
        <h3 className="heading-40 p-2">Services we provide</h3>
      </div>

      <div className="flex flex-col gap-5">
        {!isEmpty(items?.vertical_id) &&
          items.vertical_id.map((v, i) => (
            <div
              key={v?._id}
              className="text-14-600 rounded-xl border-2 border-primary-50 bg-primary-100 p-2.5 text-primary-800 sm:space-y-4 sm:p-5"
            >
              <div className="flex items-center justify-between">
                <p>Vertical Type</p>
                <div
                  onClick={() =>
                    setIsDropdownOpen((prev) => {
                      return prev === v._id ? null : v._id;
                    })
                  }
                  className={`${isDropdownOpen === v._id ? "" : "-rotate-90"} h-full cursor-pointer select-none text-primary-500 transition-transform duration-300 ease-in-out`}
                >
                  <DownArrow />
                </div>
              </div>
              {isDropdownOpen === v._id && (
                <div className="mt-2 flex flex-col gap-5">
                  <button className="flex w-full items-center justify-between gap-4 rounded-md border border-x-2 border-primary-50 p-2 text-[14px] text-primary-500">
                    {v?.event_vertical_name}{" "}
                  </button>
                  <div className="flex flex-col gap-3">
                    <label className="flex flex-col">Event Type</label>
                    <ul className="mx-10 grid list-disc grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {!isEmpty(items?.event_type_id) &&
                        items.event_type_id.map((n, index) => (
                          <>
                            {n?.event_vertical_id === v?._id && (
                              <li key={n._id} className="px-2 py-1">
                                {n?.event_type_name}
                              </li>
                            )}
                          </>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default EventVerticalAndTypes;
