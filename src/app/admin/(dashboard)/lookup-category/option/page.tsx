"use client";
import { apiHandler } from "@api/apiHandler";
import CustomInput from "@components/CustomInput";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PERMISSIONS } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

const Page = () => {
  const router = useRouter();
  // const permission = checkCurrentSelectedTabPermission();
  const searchParams = useSearchParams();
  const categoriesId = searchParams.get("id");
  const isViewOnly = searchParams.get("view") === "1";
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const [formData, setFormData] = useState({
    name: "",
    category_code: "",
  });

  const fetchCategoryDetails = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.category.get(categoriesId);
      if (status === 200) {
        const category = data?.data;
        setFormData({
          name: category.name || "",
          category_code: category.category_code || "",
        });
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

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
    if (categoriesId) {
      fetchCategoryDetails();
    }
  }, [categoriesId]);

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Please enter a category name.";
        } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error = "Please enter only letters and numbers in category name";
        }
        break;
      case "category_code":
        if (!value.trim()) error = " Please enter a category code.";
        break;
      default:
        break;
    }

    const errObj = { ...errors, [name]: error };
    setErrors(errObj);
    return errObj;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async () => {
    if (isViewOnly) return;
    let newErrors = {};
    const requiredFields = ["name", "category_code"];

    requiredFields.forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err[field]) {
        newErrors[field] = err[field];
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      dispatch(setIsLoading(true));
      const { data, status } = categoriesId
        ? await apiHandler.category.patch(categoriesId, formData)
        : await apiHandler.category.post(formData);
      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        // router.push(ROUTES.admin.lookupCategory);
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
          {categoriesId
            ? isViewOnly
              ? "View Lookup Category"
              : "Edit Lookup Category"
            : "Add New Lookup Category"}
        </h1>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <CustomInput
              label="Category Name"
              name="name"
              placeholder="Enter category name."
              value={formData.name}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required
            />
            {errors.name && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.name}
              </p>
            )}
          </div>
          <div className="flex-1">
            <CustomInput
              label="Category Code"
              name="category_code"
              placeholder="Enter category code."
              value={formData.category_code}
              onChange={handleInputChange}
              disabled={!!categoriesId || isViewOnly}
              required
            />
            {errors.category_code && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.category_code}
              </p>
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
              {categoriesId ? "Update" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Page;
