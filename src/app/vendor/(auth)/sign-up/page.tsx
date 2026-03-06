"use client";
import { apiHandler } from "@api/apiHandler";
import {
  backgroundGradient,
  CloseLight,
  CustomCheckBox,
  Logo,
} from "@assets/index";
import CustomButton from "@components/CustomButton";
import CustomDatePicker from "@components/CustomDatePicker";
import CustomInput from "@components/CustomInput";
import FetchDropdown from "@components/FetchDropdown";
import HoldOnTight from "@components/HoldOnTight";
import LabelField from "@components/LabelField";
import OTPInput from "@components/OtpInput";
import { setDeep } from "@components/SetDeep";
import SignUpButton from "@components/SignUpButton";
import styled from "@emotion/styled";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Modal,
  StepConnector,
  stepConnectorClasses,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import {
  logout,
  logoutAdmin,
  selectAdminUser,
  selectUser,
  setUser,
} from "@redux/slices/authSlice";
import { setIsLoading, setUtilsLogout } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useSelector } from "react-redux";
import { BUSINESS_CATEGORY, ROUTES, USER_TYPES } from "src/utils/Constant";
import {
  encrypt,
  isEmpty,
  showLogoutConfirmationWhileOverrideInfo,
  showToast,
  StyledCheckbox,
  StyledFormControlLabel,
  validateGSTNumberRegex,
  validatePANNumberRegex,
} from "src/utils/helper";

