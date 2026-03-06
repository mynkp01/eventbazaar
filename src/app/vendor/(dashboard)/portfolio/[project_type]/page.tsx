"use client";
import { apiHandler } from "@api/apiHandler";
import { CloseLight } from "@assets/index";
import CustomImage from "@components/CustomImage";
import CustomInput from "@components/CustomInput";
import DeleteModal from "@components/DeleteModal";
import DragAndDrop from "@components/DragAndDrop";
import InfoBox from "@components/InfoBox";
import LabelField from "@components/LabelField";
import PageAction from "@components/PageAction";
import { setDeep } from "@components/SetDeep";
import { selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import update from "immutability-helper";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";
import { projectTypeTabList } from "src/app/global";
import { ROUTES } from "src/utils/Constant";
import {
  convertMediaUrl,
  convertVideoUrl,
  isEmpty,
  showNotFoundPage,
  showToast,
} from "src/utils/helper";
import CustomVideo from "../../../../../components/CustomVideo";

const Card = ({ id, card, index, moveCard, deleteFile }) => {
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (!card.doc_path) {
      card.previewImg = URL.createObjectURL(card);
    }
  }, []);

  const cardRef = useRef(null);
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`col-span-12 h-[20vh] cursor-move sm:col-span-6 md:h-[25vh] lg:h-[30vh] xl:col-span-4 xl:h-[25vh] 2xl:col-span-3`}
      key={index}
    >
      <div className="h-full overflow-hidden">
        <div className="h-full border-primary-900 bg-primary-200">
          <div className="relative h-full w-full rounded-md border-primary-900 bg-primary-200">
            <p
              onClick={() => {
                cardRef.current = { item: card, index };
                setDeleteModal(true);
              }}
              className="absolute right-1 top-1 z-10 cursor-pointer rounded-lg bg-primary-100 p-1.5"
            >
              <CloseLight />
            </p>
            <CustomImage
              src={
                card?.doc_path
                  ? convertMediaUrl(card?.doc_path)
                  : card.previewImg
              }
              preview
              alt="Album Photos"
              height={"100%"}
              width={"100%"}
              className="!rounded-md !object-cover"
            />
          </div>
        </div>
      </div>

      <DeleteModal
        open={deleteModal}
        setOpen={setDeleteModal}
        func={async () => {
          await deleteFile(cardRef.current);
          setDeleteModal(false);
        }}
      />
    </div>
  );
};

const DraggableImages = forwardRef((props: any, ref) => {
  const { images, deleteFile } = props;
  const [cards, setCards] = useState([]);
  useImperativeHandle(ref, () => cards);

  useEffect(() => {
    setCards(images);
  }, [images]);

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      }),
    );
  }, []);

  const renderCard = useCallback(
    (card, index) => {
      return (
        <Card
          key={card?._id ? card._id : index}
          index={index}
          id={card?._id ? card._id : index}
          card={card}
          moveCard={moveCard}
          deleteFile={deleteFile}
        />
      );
    },
    [deleteFile, moveCard],
  );

  return <>{cards.map((card, i) => renderCard(card, i))}</>;
});
DraggableImages.displayName = "DraggableImages";

