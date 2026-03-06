"use client";
import { apiHandler } from "@api/apiHandler";
import {
  DeleteIcon,
  EditIcon,
  NumberOfRooms,
  VenueCapacity,
  VenueSize,
  VenueType,
} from "@assets/index";
import CustomInput from "@components/CustomInput";
import DeleteModal from "@components/DeleteModal";
import FetchDropdown from "@components/FetchDropdown";
import InfiniteScrollWrapper from "@components/InfiniteScrollWrapper";
import PageAction from "@components/PageAction";
import { Tooltip } from "@mui/material";
import { selectUser } from "@redux/slices/authSlice";
import { selectLimit, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BUSINESS_CATEGORY, ROUTES } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

interface VenuesData {
  _id?: string;
  business_sub_category_id?: string;
  name?: string;
  size?: string;
  noOfPeople?: number | null;
  noOfRoom?: number | null;
}

const Venues = () => {
  const dispatch = useAppDispatch();
  const userData = useSelector(selectUser);
  const limit = useSelector(selectLimit);

  const router = useRouter();

  const latestRef = useRef(0);
  const faqRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<VenuesData>({
    business_sub_category_id: "",
    name: "",
    size: "",
    noOfPeople: null,
    noOfRoom: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (
      [
        BUSINESS_CATEGORY.EVENT_VENUE,
        BUSINESS_CATEGORY.HOTELS_RESORTS,
      ].includes(userData?.business_category_id?.value_code)
    ) {
    } else {
      showToast("error", "You are not allowed to access this page");
      router.push(ROUTES.vendor.dashboard);
    }
  }, [router, userData?.business_category_id?.value_code]);

  useEffect(() => {
    mainFunc();
  }, []);

  const loadData = async (currentPage) => {
    const requestId = ++latestRef.current;
    try {
      const { data, status } = await apiHandler.venue.list(
        `page=${currentPage}`,
      );
      if (requestId === latestRef.current) {
        if (status === 200 || status === 201) {
          setItems(
            currentPage === 1
              ? data.data?.records
              : [...items, ...data.data?.records],
          );
          setHasMore(data.data?.records.length >= limit);
        } else {
          showToast("error", data?.message);
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

  async function mainFunc() {
    setItems([]);
    setHasMore(true);
    setPage(1);
    loadData(1);
    faqRef.current = null;
  }

  async function callNext() {
    const currentPage = page + 1;
    setPage(currentPage);
    loadData(currentPage);
  }

  const handleDelete = async (id: string) => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.venue.delete(id);
      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data?.message);
        setOpenDeleteModal(false);
        mainFunc();
        faqRef.current = null;
      }
    } catch (error: any) {
      showToast("error", error?.response?.data?.message || error.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateFields = (
    label: string,
    value: string | number | null,
  ): string => {
    if (!value || (typeof value === "string" && !value.trim())) {
      switch (label) {
        case "business_sub_category_id":
          return "Please select sub category for venue";
        case "name":
          return "Please enter venue name";
        case "size":
          return "Please enter venue size";
        case "noOfPeople":
          return "Please enter venue capacity";
        case "noOfRoom":
          return "Please enter venue number of rooms";
        default:
          return "";
      }
    }
    return "";
  };

  const onClickSubmit = async () => {
    const newErrors: Record<string, string> = {};

    Object.entries(data).forEach(([field, value]) => {
      const error = validateFields(field, value);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      dispatch(setIsLoading(true));
      try {
        const { data: resData, status } = faqRef.current
          ? await apiHandler.venue.patch(data?._id, data)
          : await apiHandler.venue.post(data);

        if (status === 200 || status === 201) {
          showToast("success", resData?.message);
          setData({
            name: "",
            size: "",
            business_sub_category_id: "",
            noOfPeople: null,
            noOfRoom: null,
          });
          mainFunc();
        } else {
          showToast("error", resData?.message);
        }
      } catch (error: any) {
        showToast("error", error?.response?.data?.message || error.message);
      } finally {
        dispatch(setIsLoading(false));
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="heading-40">Venues</h3>

      <div className="flex w-full flex-col gap-4 rounded-xl bg-primary-100 p-4 sm:p-6">
        <div className="flex flex-col justify-center">
          <FetchDropdown
            endPoints={apiHandler.eventType.eventVenueLookup}
            label="Venue"
            placeholder="Venue"
            filterStr={`business_category_id=${userData?.business_category_id?._id}`}
            value={data?.business_sub_category_id}
            required
            labelClass="!mb-2.5"
            isComponentDisabled={
              faqRef.current
                ? false
                : userData?.business_category_id?.value_code ===
                    BUSINESS_CATEGORY.EVENT_VENUE && items.length > 0
            }
            textMenuSx={(customStyles) => ({
              ...customStyles,
              "& .MuiInputBase-root": {
                ...customStyles["& .MuiInputBase-root"],
                padding: "24px 16px !important",
                height: "20px !important",
              },
            })}
            display="name"
            containerClass="!mt-0"
            className="!p-0"
            objKey="business_sub_category_id"
            func={(label, value) => handleInputChange(label, value?._id)}
          />
          {errors?.business_sub_category_id ? (
            <p className="error-text">{errors?.business_sub_category_id}</p>
          ) : null}
        </div>
        <div className="rounded-md bg-primary-100">
          <CustomInput
            label="Venue Name"
            placeholder="Enter Venue Name"
            value={data?.name || ""}
            disabled={
              faqRef.current
                ? false
                : userData?.business_category_id?.value_code ===
                    BUSINESS_CATEGORY.EVENT_VENUE && items.length > 0
            }
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />
          {errors?.name && <p className="error-text">{errors?.name}</p>}
        </div>
        <div className="rounded-md bg-primary-100">
          <CustomInput
            type="number"
            label="Venue Size"
            placeholder="Enter Venue Size In Square Feet"
            value={data?.size || ""}
            disabled={
              faqRef.current
                ? false
                : userData?.business_category_id?.value_code ===
                    BUSINESS_CATEGORY.EVENT_VENUE && items.length > 0
            }
            onChange={(e) => handleInputChange("size", e.target.value)}
            required
            postfix="Sq Ft"
          />
          {errors?.size && <p className="error-text">{errors?.size}</p>}
        </div>
        <div className="rounded-md bg-primary-100">
          <CustomInput
            type="number"
            label="Capacity"
            placeholder="Enter Venue Capacity Of People"
            value={data?.noOfPeople || ""}
            disabled={
              faqRef.current
                ? false
                : userData?.business_category_id?.value_code ===
                    BUSINESS_CATEGORY.EVENT_VENUE && items.length > 0
            }
            onChange={(e) => handleInputChange("noOfPeople", e.target.value)}
            required
            prefix="Upto"
          />
          {errors?.noOfPeople && (
            <p className="error-text">{errors?.noOfPeople}</p>
          )}
        </div>
        <div className="rounded-md bg-primary-100">
          <CustomInput
            type="number"
            label="Number Of Rooms"
            placeholder="Enter Venue Number Of Rooms"
            value={data?.noOfRoom || ""}
            disabled={
              faqRef.current
                ? false
                : userData?.business_category_id?.value_code ===
                    BUSINESS_CATEGORY.EVENT_VENUE && items.length > 0
            }
            onChange={(e) => handleInputChange("noOfRoom", e.target.value)}
            required
          />
          {errors?.noOfRoom && <p className="error-text">{errors?.noOfRoom}</p>}
        </div>
        {(faqRef.current ||
          userData?.business_category_id?.value_code ===
            BUSINESS_CATEGORY.HOTELS_RESORTS ||
          (userData?.business_category_id?.value_code ===
            BUSINESS_CATEGORY.EVENT_VENUE &&
            !items?.length)) && (
          <div className="!mb-2 flex gap-5 sm:!mb-0">
            <PageAction
              className="!mt-2 w-full sm:!mt-8 sm:py-0"
              btnSecondaryLabel={`${faqRef.current ? "Update" : "Add"}`}
              btnSecondaryClassName="!py-2 sm:!w-fit !w-full !px-6 sm:!px-16 !border-blue-100 !bg-blue-100 !text-primary-100 hover:!bg-primary-100 hover:!text-blue-100"
              btnPrimaryFun={() =>
                setData({
                  business_sub_category_id: "",
                  name: "",
                  size: "",
                  noOfPeople: null,
                  noOfRoom: null,
                })
              }
              btnSecondaryFun={onClickSubmit}
            />
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="overflow-y-auto rounded-lg" id="scrollable_faq">
            <InfiniteScrollWrapper
              hasMore={hasMore}
              dataLength={items.length}
              callNext={callNext}
              parentDivId="scrollable_faq"
            >
              <div className="grid w-full grid-cols-1 gap-4 pb-4 xl:grid-cols-2">
                {items.map((item) => (
                  <div
                    key={item?._id}
                    className="rounded-lg bg-primary-100 py-4 text-black-50 shadow-md transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-2 px-4">
                        <h3 className="truncate text-lg font-medium md:text-xl">
                          {item?.name}
                        </h3>

                        <div className="flex">
                          <Tooltip title="Edit" placement="top">
                            <button
                              className="rounded-full p-2 text-blue-300 transition-colors hover:bg-blue-50"
                              onClick={() => {
                                faqRef.current = item;
                                setData(item);
                              }}
                            >
                              <EditIcon className="h-4 w-4" />
                            </button>
                          </Tooltip>
                          <Tooltip title="Delete" placement="top">
                            <button
                              className="rounded-full p-2 text-red-300 transition-colors hover:bg-red-50"
                              onClick={() => {
                                faqRef.current = item;
                                setOpenDeleteModal(true);
                              }}
                            >
                              <DeleteIcon className="h-5 w-5" />
                            </button>
                          </Tooltip>
                        </div>
                      </div>

                      <hr />

                      <div className="grid grid-cols-1 gap-2 text-xs font-light xs:grid-cols-2 md:grid-cols-4 md:text-sm xl:grid-cols-2 2xl:grid-cols-4">
                        <div className="flex w-full items-start gap-3 px-4 even:border-r-0 xs:border-r md:border-r md:last:border-r-0 md:even:border-r">
                          <VenueType className="size-5 min-h-5 min-w-5 md:size-6" />
                          <div className="flex flex-col gap-2.5">
                            <p className="font-medium">Venue Type</p>
                            <p>{item?.business_sub_category_name}</p>
                          </div>
                        </div>

                        <div className="flex w-full items-start gap-3 px-4 even:border-r-0 xs:border-r md:border-r md:last:border-r-0 md:even:border-r">
                          <NumberOfRooms className="size-5 min-h-5 min-w-5 md:size-6" />
                          <div className="flex flex-col gap-2.5">
                            <p className="font-medium">No. of Rooms</p>
                            <p>{item?.noOfRoom}</p>
                          </div>
                        </div>

                        <div className="flex w-full items-start gap-3 px-4 even:border-r-0 xs:border-r md:border-r md:last:border-r-0 md:even:border-r">
                          <VenueCapacity className="size-5 min-h-5 min-w-5 md:size-6" />
                          <div className="flex flex-col gap-2.5">
                            <p className="font-medium">Venue Capacity</p>
                            <p>{item?.noOfPeople}</p>
                          </div>
                        </div>

                        <div className="flex w-full items-start gap-3 px-4">
                          <VenueSize className="size-5 min-h-5 min-w-5 md:size-6" />
                          <div className="flex flex-col gap-2.5">
                            <p className="font-medium">Venue Size</p>
                            <p>{item?.size} Sq Ft</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </InfiniteScrollWrapper>
          </div>
        </div>
      )}
      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        func={() => handleDelete(faqRef.current?._id)}
      />
    </div>
  );
};

export default Venues;
