"use client";
import { apiHandler } from "@api/apiHandler";
import CustomInput from "@components/CustomInput";
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
  event_vertical_name: string;
  value_code: string;
  vertical_path: string;
  vector_path: string;
  horizontal_path: string;
  vertical_previewImg: string;
  vector_previewImg: string;
  horizontal_previewImg: string;
  metaDescription: string;
  metaTitle: string;
  status: boolean;
}

const initialFormData: FormData = {
  event_vertical_name: "",
  value_code: "",
  vertical_path: "",
  vector_path: "",
  horizontal_path: "",
  vertical_previewImg: "",
  vector_previewImg: "",
  metaDescription: "",
  metaTitle: "",
  horizontal_previewImg: "",
  status: true,
};

const Page = () => {
  const router = useRouter();
  // const permission = checkCurrentSelectedTabPermission();
  const searchParams = useSearchParams();
  const eventVerticalId = searchParams.get("id");
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

  const fetchEventVerticalDetails = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } =
        await apiHandler.eventVertical.get(eventVerticalId);
      if (status === 200) {
        const eventVertical = data.data;
        setFormData({
          ...initialFormData,
          event_vertical_name: eventVertical.event_vertical_name || "",
          value_code: eventVertical.value_code || "",
          vertical_path: eventVertical.vertical_path || "",
          vector_path: eventVertical.vector_path || "",
          horizontal_path: eventVertical.horizontal_path || "",
          metaTitle: eventVertical.metaTitle || "",
          metaDescription: eventVertical.metaDescription || "",
          status: eventVertical.status || false,
        });
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [eventVerticalId, dispatch]);

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
    if (eventVerticalId) {
      fetchEventVerticalDetails();
    }
  }, [eventVerticalId, fetchEventVerticalDetails]);

  const validateFields = useCallback((name: string, value: string) => {
    let error = "";

    switch (name) {
      case "event_vertical_name":
        if (isEmpty(value.trim())) {
          error = "Please enter an event type.";
        } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error = "Please enter only letters and numbers in event type";
        }
        break;
      case "value_code":
        if (isEmpty(value.trim())) error = "Please enter a value code";
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return { [name]: error };
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "event_vertical_name" && !eventVerticalId
          ? { value_code: generateValueCode(value) }
          : {}),
      }));
      validateFields(name, value);
      setErrors((prev) => ({ ...prev, value_code: "" }));
    },
    [validateFields, eventVerticalId],
  );

  const handleFiles = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      fieldName: string,
      previewName: string,
    ) => {
      const files = e.target.files;
      if (files?.[0]) {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: files[0],
          [previewName]: URL.createObjectURL(files[0]),
        }));
      }
    },
    [],
  );

  const removeImage = useCallback((fieldName: string, previewName: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: "",
      [previewName]: "",
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isViewOnly) return;

    const requiredFields = ["event_vertical_name", "value_code"];
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
    fd.append("event_vertical_name", formData.event_vertical_name);
    fd.append("value_code", formData.value_code);
    fd.append("metaDescription", formData.metaDescription);
    fd.append("metaTitle", formData.metaTitle);

    ["vertical_path", "vector_path", "horizontal_path"].forEach((path) => {
      if (formData[path]) {
        fd.append(path, formData[path]);
      }
    });

    try {
      dispatch(setIsLoading(true));
      const { data, status } = eventVerticalId
        ? await apiHandler.eventVertical.patch(eventVerticalId, fd)
        : await apiHandler.eventVertical.post(fd);

      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        // router.push(ROUTES.admin.eventVertical);
        window.close();
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [formData, isViewOnly, eventVerticalId, validateFields, dispatch, router]);

  return pagePermissions?.[PERMISSIONS.CREATE] ||
    pagePermissions?.[PERMISSIONS.UPDATE] ? (
    <div className="border-wh-300 flex flex-col items-center gap-4 rounded-2xl border bg-white">
      <div className="flex w-full flex-col gap-4 p-4 md:p-6">
        <h1 className="text-xl font-bold">
          {eventVerticalId
            ? isViewOnly
              ? "View Event Vertical"
              : "Edit Event Vertical"
            : "Add New Event Vertical"}
        </h1>
        <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
          <div className="flex-1">
            <CustomInput
              label="Event Vertical Name"
              name="event_vertical_name"
              placeholder="Enter event vertical name"
              value={formData.event_vertical_name}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required
            />
            {errors.event_vertical_name && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.event_vertical_name}
              </p>
            )}
          </div>
          <div className="flex-1">
            <CustomInput
              label="Event Vertical Value Code"
              name="value_code"
              toolTipText="This is an internal reference code that cannot be modified after creation. It is used for backend operations only and will not be displayed elsewhere."
              placeholder="Value code will be auto-generated"
              value={formData.value_code}
              onChange={handleInputChange}
              disabled={
                !isEmpty(eventVerticalId) && !isEmpty(formData.value_code)
              }
              required
            />
            {errors.value_code && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.value_code}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
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
        </div>

        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <InputImage
              labelText="Vector"
              placeholderText="Upload Vector"
              doc_path={formData.vector_path}
              previewImg={formData.vector_previewImg}
              removeImage={() =>
                removeImage("vector_path", "vector_previewImg")
              }
              handleFiles={(e) =>
                handleFiles(e, "vector_path", "vector_previewImg")
              }
              isViewOnly={isViewOnly}
            />
          </div>
          <div className="flex-1">
            <InputImage
              labelText="Portrait Image"
              placeholderText="Upload Portrait Image"
              doc_path={formData.vertical_path}
              previewImg={formData.vertical_previewImg}
              removeImage={() =>
                removeImage("vertical_path", "vertical_previewImg")
              }
              handleFiles={(e) =>
                handleFiles(e, "vertical_path", "vertical_previewImg")
              }
              isViewOnly={isViewOnly}
            />
          </div>
          <div className="flex-1">
            <InputImage
              labelText="Landscape Image"
              placeholderText="Upload Landscape Image"
              doc_path={formData.horizontal_path}
              previewImg={formData.horizontal_previewImg}
              removeImage={() =>
                removeImage("horizontal_path", "horizontal_previewImg")
              }
              handleFiles={(e) =>
                handleFiles(e, "horizontal_path", "horizontal_previewImg")
              }
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
              {eventVerticalId ? "Update" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Page;
