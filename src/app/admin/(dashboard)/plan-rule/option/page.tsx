"use client";
import { apiHandler } from "@api/apiHandler";
import CustomInput from "@components/CustomInput";
import FetchDropdown from "@components/FetchDropdown";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PERMISSIONS, PLAN_CODE, PLAN_RULE } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

const Page = () => {
  const router = useRouter();
  // const permission = checkCurrentSelectedTabPermission();
  const searchParams = useSearchParams();
  const planruleId = searchParams.get("id");
  const isViewOnly = searchParams.get("view") === "1";
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    plan_id: "",
    // location_id: "",
    grade_id: "",
    price: "",
    actual_price: "",
    grade_name: "",
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

  const [selectedPlanCode, setSelectedPlanCode] = useState("");
  const isEnterprisePlan = selectedPlanCode === PLAN_CODE.enterprise;

  const fetchPlanRuleDetails = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.planRule.get(planruleId);
      if (status === 200) {
        const planRule = data.data;
        setFormData({
          plan_id: planRule.plan_id._id || "",
          // location_id: planRule.location_id || "",
          grade_id: planRule.grade_id._id || "",
          price: planRule.price,
          actual_price: planRule.actual_price,
          grade_name: planRule.grade_name || "",
        });
        setSelectedPlanCode(planRule?.plan_id?.plan_code || "");
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
    if (planruleId) {
      fetchPlanRuleDetails();
    }
  }, [planruleId]);

  const validateFields = (label: string, value: any) => {
    let error = "";

    switch (label) {
      case "plan_id":
        if (!String(value).trim()) error = "Please select a plan.";
        break;
      case "grade_id":
        if (!String(value).trim()) error = "Please select a grade.";
        break;
        // case "location_id":
        //   if (!String(value).trim()) error = "Please select city.";
        break;
      case "actual_price":
        if (!isEnterprisePlan) {
          if (!String(value).trim())
            error = "Please enter the introductory price.";
          else if (Number(value > formData?.price))
            error =
              "Introductory price must be less than or equal to plan price.";
        }
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

    setErrors((prevState) => {
      const newState = { ...prevState };
      newState[name] = "";
      return newState;
    });
  };

  const handleFetchDropdownChange = async (name, value) => {
    if (name === "plan_id") {
      setSelectedPlanCode(value?.plan_code);
    }

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

  const handleSubmit = async () => {
    if (isViewOnly) return;

    let newErrors = {};
    const requiredFields = [
      "plan_id",
      "grade_id",
      // "location_id",
      ...(isEnterprisePlan ? [] : ["actual_price"]),
    ];

    requiredFields.forEach((field) => {
      const err = validateFields(field, formData[field]);
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
      let bodyObj = { ...formData, plan_code: selectedPlanCode };
      const { data, status } = planruleId
        ? await apiHandler.planRule.patch(planruleId, bodyObj)
        : await apiHandler.planRule.post(bodyObj);
      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        // router.push(ROUTES.admin.planRule);
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
          {isViewOnly ? "View Plan Rule" : "Edit Plan Rule"}
        </h1>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <FetchDropdown
              label="Plan"
              placeholder="Select Plan"
              value={formData.plan_id}
              endPoints={apiHandler.plans.lookup}
              filterStr="NA"
              objKey="plan_id"
              display="plan_name"
              func={handleFetchDropdownChange}
              required
              isComponentDisabled={isViewOnly}
            />
            {errors.plan_id && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.plan_id}
              </p>
            )}
          </div>
          <div className="flex-1">
            <FetchDropdown
              label="Grade"
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
        </div>
        {/* <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <FetchDropdown
              label="City"
              placeholder="Select City"
              value={formData.location_id}
              multiple
              filterSelectedOptions
              endPoints={apiHandler.values.cities}
              filterStr="NA"
              objKey="location_id"
              display="name"
              func={handleFetchDropdownChange}
              isComponentDisabled={isViewOnly}
              required
            />
            {errors.location_id && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.location_id}
              </p>
            )}
          </div>
        </div> */}
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <CustomInput
              label="Price"
              name="price"
              type="number"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleInputChange}
              disabled={isViewOnly}
            />
            {errors.price && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.price}
              </p>
            )}
          </div>
          <div className="flex-1">
            <CustomInput
              label="Introductory Price"
              name="actual_price"
              type="number"
              placeholder="Enter introductory price"
              value={formData.actual_price}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required={!isEnterprisePlan}
            />
            {errors.actual_price && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.actual_price}
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
              Update
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Page;
