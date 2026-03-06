"use client";
import { apiHandler } from "@api/apiHandler";
import { CloseLight } from "@assets/index";
import CustomImage from "@components/CustomImage";
import CustomInput from "@components/CustomInput";
import DragAndDrop from "@components/DragAndDrop";
import FetchDropdown from "@components/FetchDropdown";
import InputImage from "@components/InputImage";
import LabelField from "@components/LabelField";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { PERMISSIONS } from "src/utils/Constant";
import {
  convertMediaUrl,
  generateValueCode,
  isEmpty,
  showToast,
} from "src/utils/helper";

const CKEditorComp = dynamic(() => import("@components/CKEditorComp"), {
  ssr: false,
});

interface FormData {
  business_sub_category_name: string;
  business_category_id: string;
  value_code: string;
  description?: string;
  status: boolean;
  doc_path: string;
  previewImg: string;
  vector_path: string;
  previewVectorImg: string;
  metaTitle: string;
  metaDescription: string;
  heroBanner: Array<{
    doc_link?: string;
    doc_path?: string;
    file?: File;
    _id?: string;
  }>;
}

const initialFormData: FormData = {
  business_sub_category_name: "",
  business_category_id: "",
  value_code: "",
  description: "",
  status: true,
  doc_path: "",
  previewImg: "",
  vector_path: "",
  previewVectorImg: "",
  metaTitle: "",
  metaDescription: "",
  heroBanner: [],
};

