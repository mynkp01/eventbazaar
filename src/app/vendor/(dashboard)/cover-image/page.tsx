"use client";
import { apiHandler } from "@api/apiHandler";
import { CloseLight, UploadSimpleIcon } from "@assets/index";
import CustomImage from "@components/CustomImage";
import DeleteModal from "@components/DeleteModal";
import FetchStyledDropdown from "@components/FetchStyledDropdown";
import ImageCropperModal from "@components/ImageCropperModal";
import PageAction from "@components/PageAction";
import { setDeep } from "@components/SetDeep";
import { selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { convertMediaUrl, isEmpty, showToast } from "src/utils/helper";

const HeroBanner = () => {
  const dispatch = useAppDispatch();
  const itemRef = useRef(null);
  const userData = useSelector(selectUser);
  const [errors, setErrors] = useState<any>({});
  const [payload, setPayload] = useState({
    banner_style: "1",
    documents: {},
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const [bannerDeleteModal, setBannerDeleteModal] = useState(false);
  const [cropModal, setCropModal] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropSlotId, setCropSlotId] = useState(null);
  const [ratio, setRatio] = useState({
    initialAspectRatio: 1,
    aspectRatio: 2.66666667,
  });

  const heroBannerStyle = [
    { _id: "1", name: "Layout 1" },
    { _id: "2", name: "Layout 2" },
    { _id: "3", name: "Layout 3" },
    // { _id: "4", name: "Layout 4" },
  ];

  const handleDropdownChange = (key: string, newValue: any) => {
    setPayload((prevState) => {
      const newState = { ...prevState };
      if (newValue?._id === "1") {
        setRatio((prev) => ({ ...prev, aspectRatio: 2.66666667 }));
      } else {
        setRatio((prev) => ({ ...prev, aspectRatio: 1.77777778 }));
      }
      setDeep(newState, "banner_style", newValue?._id);
      setDeep(newState, "documents", {});
      return newState;
    });
    setErrors((prevState) => {
      const newState = { ...prevState };
      setDeep(newState, "banner_style", "");
      return newState;
    });
  };

  const onCropComplete = (croppedFile) => {
    croppedFile.previewImg = URL.createObjectURL(croppedFile);

    let files = { ...payload.documents };
    files[cropSlotId] = croppedFile;

    setPayload((prev) => ({
      ...prev,
      documents: files,
    }));

    setErrors((prevState) => {
      const newState = { ...prevState };
      setDeep(newState, "documents", "");
      return newState;
    });
  };

  const handleFileChange = (e, slotId, selectedFiles) => {
    e.preventDefault();

    if (selectedFiles.length > 0) {
      const newFile = selectedFiles[0];

      if (newFile.size > 1024 * 1024 * 100) {
        showToast("error", "File size can not exceed 100 MB");
        return;
      }

      if (!newFile?.type.includes("image".split("/")[0])) {
        showToast("error", `Supported format (IMAGE)`);
        return;
      }

      setCropModal(true);
      setCropSlotId(slotId);

      const reader = new FileReader();
      reader.onload = () => {
        setCropImage(reader.result);
      };
      reader.readAsDataURL(newFile);
    }
  };

  async function deleteFile({ item, index }) {
    try {
      if (payload?._id && item?._id) {
        try {
          dispatch(setIsLoading(true));
          const res = await apiHandler.heroBanner.deleteCover(
            payload._id,
            `_id=${item?._id}`,
          );

          if (res.status === 200 || res.status === 201) {
            showToast("success", res?.data.message);
            let files = { ...payload.documents };
            files[index] = null;
            setPayload((prev) => ({
              ...prev,
              documents: files,
            }));
          } else {
            showToast("error", res?.data.message);
          }
        } catch (error) {
          showToast("error", error.response?.data?.message || error.message);
        }
      } else {
        let files = { ...payload.documents };
        files[index] = null;
        setPayload((prev) => ({
          ...prev,
          documents: files,
        }));
      }
      itemRef.current = null;
      setDeleteModal(false);
    } catch (error) {}
    dispatch(setIsLoading(false));
  }

  async function deleteBanner() {
    try {
      if (payload?._id) {
        try {
          dispatch(setIsLoading(true));
          const res = await apiHandler.heroBanner.delete(payload._id);

          if (res.status === 200 || res.status === 201) {
            showToast("success", res?.data.message);
            setPayload({
              banner_style: "1",
              documents: {},
            });
          } else {
            showToast("error", res?.data.message);
          }
        } catch (error) {
          showToast("error", error.response?.data?.message || error.message);
        }
        dispatch(setIsLoading(false));
      }
      setBannerDeleteModal(false);
    } catch (error) {}
    dispatch(setIsLoading(false));
  }

  useEffect(() => {
    loadCovers();
  }, []);

  const loadCovers = async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.heroBanner.get(userData?.user_id);

      if (res.status === 200 || res.status === 201) {
        if (!isEmpty(res?.data?.data)) {
          setPayload(res?.data?.data);
        }
      } else {
        showToast("error", res?.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  const validateFields = (label: string, value: string) => {
    let error = "";

    switch (label) {
      case "banner_style":
        if (!value) error = "Please select banner type";
        break;
      case "documents":
        if (isEmpty(value) || !payload?.banner_style) {
          error = "Please select cover photo";
        } else if (payload?.banner_style === "1" && !value[0]) {
          error = "Please select all cover photo";
        } else if (payload?.banner_style === "2" && (!value[0] || !value[1])) {
          error = "Please select all cover photo";
        } else if (
          payload?.banner_style === "3" &&
          (!value[0] || !value[1] || !value[2])
        ) {
          error = "Please select all cover photo";
        } else if (
          payload?.banner_style === "4" &&
          (!value["0"] ||
            !value["1"] ||
            !value["2"] ||
            !value["3"] ||
            !value["4"] ||
            !value["5"])
        ) {
          error = "Please select all cover photo";
        }
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
        requiredFields = ["banner_style", "documents"];

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
        createOrUpdateBanner();
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
  };

  async function createOrUpdateBanner() {
    try {
      dispatch(setIsLoading(true));

      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({ vendor_id: userData?.user_id, ...payload }),
      );

      for (let [key, file] of Object.entries(payload.documents)) {
        formData.append(key, file);
      }

      const res = payload?._id
        ? await apiHandler.heroBanner.patch(payload?._id, formData)
        : await apiHandler.heroBanner.post(formData);

      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data?.message);
        loadCovers();
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error?.message);
    }
    dispatch(setIsLoading(false));
  }

  const renderUploadSlot = (slotId: number) => {
    const uploadedFile = payload?.documents?.[slotId];

    return (
      <div className={`flex h-full w-full items-center justify-center`}>
        {!isEmpty(uploadedFile) ? (
          <div className={`relative flex h-full w-full`}>
            <div
              className="w-full"
              onClick={() => {
                setCropImage(
                  uploadedFile?.doc_path
                    ? convertMediaUrl(uploadedFile?.doc_path)
                    : uploadedFile.previewImg,
                );
                setCropSlotId(slotId);
                setCropModal(true);
              }}
            >
              <CustomImage
                src={
                  uploadedFile?.doc_path
                    ? convertMediaUrl(uploadedFile?.doc_path)
                    : uploadedFile.previewImg
                }
                alt="Preview"
                height={"100%"}
                width={"100%"}
                className={`!rounded-md !object-cover`}
              />
            </div>
            <button
              onClick={() => {
                itemRef.current = { item: uploadedFile, index: slotId };
                setDeleteModal(true);
              }}
              className="absolute right-1 top-1 z-10 cursor-pointer rounded-lg bg-primary-100 p-1.5"
            >
              <CloseLight />
            </button>
          </div>
        ) : (
          <label
            htmlFor={"imageup" + slotId}
            className={`relative flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-primary-50 bg-primary-300 p-1 sm:p-2`}
          >
            <div
              className={`flex h-full w-full items-center justify-center rounded-md`}
              onDrop={(e) =>
                handleFileChange(
                  e,
                  slotId,
                  e?.dataTransfer?.files ? e.dataTransfer.files : [],
                )
              }
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                id={"imageup" + slotId}
                type="file"
                className="absolute left-0 top-0 h-full w-full opacity-0"
                hidden
                onChange={(e) =>
                  handleFileChange(
                    e,
                    slotId,
                    e?.target?.files ? e.target.files : [],
                  )
                }
                accept={"image/*"}
              />
              <div className="flex flex-col items-center justify-center">
                <UploadSimpleIcon className="text-primary-800" />
                <p className="text-15-600 text-primary-800">
                  Upload Image Here
                </p>
              </div>
            </div>
          </label>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="heading-40">Cover Image</h3>
      <div className="flex flex-col gap-6">
        <div className="rounded-lg bg-white p-3 sm:p-6">
          <p className="text-15-600 text-primary-800">Banner Types</p>
          <div className="my-4">
            <FetchStyledDropdown
              placeholder="Select Layout"
              func={handleDropdownChange}
              display="name"
              arr={heroBannerStyle}
              value={payload?.banner_style}
              isComponentDisabled={false}
              multiple={false}
            />
          </div>
          {errors.banner_style ? (
            <p className="error-text">{errors.banner_style}</p>
          ) : null}
        </div>
        <div className="rounded-lg bg-white p-3 sm:p-6">
          <div className="flex flex-col gap-6">
            {payload?.banner_style === "1" && (
              <>
                <p className="text-16-400 bg-primary-300 p-1 text-center text-primary-500 sm:p-3">
                  [1600 X 600] 16:6
                </p>
                <div className="flex !aspect-[48/18] w-full items-center justify-center overflow-hidden bg-primary-300">
                  {renderUploadSlot(0)}
                </div>
              </>
            )}

            {payload?.banner_style === "2" && (
              <div className="flex h-full w-full gap-2">
                <div className="flex h-full w-1/2 flex-col gap-2">
                  <p className="text-16-400 bg-primary-300 p-1 text-center text-primary-500 sm:p-3">
                    [800 X 450] 16:9
                  </p>
                  <div className="!aspect-[16/9] h-full w-full bg-primary-300">
                    {renderUploadSlot(0)}
                  </div>
                </div>
                <div className="flex h-full w-1/2 flex-col gap-2">
                  <p className="text-16-400 bg-primary-300 p-1 text-center text-primary-500 sm:p-3">
                    [800 X 450] 16:9
                  </p>
                  <div className="!aspect-[16/9] h-full w-full bg-primary-300">
                    {renderUploadSlot(1)}
                  </div>
                </div>
              </div>
            )}

            {payload?.banner_style === "3" && (
              <div className="flex h-full w-full gap-2">
                <div className="flex h-full w-2/3 flex-col gap-2">
                  <p className="text-16-400 bg-primary-300 p-1 text-center text-primary-500 sm:p-3">
                    [1067 X 600] 16:9
                  </p>
                  <div className="!aspect-[16/9] h-full w-full bg-primary-300">
                    {renderUploadSlot(0)}
                  </div>
                </div>
                <div className="flex h-full w-1/3 flex-col gap-2">
                  <p className="text-16-400 bg-primary-300 p-1 text-center text-primary-500 sm:p-3">
                    [533 X 300] 16:9
                  </p>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <div className="!aspect-[16/9] h-1/2 w-full bg-primary-300">
                      {renderUploadSlot(1)}
                    </div>
                    <div className="!aspect-[16/9] h-1/2 w-full !overflow-hidden bg-primary-300">
                      {renderUploadSlot(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {payload?.banner_style === "4" && (
              <div className="flex h-full w-full gap-2">
                <div className="flex h-full w-1/3 flex-col gap-2">
                  <p className="text-16-400 bg-primary-300 p-1 text-center text-primary-500 sm:p-3">
                    [533 X 300] 16:9
                  </p>
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
                  <p className="text-16-400 bg-primary-300 p-1 text-center text-primary-500 sm:p-3">
                    [533 X 300] 16:9
                  </p>
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
                  <p className="text-16-400 bg-primary-300 p-1 text-center text-primary-500 sm:p-3">
                    [533 X 300] 16:9
                  </p>
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

            {errors.documents ? (
              <p className="error-text">{errors.documents}</p>
            ) : null}
          </div>
          <div className="flex justify-between">
            <PageAction
              btnPrimaryLabel="Save"
              btnPrimaryFun={handleSubmit}
              btnPrimaryClassName="!py-2 sm:!w-fit !w-full !px-6 hover:!bg-primary-100 hover:!text-blue-100"
            />

            {payload?._id && (
              <PageAction
                btnSecondaryFun={() => setBannerDeleteModal(true)}
                btnSecondaryClassName="!border-red-300 !text-red-300 hover:!bg-red-300 hover:!text-primary-100"
                btnSecondaryLabel="Delete Banner"
              />
            )}
          </div>
        </div>
      </div>

      <ImageCropperModal
        cropModal={cropModal}
        setCropModal={setCropModal}
        onCropComplete={onCropComplete}
        cropImage={cropImage}
        ratio={ratio}
      />

      <DeleteModal
        open={deleteModal}
        setOpen={setDeleteModal}
        func={() => deleteFile(itemRef.current)}
      />

      <DeleteModal
        open={bannerDeleteModal}
        setOpen={setBannerDeleteModal}
        func={deleteBanner}
      />
    </div>
  );
};

export default HeroBanner;
