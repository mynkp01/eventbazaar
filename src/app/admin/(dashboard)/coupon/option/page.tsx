"use client";
import { apiHandler } from "@api/apiHandler";
import CustomInput from "@components/CustomInput";
import CustomSwitch from "@components/CustomSwitch";
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
  const couponId = searchParams.get("id");
  const isViewOnly = searchParams.get("view") === "1";
  const dispatch = useAppDispatch();
  const [isAmountSelected, setIsAmountSelected] = useState(false);
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
    plan_rule_id: "",
    coupon_code: "",
    amount: 0,
    percent: 0,
    max_redemptions: "",
    desc: "",
  });

  const fetchCouponDetails = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.couponCode.get(couponId);
      if (status === 200) {
        const coupon = data?.data;
        setFormData({
          plan_rule_id: coupon?.plan_rule_id?._id,
          coupon_code: coupon?.coupon_code,
          amount: coupon?.amount,
          percent: coupon?.percent,
          desc: coupon?.desc,
          max_redemptions: coupon?.max_redemptions,
          actual_price: coupon?.plan_rule_id?.actual_price,
        });
        setIsAmountSelected(!coupon.percent);
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
    if (couponId) {
      fetchCouponDetails();
    }
  }, [couponId]);

  const handleSwitchChange = (selected: boolean) => {
    setIsAmountSelected(selected);
    if (!selected) {
      setFormData((prev) => ({ ...prev, amount: 0 }));
    } else {
      setFormData((prev) => ({ ...prev, percent: 0 }));
    }
  };

  const validateField = (name: string, value: string): string => {
    const stringValue =
      value !== null && value !== undefined ? String(value).trim() : "";
    switch (name) {
      // case "plan_rule_id":
      //   if (!stringValue) return "Please select a plan rule.";
      //   break;
      case "coupon_code":
        if (!stringValue) return "Please enter a coupon code.";
        break;
      case "amount":
        if (!stringValue) return "Please enter a discount amount.";
        if (
          Number(stringValue) <= 0 ||
          Number(stringValue) > formData?.actual_price
        )
          return `Discount amount must be between 0 and ${formData?.actual_price}`;
        break;
      case "percent":
        if (!stringValue) return "Discount percentage is required.";
        if (Number(stringValue) <= 0 || Number(stringValue) > 100)
          return "Discount percentage must be between 0 and 100.";
        break;
      // case "max_redemptions":
      //   if (!stringValue) return "Please enter a max redemptions.";
      //   if (Number(stringValue) <= 0)
      //     return "Max redemptions must be greater than 0.";
      //   break;
      default:
        return "";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const handleFetchDropdownChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value ? value._id : "",
      actual_price: value?.actual_price,
    }));
  };

  const handleSubmit = async () => {
    if (isViewOnly) return;

    const newErrors = {},
      requiredFields = ["plan_rule_id", "coupon_code", "max_redemptions"];
    if (isAmountSelected) {
      requiredFields.push("amount");
    } else {
      requiredFields.push("percent");
    }
    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { data, status } = couponId
        ? await apiHandler.couponCode.patch(couponId, formData)
        : await apiHandler.couponCode.post(formData);
      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        // router.push(ROUTES.admin.coupon);
        window.close();
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    }
  };

  return pagePermissions?.[PERMISSIONS.CREATE] ||
    pagePermissions?.[PERMISSIONS.UPDATE] ? (
    <div className="border-wh-300 flex flex-col items-center gap-4 rounded-2xl border bg-white">
      <div className="flex w-full flex-col gap-4 p-4 md:p-6">
        <h1 className="text-xl font-bold">
          {couponId
            ? isViewOnly
              ? "View Coupon"
              : "Edit Coupon"
            : "Add New Coupon"}
        </h1>
        <div className="flex flex-col gap-[10px] md:flex-row">
          {/* <div className="flex-1">
            <LabelField labelText="Plan Rule" required />
            <FetchDropdown
              placeholder="Select plan rule"
              value={formData.plan_rule_id}
              endPoints={apiHandler.planRule.lookup}
              filterStr="NA"
              func={handleFetchDropdownChange}
              objKey="plan_rule_id"
              display="plan_id.plan_name,grade_id.name"
              required
              isComponentDisabled={isViewOnly}
            />
            {errors.plan_rule_id && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.plan_rule_id}
              </p>
            )}
          </div> */}
          <div className="flex-1">
            <CustomInput
              label="Coupon Code"
              name="coupon_code"
              placeholder="Enter coupon code"
              value={formData.coupon_code}
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: e.target.name,
                    value: e.target.value.toUpperCase(),
                  },
                })
              }
              disabled={isViewOnly}
              required
            />
            {errors.coupon_code && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.coupon_code}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <label className="text-sm font-medium">
              Apply Coupon Discount In Tearms Of Amount
            </label>
            <div className="flex-1">
              <CustomSwitch
                selected={isAmountSelected}
                setSelected={handleSwitchChange}
              />
            </div>
          </div>
          <div className="flex-1">
            {isAmountSelected ? (
              <div className="flex-1">
                <CustomInput
                  label="Discount Amount"
                  name="amount"
                  placeholder="Enter discount amount"
                  value={formData.amount}
                  type="number"
                  onChange={handleInputChange}
                  disabled={isViewOnly}
                  required
                />
                {errors.amount && (
                  <p className="error-text mt-1 text-sm text-red-500">
                    {errors.amount}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex-1">
                <CustomInput
                  label="Discount Percentage"
                  name="percent"
                  placeholder="Enter discount percentage"
                  value={formData.percent}
                  type="number"
                  onChange={handleInputChange}
                  disabled={isViewOnly}
                  required
                />
                {errors.percent && (
                  <p className="error-text mt-1 text-sm text-red-500">
                    {errors.percent}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <CustomInput
              label="Max Redemption"
              name="max_redemptions"
              placeholder="Enter maximum redemption"
              value={formData.max_redemptions}
              type="number"
              onChange={handleInputChange}
              disabled={isViewOnly}
              // required
            />
            {errors.max_redemptions && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.max_redemptions}
              </p>
            )}
          </div>
          <div className="flex-1">
            <CustomInput
              label="Description"
              name="desc"
              placeholder="Enter description"
              value={formData.desc}
              onChange={handleInputChange}
              disabled={isViewOnly}
            />
            {errors.desc && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.desc}
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
              {couponId ? "Update" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Page;
