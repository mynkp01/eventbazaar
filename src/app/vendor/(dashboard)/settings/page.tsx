"use client";
import { apiHandler } from "@api/apiHandler";
import { InfoFilled } from "@assets/index";
import CustomInput from "@components/CustomInput";
import HideModel from "@components/HideModel";
import { LockClockOutlined, WarningAmberOutlined } from "@mui/icons-material";
import { Modal } from "@mui/material";
import { logout, selectAdminUser, selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES } from "src/utils/Constant";
import { isEmpty, showToast } from "src/utils/helper";
let initialForm = {
  currentPin: "",
  newPin: "",
  confirm_pin: "",
  reason: "",
  reasonOption: "",
};
const predefinedReasons = [
  "I no longer need this service",
  "Privacy concerns",
  "Found a better alternative",
  "Too many emails/notifications",
  "Difficult to use",
  "Account security issues",
  "Other",
];

function Page() {
  const isViewOnly = false;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userData = useSelector(selectUser);
  const adminData = useSelector(selectAdminUser);
  const [isVisibleLoginModal, setIsVisibleLoginModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendorDetails, setVendorDetails] = useState(initialForm);
  const [errors, setErrors] = useState(initialForm);

  const validateField = (label: string, value: string) => {
    let error = "";

    switch (label) {
      case "currentPin":
        if (!value.trim()) error = "Please enter current pin";
        break;
      case "newPin":
        if (!value.trim()) error = "Please enter new pin";
        break;
      case "confirm_pin":
        if (!value.trim()) error = "Please enter confirm pin";
        if (value.trim() !== vendorDetails.newPin)
          error = "New pin and confirm pin do not match";
        break;
      case "reason":
        if (!value.trim()) error = "Please enter reason for delete account";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [label]: error }));
    return { ...errors, [label]: error };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendorDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));

    if (name === "reasonOption") {
      if (value !== "Other") {
        setVendorDetails((prev) => ({ ...prev, reason: value }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          reason: validateField("reason", value),
        }));
      } else {
        setVendorDetails((prev) => ({ ...prev, reason: "" }));
      }
    }
  };

  const handleSubmit = async () => {
    let newErrors = {};

    const requiredFields = ["current_pin", "new_pin", "confirm_pin"];

    requiredFields.forEach((field) => {
      const err = validateField(field, vendorDetails[field]);
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
      const { data, status } =
        await apiHandler.vendor.vendorUpdatePin(vendorDetails);
      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        setVendorDetails(initialForm);
        setIsModalOpen(false);
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  function resetStates(
    event: {},
    reason: "backdropClick" | "escapeKeyDown",
  ): void {
    setIsVisibleLoginModal(false);
  }

  const handleOpenUpdatePinModal = () => {
    let newErrors = {};

    const requiredFields = ["currentPin", "newPin", "confirm_pin"];

    requiredFields.forEach((field) => {
      const err = validateField(field, vendorDetails[field]);
      if (err[field]) {
        newErrors[field] = err[field];
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setIsModalOpen(true);
    }
  };

  const handleDeleteAccount = async () => {
    let newErrors = {};

    const requiredFields = ["reason"];

    requiredFields.forEach((field) => {
      const err = validateField(field, vendorDetails[field]);
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
      const { data, status } = await apiHandler.vendor.vendorDelete(
        userData?.user_id,
        vendorDetails,
      );
      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        Cookies.remove("token");
        Cookies.remove("user_type");
        dispatch(logout());
        dispatch(setIsLoading(false));
        router.push(
          !isEmpty(adminData) ? ROUTES.admin.vendor : ROUTES.landingPage,
        );
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col gap-4">
      <h3 className="heading-40">Account Settings</h3>
      <div className="w-full space-y-3 rounded-lg bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-medium">Update Login Pin</p>
          <p className="text-gray-500">(You Can Update Login Your Pin Here)</p>
        </div>
        <div className="grid gap-y-2 sm:gap-y-4 lg:w-1/2">
          <div>
            <CustomInput
              type="password"
              label="Pin"
              id="pin"
              name="currentPin"
              maxLength={4}
              value={vendorDetails.currentPin}
              onChange={(e) => {
                if (!e.target.value || /^\d+$/.test(e.target.value)) {
                  handleInputChange(e);
                }
              }}
              placeholder="Please enter your 4 digit PIN"
            />
            {errors?.currentPin ? (
              <p className="error-text">{errors?.currentPin}</p>
            ) : null}
          </div>
          <div>
            <CustomInput
              type="password"
              toolTipText="Please enter your new 4 digit PIN"
              label="New Pin"
              name="newPin"
              maxLength={4}
              placeholder="Please enter your new 4 digit PIN"
              disabled={isViewOnly}
              value={vendorDetails.newPin}
              onChange={(e) => {
                if (!e.target.value || /^\d+$/.test(e.target.value)) {
                  handleInputChange(e);
                }
              }}
            />
            {errors?.newPin ? (
              <p className="error-text">{errors?.newPin}</p>
            ) : null}
          </div>
          <div>
            <CustomInput
              toolTipText="Please confirm your new 4 digit PIN"
              label="Confirm Pin"
              type="password"
              disabled={isViewOnly}
              maxLength={4}
              placeholder="Please confirm your new 4 digit PIN"
              name="confirm_pin"
              value={vendorDetails.confirm_pin}
              onChange={(e) => {
                if (!e.target.value || /^\d+$/.test(e.target.value)) {
                  handleInputChange(e);
                }
              }}
            />
            {errors?.confirm_pin ? (
              <p className="error-text">{errors?.confirm_pin}</p>
            ) : null}
          </div>
          <div>
            <button
              className="rounded-lg bg-blue-100 px-6 py-2 text-white"
              onClick={handleOpenUpdatePinModal}
            >
              Update Pin
            </button>
          </div>
        </div>
      </div>
      <div className="w-full space-y-3 rounded-lg bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-medium">Request Account Deletion</p>
          <p className="text-gray-500">(You can delete account here)</p>
          <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-start gap-2">
              <WarningAmberOutlined className="h-5 w-5 flex-shrink-0 text-yellow-600" />
              <div>
                <p className="mb-1 text-sm font-medium text-yellow-800">
                  Before you delete your account:
                </p>
                <ul className="space-y-1 text-sm text-yellow-700">
                  <li>• Your data will be permanently deleted after 90 days</li>
                  <li>• You can cancel deletion request within 90 days</li>
                  <li>• All active subscriptions will be cancelled</li>
                  <li>• This action cannot be undone after 90 days</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-y-2 sm:gap-y-4 lg:w-1/2">
          <div className="grid gap-3 xs:flex">
            <button
              className="rounded-lg bg-red-500 px-3 py-2 text-white xs:px-6"
              onClick={() => {
                setVendorDetails((prev) => ({
                  ...prev,
                  reason: "",
                  reasonOption: "",
                }));
                setIsVisibleLoginModal(true);
              }}
            >
              Delete Account
            </button>
            <button className="rounded-lg border bg-blue-100 px-3 py-2 text-white xs:px-6">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <Modal
        disableEnforceFocus
        open={isVisibleLoginModal}
        onClose={resetStates}
        className="flex h-full w-full items-center justify-center !p-6"
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <WarningAmberOutlined className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Account
              </h3>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Reason for account deletion
                <span className="ml-1 text-gray-400">
                  <InfoFilled className="inline h-4 w-4" />
                </span>
              </label>

              <div className="mb-4 space-y-2">
                {predefinedReasons.map((reasonOption, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="radio"
                      name="reasonOption"
                      value={reasonOption}
                      checked={vendorDetails?.reasonOption === reasonOption}
                      onChange={handleInputChange}
                      className="mr-2 text-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {reasonOption}
                    </span>
                  </label>
                ))}
              </div>

              {vendorDetails?.reasonOption === "Other" && (
                <textarea
                  name="reason"
                  value={vendorDetails?.reason}
                  onChange={handleInputChange}
                  placeholder="Please tell us more about your reason for leaving..."
                  className="h-20 w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={500}
                />
              )}
              {errors?.reason ? (
                <p className="error-text">{errors?.reason}</p>
              ) : null}
            </div>

            <div className="mb-6 rounded-md border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-start gap-2">
                <LockClockOutlined className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                <div>
                  <p className="mb-1 text-sm font-medium text-yellow-800">
                    Important Information
                  </p>
                  <p className="text-sm text-yellow-700">
                    Your account will be scheduled for permanent deletion in 90
                    days. During this period, you can contact administrator to
                    cancel the deletion request and restore your account.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsVisibleLoginModal(false)}
                className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <HideModel
        open={isModalOpen}
        heading={`Are you sure want to update pin ?`}
        btnTitle={"Update"}
        setOpen={setIsModalOpen}
        func={handleSubmit}
      />
    </div>
  );
}

export default Page;
