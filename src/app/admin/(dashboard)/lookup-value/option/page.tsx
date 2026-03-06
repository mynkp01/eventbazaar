"use client";
import { apiHandler } from "@api/apiHandler";
import CustomInput from "@components/CustomInput";
import FetchDropdown from "@components/FetchDropdown";
import LabelField from "@components/LabelField";
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
  const lookupId = searchParams.get("id");
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
    value_code: "",
    category_id: "",
    status: true,
  });

  const fetchLookupDetails = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.values.get(lookupId);
      if (status === 200) {
        const lookup = data.data;
        setFormData({
          name: lookup.name || "",
          value_code: lookup.value_code || "",
          category_id: lookup.category_id || "",
          status: lookup.status || false,
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
    if (lookupId) {
      fetchLookupDetails();
    }
  }, [lookupId]);

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Please enter name.";
        } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error =
            "Please enter only letters and numbers in event vertical name";
        }
        break;
      case "value_code":
        if (!value.trim()) error = "Please enter a value code.";
        break;
      case "category_id":
        if (!value.trim()) error = "Select a category.";
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

  const handleFetchDropdownChange = (name, value) => {
    const selectedValue = value ? value._id : "";
    setFormData((prev) => ({ ...prev, [name]: selectedValue }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, selectedValue),
    }));
  };

  // const handleStatusToggle = () => {
  //   setFormData((prev) => ({ ...prev, status: !prev.status }));
  // };

  const handleSubmit = async () => {
    if (isViewOnly) return;
    let newErrors = {};
    const requiredFields = ["name", "value_code"];

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
      const { data, status } = lookupId
        ? await apiHandler.values.patch(lookupId, formData)
        : await apiHandler.values.post(formData);
      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        // router.push(ROUTES.admin.lookupValue);
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
          {lookupId
            ? isViewOnly
              ? "View Lookup Value"
              : "Edit Lookup Value"
            : "Add New Lookup Value"}
        </h1>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <CustomInput
              label="Name"
              name="name"
              placeholder="Enter name"
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
              label="Value Code"
              name="value_code"
              placeholder="Enter value code"
              value={formData.value_code}
              onChange={handleInputChange}
              disabled={!!lookupId || isViewOnly}
              required
            />
            {errors.value_code && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.value_code}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <LabelField labelText="Category" required />
            <FetchDropdown
              placeholder="Select category"
              value={formData.category_id}
              endPoints={apiHandler.category.adminCategoryLookup}
              filterStr="NA"
              func={handleFetchDropdownChange}
              objKey="category_id"
              display="name"
              required
              isComponentDisabled={isViewOnly}
            />
            {errors.category_id && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.category_id}
              </p>
            )}
          </div>
          {/* <div className="flex-1">
            <div className="switch-wrapper">
              <LabelField labelText="Status" />
              <Switch
                id="status"
                checked={formData.status}
                onChange={handleStatusToggle}
                disabled={isViewOnly}
              />
            </div>
          </div> */}
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
              {lookupId ? "Update" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Page;
