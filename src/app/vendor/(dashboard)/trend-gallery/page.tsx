"use client";
import { apiHandler } from "@api/apiHandler";
import { CloseLight, CustomCheckBox, PlusIcon } from "@assets/index";
import CustomImage from "@components/CustomImage";
import CustomInput from "@components/CustomInput";
import CustomVideo from "@components/CustomVideo";
import DeleteModal from "@components/DeleteModal";
import FetchDropdown from "@components/FetchDropdown";
import InfiniteScrollWrapper from "@components/InfiniteScrollWrapper";
import InfoBox from "@components/InfoBox";
import LabelField from "@components/LabelField";
import PageAction from "@components/PageAction";
import { setDeep } from "@components/SetDeep";
import { Modal, Tooltip } from "@mui/material";
import { selectUser } from "@redux/slices/authSlice";
import { selectLimit, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LOOKUP_VALUES, PLAN_RULE, ROUTES } from "src/utils/Constant";
import {
  convertMediaUrl,
  isEmpty,
  showToast,
  StyledCheckbox,
} from "src/utils/helper";
import tailwindConfig from "tailwind.config";

const TrendGallery = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userData = useSelector(selectUser);

  const [items, setItems] = useState([]);
  const [reelCategories, setReelCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const limit = useSelector(selectLimit);
  const [openModal, setOpenModal] = useState(false);
  const [payload, setPayload] = useState({
    reel_name: "",
    description: "",
    category_id: [],
    doc_path: "",
    concent: false,
    thumbnail: null,
  });
  const [errors, setErrors] = useState<any>({});
  const [deleteVideoModal, setDeleteVideoModal] = useState(false);
  const [deleteImageModal, setDeleteImageModal] = useState(false);
  const [galleryDeleteModal, setGalleryDeleteModal] = useState(false);

  const handleFileChange = (e, selectedFiles, type: "image" | "video") => {
    e.preventDefault();

    if (selectedFiles.length > 0) {
      const newFile = selectedFiles[0];

      if (type === "image") {
        if (newFile.size > 1024 * 1024 * 5) {
          showToast("error", "File size can not exceed 5 MB");
          return;
        }

        if (!newFile?.type.includes("image".split("/")[0])) {
          showToast("error", `Supported format (IMAGE)`);
          return;
        }

        newFile.previewImg = URL.createObjectURL(newFile);

        setPayload((prev) => ({
          ...prev,
          thumbnail: newFile,
        }));
        setErrors((prevState) => {
          const newState = { ...prevState };
          setDeep(newState, "thumbnail", "");
          return newState;
        });
      } else {
        if (newFile.size > 1024 * 1024 * 250) {
          showToast("error", "File size can not exceed 250 MB");
          return;
        }

        if (!newFile?.type.includes("video".split("/")[0])) {
          showToast("error", `Supported format (VIDEO)`);
          return;
        }

        newFile.previewImg = URL.createObjectURL(newFile);

        setPayload((prev) => ({
          ...prev,
          doc_path: newFile,
        }));
        setErrors((prevState) => {
          const newState = { ...prevState };
          setDeep(newState, "doc_path", "");
          return newState;
        });
      }
    }
  };

  const validateFields = (label: string, value: string) => {
    let error = "";

    switch (label) {
      case "reel_name":
        if (!value) error = "Please enter title";
        break;
      case "description":
        if (!value) error = "Please enter description";
        break;
      case "category_id":
        if (isEmpty(value)) error = "Please select category";
        break;
      case "thumbnail":
        if (isEmpty(value)) error = "Please select thumbnail for trend reel";
        break;
      case "doc_path":
        if (isEmpty(value)) error = "Please select an trend reel video";
        break;
      case "concent":
        if (!value) error = "Please agree to sharing terms";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [label]: error }));
    return { ...errors, [label]: error };
  };

  const handleSubmit = async () => {
    try {
      let newErrors = {};
      const updatedData = { ...payload },
        requiredFields = [
          "reel_name",
          "description",
          "category_id",
          "concent",
          "doc_path",
          "thumbnail",
        ];

      requiredFields.forEach((field) => {
        const err = validateFields(field, updatedData[field]);
        if (err[field]) {
          newErrors[field] = err[field];
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);

        return;
      } else {
        createOrUpdateReel();
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
  };

  async function createOrUpdateReel() {
    try {
      dispatch(setIsLoading(true));

      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          vendor_id: userData?.user_id,
          ...payload,
        }),
      );

      formData.append("doc_path", payload.doc_path);
      formData.append("thumbnail", payload.thumbnail);

      const res = payload?._id
        ? await apiHandler.inspirationReels.patch(payload?._id, formData)
        : await apiHandler.inspirationReels.post(formData);

      if (res.status === 200 || res.status === 201) {
        loadReels(1);
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  }

  async function resetStates() {
    setPayload({
      reel_name: "",
      description: "",
      category_id: [],
      doc_path: "",
      concent: false,
      thumbnail: null,
    });
    setErrors({});
    setOpenModal(false);
  }

  useEffect(() => {
    // const ruleValue = userData?.price_rule?.rules?.find(
    //   (i) => i?.rule_code === PLAN_RULE.INSPIRATION_REEL,
    // )?.value;

    // if (ruleValue === 0) {
    //   showToast(
    //     "error",
    //     `Want to inspire your customers with work? Upgrade Now`,
    //   );
    //   router.push(ROUTES.vendor.dashboard);
    // } else {
    getReelCategories();
    mainFunc();
    // }
  }, []);

  async function mainFunc() {
    setItems([]);
    setHasMore(true);
    setPage(1);
    loadReels(1);
  }

  async function callNext() {
    const currentPage = page + 1;
    setPage(currentPage);
    loadReels(currentPage);
  }

  async function loadReels(currentPage) {
    try {
      resetStates();
      const res = await apiHandler.inspirationReels.list(
        `page=${currentPage}&vendor_id=${userData?.user_id}`,
      );
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
    } catch (error) {
      setHasMore(false);
      showToast("error", error?.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  }

  async function getReelCategories() {
    try {
      const res = await apiHandler.values.lookup(
        `value=${LOOKUP_VALUES.REEL_CATEGORY}`,
      );
      if (res.status === 200 || res.status === 201) {
        setReelCategories(res?.data?.data);
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  }

  async function deleteReel(id) {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.inspirationReels.delete(id);
      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data.message);
        loadReels(1);
        setGalleryDeleteModal(false);
      } else {
        showToast("error", res?.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  }

  const handleDropdownChangeCategories = (category: any, value: any) => {
    if (value?.length <= 1) {
      let categoriesArr = [];
      value.filter((v) => {
        let findIndex = categoriesArr.findIndex(
          (n) => n.toString() === v._id.toString(),
        );
        if (findIndex === -1) categoriesArr.push(v._id);
      });
      setErrors((errs) => ({ ...errs, category_id: "" }));
      setPayload((data) => ({ ...data, category_id: categoriesArr }));
    } else {
      showToast("error", "You can only  select 1 category");
    }
  };

  const handleInputChange = (path: string, value: string) => {
    setPayload((prevState) => {
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

  const onClickAddReel = async () => {
    const ruleValue = userData?.price_rule?.rules?.find(
      (i) => i?.rule_code === PLAN_RULE.INSPIRATION_REEL,
    )?.value;

    if (ruleValue === null || items.length < ruleValue) {
      await resetStates();
      setOpenModal(true);
    } else {
      showToast(
        "error",
        "Want to inspire your customers with your work. Upgrade Now",
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="heading-40">Add Trend Gallery (Reels)</h3>
      <div className="overflow-auto rounded-xl bg-primary-100 p-2 sm:p-6">
        <InfoBox
          text={`Categories for trend gallery: ${reelCategories.map((v) => v?.name).join(", ")}.`}
        />
        <div id="scrollable_reels" className="max-h-[70vh] overflow-y-scroll">
          <InfiniteScrollWrapper
            hasMore={hasMore}
            dataLength={items.length}
            callNext={callNext}
            parentDivId="scrollable_reels"
          >
            <div className="xxl:grid-cols-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <div className="h-96 cursor-pointer">
                <div
                  className="flex h-full cursor-pointer items-center justify-center rounded-md border-4 border-dashed border-primary-900 bg-primary-200"
                  onClick={onClickAddReel}
                >
                  <div className="flex items-center justify-center">
                    <PlusIcon
                      color={tailwindConfig.theme.extend.colors["primary"][500]}
                    />
                    <p className="text-15-600 text-primary-800">Add Reel</p>
                  </div>
                </div>
              </div>

              {items.map((item) => (
                <div
                  className="relative h-96 cursor-pointer"
                  key={item?._id}
                  onClick={() => {
                    setPayload(item);
                    setOpenModal(true);
                  }}
                >
                  <div className="flex h-full cursor-pointer items-center justify-center border-primary-900 bg-primary-200">
                    <CustomImage
                      src={convertMediaUrl(item?.thumbnail)}
                      className="!h-full !w-full !object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 z-10 flex h-10 w-full items-center justify-between gap-2 bg-white px-2">
                    <Tooltip title={item?.reel_name}>
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-primary-800">
                        {item?.reel_name}
                      </p>
                    </Tooltip>
                    <p className="text-nowrap rounded-lg border px-2 py-1 text-sm font-semibold text-primary-800">
                      {item?.category?.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </InfiniteScrollWrapper>
        </div>
      </div>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        className="flex h-full w-full items-center justify-center !p-6"
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="relative z-50 flex h-full max-h-fit w-full max-w-2xl flex-col overflow-y-auto rounded-xl bg-white shadow-lg">
          <div className="sticky top-0 z-50 flex items-center justify-between bg-white p-4 sm:p-6">
            <h3 className="text-xl font-semibold">
              {payload?._id ? "Update Reels" : "Add New Reels"}
            </h3>
            <button onClick={() => setOpenModal(false)}>
              <CloseLight className="h-3 w-3" fill={"#1A1D1F"} />
            </button>
          </div>
          <div className="flex flex-col gap-4 p-4 !pt-0 sm:p-6">
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <div className="flex flex-col items-center gap-6 xs:flex-row">
                <div>
                  <div className="relative h-64 w-full flex-col sm:h-96">
                    {payload?.thumbnail ? (
                      <div className="flex aspect-[9/16] h-full items-center justify-center overflow-hidden rounded-lg">
                        <CustomImage
                          src={
                            !isEmpty(payload?.thumbnail?.previewImg)
                              ? payload?.thumbnail?.previewImg
                              : convertMediaUrl(payload?.thumbnail)
                          }
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={() => setDeleteImageModal(true)}
                          className="absolute right-2 top-2 z-10 flex items-center rounded-lg bg-primary-100 p-1.5"
                        >
                          <CloseLight />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="inspiration-reel-thumbnail"
                        className={`flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-primary-50`}
                      >
                        <div
                          onDrop={(e) =>
                            handleFileChange(
                              e,
                              e?.dataTransfer?.files
                                ? e.dataTransfer.files
                                : [],
                              "image",
                            )
                          }
                          onDragOver={(e) => e.preventDefault()}
                          className="flex aspect-[9/16] h-full items-center justify-center rounded-lg border-4 border-dashed border-primary-900 bg-primary-300 p-4"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileChange(
                                  e,
                                  e?.target?.files ? e.target.files : [],
                                  "image",
                                )
                              }
                              className="hidden"
                              id="inspiration-reel-thumbnail"
                            />
                            <label
                              htmlFor="inspiration-reel-thumbnail"
                              className="cursor-pointer text-center text-[15px] font-semibold text-primary-800"
                            >
                              Drag your thumbnail image here, or
                              <span className="font-semibold text-blue-100">
                                {" "}
                                click to browse
                              </span>
                            </label>
                            <p className="text-center text-[14px] text-primary-600">
                              1080 x 1920 (9:16) recommended, up to 5 MB
                            </p>
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                  {errors.thumbnail ? (
                    <p className="error-text">{errors.thumbnail}</p>
                  ) : null}
                </div>

                <div>
                  <div className="relative h-64 w-full flex-col sm:h-96">
                    {payload?.doc_path ? (
                      <div className="flex aspect-[9/16] h-full items-center justify-center overflow-hidden rounded-lg">
                        <CustomVideo
                          src={
                            !isEmpty(payload?.doc_path?.previewImg)
                              ? payload?.doc_path?.previewImg
                              : convertMediaUrl(payload?.doc_path)
                          }
                          controls
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={() => setDeleteVideoModal(true)}
                          className="absolute right-2 top-2 z-10 flex items-center rounded-lg bg-primary-100 p-1.5"
                        >
                          <CloseLight />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="inspiration-reel"
                        className={`flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-primary-50`}
                      >
                        <div
                          onDrop={(e) =>
                            handleFileChange(
                              e,
                              e?.dataTransfer?.files
                                ? e.dataTransfer.files
                                : [],
                              "video",
                            )
                          }
                          onDragOver={(e) => e.preventDefault()}
                          className="flex aspect-[9/16] h-full items-center justify-center rounded-lg border-4 border-dashed border-primary-900 bg-primary-300 p-4"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) =>
                                handleFileChange(
                                  e,
                                  e?.target?.files ? e.target.files : [],
                                  "video",
                                )
                              }
                              className="hidden"
                              id="inspiration-reel"
                            />
                            <label
                              htmlFor="inspiration-reel"
                              className="cursor-pointer text-center text-[15px] font-semibold text-primary-800"
                            >
                              Drag your video here, or
                              <span className="font-semibold text-blue-100">
                                {" "}
                                click to browse
                              </span>
                            </label>
                            <p className="text-center text-[14px] text-primary-600">
                              1080 x 1920 (9:16) recommended, up to 250 MB
                            </p>
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                  {errors.doc_path ? (
                    <p className="error-text">{errors.doc_path}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex w-full flex-col gap-3">
                <div>
                  <LabelField
                    labelText="Select Category"
                    toolTipText="Select Category"
                    className="mb-1.5"
                  />
                  <FetchDropdown
                    placeholder="Select Category"
                    value={payload.category_id}
                    multiple
                    filterSelectedOptions
                    endPoints={apiHandler.values.lookup}
                    filterStr={`value=${LOOKUP_VALUES.REEL_CATEGORY}`}
                    display="name"
                    func={handleDropdownChangeCategories}
                    required
                  />
                  {errors.category_id ? (
                    <p className="error-text">{errors.category_id}</p>
                  ) : null}
                </div>
                <div>
                  <CustomInput
                    placeholder="Title goes here"
                    toolTipText="Title"
                    label="Title"
                    type="text"
                    value={payload.reel_name}
                    onChange={(e) =>
                      handleInputChange("reel_name", e.target.value)
                    }
                  />
                  {errors.reel_name ? (
                    <p className="error-text">{errors.reel_name}</p>
                  ) : null}
                </div>
                <div>
                  <CustomInput
                    placeholder="Description goes here..."
                    toolTipText="Description"
                    label="Description"
                    type="text"
                    value={payload.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                  {errors.description ? (
                    <p className="error-text">{errors.description}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <StyledCheckbox
                  id="privacy_policy"
                  icon={<CustomCheckBox className="h-5 w-5" />}
                  checkedIcon={<CustomCheckBox checked className="h-5 w-5" />}
                  checked={payload?.concent}
                  onChange={(e) => {
                    handleInputChange(
                      "concent",
                      payload?.concent ? false : true,
                    );
                  }}
                />
                <label
                  htmlFor="privacy_policy"
                  className="text-14-600 text-primary-800"
                >
                  I have read and agree to the{" "}
                  <Link
                    target="_blank"
                    className="text-green-400"
                    href={ROUTES.privacyPolicy}
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors?.concent ? (
                <p className="error-text">{errors?.concent}</p>
              ) : null}
            </div>

            <PageAction
              className="!mt-0"
              btnPrimaryClassName="w-full !mt-0 hover:!text-primary-100"
              btnPrimaryFun={handleSubmit}
              btnPrimaryLabel="Upload"
            />
            {payload?._id && (
              <PageAction
                className="!mt-0"
                btnSecondaryFun={() => setGalleryDeleteModal(true)}
                btnSecondaryClassName="!border-red-300 !text-red-300 hover:!bg-red-300 w-full hover:!text-primary-100"
                btnSecondaryLabel="Delete"
              />
            )}
          </div>
        </div>
      </Modal>

      <DeleteModal
        open={deleteImageModal}
        setOpen={setDeleteImageModal}
        func={() => {
          handleInputChange("thumbnail", null);
          setDeleteImageModal(false);
        }}
      />

      <DeleteModal
        open={deleteVideoModal}
        setOpen={setDeleteVideoModal}
        func={() => {
          handleInputChange("doc_path", "");
          setDeleteVideoModal(false);
        }}
      />

      <DeleteModal
        open={galleryDeleteModal}
        setOpen={setGalleryDeleteModal}
        func={() => deleteReel(payload?._id)}
      />
    </div>
  );
};

export default TrendGallery;