const SignUp = () => {
  const steps = ["Brand Name", "Business Info", "Registration"];

  const dispatch = useAppDispatch();
  const userData = useSelector(selectUser);
  const adminData = useSelector(selectAdminUser);

  const isMobile = useMediaQuery("(max-width:600px)");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [sendOtp, setSendOtp] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [verticals, setVerticals] = useState([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [businessSubCategoryOptions, setBusinessSubCategoryOptions] = useState(
    [],
  );
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [timer, setTimer] = useState(0);
  const [state, setState] = useState("");
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [otpVerifyModal, setOtpVerifyModal] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    business_category_id: "",
    business_category_code: "",
    business_sub_category_id: [],
    full_name: "",
    primary_email: "",
    primary_contact: "",
    location_id: "",
    pin: "",
    // vertical_id: [],
    // event_type_id: [],
    address: "",
    city: "",
    state: "",
    establishment_year: "",
    verticals: [],
    no_of_employees: "",
    gst_number: "",
    pan_number: "",
    concent: false,
    want_multiple_cities: false,
  });
  const [isNumberOfEmployeesRequired, setNumberOfEmployeesRequired] =
    useState(null);

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

  useEffect(() => {
    // getCategoryList();
    loadVerticals();
  }, []);

  const loadVerticals = async () => {
    try {
      const res = await apiHandler.eventVertical.lookup();
      if (res.status === 200 || res.status === 201) {
        setVerticals(res.data.data);
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
  };

  async function getCategoryList() {
    try {
      const res = await apiHandler.businessCategory.categoryList();
      if (res.status === 200 || res.status === 201) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error("error get Category List", error);
    }
  }

  const loadSubCategory = async () => {
    try {
      const res = await apiHandler.businessSubCategory.lookup(
        `business_category_id=${formData.business_category_id}`,
      );
      if (res.status === 200 || res.status === 201) {
        setBusinessSubCategoryOptions(res.data.data);
        setLoadedOnce(true);
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    if (formData.business_category_id) {
      let obj = { ...formData };

      if (loadedOnce) {
        obj.business_sub_category_id = [];
      }
      setFormData(obj);
      loadSubCategory();
    }
  }, [formData.business_category_id]);

  const handleCheck = (e, obj) => {
    let idArr = [...formData.business_sub_category_id];

    if (e.target.checked === true) {
      idArr.push(obj._id);
    } else {
      let findIndex = idArr.findIndex((item) => item === obj._id);
      if (findIndex !== -1) {
        idArr.splice(findIndex, 1);
      }
    }
    setErrors((prevState) => {
      const newState = { ...prevState };
      setDeep(newState, "business_sub_category_id", "");
      return newState;
    });
    setFormData({ ...formData, business_sub_category_id: idArr });
  };

  const handleVerticalCheck = (e, obj) => {
    let idArr = [...formData.verticals];

    if (e.target.checked === true) {
      idArr.push({
        vertical_id: obj._id,
        event_type_id: [],
      });
    } else {
      let findIndex = idArr.findIndex((item) => item?.vertical_id === obj?._id);
      if (findIndex !== -1) {
        idArr.splice(findIndex, 1);
      }
    }
    setErrors((prevState) => {
      const newState = { ...prevState };
      setDeep(newState, "verticals", "");
      return newState;
    });
    setFormData({ ...formData, verticals: idArr });
  };

  const validateFields = (label: string, value: string) => {
    let error = "";

    switch (label) {
      case "company_name":
        if (!value.trim()) error = "Please enter brand name";
        break;
      case "business_category_id":
        if (!value) error = "Please select business category";
        break;
      case "business_sub_category_id":
        if (isEmpty(value)) error = "Please select business sub category";
        break;
      case "full_name":
        if (!value.trim()) error = "Please enter your full name";
        break;
      case "primary_email":
        if (!value.trim()) error = "Please enter your email address";
        else if (!/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
        break;
      case "primary_contact":
        if (!value.trim()) error = "Please enter your phone number";
        else if (!/^\d{10}$/.test(value)) error = "Invalid phone number";
        break;
      case "pin":
        if (!value.trim()) error = "Please enter 4 digit PIN";
        else if (value.length < 4) error = "Please enter your 4 digit pin";
        break;
      case "location_id":
        if (!value.trim()) error = "Please select city you provide service";
        break;
      case "verticals":
        if (isEmpty(value)) error = "Please select verticals";
        break;
      // case "event_type_id":
      //   if (isEmpty(value)) error = "Please select event type";
      //   break;
      case "address":
        if (!value) error = "Please enter your address";
        break;
      case "establishment_year":
        if (!value) error = "Please select establishment year";
        break;
      case "no_of_employees":
        if (!value) error = "Please enter number of employees";
        break;
      case "concent":
        if (!value) error = "Please agree to privacy terms";
        break;
      case "gst_number":
        if (!value.trim()) {
          error = "Please enter GST number";
        } else if (!validateGSTNumberRegex.test(value)) {
          error = "Invalid GST number";
        }
        break;
      case "pan_number":
        if (!value.trim()) {
          error = "Please enter PAN number";
        } else if (!validatePANNumberRegex.test(value)) {
          error = "Invalid PAN number";
        }
        break;
      case "city":
        if (isEmpty(value)) error = "Please enter your city";
        break;
      case "state":
        if (isEmpty(value)) error = "Please enter your state";
        break;
      default:
        break;
    }

    const errObj = { ...errors, [label]: error };
    setErrors(errObj);
    return errObj;
  };

  const handleSubmit = async (e) => {
    try {
      let newErrors = {},
        obj = { ...formData };
      const requiredFields = [
        "company_name",
        "business_category_id",
        "business_sub_category_id",
        "primary_email",
        "pin",
        "primary_contact",
        "location_id",
        "verticals",
        "concent",
      ];

      requiredFields.forEach((field) => {
        const err = validateFields(field, obj[field]);
        if (err[field]) {
          newErrors[field] = err[field];
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      if (!isOtpVerified) {
        showToast("error", "Please verify your mobile number.");
        return;
      }

      if (!executeRecaptcha) {
        showToast("error", "Registration Failed! Please Try Again.");
        router.push(ROUTES.vendor.signUp);
        return;
      }

      if (
        (!isEmpty(userData) || !isEmpty(adminData)) &&
        userData?.user_type !== USER_TYPES.VENDOR
      ) {
        e.preventDefault();
        e.stopPropagation();
        const handleLogout = async () => {
          try {
            if (userData?.user_type === USER_TYPES.CUSTOMER) {
              apiHandler.client.customerSignout(
                {},
                {
                  headers: { Authorization: `Bearer ${userData?.token}` },
                },
              );
              Cookies.remove("user_type");
              Cookies.remove("token");
              dispatch(logout());
            } else if (adminData?.user_type === USER_TYPES.ADMIN) {
              apiHandler.admin.adminSignOut(
                {},
                {
                  headers: {
                    Authorization: `Bearer ${adminData?.token}`,
                  },
                },
              );
              Cookies.remove("admin_token");
              Cookies.remove("admin_id");
              Cookies.remove("admin_user_type");
              dispatch(logoutAdmin());
            }
            dispatch(setUtilsLogout());
          } catch (error) {
            console.error(error);
          }
        };

        showLogoutConfirmationWhileOverrideInfo(
          isEmpty(adminData) ? userData?.user_type : adminData?.user_type,
          handleLogout,
        );
      }

      setActiveStep(3);
      const reCaptchaToken = await executeRecaptcha("vendorRegistration");

      const res = await apiHandler.vendor.vendorSignUp({
        ...obj,
        g_recaptcha_response: reCaptchaToken,
      });

      if (
        (res.status === 200 || res.status === 201) &&
        !isEmpty(res?.data.data)
      ) {
        showToast("success", res.data.message);
        let data = res?.data?.data;
        Cookies.set("token", encrypt(data?.token), { expires: 30 });
        Cookies.set("user_type", encrypt(data?.user_type), {
          expires: 30,
        });
        dispatch(setUser(data));
        router.push(ROUTES.vendor.thankYou);
      } else {
        setActiveStep(0);
        showToast("error", res.data.message);
      }
    } catch (error) {
      setActiveStep(0);
      showToast("error", error.message);
    }
  };

  const handleSendOtp = async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.vendor.vendorSendOtp({
        email: formData.primary_email,
        contact: formData.primary_contact,
      });
      if (res.status === 200 || res.status === 201) {
        setOtpVerifyModal(true);
        showToast("success", res.data.message);
        setSendOtp(true);
        setTimer(60);
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  const handleVerifyOtp = async () => {
    if (sendOtp && otp && !isOtpVerified) {
      try {
        dispatch(setIsLoading(true));
        const res = await apiHandler.vendor.vendorVerifyOtp({
          full_name: formData.full_name,
          email: formData.primary_email,
          contact: formData.primary_contact,
          otp: otp,
        });
        if (res.status === 200 || res.status === 201) {
          showToast("success", res.data.message);
          setIsOtpVerified(true);
          setOtp("");
          setOtpVerifyModal(false);
        } else {
          showToast("error", res.data.message);
        }
      } catch (error) {
        showToast("error", error.response?.data?.message || error.message);
      }
    }
    dispatch(setIsLoading(false));
  };

  const handleResendOtp = async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.vendor.vendorReSendOtp({
        email: formData.primary_email,
        contact: formData.primary_contact,
      });
      if (res.status === 200 || res.status === 201) {
        showToast("success", res.data.message);
        setSendOtp(true);
        setTimer(60);
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  const handleInputChange = (path: string, value: string) => {
    if (path === "primary_contact") {
      setSendOtp(false);
      setIsOtpVerified(false);
    }
    setFormData((prevState) => {
      const newState = { ...prevState };
      setDeep(newState, path, value);
      return newState;
    });

    setErrors((prevState) => {
      const newState = { ...prevState };
      setDeep(newState, path, "");
      return newState;
    });
  };

  const handleDropdownChange = (category, value) => {
    const updatedData = { ...formData };
    updatedData[category] = value._id;

    if (category === "business_category_id") {
      updatedData.business_category_code = value.value_code;
      setNumberOfEmployeesRequired(
        ![
          BUSINESS_CATEGORY.ARTIST,
          BUSINESS_CATEGORY.EVENT_VENUE,
          BUSINESS_CATEGORY.HOTELS_RESORTS,
        ].includes(value?.value_code),
      );
    }
    if (category === "state") {
      updatedData["city"] = "";
      setState(value?.state);
    }
    setFormData(updatedData);
    setErrors((prevState) => {
      let newState = { ...prevState };
      setDeep(newState, category, "");
      newState = { ...newState };
      return newState;
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col gap-2 sm:gap-4">
            <div>
              <FetchDropdown
                label="Business Category"
                placeholder="Select your business category"
                value={formData.business_category_id}
                endPoints={apiHandler.businessCategory.lookup}
                containerClass="!mt-0"
                filterStr="NA"
                func={handleDropdownChange}
                display="business_category_name"
                objKey="business_category_id"
                required
              />
              {errors.business_category_id ? (
                <p className="error-text">{errors.business_category_id}</p>
              ) : null}
            </div>
            {formData.business_category_id && (
              <div>
                <LabelField
                  labelText="Business Sub Category"
                  toolTipText=""
                  required
                />
                <div>
                  {businessSubCategoryOptions.map((option) => (
                    <StyledFormControlLabel
                      key={option._id}
                      className="pl-1"
                      control={
                        <StyledCheckbox
                          icon={<CustomCheckBox className="h-5 w-5" />}
                          checkedIcon={
                            <CustomCheckBox checked className="h-5 w-5" />
                          }
                          checked={formData?.business_sub_category_id?.includes(
                            option?._id,
                          )}
                          onChange={(e) => handleCheck(e, option)}
                        />
                      }
                      label={option.business_sub_category_name}
                    />
                  ))}
                  {errors.business_sub_category_id ? (
                    <p className="error-text">
                      {errors.business_sub_category_id}
                    </p>
                  ) : null}
                </div>
              </div>
            )}
            {/* <p
              className="text-blue-100 hover:cursor-pointer"
              onClick={() => setOpenModal(true)}
            >
              Find my business category
            </p> */}
            <div>
              <LabelField
                labelText="What Kind of Events Do You Cater? "
                toolTipText=""
                required
              />
              <div>
                {verticals.map((option) => (
                  <StyledFormControlLabel
                    key={option._id}
                    className="pl-1"
                    control={
                      <StyledCheckbox
                        icon={<CustomCheckBox className="h-5 w-5" />}
                        checkedIcon={
                          <CustomCheckBox checked className="h-5 w-5" />
                        }
                        checked={formData?.verticals?.find(
                          (v) => v?.vertical_id === option?._id,
                        )}
                        onChange={(e) => handleVerticalCheck(e, option)}
                      />
                    }
                    label={option.event_vertical_name}
                  />
                ))}
                {errors.verticals ? (
                  <p className="error-text">{errors.verticals}</p>
                ) : null}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <div className="w-full md:w-1/2">
                <CustomInput
                  placeholder="Add your brand name"
                  name="Brand Name"
                  label="Brand Name"
                  value={formData.company_name}
                  onChange={(e) => {
                    handleInputChange("company_name", e.target.value);
                  }}
                  required
                />
                {errors.company_name ? (
                  <p className="error-text">{errors.company_name}</p>
                ) : null}
              </div>
              <div className="w-full md:w-1/2">
                <LabelField
                  labelText="City you want to list your business"
                  className="mb-1.5"
                  required
                />
                <FetchDropdown
                  placeholder="Select city you want to list your business"
                  value={formData.location_id}
                  endPoints={apiHandler.values.cities}
                  filterStr="NA"
                  func={handleDropdownChange}
                  display="name"
                  objKey="location_id"
                  required
                />
                {errors.location_id ? (
                  <p className="error-text">{errors.location_id}</p>
                ) : null}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <div className="relative w-full md:w-1/2">
                <div className="relative">
                  <CustomInput
                    type="number"
                    label="Phone Number"
                    name="Phone Number"
                    value={formData.primary_contact}
                    maxLength={10}
                    onChange={(e) =>
                      handleInputChange("primary_contact", e.target.value)
                    }
                    placeholder="Enter your phone number"
                    required
                  />
                  <div className="absolute bottom-[9px] right-1.5 mt-2 sm:bottom-1.5">
                    {!isOtpVerified && !sendOtp && (
                      <CustomButton
                        text="Verify"
                        disabled={
                          !formData.primary_contact ||
                          formData.primary_contact.length < 10
                        }
                        className={`w-fit !rounded-md !border !px-2 !py-1.5 sm:min-w-14 sm:bg-primary-200 ${formData.primary_contact && formData.primary_contact.length >= 10 ? "!border-blue-100 !text-blue-100" : "!border-primary-400 !text-primary-400"}`}
                        onClick={() => handleSendOtp()}
                      />
                    )}
                  </div>
                </div>
                {errors.primary_contact ? (
                  <p className="error-text">{errors.primary_contact}</p>
                ) : null}
              </div>
              <div className="w-full md:w-1/2">
                <CustomInput
                  label="Email Address"
                  name="Email Address"
                  type="email"
                  value={formData.primary_email}
                  onChange={(e) =>
                    handleInputChange(
                      "primary_email",
                      e?.target?.value?.toLowerCase(),
                    )
                  }
                  placeholder="Enter your email"
                  required
                />
                {errors.primary_email ? (
                  <p className="error-text">{errors.primary_email}</p>
                ) : null}
              </div>
            </div>
            <div className="flex w-full gap-2 sm:gap-3">
              <div className="relative flex-grow">
                <CustomInput
                  id={"pin"}
                  label="PIN"
                  name="pin"
                  type={showPassword ? "text" : "password"}
                  value={formData.pin}
                  maxLength={4}
                  onChange={(e) => {
                    if (!e.target.value || /^\d+$/.test(e.target.value)) {
                      handleInputChange("pin", e.target.value);
                    }
                  }}
                  placeholder="Set a 4-digit PIN for future logins"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-4 flex items-center ${errors.pin ? "top-2" : "top-7 sm:top-[34px]"}`}
                >
                  {!showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
                {errors.pin && (
                  <p className="error-text mt-1 text-sm text-red-500">
                    {errors.pin}
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <StyledCheckbox
                  icon={<CustomCheckBox className="h-5 w-5" />}
                  checkedIcon={<CustomCheckBox checked className="h-5 w-5" />}
                  checked={formData?.want_multiple_cities}
                  onChange={(e) => {
                    handleInputChange(
                      "want_multiple_cities",
                      formData?.want_multiple_cities ? false : true,
                    );
                  }}
                />

                <p className="text-14-600 text-primary-800">
                  Interested in multi-city listing? We’ll reach out!
                </p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <StyledCheckbox
                  icon={<CustomCheckBox className="h-5 w-5" />}
                  checkedIcon={<CustomCheckBox checked className="h-5 w-5" />}
                  checked={formData?.concent}
                  onChange={(e) => {
                    handleInputChange(
                      "concent",
                      formData?.concent ? false : true,
                    );
                  }}
                />

                <p className="text-14-600 text-primary-800">
                  I have read and agreed to the{" "}
                  <Link
                    target="_blank"
                    className="text-green-400"
                    href={ROUTES.privacyPolicy}
                  >
                    Privacy Policy
                  </Link>
                  <span className="ml-0.5 text-[20px] text-red-500">*</span>
                </p>
              </div>
              {errors?.concent ? (
                <p className="error-text">{errors?.concent}</p>
              ) : null}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col gap-2 sm:gap-4">
            <div>
              <CustomInput
                label="Full Name"
                name="Full Name"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="Enter your full name"
                required
              />
              {errors.full_name ? (
                <p className="error-text">{errors.full_name}</p>
              ) : null}
            </div>
            <div>
              <CustomInput
                label="Email Address"
                name="Email Address"
                type="email"
                value={formData.primary_email}
                onChange={(e) =>
                  handleInputChange(
                    "primary_email",
                    e?.target?.value?.toLowerCase(),
                  )
                }
                placeholder="Enter your email"
                required
              />
              {errors.primary_email ? (
                <p className="error-text">{errors.primary_email}</p>
              ) : null}
            </div>

            <div className="relative">
              <div className="relative">
                <CustomInput
                  type="number"
                  label="Phone Number"
                  name="Phone Number"
                  value={formData.primary_contact}
                  maxLength={10}
                  onChange={(e) =>
                    handleInputChange("primary_contact", e.target.value)
                  }
                  placeholder="Enter your phone number"
                  required
                />
                <div className="absolute bottom-[9px] right-1.5 mt-2 sm:bottom-1.5">
                  {!isOtpVerified && !sendOtp && (
                    <CustomButton
                      text="Verify"
                      disabled={
                        !formData.primary_contact ||
                        formData.primary_contact.length < 10
                      }
                      className={`w-fit !rounded-md !border !px-2 !py-1.5 sm:min-w-14 sm:bg-primary-200 ${formData.primary_contact && formData.primary_contact.length >= 10 ? "!border-blue-100 !text-blue-100" : "!border-primary-400 !text-primary-400"}`}
                      onClick={() => handleSendOtp()}
                    />
                  )}
                </div>
              </div>
              {errors.primary_contact ? (
                <p className="error-text">{errors.primary_contact}</p>
              ) : null}
            </div>

            {!isOtpVerified && sendOtp && (
              <div>
                <div className="relative">
                  <CustomInput
                    label=""
                    name="OTP"
                    type="number"
                    value={otp}
                    maxLength={6}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6 digit OTP"
                  />
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                    {!isOtpVerified && (
                      <CustomButton
                        text="Verify"
                        disabled={!otp || otp.length < 6}
                        className={`w-full min-w-20 !rounded-md !border bg-primary-200 !px-2 !py-1.5 ${otp && otp.length >= 6 ? "!border-blue-100 !text-blue-100" : "!border-primary-400 !text-primary-400"}`}
                        onClick={handleVerifyOtp}
                      />
                    )}
                  </div>
                </div>
                {timer > 0 ? (
                  <span className="text-xs text-blue-500 sm:text-sm">
                    Resend OTP in {timer}s
                  </span>
                ) : (
                  <button
                    className="text-xs text-blue-500 sm:text-sm"
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            )}

            <div className="flex w-full gap-2 sm:gap-3">
              <div className="relative flex-grow">
                <CustomInput
                  id={"pin"}
                  label="PIN"
                  name="pin"
                  type={showPassword ? "text" : "password"}
                  value={formData.pin}
                  maxLength={4}
                  onChange={(e) => {
                    if (!e.target.value || /^\d+$/.test(e.target.value)) {
                      handleInputChange("pin", e.target.value);
                    }
                  }}
                  placeholder="Enter your 4 digit PIN"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-4 flex items-center ${errors.pin ? "top-2" : "top-7 sm:top-[34px]"}`}
                >
                  {!showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
                {errors.pin && (
                  <p className="error-text mt-1 text-sm text-red-500">
                    {errors.pin}
                  </p>
                )}
              </div>
            </div>
            <div>
              <LabelField
                labelText="City You Provide Service"
                className="mb-1.5"
                required
              />
              <FetchDropdown
                placeholder="Select city you provide service"
                value={formData.location_id}
                endPoints={apiHandler.values.cities}
                filterStr="NA"
                func={handleDropdownChange}
                display="name"
                objKey="location_id"
                required
              />
              {errors.location_id ? (
                <p className="error-text">{errors.location_id}</p>
              ) : null}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-2 sm:gap-4">
            <div>
              <CustomInput
                // toolTipText="Address"
                label="Address"
                className="!pb-20"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                maxLength={200}
                required
              />
              {errors.address ? (
                <p className="error-text">{errors.address}</p>
              ) : null}
            </div>
            <div className="w-full">
              <FetchDropdown
                required
                placeholder="Enter Your State (Required)"
                value={formData?.state}
                endPoints={apiHandler.values.stateList}
                filterStr={`value=${formData?.business_category_code}`}
                func={handleDropdownChange}
                objKey="state"
                display="state"
              />
              {errors?.state ? (
                <p className="error-text">{errors?.state}</p>
              ) : null}
            </div>
            <div className="w-full">
              <FetchDropdown
                required
                placeholder="Enter Your City (Required)"
                value={formData?.city}
                isComponentDisabled={isEmpty(formData?.state)}
                endPoints={apiHandler.values.cityList}
                filterStr={`state=${state}&value=${formData?.business_category_code}`}
                func={handleDropdownChange}
                objKey="city"
                display="city"
              />
              {errors?.city ? (
                <p className="error-text">{errors?.city}</p>
              ) : null}
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:gap-5">
              <div>
                <CustomDatePicker
                  value={formData.establishment_year}
                  onChange={(newValue) =>
                    handleInputChange("establishment_year", newValue)
                  }
                  picker="year"
                  placeholder="Click to change or add establishment year"
                  label="Establishment Year"
                  // toolTipText="Establishment Year"
                  maxDate={new Date()}
                  required
                />
                {errors.establishment_year ? (
                  <p className="error-text">{errors.establishment_year}</p>
                ) : null}
              </div>
              <div>
                <CustomInput
                  required={isNumberOfEmployeesRequired}
                  placeholder="Click to change or add number of employees"
                  label="Number of employee"
                  value={formData?.no_of_employees}
                  type="number"
                  onChange={(e) =>
                    handleInputChange("no_of_employees", e.target.value)
                  }
                />
                {errors.no_of_employees ? (
                  <p className="error-text">{errors.no_of_employees}</p>
                ) : null}
              </div>
              {/* <div>
                <LabelField
                  labelText="Do you have a GST Number?"
                  // toolTipText="GST"
                />

                <CustomSwitch selected={selected} setSelected={setSelected} />

                {selected ? (
                  <div>
                    <CustomInput
                      required
                      label="Enter your GST Number"
                      name="Enter your GST Number"
                      // toolTipText="GST Number"
                      value={formData.gst_number}
                      onChange={(e) => {
                        if (e.target.value.length <= 15) {
                          handleInputChange("gst_number", e.target.value);
                        }
                      }}
                      placeholder="GST Number"
                    />
                    {errors.gst_number ? (
                      <p className="error-text">{errors.gst_number}</p>
                    ) : null}
                  </div>
                ) : (
                  <div>
                    <CustomInput
                      required
                      name="Enter your Pan Number"
                      label="Enter your Pan Number"
                      // toolTipText="Pan Number"
                      value={formData.pan_number}
                      onChange={(e) => {
                        if (e.target.value.length <= 10) {
                          handleInputChange("pan_number", e.target.value);
                        }
                      }}
                      placeholder="Pan Number"
                    />
                    {errors.pan_number ? (
                      <p className="error-text">{errors.pan_number}</p>
                    ) : null}
                  </div>
                )}
              </div> */}
              {/* <BusinessInfo
                func={changeVerticalAndType}
                errorMsg={errors?.verticals || ""}
                event_type_id={(() => {
                  let obj = {};

                  formData?.verticals?.forEach(
                    (i) =>
                      (obj = {
                        ...obj,
                        [i?.vertical_id]: i?.event_type_id,
                      }),
                  );

                  return obj;
                })()}
              /> */}

              <div>
                <div className="flex items-center gap-1">
                  <StyledCheckbox
                    icon={<CustomCheckBox className="h-5 w-5" />}
                    checkedIcon={<CustomCheckBox checked className="h-5 w-5" />}
                    checked={formData?.concent}
                    onChange={(e) => {
                      handleInputChange(
                        "concent",
                        formData?.concent ? false : true,
                      );
                    }}
                  />

                  <p className="text-14-600 text-primary-800">
                    I have read and agree to the{" "}
                    <Link
                      target="_blank"
                      className="text-green-400"
                      href={ROUTES.privacyPolicy}
                    >
                      Privacy Policy
                    </Link>
                    <span className="ml-0.5 text-[20px] text-red-500">*</span>
                  </p>
                </div>
                {errors?.concent ? (
                  <p className="error-text">{errors?.concent}</p>
                ) : null}
              </div>
            </div>
          </div>
        );
      case 3:
        return <HoldOnTight />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex h-full min-h-screen w-full items-center justify-center bg-cover bg-[center_center] sm:p-5 sm:px-3 sm:py-5`}
      style={{ backgroundImage: `url(${backgroundGradient.src})` }}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-full w-screen flex-col justify-center rounded-[20px] bg-white p-4 shadow-loginContainerShadow xs:p-10 sm:w-full md:w-[70vw] lg:w-[60vw] xl:w-[55vw]">
          <div className="flex flex-col xs:flex-row xs:items-center">
            <div className="mr-auto">
              <Logo className="w-32 sm:w-full" />
            </div>
            <div className="flex justify-start sm:justify-end">
              <p className="text-12-700 text-primary-400">
                Already a member ?
                <button>
                  <Link
                    className="ml-2 text-primary-800"
                    href={ROUTES.vendor.signIn}
                  >
                    Sign in
                  </Link>
                </button>
              </p>
            </div>
          </div>
          <div className="flex h-full flex-col gap-4">
            {/* <h1 className="mb-4 text-4xl font-semibold tracking-[-2px] text-primary-800 lg:text-5xl"> */}
            {/* <h1 className="heading-48 mb-8 sm:mb-10">Sign Up</h1> */}
            <div
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
              className="flex h-full flex-col items-center"
            >
              <Box className="w-full">{renderStepContent(activeStep)}</Box>
              <SignUpButton
                onClick={handleSubmit}
                activeStep={activeStep}
                steps={steps}
                buttonText="Register Now"
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        className="flex h-full w-full items-center justify-center !p-6"
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="relative z-50 flex h-full w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-lg sm:max-w-6xl">
          <div className="sticky top-0 z-50 flex items-center justify-between bg-white p-4 sm:p-6">
            <h3 className="text-xl font-semibold">
              Business category and their subcategory
            </h3>
            <button onClick={() => setOpenModal(false)}>
              <CloseLight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid h-full w-full grid-cols-1 gap-4 overflow-y-auto p-4 pt-0 sm:grid-cols-2 lg:grid-cols-4">
            {categories?.map((v) => (
              <div
                key={v?._id}
                className="flex flex-col gap-2 rounded-lg border p-4 shadow-md"
              >
                <p className="text-lg font-semibold sm:text-xl">
                  {v?.business_category_name}
                </p>
                <div>
                  {v?.businessSubCategories?.map((n) => (
                    <ul key={n?._id}>
                      <li className="ml-4 list-disc">
                        {n?.business_sub_category_name}
                      </li>
                    </ul>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
      <Modal
        open={otpVerifyModal}
        className="flex h-full w-full items-center justify-center !p-6"
      >
        <div className="flex h-fit max-h-full w-full max-w-xs flex-col gap-3 overflow-y-auto rounded-xl bg-primary-20 p-4 xs:max-w-md sm:p-6">
          <>
            <div className="relative">
              <div className="flex flex-col gap-6">
                <p className="text-center text-xl font-medium">
                  Enter 6 digit OTP
                </p>

                <div className="mx-auto flex w-full flex-row items-center justify-between gap-3">
                  <OTPInput
                    errorText={errors.otp}
                    handleBack={() => setOtpVerifyModal(false)}
                    handleConfirm={() => {}}
                    onChangeText={(e) => setOtp(e.target.value)}
                    value={otp}
                    phoneNumber={formData.primary_contact}
                  />
                </div>

                {timer > 0 ? (
                  <span className="text-xs text-blue-500 sm:text-sm">
                    Resend OTP in {timer}s
                  </span>
                ) : (
                  <div className="flex flex-row items-center justify-center space-x-1 text-center text-sm font-medium text-gray-500">
                    <p>{`Didn't recieve OTP?`}</p>
                    <button
                      className="flex flex-row items-center text-green-400"
                      onClick={handleResendOtp}
                    >
                      Resend
                    </button>
                  </div>
                )}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    className="flex w-full flex-row items-center justify-center rounded-xl border border-none bg-green-400 py-3 text-center text-sm text-white shadow-sm outline-none xs:py-4"
                    disabled={!otp || otp.length < 6}
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </button>
                  <button
                    className="border-1 flex w-full flex-row items-center justify-center rounded-xl border py-3 text-center text-sm text-black shadow-sm outline-none xs:py-4"
                    onClick={() => {
                      setOtpVerifyModal(false);
                      setSendOtp(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </>
        </div>
      </Modal>
    </div>
  );
};

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    // left: "-100%",
    // right: "0",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#23C55E",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#23C55E",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    border: 0,
    display: "flex",
    backgroundColor: "#EFEFEF",
    borderRadius: 1,
  },
  "@media (min-width: 320px) and (max-width: 500px)": {
    [`& .${stepConnectorClasses.line}`]: {
      height: 2,
      width: "100%",
    },
  },
  "@media (min-width: 500px) and (max-width: 600px)": {
    [`& .${stepConnectorClasses.line}`]: {
      height: 2,
      width: "100%",
    },
  },
  "@media (min-width: 601px) and (max-width: 960px)": {
    [`& .${stepConnectorClasses.line}`]: {
      height: 2,
    },
  },
  "@media (min-width: 961px)": {
    [`& .${stepConnectorClasses.line}`]: {
      height: 2,
    },
  },
}));

export default SignUp;