const ProjectsOption = () => {
  const { project_type } = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryParams = useSearchParams();
  const project_id = queryParams.get("id");
  const isUpdate = project_id ? true : false;
  const draggableImageRef = useRef(null);
  const itemRef = useRef(null);

  const userData = useSelector(selectUser);
  const [vendorProjects, setVendorProjects] = useState<any>({
    project_name: "",
    description: "",
  });
  const [projectType, setProjectType] = useState<any>(projectTypeTabList[0]);
  const [errors, setErrors] = useState<any>({});
  const [showNotFound, setShowNotFound] = useState(false);
  const [items, setItems] = useState([]);
  const [coverPhotoDeleteModal, setCoverPhotoDeleteModal] = useState(false);
  const [projectDeleteModal, setProjectDeleteModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemsCoverPhoto, setItemsCoverPhoto] = useState([]);
  const [files, setFiles] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState<any>([]);
  const [videoDeleteModal, setVideoDeleteModal] = useState(false);
  const [video, setVideo] = useState<any>([]);
  const [itemsVideo, setItemsVideo] = useState([]);

  useEffect(() => {
    let selectedProjectType = projectTypeTabList.filter(
      (item) =>
        item.key.toLowerCase() ===
        decodeURIComponent(project_type?.toLowerCase()),
    );

    if (selectedProjectType.length > 0) {
      setProjectType(projectTypeTabList[0]);
      if (project_id) loadProjects();
    } else {
      router.back();
    }
  }, []);

  async function loadProjects() {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.project.get(project_id);
      if (res.status === 200 || res.status === 201) {
        setVendorProjects(res.data.data);
        await loadProjectsDocs();
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      if (error?.error?.status === 404) setShowNotFound(true);
      else showToast("error", error?.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  }
  useEffect(() => {
    showNotFoundPage(showNotFound);
  }, [showNotFound]);

  async function loadProjectsDocs() {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.projectDoc.get(project_id);
      if (res.status === 200 || res.status === 201) {
        setItems(res.data.data.documents);
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

  const validateFields = (label: string, value: string) => {
    let error = "";

    switch (label) {
      case "project_name":
        if (!value.trim()) error = "Please enter album name";
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
        if (isEmpty(value)) error = "Please select or Drag and drop images";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [label]: error }));
    return { ...errors, [label]: error };
  };

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

  const handleSubmit = async () => {
    try {
      let newItems = [],
        newErrors = {};
      const updatedData = {
          ...vendorProjects,
          cover_photo:
            itemsCoverPhoto.length > 0 ? itemsCoverPhoto : coverPhoto,
          video: itemsVideo.length > 0 ? itemsVideo : video,
          files: [...files, ...items],
        },
        requiredFields = [
          "project_name",
          // "description",
          "cover_photo",
          "files",
          // "video",
        ];

      if (draggableImageRef.current) {
        newItems = await draggableImageRef.current.map((v, i) => {
          v.sort_order = i + 1;
          return v;
        });

        setItems(newItems.filter((v) => v?.doc_path));
        setFiles(newItems.filter((v) => !v?.doc_path));
      }

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

  async function createProjects() {
    try {
      dispatch(setIsLoading(true));

      const res = isUpdate
        ? await apiHandler.project.patch(project_id, {
            ...vendorProjects,
            vendor_id: userData.user_id,
          })
        : await apiHandler.project.post({
            ...vendorProjects,
            vendor_id: userData.user_id,
            project_type: projectType?.value,
          });
      if (res.status === 200 || res.status === 201) {
        dispatch(setIsLoading(false));
        await uploadProjectsDocs(project_id ? project_id : res.data.data._id);
      } else {
        dispatch(setIsLoading(false));
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      dispatch(setIsLoading(false));
      showToast("error", error?.response?.data?.message || error.message);
    }
  }

  async function uploadProjectsDocs(projectId) {
    try {
      dispatch(setIsLoading(true));

      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          project_id: projectId,
          documents: [...itemsCoverPhoto, ...items, ...itemsVideo],
        }),
      );

      if (coverPhoto.length > 0) formData.append(String(0), coverPhoto[0]);
      files.forEach((file, i) =>
        formData.append(
          String(file?.sort_order ? file.sort_order : items.length + i + 1),
          file,
        ),
      );
      if (video.length > 0) formData.append(String(files.length + 2), video[0]);

      const res = await apiHandler.projectDoc.post(formData);
      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data.message);
        router.push(ROUTES.vendor.portfolio);
      } else {
        showToast("error", res?.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  }

  async function deleteProject() {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.project.delete(project_id);
      if (res.status === 200 || res.status === 201) {
        router.push(ROUTES.vendor.portfolio);
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
    setProjectDeleteModal(false);
  }

  async function deleteFile({ item, index }) {
    if (item?._id) {
      try {
        dispatch(setIsLoading(true));
        const res = await apiHandler.projectDoc.delete(item._id);

        if (res.status === 200 || res.status === 201) {
          showToast("success", res?.data.message);
          await loadProjectsDocs();
        } else {
          showToast("error", res?.data.message);
        }
      } catch (error) {
        showToast("error", error.response?.data?.message || error.message);
      }
      dispatch(setIsLoading(false));
    } else {
      let newIndex = index > items.length ? index - items.length : index;
      setFiles((prevFiles) => prevFiles.filter((_, i) => i !== newIndex));
    }
    itemRef.current = null;
    setDeleteModal(false);
    setCoverPhotoDeleteModal(false);
    setVideoDeleteModal(false);
    dispatch(setIsLoading(false));
  }

  async function onFilesSelected(newFiles) {
    let oldFilesArr = [...items, ...files];
    let newFilesArr = [...newFiles];

    if (oldFilesArr.length + newFilesArr.length > 20) {
      let allowedFiles = 20 - oldFilesArr.length;
      newFilesArr = newFilesArr.slice(0, allowedFiles);

      showToast("error", "You can only upload 20 files");
    }

    setFiles((prev) => [...prev, ...newFilesArr]);

    setErrors((prevState) => {
      const newState = { ...prevState };
      setDeep(newState, "files", "");
      return newState;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="heading-40 text-black">Portfolio</h3>

      <div className="overflow-auto rounded-xl bg-primary-100 p-2 sm:p-6">
        <InfoBox
          text={
            "To build your portfolio, you can add thumbnail, 1 video, and up to 20 photos with a max size of 5 MB for images and 250 MB for video."
          }
        />

        <div className={`flex flex-col space-y-6`}>
          <div>
            <CustomInput
              placeholder={`Add album name here`}
              toolTipText={`Add your album name here`}
              label={"Album Name"}
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
              toolTipText={`Add thumbnail for your album here`}
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
                          itemsCoverPhoto?.[0]?.doc_path
                            ? convertMediaUrl(itemsCoverPhoto?.[0]?.doc_path)
                            : coverPhoto?.[0]?.previewImg
                        }
                        preview
                        alt="Thumbnail"
                        width="100%"
                        height="100%"
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

          <>
            <div className="border border-primary-50" />
            <div>
              <LabelField
                labelText={
                  "Add Video (Only One Video) (Recommendation :- Upload Event Highlight for better visibility)"
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
                          itemsVideo[0]?.doc_path
                            ? convertVideoUrl(itemsVideo[0].doc_path)
                            : video[0].previewImg
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
                        text={"Add Video"}
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
          </>

          <div className="border border-primary-50" />
          <div>
            <LabelField
              labelText={"Add Photos (Upto 20 Photos)"}
              toolTipText={
                "Drag and drop all photos here or Select photos to upload"
              }
            />
            <div className={`mt-3 grid grid-cols-12 gap-4 sm:gap-5`}>
              <>
                <div className="col-span-12 h-[20vh] sm:col-span-6 md:h-[25vh] lg:h-[30vh] xl:col-span-4 xl:h-[25vh] 2xl:col-span-3">
                  <DragAndDrop
                    onFilesSelected={onFilesSelected}
                    multiple={true}
                    accept={"image/*"}
                    text={"Add Photos"}
                    text2={"Or Drag and drop all photos here"}
                    id={"files"}
                    ratio="1920 x 1080 (16:9)"
                  />
                  {errors?.files ? (
                    <p className="error-text">{errors?.files}</p>
                  ) : null}
                </div>
                <DndProvider backend={HTML5Backend}>
                  <DraggableImages
                    images={[...items, ...files]}
                    loadProjectsDocs={loadProjectsDocs}
                    ref={draggableImageRef}
                    deleteFile={deleteFile}
                  />
                </DndProvider>
              </>
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

            {isUpdate && (
              <PageAction
                btnSecondaryFun={() => setProjectDeleteModal(true)}
                btnSecondaryClassName="!border-red-300 !text-red-300 hover:!bg-red-300 hover:!text-primary-100"
                btnSecondaryLabel="Delete Project"
              />
            )}
          </div>

          <DeleteModal
            open={deleteModal}
            setOpen={setDeleteModal}
            func={() => deleteFile(itemRef.current)}
          />

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
                ? deleteFile({ item: itemsCoverPhoto[0], index: 0 })
                : setCoverPhoto([]);
              setCoverPhotoDeleteModal(false);
            }}
          />
          <DeleteModal
            open={videoDeleteModal}
            setOpen={setVideoDeleteModal}
            func={() => {
              itemsVideo[0]?.doc_path
                ? deleteFile({ item: itemsVideo[0], index: 1 })
                : setVideo([]);
              setVideoDeleteModal(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectsOption;
