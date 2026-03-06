"use client";
import { apiHandler } from "@api/apiHandler";
import CustomInput from "@components/CustomInput";
import LabelField from "@components/LabelField";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { Rate } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PERMISSIONS, ROUTES } from "src/utils/Constant";
import { isEmpty, showToast } from "src/utils/helper";

interface FormData {
  rating: number;
  title: string;
  full_name: string;
  description: string;
}

const initialFormData: FormData = {
  rating: 0,
  title: "",
  full_name: "",
  description: "",
};

const Page = () => {
  const router = useRouter();
  // const permission = checkCurrentSelectedTabPermission();
  const searchParams = useSearchParams();
  const reviewId = searchParams.get("id");
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

  const fetchReviewedDetails = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.webSiteReview.get(reviewId);

      if (status === 200) {
        const review = data.data;
        setFormData((prev) => ({
          ...prev,
          rating: review.rating || 0,
          title: review.title || "",
          full_name: review.full_name || "",
          description: review.description || "",
        }));
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [reviewId, dispatch]);

  useEffect(() => {
    if (pagePermissions !== null) {
      if (
        !pagePermissions?.[PERMISSIONS.CREATE] ||
        !pagePermissions?.[PERMISSIONS.UPDATE]
      ) {
        router.back();
      }
    }
  }, [permissions]);
  useEffect(() => {
    if (reviewId) {
      fetchReviewedDetails();
    }
  }, [reviewId, fetchReviewedDetails]);

  const validateFields = useCallback((name: string, value: string) => {
    let error = "";

    switch (name) {
      case "title":
        if (isEmpty(value)) {
          error = "Please enter a title";
        }
        // else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
        //   error = "Please enter only letters and numbers in business category";
        // }
        break;
      case "full_name":
        if (isEmpty(value.trim())) error = "Please enter a full name";
        break;
      case "rating":
        if (Number(value) == 0) error = "Please select rating";
        break;
      case "description":
        if (isEmpty(value.trim())) error = "Please select a description";
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
      }));
      setErrors((prev) => ({
        ...prev,
        [name]: validateFields(name, value),
      }));
    },
    [validateFields, reviewId],
  );

  const handleSubmit = useCallback(async () => {
    if (isViewOnly) return;

    const newErrors: Record<string, string> = {};
    const requiredFields = ["title", "full_name", "description", "rating"];

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

    try {
      dispatch(setIsLoading(true));
      const { data, status } = reviewId
        ? await apiHandler.webSiteReview.patch(reviewId, formData)
        : await apiHandler.webSiteReview.post(formData);

      if ([200, 201].includes(status)) {
        showToast("success", data?.message);
        router.push(ROUTES.admin.webSiteReview);
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [isViewOnly, formData, validateFields, reviewId, dispatch, router]);

  return pagePermissions?.[PERMISSIONS.CREATE] ||
    pagePermissions?.[PERMISSIONS.UPDATE] ? (
    <div className="border-wh-300 flex flex-col items-center gap-4 rounded-2xl border bg-white">
      <style>{`
       .custom-rate .ant-rate-star {
               font-size: 50px;  
        }
      `}</style>
      <div className="flex w-full flex-col gap-4 p-4 md:p-6">
        <h1 className="text-xl font-bold">
          {reviewId
            ? isViewOnly
              ? "View Web Review"
              : "Edit Web Review"
            : "Add New Web Review"}
        </h1>
        <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
          <div className="flex-1">
            <CustomInput
              label="Full Name"
              name="full_name"
              placeholder="Enter full name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
            />
            {errors.full_name && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.full_name}
              </p>
            )}
          </div>
          <div>
            <div className="flex-1">
              <CustomInput
                label="Title"
                name="title"
                placeholder="Enter title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              {errors.title && (
                <p className="error-text mt-1 text-sm text-red-500">
                  {errors.title}
                </p>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="flex-1">
            <CustomInput
              label="Description"
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required
              isTextArea
            />
            {errors.description && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.description}
              </p>
            )}
          </div>
        </div>
        <div className="h-full flex-1">
          <LabelField labelText={"Rating"} required />
          <div className="mt-2.5 flex flex-col justify-center">
            <Rate
              value={formData?.rating}
              className="text-[40px]"
              onChange={(e) =>
                handleInputChange({ target: { name: "rating", value: e } })
              }
            />
          </div>
          {errors.rating && (
            <p className="error-text mt-1 text-sm text-red-500">
              {errors.rating}
            </p>
          )}
        </div>
        <div className="mt-4 flex flex-row gap-4">
          <button
            type="button"
            onClick={() => router.push(ROUTES.admin.webSiteReview)}
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
              {reviewId ? "Update" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Page;
