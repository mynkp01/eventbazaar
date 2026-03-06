"use client";
import { apiHandler } from "@api/apiHandler";
import { Logo } from "@assets/index";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Modal } from "@mui/material";
import {
  logout,
  logoutAdmin,
  selectAdminUser,
  selectUser,
  selectVisibleLoginModal,
  setUser,
  setVisibleLoginModal,
} from "@redux/slices/authSlice";
import { setIsLoading, setUtilsLogout } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import Cookies from "js-cookie";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { USER_TYPES } from "src/utils/Constant";
import {
  decrypt,
  encrypt,
  isEmpty,
  showLogoutConfirmationWhileOverrideInfo,
  showToast,
} from "src/utils/helper";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";

const Login = () => {
  const userType = decrypt(Cookies.get("user_type") || "");
  const adminUserType = decrypt(Cookies.get("admin_user_type") || "");

  const userData = useSelector(selectUser);
  const adminData = useSelector(selectAdminUser);

  const dispatch = useAppDispatch();
  const isVisibleLoginModal = useSelector(selectVisibleLoginModal);

  const [formData, setFormData] = useState({
    contact: "",
    otp: "",
    pin: "",
    full_name: "",
    email: "",
  });
  const [errors, setErrors] = useState<typeof formData>(null);
  const [sendOtp, setSendOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isSignup, setIsSignup] = useState(false);
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    let intervalId;

    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      if (intervalId) clearInterval(intervalId);
    }

    // Cleanup interval
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contact") {
      setSendOtp(false);
      setIsSignup(false);
      setTimer(0);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateFields = (label: string, value: string) => {
    let error = "";

    switch (label) {
      case "contact":
        if (!value.trim()) error = "Please enter your mobile number";
        else if (!/^\d{10}$/.test(value))
          error = "Please enter valid mobile number";
        break;
      case "otp":
        if (!value.trim()) error = "Please enter OTP";
        else if (!/^\d{6}$/.test(value)) error = "Please enter valid OTP";
        break;
      case "full_name":
        if (!value.trim()) error = "Please enter your full name";
        break;
      case "email":
        if (!value.trim()) error = "Please enter your email address";
        else if (!/^\S+@\S+\.\S+$/.test(value))
          error = "Please enter valid email address";
        break;
      case "pin":
        if (!value.trim()) error = "Please enter your 4 digit pin";
        else if (value.length < 4) error = "Please enter your 4 digit pin";
        break;

      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [label]: error }));
    return { ...errors, [label]: error };
  };

  const validateForm = (requiredFields) => {
    let newErrors = {};

    requiredFields.forEach((field) => {
      const err = validateFields(field, formData[field]);
      if (err[field]) {
        newErrors[field] = err[field];
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors as any);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    let requiredFields = ["contact", "otp"];
    if (isSignup) {
      requiredFields.push("full_name", "email");
    }

    if (isVendor) {
      requiredFields = ["contact", "pin"];
    }
    const isDataValid = validateForm(requiredFields);
    if (!isDataValid) return;

    try {
      dispatch(setIsLoading(true));
      const res = isSignup
        ? await apiHandler.client.customerSignUp({ ...formData })
        : isVendor
          ? await apiHandler.vendor.vendorSignIn({
              ...formData,
              primary_contact: formData.contact,
              from_customer: true,
            })
          : await apiHandler.client.customerLogin({ ...formData });
      if (
        (res.status === 200 || res.status === 201) &&
        !isEmpty(res?.data.data)
      ) {
        showToast("success", res?.data.message);
        let data = res?.data?.data;
        Cookies.set("token", encrypt(data?.token), { expires: 30 });
        Cookies.set("user_type", encrypt(data?.user_type), { expires: 30 });
        dispatch(setUser(data));

        resetStates();
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleSendOtp = async (isResendOtp = false) => {
    try {
      let isDataValid = validateForm(["contact"]);
      if (!isDataValid) return;

      dispatch(setIsLoading(true));
      const { data, status } = isResendOtp
        ? await apiHandler.client.customerReSendOtp({
            contact: formData.contact,
          })
        : await apiHandler.client.customerSendOtp({
            contact: formData.contact,
            primary: true,
          });

      if (status === 200 || status === 201) {
        if (!data?.data?.isVendor) showToast("success", data?.message);
        setIsVendor(data?.data?.isVendor ? true : false);
        setIsSignup(data?.data?.isSignup ? true : false);
        setSendOtp(true);
        setTimer(60);
      } else {
        showToast("error", data?.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  function resetStates() {
    dispatch(setVisibleLoginModal(false));

    setFormData({ contact: "", otp: "", email: "", full_name: "", pin: "" });
    setErrors(null);
    setSendOtp(false);
    setTimer(0);
    setIsSignup(false);
  }

  const handleLogout = async () => {
    try {
      if (userData?.user_type === USER_TYPES.VENDOR) {
        apiHandler.vendor.vendorSignOut(
          {},
          {
            headers: { Authorization: `Bearer ${userData?.token}` },
          },
        );
        Cookies.remove("token");
        Cookies.remove("user_type");
        dispatch(logout());
      } else if (adminData?.user_type === USER_TYPES.ADMIN) {
        apiHandler.admin.adminSignOut(
          {},
          {
            headers: { Authorization: `Bearer ${adminData?.token}` },
          },
        );
        Cookies.remove("admin_token");
        Cookies.remove("admin_user_type");
        Cookies.remove("admin_id");
        dispatch(logoutAdmin());
      }
      dispatch(setUtilsLogout());
    } catch (error) {
      console.error(error);
    }
    await handleSubmit();
  };

  const handleLogin = (e) => {
    if (
      (!isEmpty(adminUserType) || !isEmpty(userType)) &&
      userType !== USER_TYPES.CUSTOMER
    ) {
      e.preventDefault();
      e.stopPropagation();

      showLogoutConfirmationWhileOverrideInfo(
        isEmpty(adminUserType) ? userType : adminUserType,
        handleLogout,
      );
    } else {
      handleSubmit();
    }
  };

  return (
    <Modal
      disableEnforceFocus
      open={isVisibleLoginModal}
      onClose={resetStates}
      className="flex h-full w-full items-center justify-center !p-6"
    >
      <div
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (!sendOtp) handleSendOtp();
            else handleLogin(e);
          }
        }}
        className="flex h-fit max-h-full w-full max-w-2xl flex-col gap-3 overflow-y-auto rounded-xl bg-primary-20 p-8 sm:gap-4 sm:p-10"
      >
        <div className="sticky top-0 flex flex-col justify-between gap-3 bg-white sm:gap-4">
          <Logo />
          <h2 className="text-4xl font-semibold text-primary-800">Login</h2>
          <p className="text-sm text-black-400">
            Please fill out the form below to create or sign in to your account.
          </p>
          <div className="border-full border border-primary-50"></div>
        </div>

        <div>
          <CustomInput
            type="number"
            id="contact"
            label="Mobile Number"
            name="contact"
            value={formData.contact}
            maxLength={10}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
          {errors?.contact && (
            <p className="error-text text-red-600">{errors?.contact}</p>
          )}
        </div>

        {sendOtp || isSignup ? (
          <Fragment>
            {isVendor ? (
              <Fragment>
                <div className="relative">
                  <CustomInput
                    type={showPassword ? "text" : "password"}
                    label="PIN"
                    id="pin"
                    name="pin"
                    value={formData.pin}
                    maxLength={4}
                    onChange={(e) => {
                      if (!e.target.value || /^\d+$/.test(e.target.value)) {
                        handleChange(e);
                      }
                    }}
                    placeholder="Please enter your 4 digit pin"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-4 flex items-center ${errors?.pin ? "top-2" : "top-7 sm:top-[34px]"}`}
                  >
                    {!showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                  {errors?.pin ? (
                    <p className="error-text">{errors?.pin}</p>
                  ) : null}
                </div>
                <p className="text-center text-sm font-bold text-primary-600 md:text-base">
                  Welcome back! Please enter your vendor PIN to continue.
                </p>
              </Fragment>
            ) : (
              <div className="flex flex-col">
                <CustomInput
                  name="otp"
                  type="number"
                  label="OTP"
                  value={formData.otp}
                  maxLength={6}
                  onChange={handleChange}
                  placeholder="Enter 6 digit OTP"
                />
                {errors?.otp && (
                  <p className="error-text text-red-600">{errors?.otp}</p>
                )}

                {timer > 0 ? (
                  <span className="text-left text-xs text-blue-500 sm:text-sm">
                    Resend OTP in {timer}s
                  </span>
                ) : (
                  <button
                    className="text-left text-xs text-blue-500 sm:text-sm"
                    onClick={() => handleSendOtp(true)}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            )}

            {isSignup ? (
              <Fragment>
                <div>
                  <CustomInput
                    type="text"
                    id="full_name"
                    label="Full Name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                  {errors?.full_name && (
                    <p className="error-text text-red-600">
                      {errors?.full_name}
                    </p>
                  )}
                </div>
                <div>
                  <CustomInput
                    type="email"
                    id="email"
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors?.email && (
                    <p className="error-text text-red-600">{errors?.email}</p>
                  )}
                </div>
              </Fragment>
            ) : null}
          </Fragment>
        ) : null}

        <div className="flex flex-col gap-3">
          <CustomButton
            text={!sendOtp ? "Verify" : "Login"}
            className={`!h-12 w-full rounded-xl border-transparent bg-green-400 text-sm font-semibold text-white hover:border-green-400 hover:bg-white hover:text-green-400`}
            onClick={(e) => (!sendOtp ? handleSendOtp() : handleLogin(e))}
          />
        </div>
      </div>
    </Modal>
  );
};

export default Login;
