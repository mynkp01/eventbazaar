"use client";
import { apiHandler } from "@api/apiHandler";
import CustomInput from "@components/CustomInput";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PERMISSIONS } from "src/utils/Constant";
import { generateValueCode, isEmpty, showToast } from "src/utils/helper";
interface FormData {
  plan_name: string;
  plan_code: string;
  validity: number;
  price: number;
}

const Page = () => {
  const router = useRouter();
  // const permission = checkCurrentSelectedTabPermission();
  const searchParams = useSearchParams();
  const bazaarBuddyPlanId = searchParams.get("id");
  const isViewOnly = searchParams.get("view") === "1";
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    plan_name: "",
    plan_code: "",
    validity: 0,
    price: 0,
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

  const fetchBazaarBuddyPlanDetails = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } =
        await apiHandler.bazaarBuddyPlan.get(bazaarBuddyPlanId);

      if (status === 200) {
        const bazaarBuddyPlan = data.data;
        setFormData((prev) => ({
          ...prev,
          plan_name: bazaarBuddyPlan.plan_name,
          plan_code: bazaarBuddyPlan.plan_code,
          validity: bazaarBuddyPlan.validity,
          price: bazaarBuddyPlan.price,
        }));
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [bazaarBuddyPlanId, dispatch]);

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
    if (bazaarBuddyPlanId) {
      fetchBazaarBuddyPlanDetails();
    }
  }, [bazaarBuddyPlanId, fetchBazaarBuddyPlanDetails]);
  const validateFields = useCallback((name: string, value: any) => {
    let error = "";

    switch (name) {
      case "plan_name":
        if (isEmpty(value?.trim())) {
          error = "Please enter a plan name";
        } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error = "Please enter only letters and numbers in plan name";
        }
        break;
      case "plan_code":
        if (isEmpty(value?.trim())) {
          error = "Please enter a plan code";
        }
        break;
      case "validity":
        if (Number(value) == 0) {
          error = "Please enter a validity";
        } else if (Number(value) <= 0) {
          error = "Validity code should be greater than 0";
        }
        break;
      case "price":
        if (Number(value) == 0) {
          error = "Please enter a price";
        } else if (Number(value) <= 0) {
          error = "Validity code should be greater than 0";
        }
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
        ...(name === "plan_name" && !bazaarBuddyPlanId
          ? { plan_code: generateValueCode(value) }
          : {}),
      }));
      setErrors((prev) => ({
        ...prev,
        [name]: validateFields(name, value),
      }));
    },
    [validateFields, bazaarBuddyPlanId],
  );

  const handleSubmit = useCallback(async () => {
    if (isViewOnly) return;

    const newErrors: Record<string, string> = {};
    const requiredFields = [
      "plan_name",
      "plan_code",
      "validity",
      "price",
      // "description",
    ];

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
      const { data, status } = bazaarBuddyPlanId
        ? await apiHandler.bazaarBuddyPlan.patch(bazaarBuddyPlanId, formData)
        : await apiHandler.bazaarBuddyPlan.post(formData);

      if ([200, 201].includes(status)) {
        showToast("success", data?.message);
        // router.push(ROUTES.admin.bazaarBuddyPlan);
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
    bazaarBuddyPlanId,
    dispatch,
    router,
  ]);

  return pagePermissions?.[PERMISSIONS.CREATE] ||
    pagePermissions?.[PERMISSIONS.UPDATE] ? (
    <div className="border-wh-300 flex flex-col items-center gap-4 rounded-2xl border bg-white">
      <div className="flex w-full flex-col gap-4 p-4 md:p-6">
        <h1 className="text-xl font-bold">
          {bazaarBuddyPlanId
            ? isViewOnly
              ? "View Bazaar Buddy Plan"
              : "Edit Bazaar Buddy Plan"
            : "Add New Bazaar Buddy Plan"}
        </h1>
        <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
          <div className="flex-1">
            <CustomInput
              label="Plan name"
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
              toolTipText="This is an internal reference code that cannot be modified after creation. It is used for backend operations only and will not be displayed elsewhere."
              placeholder="Value code will be auto-generated"
              value={formData.plan_code}
              onChange={handleInputChange}
              disabled={
                !isEmpty(bazaarBuddyPlanId) && !isEmpty(formData?.plan_code)
              }
              required
            />
            {errors.plan_code && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.plan_code}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
          <div className="flex-1">
            <CustomInput
              label="Price"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required
            />
            {errors.price && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.price}
              </p>
            )}
          </div>
          <div className="flex-1">
            <CustomInput
              label="Validity"
              name="validity"
              placeholder="Enter validity in days"
              type="number"
              value={formData.validity}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required
            />
            {errors.validity && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.validity}
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
              {bazaarBuddyPlanId ? "Update" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Page;
