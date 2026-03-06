"use client";
import { apiHandler } from "@api/apiHandler";
import { CloseLight } from "@assets/index";
import CustomInput from "@components/CustomInput";
import CustomSwitch from "@components/CustomSwitch";
import CustomVideo from "@components/CustomVideo";
import DragAndDrop from "@components/DragAndDrop";
import FetchDropdown from "@components/FetchDropdown";
import LabelField from "@components/LabelField";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PERMISSIONS } from "src/utils/Constant";
import { convertVideoUrl, isEmpty, showToast } from "src/utils/helper";

const Page = () => {
  const router = useRouter();
  // const permission = checkCurrentSelectedTabPermission();
  const queryParams = useSearchParams();
  const id = queryParams.get("id");
  const isViewOnly = queryParams.get("view") === "1";

  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    business_sub_category_ids: [],
    title: "",
    description: "",
    pin: false,
    doc_path: "",
    preview: "",
  });
  const [pagePermissions, setPagePermissions] = useState(null);
  const permissions = useSelector(selectPermissions);
  const pathname = usePathname();
  const sidebar = useSelector(selectAdminSideBar);
  useEffect(() => {
    setPagePermissions(
      permissions?.find(
        (n) =>
          n?.module?.value_code ===
          sidebar?.find((v) => pathname.includes(v?.path))?.value_code,
      )?.permissions,
    );
  }, [permissions]);

  useEffect(() => {
    if (pagePermissions !== null) {
      if (
        !pagePermissions?.[PERMISSIONS.CREATE] ||
        !pagePermissions?.[PERMISSIONS.UPDATE]
      ) {
        // router.back();
        window.close();
      }
    }
  }, [permissions]);

  useEffect(() => {
    if (!isEmpty(id)) {
      fetchEducationalData();
    }
  }, [id]);

  const fetchEducationalData = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.educationalVideo.get(id);
      if (status === 200 || status === 201) {
        setFormData((prev) => ({
          ...prev,
          business_sub_category_ids: data?.data?.business_sub_category_ids,
          title: data?.data?.title,
          description: data?.data?.description,
          pin: data?.data?.pin,
          doc_path: data?.data?.doc_path,
          business_sub_category_name: data?.data?.business_sub_category_name,
        }));
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const validateFields = (label: string, value: any) => {
    let error = "";

    switch (label) {
      case "business_sub_category_ids":
        if (isEmpty(value)) error = "Please select business sub categories";
        break;
      case "title":
        if (isEmpty(value.trim())) error = "Please enter title";
        break;
      case "description":
        if (isEmpty(value.trim())) error = "Please enter description";
        break;
      case "doc_path":
        if (isEmpty(value)) error = "Please select any video";
        break;
      default:
        break;
    }

    const errObj = { ...errors, [label]: error };
    setErrors(errObj);
    return errObj;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name !== "pin") {
      setErrors((prevState) => ({ ...prevState, [name]: "" }));
    }
  };

  const handleFetchDropdownChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: Array.isArray(value)
        ? value.map((item) => item._id)
        : value?._id || "",
      business_sub_category_name: Array.isArray(value)
        ? value.map((item) => item.business_sub_category_name)
        : value?.business_sub_category_name || "",
    }));

    setErrors((prevState) => ({ ...prevState, [name]: "" }));
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "business_sub_category_ids",
      "title",
      "description",
      "doc_path",
    ];
    let newErrors = {};

    const formDataToSend = new FormData();

    requiredFields.forEach((field) => {
      const value = formData[field];
      const err = validateFields(field, value);
      if (err[field]) {
        newErrors[field] = err[field];
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    formDataToSend.append("data", JSON.stringify(formData));
    formDataToSend.append("doc_path", formData?.doc_path);
    try {
      dispatch(setIsLoading(true));
      const { data, status } = !isEmpty(id)
        ? await apiHandler.educationalVideo.patch(id, formDataToSend)
        : await apiHandler.educationalVideo.post(formDataToSend);

      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        // router.push(ROUTES.admin.educationalVideo);
        window.close();
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return pagePermissions?.[PERMISSIONS.CREATE] ||
    pagePermissions?.[PERMISSIONS.UPDATE] ? (
    <div className="border-wh-300 flex flex-col items-center gap-4 rounded-2xl border bg-white">
      <div className="flex w-full flex-col gap-4 p-4 md:p-6">
        <h1 className="text-xl font-bold">
          {isViewOnly ? "View Educational Video" : "Edit Educational Video"}
        </h1>
        <div className="flex w-full flex-col gap-2.5">
          <div className="flex flex-col gap-2.5 md:flex-row">
            <div className="flex-1">
              <CustomInput
                label="Title"
                name="title"
                type="text"
                placeholder="Enter Title"
                value={formData?.title}
                onChange={handleInputChange}
                required
                disabled={isViewOnly}
              />
              {errors.title && (
                <p className="error-text mt-1 text-sm text-red-500">
                  {errors.title}
                </p>
              )}
            </div>
            <div className="flex-1">
              <LabelField
                labelText={"Want To Pin?"}
                toolTipText="Do you want to pin your video?"
              />
              <CustomSwitch
                selected={formData?.pin}
                setSelected={(value) =>
                  handleInputChange({ target: { name: "pin", value } })
                }
                disabled={isViewOnly}
              />
            </div>
          </div>
          <div className="flex-1">
            <FetchDropdown
              label="Select Business Sub Category"
              placeholder="Select Category"
              value={formData?.business_sub_category_ids}
              endPoints={apiHandler.businessSubCategory.lookup}
              filterStr="NA"
              multiple
              labelClass="!mb-2"
              objKey="business_sub_category_ids"
              display="business_sub_category_name"
              func={handleFetchDropdownChange}
              required
              isComponentDisabled={isViewOnly}
            />
            {errors.business_sub_category_ids && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.business_sub_category_ids}
              </p>
            )}
          </div>
          <div className="flex-1">
            <CustomInput
              label="Description"
              name="description"
              type="text"
              isTextArea
              placeholder="Enter Description"
              value={formData?.description}
              onChange={handleInputChange}
              required
              disabled={isViewOnly}
            />
            {errors.description && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.description}
              </p>
            )}
          </div>
          <div className="flex aspect-video h-auto max-h-80 w-full">
            {!isEmpty(formData?.doc_path) ? (
              <div className="relative cursor-pointer rounded-md border-primary-900 bg-primary-200">
                {isViewOnly ? null : (
                  <p
                    onClick={() =>
                      setFormData((prevData) => ({
                        ...prevData,
                        preview: "",
                        doc_path: "",
                      }))
                    }
                    className="absolute right-1 top-1 z-10 rounded-lg bg-primary-100 p-1.5"
                  >
                    <CloseLight />
                  </p>
                )}
                <CustomVideo
                  src={
                    !isEmpty(formData?.preview)
                      ? formData?.preview
                      : !isEmpty(formData?.doc_path)
                        ? convertVideoUrl(formData?.doc_path)
                        : ""
                  }
                  height="100%"
                  width="100%"
                  className="!aspect-video !h-full !w-full !rounded-md !object-cover"
                  controls
                />
              </div>
            ) : (
              <div className="flex flex-col">
                <DragAndDrop
                  onFilesSelected={(files) => {
                    if (!isEmpty(files)) {
                      setFormData((prevData) => ({
                        ...prevData,
                        doc_path: files[0],
                        preview: URL.createObjectURL(files[0]),
                      }));
                    }
                  }}
                  multiple={false}
                  accept={"video/*"}
                  text={"Add Video"}
                  text2={"Or Drag and drop video here"}
                  id={"video"}
                  className="!aspect-video !h-full"
                  ratio="1080 x 1920 (9:16)"
                />
                {errors?.doc_path && (
                  <p className="error-text">{errors.doc_path}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-row gap-4">
          <button
            type="button"
            onClick={() => window.close()}
            className="text-15-700 btn-fill-hover h-fit w-fit rounded-xl border-2 border-blue-100 bg-blue-100 p-1.5 text-primary-100 sm:px-3 sm:py-2.5"
          >
            Cancel
          </button>
          {isViewOnly ? null : (
            <button
              type="button"
              onClick={handleSubmit}
              className="shadow-outer h-fit w-fit rounded-xl border border-blue-100 bg-primary-100 p-1.5 text-blue-100 sm:px-3 sm:py-2.5"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Page;
