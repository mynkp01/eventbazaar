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
  const planId = searchParams.get("id");
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
    plan_name: "",
    plan_code: "",
    description: "",
  });

  const fetchPlanDetails = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.plans.get(planId);
      if (status === 200) {
        const plan = data.data;
        setFormData({
          plan_name: plan.plan_name || "",
          plan_code: plan.plan_code || "",
          description: plan.description || "",
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
    if (planId) {
      fetchPlanDetails();
    } else {
      // router.back();
      window.close();
    }
  }, [planId]);

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "plan_name":
        if (!value.trim()) {
          error = "Please enter a plan name.";
        } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error = "Please enter only letters and numbers in plan name";
        }
        break;
      case "plan_code":
        if (!value.trim()) error = "Please enter a plan code.";
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
    const requiredFields = ["plan_name", "plan_code"];

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
      const { data, status } = planId
        ? await apiHandler.plans.patch(planId, formData)
        : await apiHandler.plans.post(formData);
      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        // router.push(ROUTES.admin.plan);
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
          {planId ? (isViewOnly ? "View Plan" : "Edit Plan") : "Add New Plan"}
        </h1>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <CustomInput
              label="Plan Name"
              name="plan_name"
              placeholder="Enter plan name"
              value={formData.plan_name}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required
            />
            {errors.plan_name && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.plan_name}
              </p>
            )}
          </div>
          <div className="flex-1">
            <CustomInput
              label="Plan Code"
              name="plan_code"
              placeholder="Enter plan code"
              value={formData.plan_code}
              onChange={handleInputChange}
              disabled={!!planId || isViewOnly}
              required
            />
            {errors.plan_code && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.plan_code}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-[10px]">
          <div className="flex-1">
            <CustomInput
              label="Description"
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isViewOnly}
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
              {planId ? "Update" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Page;