const Page = () => {
  const router = useRouter();
  // const permission = checkCurrentSelectedTabPermission();
  const searchParams = useSearchParams();
  const subCategoryId = searchParams.get("id");
  const isViewOnly = searchParams.get("view") === "1";
  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deletedBannerIds, setDeletedBannerIds] = useState<string[]>([]);
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

  const fetchSubCategoryDetails = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } =
        await apiHandler.businessSubCategory.get(subCategoryId);

      if (status === 200) {
        const subCategory = data.data;
        setFormData({
          business_sub_category_name:
            subCategory?.business_sub_category_name || "",
          value_code: subCategory?.value_code || "",
          business_category_id: subCategory?.business_category_id || "",
          status: subCategory?.status || false,
          description: subCategory?.description || "",
          doc_path: subCategory?.doc_path || "",
          previewImg: "",
          vector_path: subCategory?.vector_path || "",
          previewVectorImg: subCategory?.previewVectorImg || "",
          metaDescription: subCategory?.metaDescription || "",
          metaTitle: subCategory?.metaTitle || "",
          heroBanner: subCategory?.heroBanner || [],
        });
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
      dispatch(setIsLoading(false));
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch, subCategoryId]);

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
    if (subCategoryId) {
      setDeletedBannerIds([]);
      fetchSubCategoryDetails();
    }
  }, [subCategoryId, fetchSubCategoryDetails]);

  const validateFields = useCallback((name: string, value: string) => {
    let error = "";

    switch (name) {
      case "business_sub_category_name":
        if (!value.trim()) {
          error = "Please enter a sub category";
        } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error = "Please enter only letters and numbers in sub category";
        }
        break;
      case "value_code":
        if (isEmpty(value.trim())) error = "Please enter a value code";
        break;
      case "business_category_id":
        if (isEmpty(value.trim())) error = "Please select a business category";
        break;
      case "heroBanner":
        if (isEmpty(value)) error = "Please select or Drag and drop images";
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
        ...(name === "business_sub_category_name" && !subCategoryId
          ? { value_code: generateValueCode(value) }
          : {}),
      }));

      const error = validateFields(name, value);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [validateFields, subCategoryId],
  );

  const handleFetchDropdownChange = useCallback((name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value?._id || "" }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const handleFiles = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      field: string,
      previewField: string,
    ) => {
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

  const onBannerImagesSelected = useCallback((newFiles: File[]) => {
    setFormData((prev) => {
      const currentLength = prev.heroBanner.length;
      const allowedNewFiles = newFiles.slice(
        0,
        Math.max(0, 10 - currentLength),
      );

      if (currentLength + newFiles.length > 10) {
        showToast("error", "You can only upload up to 10 banner images");
      }

      const newBannerImages = allowedNewFiles.map((file) => ({
        file,
        doc_link: URL.createObjectURL(file),
      }));

      return {
        ...prev,
        heroBanner: [...prev.heroBanner, ...newBannerImages],
      };
    });

    setErrors((prev) => ({ ...prev, heroBanner: "" }));
  }, []);

  const removeBannerImage = useCallback((index: number) => {
    setFormData((prev) => {
      const bannerToRemove = prev.heroBanner[index];
      if (bannerToRemove.doc_path && bannerToRemove._id) {
        setDeletedBannerIds((prevIds) => [...prevIds, bannerToRemove._id!]);
      }
      return {
        ...prev,
        heroBanner: prev.heroBanner.filter((_, i) => i !== index),
      };
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isViewOnly) return;

    const newErrors: Record<string, string> = {};
    const requiredFields = [
      "business_sub_category_name",
      "business_category_id",
      "value_code",
      // "heroBanner",
    ];

    requiredFields.forEach((field) => {
      const error = validateFields(
        field,
        formData[field as keyof FormData] as string,
      );
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      dispatch(setIsLoading(true));
      const fd = new FormData();

      fd.append(
        "business_sub_category_name",
        formData.business_sub_category_name,
      );
      fd.append("value_code", formData.value_code);
      fd.append("description", formData.description);
      fd.append("business_category_id", formData.business_category_id);
      fd.append("metaDescription", formData.metaDescription);
      fd.append("metaTitle", formData.metaTitle);

      if (formData.doc_path) fd.append("doc_path", formData.doc_path);
      if (formData.vector_path) fd.append("vector_path", formData.vector_path);
      if (deletedBannerIds.length)
        fd.append("deletedHeroBanner", JSON.stringify(deletedBannerIds));

      formData.heroBanner.forEach((banner, index) => {
        if (banner.file) {
          fd.append("heroBanner", banner.file);
        } else if (banner.doc_link && banner.doc_path) {
          fd.append(
            `existingBanners[${index}]`,
            JSON.stringify({
              _id: banner._id,
              doc_path: banner.doc_path,
              doc_link: banner.doc_link,
            }),
          );
        }
      });

      const { data, status } = subCategoryId
        ? await apiHandler.businessSubCategory.patch(subCategoryId, fd)
        : await apiHandler.businessSubCategory.post(fd);

      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        // router.push(ROUTES.admin.businessSubCategory);
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
    dispatch,
    formData,
    deletedBannerIds,
    isViewOnly,
    router,
    subCategoryId,
    validateFields,
  ]);

  const pageTitle = useMemo(() => {
    if (subCategoryId) {
      return isViewOnly
        ? "View Business Sub Category"
        : "Edit Business Sub Category";
    }
    return "Add New Business Sub Category";
  }, [subCategoryId, isViewOnly]);

  return pagePermissions?.[PERMISSIONS.CREATE] ||
    pagePermissions?.[PERMISSIONS.UPDATE] ? (
    <div className="border-wh-300 flex flex-col items-center gap-4 rounded-2xl border bg-white">
      <div className="flex w-full flex-col gap-4 p-4 md:p-6">
        <h1 className="text-xl font-bold">{pageTitle}</h1>

        <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
          <div className="flex-1">
            <CustomInput
              label="Business Sub Category"
              name="business_sub_category_name"
              placeholder="Enter sub category name"
              value={formData.business_sub_category_name}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required
            />
            {errors.business_sub_category_name && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.business_sub_category_name}
              </p>
            )}
          </div>

          <div className="flex-1">
            <CustomInput
              label="Business Sub Category Value Code"
              name="value_code"
              toolTipText="This is an internal reference code that cannot be modified after creation. It is used for backend operations only and will not be displayed elsewhere."
              placeholder="Value code will be auto-generated"
              value={formData.value_code}
              onChange={handleInputChange}
              disabled={
                !isEmpty(subCategoryId) && !isEmpty(formData.value_code)
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
              placeholder="Select business category"
              label="Business Category"
              value={formData.business_category_id}
              endPoints={apiHandler.businessCategory.lookup}
              filterStr="NA"
              func={handleFetchDropdownChange}
              objKey="business_category_id"
              display="business_category_name"
              required
              isComponentDisabled={isViewOnly}
            />
            {errors.business_category_id && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.business_category_id}
              </p>
            )}
          </div>

          <div className="col-span-full flex-1">
            <LabelField
              labelText="Category Description"
              toolTipText="Category Description"
            />
            <CKEditorComp
              value={formData.description}
              onChange={(data) => {
                setFormData((prev) => ({ ...prev, description: data }));
              }}
              // maxChars={500}
            />
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

          <div className="col-span-full flex w-full flex-col gap-4">
            <div>
              <LabelField labelText="Banner Images (Up to 10)" required />
              {!isViewOnly && (
                <div className="mt-3 flex flex-col gap-4 sm:gap-5">
                  <div className="h-[20vh] md:h-[25vh] lg:h-[30vh] xl:h-[25vh]">
                    <DragAndDrop
                      onFilesSelected={onBannerImagesSelected}
                      multiple={true}
                      accept="image/*"
                      text="Add Banner Images"
                      text2="Or Drag and drop images here"
                      id="bannerImages"
                      ratio="1920 x 1080 (16:9)"
                    />
                    {errors?.heroBanner && (
                      <p className="error-text">{errors.heroBanner}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {!isEmpty(formData.heroBanner) && (
              <div className="flex flex-col gap-4 sm:gap-5">
                {formData.heroBanner.map((banner, index) => (
                  <div
                    key={index}
                    className="h-[20vh] md:h-[25vh] lg:h-[30vh] xl:h-[25vh]"
                  >
                    <div className="h-full overflow-hidden">
                      <div className="relative h-full w-full rounded-md border-primary-900 bg-primary-200">
                        {!isViewOnly && (
                          <button
                            onClick={() => removeBannerImage(index)}
                            className="absolute right-1 top-1 z-10 rounded-lg bg-primary-100 p-1.5"
                          >
                            <CloseLight />
                          </button>
                        )}
                        <CustomImage
                          src={
                            banner.doc_path
                              ? convertMediaUrl(banner.doc_path)
                              : banner.doc_link
                          }
                          alt={`Banner Image ${index + 1}`}
                          preview
                          height="100%"
                          width="100%"
                          className="!rounded-md !object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
          {!isViewOnly && (
            <button
              type="button"
              onClick={handleSubmit}
              className="shadow-outer h-fit w-fit rounded-xl border border-blue-100 bg-primary-100 p-1.5 text-blue-100 sm:px-3 sm:py-2.5"
            >
              {subCategoryId ? "Update" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Page;
