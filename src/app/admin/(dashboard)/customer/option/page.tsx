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
  const searchParams = useSearchParams();
  const customerId = searchParams.get("id");
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
    full_name: "",
    email: "",
    contact: "",
  });

  const fetchCustomerDetails = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.customer.get(customerId);
      if (status === 200) {
        const customer = data.data;
        setFormData({
          full_name: customer.full_name || "",
          email: customer.email || "",
          contact: customer.contact || "",
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
    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

  const validateFields = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "full_name":
        if (!value.trim()) {
          error = "Please enter full name";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Please enter email";
        }
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

    const newErrors = validateFields(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: newErrors[name],
    }));
  };

  const handleSubmit = async () => {
    if (isViewOnly) return;

    let newErrors = {};
    const requiredFields = ["full_name", "email"];

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

    const fd = new FormData();
    fd.append("full_name", formData.full_name);
    fd.append("email", formData.email);
    if (formData.contact) {
      fd.append("contact", formData.contact);
    }

    try {
      dispatch(setIsLoading(true));
      const { data, status } = customerId
        ? await apiHandler.customer.patch(customerId, fd)
        : await apiHandler.customer.post(fd);
      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        // router.push(ROUTES.admin.customer);
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
          {customerId
            ? isViewOnly
              ? "View Customer"
              : "Edit Customer"
            : "Add New Customer"}
        </h1>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <CustomInput
              label="Customer Name"
              name="full_name"
              placeholder="Enter Customer name"
              value={formData.full_name}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required
            />
            {errors.full_name && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.full_name}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <CustomInput
              label="Email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required
            />
            {errors.email && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <CustomInput
              label="contact"
              name="contact"
              placeholder="Enter contact"
              value={formData.contact}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required
            />
            {errors.contact && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.contact}
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
              {customerId ? "Update" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Page;
