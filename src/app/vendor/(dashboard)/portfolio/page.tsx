"use client";
import { apiHandler } from "@api/apiHandler";
import {
  AlbumPhoto,
  CloseLight,
  PlusIcon,
  VideoRecorderLight,
} from "@assets/index";
import CustomImage from "@components/CustomImage";
import CustomInput from "@components/CustomInput";
import CustomVideo from "@components/CustomVideo";
import DeleteModal from "@components/DeleteModal";
import DragAndDrop from "@components/DragAndDrop";
import InfiniteScrollWrapper from "@components/InfiniteScrollWrapper";
import InfoBox from "@components/InfoBox";
import LabelField from "@components/LabelField";
import PageAction from "@components/PageAction";
import { setDeep } from "@components/SetDeep";
import { selectUser } from "@redux/slices/authSlice";
import {
  selectLimit,
  selectProjectType,
  setIsLoading,
  setProjectType,
} from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { projectTypeTabList } from "src/app/global";
import { PLAN_CODE, PLAN_RULE, PORTFOLIO, ROUTES } from "src/utils/Constant";
import {
  convertMediaUrl,
  convertVideoUrl,
  isEmpty,
  showToast,
} from "src/utils/helper";

export default function Projects() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const limit = useSelector(selectLimit);
  const selectedTab = useSelector(selectProjectType);
  const userData = useSelector(selectUser);
  const latestRef = useRef(0);
  const [errors, setErrors] = useState<any>({});
  const [vendorProjects, setVendorProjects] = useState<any>({
    project_name: "",
    description: "",
  });
  const [video, setVideo] = useState<any>([]);
  const [itemsVideo, setItemsVideo] = useState([]);
  const [videoDeleteModal, setVideoDeleteModal] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<any>([]);
  const [itemsCoverPhoto, setItemsCoverPhoto] = useState([]);
  const [coverPhotoDeleteModal, setCoverPhotoDeleteModal] = useState(false);
  const [projectDeleteModal, setProjectDeleteModal] = useState(false);

  const handleInputChange = (path: string, value: string) => {
    setVendorProjects((prevState) => {
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

  const validateFields = (label: string, value: string) => {
    let error = "";

    switch (label) {
      case "project_name":
        if (!value.trim()) error = "Please enter company video name";
        break;
      case "description":
        if (!value.trim()) error = "Please enter description";
        break;
      case "cover_photo":
        if (isEmpty(value)) error = "Please select thumbnail";
        break;
      case "video":
        if (isEmpty(value)) error = "Please select video";
        break;
      case "files":
        if (isEmpty(value))
          error = "Please select or Drag and drop company video";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [label]: error }));
    return { ...errors, [label]: error };
  };

  const handleSubmit = async () => {
    try {
      let newItems = [],
        newErrors = {};
      const updatedData = {
          ...vendorProjects,
          cover_photo:
            itemsCoverPhoto.length > 0 ? itemsCoverPhoto : coverPhoto,
          video: itemsVideo.length > 0 ? itemsVideo : video,
        },
        requiredFields = [
          "project_name",
          // "description",
          "cover_photo",
          "video",
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
        await createProjects();
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
  };

  async function deleteProject() {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.project.delete(vendorProjects?._id);
      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data?.message);
        mainFunc();
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
    setProjectDeleteModal(false);
  }

  async function createProjects() {
    try {
      dispatch(setIsLoading(true));

      const res = vendorProjects?._id
        ? await apiHandler.project.patch(vendorProjects?._id, {
            ...vendorProjects,
            vendor_id: userData.user_id,
          })
        : await apiHandler.project.post({
            ...vendorProjects,
            vendor_id: userData.user_id,
            project_type: selectedTab?.value,
          });
      if (res.status === 200 || res.status === 201) {
        dispatch(setIsLoading(false));
        await uploadProjectsDocs(
          vendorProjects?._id ? vendorProjects?._id : res.data.data._id,
        );
      } else {
        dispatch(setIsLoading(false));
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      dispatch(setIsLoading(false));
      showToast("error", error?.response?.data?.message || error.message);
    }
  }

  useEffect(() => {
    if (vendorProjects?._id) loadProjectsVideo();
  }, [vendorProjects]);

  async function loadProjectsVideo() {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.project.get(vendorProjects?._id);
      if (res.status === 200 || res.status === 201) {
        await loadProjectsDocs(res.data.data?._id);
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  }

  async function loadProjectsDocs(projectId) {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.projectDoc.get(projectId);
      if (res.status === 200 || res.status === 201) {
        setItemsCoverPhoto(res.data.data.coverPhoto);
        setItemsVideo(res.data.data.video);
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  }

  async function uploadProjectsDocs(projectId) {
    try {
      dispatch(setIsLoading(true));

      const documents = [
        ...itemsCoverPhoto.map((doc, index) => ({ ...doc, sort_order: 0 })),
        ...itemsVideo.map((doc, index) => ({
          ...doc,
          sort_order: itemsCoverPhoto.length + 1,
        })),
      ];

      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          project_id: projectId,
          documents: documents,
        }),
      );

      if (coverPhoto.length > 0) formData.append(String(0), coverPhoto[0]);
      if (video.length > 0) formData.append(String(1), video[0]);

      const res = await apiHandler.projectDoc.post(formData);
      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data.message);
        mainFunc();
      } else {
        showToast("error", res?.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  }

  async function deleteFile({ item }) {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.projectDoc.delete(item._id);

      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data.message);
        await loadProjectsDocs(vendorProjects?._id);
      } else {
        showToast("error", res?.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));

    setCoverPhotoDeleteModal(false);
    setVideoDeleteModal(false);
    dispatch(setIsLoading(false));
  }

  async function loadProjects(currentPage) {
    const requestId = ++latestRef.current;
    try {
      const res = await apiHandler.project.list(
        `value_code=${selectedTab.value}&page=${currentPage}&vendor_id=${userData?.user_id}`,
      );
      if (requestId === latestRef.current) {
        if (res.status === 200 || res.status === 201) {
          setItems(
            currentPage === 1
              ? res.data.data.records
              : [...items, ...res.data.data.records],
          );
          if (
            selectedTab.value === PORTFOLIO.PROJECT_SHOW_REEL &&
            !isEmpty(res.data.data.records)
          ) {
            setVendorProjects(res.data.data.records?.[0]);
          }
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

  async function mainFunc() {
    setErrors({});
    setVendorProjects({ project_name: "", description: "" });
    setVideo([]);
    setItemsVideo([]);
    setVideoDeleteModal(false);
    setProjectDeleteModal(false);
    setCoverPhotoDeleteModal(false);
    setItemsCoverPhoto([]);
    setCoverPhoto([]);
    setItems([]);
    setHasMore(true);
    setPage(1);
    loadProjects(1);
  }

  async function callNext() {
    const currentPage = page + 1;
    setPage(currentPage);
    loadProjects(currentPage);
  }

  useEffect(() => {
    mainFunc();
  }, [selectedTab]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="heading-40">Portfolio</h3>
      <div className="overflow-auto rounded-xl bg-primary-100 p-2 sm:p-6">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center justify-center rounded-full bg-gray-200 p-1">
            {projectTypeTabList.map((item) => (
              <button
                key={item.key}
                onClick={() => dispatch(setProjectType(item))}
                className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ease-in-out ${
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
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative flex items-center justify-center">
                  {item.value === PORTFOLIO.PROJECT_ALBUMS ? (
                    <AlbumPhoto className="mr-1 h-4 w-4" />
                  ) : (
                    <VideoRecorderLight className="mr-1 h-4 w-4" />
                  )}
                  {item.key}
                </span>
              </button>
            ))}
          </div>
        </div>

        {selectedTab.value === PORTFOLIO.PROJECT_ALBUMS ? (
          <div
            id="scrollable_project"
            className="max-h-[70vh] overflow-y-scroll"
          >
            <InfiniteScrollWrapper
              hasMore={hasMore}
              dataLength={items.length}
              callNext={callNext}
              parentDivId="scrollable_project"
            >
              <div className="grid grid-cols-12">
                <div className="col-span-12 mt-3 h-[20vh] p-4 sm:col-span-6 sm:mt-5 md:h-[25vh] lg:h-[30vh] xl:col-span-4 xl:h-[25vh] 2xl:col-span-3">
                  <div
                    className="flex h-full cursor-pointer items-center justify-center rounded-md border-4 border-dashed border-primary-900 bg-primary-200"
                    onClick={() => {
                      const ruleValue = userData?.price_rule?.rules?.find(
                        (i) => i?.rule_code === PLAN_RULE.PROJECT,
                      )?.value;

                      if (ruleValue === null || items.length < ruleValue) {
                        router.push(
                          `${ROUTES.vendor.portfolio}/${encodeURIComponent(selectedTab?.key?.toLowerCase())}`,
                        );
                      } else {
                        showToast(
                          "error",
                          `Please upgrade your plan for adding more albums`,
                        );
                      }
                    }}
                  >
                    <div className="flex items-center justify-center">
                      <PlusIcon className="text-primary-500" />
                      <p className="text-15-600 text-primary-800">Add Album</p>
                    </div>
                  </div>
                </div>

                {items.map((item, i) => (
                  <div
                    className="col-span-12 my-5 h-[20vh] cursor-pointer sm:col-span-6 md:h-[25vh] lg:h-[30vh] xl:col-span-4 xl:h-[25vh] 2xl:col-span-3"
                    key={item?._id}
                  >
                    <div className="h-full overflow-hidden p-4">
                      <div
                        className="h-full cursor-pointer border-primary-900 bg-primary-200"
                        onClick={() =>
                          router.push(
                            `${ROUTES.vendor.portfolio}/${encodeURIComponent(selectedTab?.key?.toLowerCase())}?id=${item._id}`,
                          )
                        }
                      >
                        <CustomImage
                          src={convertMediaUrl(
                            item?.projectDocuments?.find(
                              (v) => v?.cover_photo === true,
                            )?.doc_path,
                          )}
                          alt="Thumbnail"
                          width={"100%"}
                          height={"100%"}
                          className="!object-cover"
                        />
                      </div>
                    </div>
                    <div className="bottom-0 flex justify-between px-4">
                      <p className="text-15-600 text-wrap text-primary-800">
                        {item?.project_name}
                      </p>
                      <p className="text-15-600 text-primary-800">
                        {item?.no_of_doc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </InfiniteScrollWrapper>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="overflow-auto rounded-xl bg-primary-100 p-2 sm:p-6">
              {userData?.plan_code === PLAN_CODE.lite ? (
                <InfoBox
                  text={
                    "To build your portfolio, you can add thumbnail and company video with a max size of 5 MB for images and 250 MB for video."
                  }
                />
              ) : null}

              <div className={`flex flex-col space-y-6`}>
                <div>
                  <CustomInput
                    placeholder={`Add company video name here`}
                    toolTipText={`Add your company video name here`}
                    label={"Company Video Name"}
                    type="text"
                    value={vendorProjects.project_name}
                    onChange={(e) =>
                      handleInputChange("project_name", e.target.value)
                    }
                  />
                  {errors.project_name ? (
                    <p className="error-text">{errors.project_name}</p>
                  ) : null}
                </div>

                <div>
                  <LabelField
                    labelText="Thumbnail"
                    toolTipText={`Add thumbnail for your company video here`}
                  />
                  {!isEmpty(coverPhoto) || !isEmpty(itemsCoverPhoto) ? (
                    <div className="mt-3 grid grid-cols-12 gap-4 sm:gap-5">
                      <div
                        className={`col-span-12 h-[20vh] cursor-pointer sm:col-span-6 sm:mt-0 md:h-[25vh] lg:h-[30vh] xl:col-span-4 xl:h-[25vh] 2xl:col-span-3`}
                      >
                        <div className="h-full overflow-hidden">
                          <div className="relative h-full w-full cursor-pointer rounded-md border-primary-900 bg-primary-200">
                            <p
                              onClick={() => setCoverPhotoDeleteModal(true)}
                              className="absolute right-1 top-1 z-10 rounded-lg bg-primary-100 p-1.5"
                            >
                              <CloseLight />
                            </p>
                            <CustomImage
                              src={
                                itemsCoverPhoto[0]?.doc_path
                                  ? convertMediaUrl(itemsCoverPhoto[0].doc_path)
                                  : coverPhoto[0].previewImg
                              }
                              alt="Thumbnail"
                              width={"100%"}
                              height={"100%"}
                              className="!rounded-md !object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 grid grid-cols-12 gap-4 sm:gap-5">
                      <div className="col-span-12 h-[20vh] sm:col-span-6 md:h-[25vh] lg:h-[30vh] xl:col-span-4 xl:h-[25vh] 2xl:col-span-3">
                        <DragAndDrop
                          onFilesSelected={setCoverPhoto}
                          accept="image/*"
                          text="Add Thumbnail"
                          text2={"Or Drag and drop thumbnail here"}
                          ratio="1920 x 1080 (16:9)"
                          id={"coverPhoto"}
                        />
                        {errors.cover_photo ? (
                          <p className="error-text">{errors.cover_photo}</p>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border border-primary-50" />
                <div>
                  <LabelField
                    labelText={
                      "Add Company Video (Only One Video) (Recommendation :- Upload Event Highlight for better visibility)"
                    }
                    toolTipText={
                      "Drag and drop video here or Select video to upload"
                    }
                  />
                  <div className="mt-3 grid grid-cols-12 gap-4 sm:gap-5">
                    <div className="col-span-12 h-[20vh] sm:col-span-6 md:h-[25vh] lg:h-[30vh] xl:col-span-4 xl:h-[25vh] 2xl:col-span-3">
                      {video.length > 0 || itemsVideo.length > 0 ? (
                        <div className="relative h-full w-full cursor-pointer rounded-md border-primary-900 bg-primary-200">
                          <p
                            onClick={() => setVideoDeleteModal(true)}
                            className="absolute right-1 top-1 z-10 rounded-lg bg-primary-100 p-1.5"
                          >
                            <CloseLight />
                          </p>
                          <CustomVideo
                            src={
                              itemsVideo?.[0]?.doc_path
                                ? convertVideoUrl(itemsVideo?.[0]?.doc_path)
                                : video?.[0]?.previewImg
                            }
                            className="h-full w-full rounded-md object-cover"
                            controls
                          />
                        </div>
                      ) : (
                        <>
                          <DragAndDrop
                            onFilesSelected={setVideo}
                            multiple={false}
                            accept={"video/*"}
                            text={"Add Company Video"}
                            text2={"Or Drag and drop video here"}
                            id={"video"}
                            ratio="1920 x 1080 (16:9)"
                          />
                          {errors?.video ? (
                            <p className="error-text">{errors?.video}</p>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <PageAction
                    btnSecondaryFun={() => router.push(ROUTES.vendor.portfolio)}
                    btnSecondaryLabel="Cancel"
                    btnSecondaryClassName="hover:!bg-blue-100 hover:!text-primary-100 border-2"
                    btnPrimaryFun={handleSubmit}
                    btnPrimaryLabel="Save"
                    btnPrimaryClassName="hover:!bg-primary-100 hover:!text-blue-100"
                  />

                  {vendorProjects?._id ? (
                    <PageAction
                      btnSecondaryFun={() => setProjectDeleteModal(true)}
                      btnSecondaryClassName="!border-red-300 !text-red-300 hover:!bg-red-300 hover:!text-primary-100"
                      btnSecondaryLabel="Delete Project"
                    />
                  ) : null}
                </div>

                <DeleteModal
                  open={projectDeleteModal}
                  setOpen={setProjectDeleteModal}
                  func={deleteProject}
                />

                <DeleteModal
                  open={coverPhotoDeleteModal}
                  setOpen={setCoverPhotoDeleteModal}
                  func={() => {
                    itemsCoverPhoto[0]?.doc_path
                      ? deleteFile({ item: itemsCoverPhoto[0] })
                      : setCoverPhoto([]);
                    setCoverPhotoDeleteModal(false);
                  }}
                />
                <DeleteModal
                  open={videoDeleteModal}
                  setOpen={setVideoDeleteModal}
                  func={() => {
                    itemsVideo[0]?.doc_path
                      ? deleteFile({ item: itemsVideo[0] })
                      : setVideo([]);
                    setVideoDeleteModal(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
