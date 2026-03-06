"use client";
import { apiHandler } from "@api/apiHandler";
import CustomInput from "@components/CustomInput";
import FetchDropdown from "@components/FetchDropdown";
import InputImage from "@components/InputImage";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PERMISSIONS } from "src/utils/Constant";
import { generateValueCode, isEmpty, showToast } from "src/utils/helper";

interface FormData {
  event_type_name: string;
  value_code: string;
  event_vertical_id: string;
  doc_path: string;
  vector_path: string;
  previewImg: string;
  previewVector: string;
  metaDescription: string;
  metaTitle: string;
  status: boolean;
  business_sub_category_id: [];
}

const initialFormData: FormData = {
  event_type_name: "",
  value_code: "",
  event_vertical_id: "",
  doc_path: "",
  vector_path: "",
  previewImg: "",
  previewVector: "",
  metaDescription: "",
  metaTitle: "",
  status: true,
  business_sub_category_id: [],
};

const Page = () => {
  const router = useRouter();
  // const permission = checkCurrentSelectedTabPermission();
  const searchParams = useSearchParams();
  const eventTypeId = searchParams.get("id");
  const isViewOnly = searchParams.get("view") === "1";
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>(initialFormData);
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

  const fetchEventTypeDetails = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.eventType.get(eventTypeId);
      if (status === 200) {
        const eventType = data.data;
        setFormData({
          event_type_name: eventType.event_type_name || "",
          value_code: eventType.value_code || "",
          event_vertical_id: eventType.event_vertical_id?._id,
          doc_path: eventType.doc_path,
          vector_path: eventType.vector_path,
          previewImg: eventType.previewImg,
          previewVector: eventType.previewVector,
          metaDescription: eventType.metaDescription || "",
          metaTitle: eventType.metaTitle || "",
          status: eventType.status || false,
          business_sub_category_id: eventType.business_sub_category_id || [],
        });
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [eventTypeId, dispatch]);

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
    if (eventTypeId) {
      fetchEventTypeDetails();
    }
  }, [eventTypeId, fetchEventTypeDetails]);

  const validateFields = useCallback((name: string, value: string) => {
    const validations = {
      event_type_name: () => {
        if (isEmpty(value.trim())) return "Please enter an event type.";
        if (!/^[a-zA-Z0-9\s]+$/.test(value))
          return "Please enter only letters and numbers in event type";
        return "";
      },
      event_vertical_id: () =>
        isEmpty(value.trim()) ? "Please select an event vertical" : "",
      value_code: () =>
        isEmpty(value.trim()) ? "Please enter a value code" : "",
    };

    const error = validations[name]?.() || "";
    setErrors((prev) => ({ ...prev, [name]: error }));
    return { [name]: error };
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "event_type_name" && !eventTypeId
          ? { value_code: generateValueCode(value) }
          : {}),
      }));
      validateFields(name, value);
    },
    [validateFields, eventTypeId],
  );

  const handleFetchDropdownChange = useCallback((name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value?._id || "" }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleFetchMultiplaDropdownChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: Array.isArray(value)
        ? value.map((item) => item._id)
        : value?._id || "",
    }));

    setErrors((prevState) => {
      const newState = { ...prevState };
      newState[name] = "";
      return newState;
    });
  };

  const handleFiles = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
      const files = e.target.files;
      if (files?.[0]) {
        setFormData((prev) => ({
          ...prev,
          [field]: files[0],
          [field === "doc_path" ? "previewImg" : "previewVector"]:
            URL.createObjectURL(files[0]),
        }));
      }
    },
    [],
  );

  const removeImage = useCallback((field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: "",
      [field === "doc_path" ? "previewImg" : "previewVector"]: "",
    }));
  }, []);

  const handleSubmit = async () => {
    if (isViewOnly) return;

    const requiredFields = [
      "event_type_name",
      "value_code",
      "event_vertical_id",
    ];
    const newErrors = requiredFields.reduce(
      (acc, field) => ({
        ...acc,
        ...validateFields(field, formData[field]),
      }),
      {},
    );

    if (Object.keys(newErrors).filter((key) => newErrors[key]).length > 0) {
      setErrors(newErrors);
      return;
    }

    const fd = new FormData();
    fd.append("event_type_name", formData.event_type_name);
    fd.append("value_code", formData.value_code);
    fd.append("metaTitle", formData.metaTitle);
    fd.append("metaDescription", formData.metaDescription);
    fd.append("event_vertical_id", formData.event_vertical_id);
    fd.append("business_sub_category_id", formData.business_sub_category_id);
    if (formData.doc_path) fd.append("doc_path", formData.doc_path);
    if (formData.vector_path) fd.append("vector_path", formData.vector_path);

    try {
      dispatch(setIsLoading(true));
      const { data, status } = eventTypeId
        ? await apiHandler.eventType.patch(eventTypeId, fd)
        : await apiHandler.eventType.post(fd);

      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        // router.push(ROUTES.admin.eventType);
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
          {eventTypeId
            ? isViewOnly
              ? "View Event Type"
              : "Edit Event Type"
            : "Add New Event Type"}
        </h1>
        <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
          <div className="flex-1">
            <CustomInput
              label="Event Type"
              name="event_type_name"
              placeholder="Enter event type name"
              value={formData.event_type_name}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required
            />
            {errors.event_type_name && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.event_type_name}
              </p>
            )}
          </div>
          <div className="flex-1">
            <CustomInput
              label="Event Type Value Code"
              name="value_code"
              toolTipText="This is an internal reference code that cannot be modified after creation. It is used for backend operations only and will not be displayed elsewhere."
              placeholder="Value code will be auto-generated"
              value={formData.value_code}
              onChange={handleInputChange}
              disabled={!isEmpty(eventTypeId) && !isEmpty(formData.value_code)}
              required
            />
            {errors.value_code && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.value_code}
              </p>
            )}
          </div>
          <div className="flex-1">
            <CustomInput
              label="Meta Title"
              name="metaTitle"
              placeholder="Enter meta title"
              value={formData.metaTitle}
              onChange={handleInputChange}
              disabled={isViewOnly}
              isTextArea
            />
          </div>
          <div className="flex-1">
            <CustomInput
              label="Meta Description"
              name="metaDescription"
              placeholder="Enter meta description"
              value={formData.metaDescription}
              onChange={handleInputChange}
              disabled={isViewOnly}
              isTextArea
            />
          </div>
          <div className="col-span-full flex-1">
            <FetchDropdown
              placeholder="Select event vertical"
              label="Event Vertical"
              value={formData.event_vertical_id}
              endPoints={apiHandler.eventVertical.lookup}
              filterStr="NA"
              func={handleFetchDropdownChange}
              objKey="event_vertical_id"
              display="event_vertical_name"
              required
              isComponentDisabled={isViewOnly}
            />
            {errors.event_vertical_id && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.event_vertical_id}
              </p>
            )}
          </div>
          <div className="col-span-full flex-1">
            <FetchDropdown
              label="Business Sub Category"
              placeholder="Select business sub category"
              value={formData.business_sub_category_id}
              endPoints={apiHandler.businessSubCategory.lookup}
              filterStr="NA"
              multiple
              objKey="business_sub_category_id"
              display="business_sub_category_name"
              func={handleFetchMultiplaDropdownChange}
              required
            />
            {errors.business_sub_category_id && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.business_sub_category_id}
              </p>
            )}
          </div>
          <div className="flex-1">
            <InputImage
              labelText="Vector"
              placeholderText="Upload Vector"
              doc_path={formData.vector_path}
              previewImg={formData.previewVector}
              removeImage={() => removeImage("vector_path")}
              handleFiles={(e) => handleFiles(e, "vector_path")}
              isViewOnly={isViewOnly}
            />
          </div>
          <div className="flex-1">
            <InputImage
              labelText="Image"
              placeholderText="Upload Image"
              doc_path={formData.doc_path}
              previewImg={formData.previewImg}
              removeImage={() => removeImage("doc_path")}
              handleFiles={(e) => handleFiles(e, "doc_path")}
              isViewOnly={isViewOnly}
            />
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
          {!isViewOnly && (
            <button
              type="button"
              onClick={handleSubmit}
              className="shadow-outer h-fit w-fit rounded-xl border border-blue-100 bg-primary-100 p-1.5 text-blue-100 sm:px-3 sm:py-2.5"
            >
              {eventTypeId ? "Update" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Page;
