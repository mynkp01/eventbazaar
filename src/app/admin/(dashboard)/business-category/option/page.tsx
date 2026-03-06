"use client";
import { apiHandler } from "@api/apiHandler";
import CustomInput from "@components/CustomInput";
import FetchDropdown from "@components/FetchDropdown";
import InputImage from "@components/InputImage";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PERMISSIONS, PLAN_RULE } from "src/utils/Constant";
import { generateValueCode, isEmpty, showToast } from "src/utils/helper";

interface FormData {
  business_category_name: string;
  value_code: string;
  grade_id: string;
  status: boolean;
  doc_path: string;
  previewImg: string;
  vector_path: string;
  previewVectorImg: string;
  metaTitle: string;
  metaDescription: string;
}

const initialFormData: FormData = {
  business_category_name: "",
  value_code: "",
  grade_id: "",
  status: true,
  doc_path: "",
  previewImg: "",
  vector_path: "",
  previewVectorImg: "",
  metaTitle: "",
  metaDescription: "",
};

const Page = () => {
  const router = useRouter();
  // const permission = checkCurrentSelectedTabPermission();
  const searchParams = useSearchParams();
  const businessCategoryId = searchParams.get("id");
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

  const fetchBusinessCategoryDetails = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } =
        await apiHandler.businessCategory.get(businessCategoryId);

      if (status === 200) {
        const businessCategory = data.data;
        setFormData((prev) => ({
          ...prev,
          business_category_name: businessCategory?.business_category_name,
          value_code: businessCategory?.value_code,
          grade_id: businessCategory?.grade_id?._id,
          status: businessCategory?.status ?? false,
          doc_path: businessCategory?.doc_path,
          previewImg: businessCategory?.previewImg,
          vector_path: businessCategory?.vector_path || "",
          previewVectorImg: businessCategory?.previewVectorImg || "",
          metaTitle: businessCategory?.metaTitle || "",
          metaDescription: businessCategory?.metaDescription || "",
        }));
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [businessCategoryId, dispatch]);

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
    if (businessCategoryId) {
      fetchBusinessCategoryDetails();
    }
  }, [businessCategoryId, fetchBusinessCategoryDetails]);

  const validateFields = useCallback((name: string, value: string) => {
    let error = "";

    switch (name) {
      case "business_category_name":
        if (isEmpty(value)) {
          error = "Please enter a business category";
        } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error = "Please enter only letters and numbers in business category";
        }
        break;
      case "value_code":
        if (isEmpty(value.trim())) error = "Please enter a value code";
        break;
      case "grade_id":
        if (isEmpty(value.trim())) error = "Please select a grade";
        break;
    }

    return error;
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "business_category_name" && !businessCategoryId
          ? { value_code: generateValueCode(value) }
          : {}),
      }));
      setErrors((prev) => ({
        ...prev,
        [name]: validateFields(name, value),
      }));
    },
    [validateFields, businessCategoryId],
  );

  const handleFetchDropdownChange = useCallback((name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value?._id || "" }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleFiles = useCallback(
    (e: ChangeEvent<HTMLInputElement>, field: string, previewField: string) => {
      const files = e.target.files;
      if (files?.[0]) {
        setFormData((prev) => ({
          ...prev,
          [field]: files[0],
          [previewField]: URL.createObjectURL(files[0]),
        }));
      }
    },
    [],
  );

  const removeImage = useCallback((field: string, previewField: string) => {
    setFormData((prev) => ({ ...prev, [field]: "", [previewField]: "" }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isViewOnly) return;

    const newErrors: Record<string, string> = {};
    const requiredFields = ["business_category_name", "value_code", "grade_id"];

    requiredFields.forEach((field) => {
      const error = validateFields(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const fd = new FormData();
    fd.append("business_category_name", formData.business_category_name);
    fd.append("value_code", formData.value_code);
    fd.append("grade_id", formData.grade_id);
    fd.append("metaDescription", formData.metaDescription);
    fd.append("metaTitle", formData.metaTitle);
    formData.doc_path && fd.append("doc_path", formData.doc_path);
    formData.vector_path && fd.append("vector_path", formData.vector_path);

    try {
      dispatch(setIsLoading(true));
      const { data, status } = businessCategoryId
        ? await apiHandler.businessCategory.patch(businessCategoryId, fd)
        : await apiHandler.businessCategory.post(fd);

      if ([200, 201].includes(status)) {
        showToast("success", data?.message);
        // router.push(ROUTES.admin.businessCategory);
        window.close();
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [
    isViewOnly,
    formData,
    validateFields,
    businessCategoryId,
    dispatch,
    router,
  ]);

  return pagePermissions?.[PERMISSIONS.CREATE] ||
    pagePermissions?.[PERMISSIONS.UPDATE] ? (
    <div className="border-wh-300 flex flex-col items-center gap-4 rounded-2xl border bg-white">
      <div className="flex w-full flex-col gap-4 p-4 md:p-6">
        <h1 className="text-xl font-bold">
          {businessCategoryId
            ? isViewOnly
              ? "View Business Category"
              : "Edit Business Category"
            : "Add New Business Category"}
        </h1>
        <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
          <div className="flex-1">
            <CustomInput
              label="Business Category"
              name="business_category_name"
              placeholder="Enter business category name"
              value={formData.business_category_name}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required
            />
            {errors.business_category_name && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.business_category_name}
              </p>
            )}
          </div>
          <div className="flex-1">
            <CustomInput
              label="Business Category Value Code"
              name="value_code"
              toolTipText="This is an internal reference code that cannot be modified after creation. It is used for backend operations only and will not be displayed elsewhere."
              placeholder="Value code will be auto-generated"
              value={formData.value_code}
              onChange={handleInputChange}
              disabled={
                !isEmpty(businessCategoryId) && !isEmpty(formData?.value_code)
              }
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
              label="Grade"
              placeholder="Select grade"
              containerClass="!mt-0"
              value={formData.grade_id}
              endPoints={apiHandler.values.lookup}
              filterStr={`value=${PLAN_RULE.VENDOR_GRADE}`}
              func={handleFetchDropdownChange}
              objKey="grade_id"
              display="name"
              required
              isComponentDisabled={isViewOnly}
            />
            {errors.grade_id && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.grade_id}
              </p>
            )}
          </div>
          <div className="flex-1">
            <InputImage
              labelText="Vector"
              placeholderText="Upload Vector"
              doc_path={formData.vector_path}
              previewImg={formData.previewVectorImg}
              removeImage={() => removeImage("vector_path", "previewVectorImg")}
              handleFiles={(e) =>
                handleFiles(e, "vector_path", "previewVectorImg")
              }
              isViewOnly={isViewOnly}
            />
          </div>
          <div className="flex-1">
            <InputImage
              labelText="Image"
              placeholderText="Upload Image"
              doc_path={formData.doc_path}
              previewImg={formData.previewImg}
              removeImage={() => removeImage("doc_path", "previewImg")}
              handleFiles={(e) => handleFiles(e, "doc_path", "previewImg")}
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
              {businessCategoryId ? "Update" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Page;
