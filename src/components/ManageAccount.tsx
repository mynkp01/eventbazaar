import { apiHandler } from "@api/apiHandler";
import { CustomCheckBox, DeleteIcon, PlusIcon, TickIcon } from "@assets/index";
import { Tooltip } from "@mui/material";
import { selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  convertMediaUrl,
  isEmpty,
  showToast,
  StyledCheckbox,
  StyledFormControlLabel,
  validateGSTNumberRegex,
  validatePANNumberRegex,
  validateWebsiteRegex,
} from "src/utils/helper";
import CustomButton from "./CustomButton";
import CustomDatePicker from "./CustomDatePicker";
import CustomImage from "./CustomImage";
import CustomInput from "./CustomInput";
import CustomSwitch from "./CustomSwitch";
import DeleteModal from "./DeleteModal";
import FetchDropdown from "./FetchDropdown";
import LabelField from "./LabelField";
import PageAction from "./PageAction";
import { setDeep } from "./SetDeep";
import VendorDocumentUpload from "./VendorDocumentUpload";

const ManageAccount = ({
  vendorDetails,
  setVendorDetails,
  vendorLogo,
  fetchVendorDetails,
  handleInputChange,
  isGstNumber,
  setIsGstNumber,
  isViewOnly = false,
}) => {
  const dispatch = useAppDispatch();
  const userData = useSelector(selectUser);

  const router = useRouter();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [state, setState] = useState("");
  const [businessSubCategoryOptions, setBusinessSubCategoryOptions] = useState(
    [],
  );
  const [primaryContact, setPrimaryContact] = useState<{
    contact?: string;
    verified?: boolean;
    otpSend?: boolean;
    otp?: string;
  }>({});
  const [contacts, setContacts] = useState([]);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let intervalId;

    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      if (intervalId) clearInterval(intervalId);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timer]);

  const loadSubCategory = async () => {
    try {
      const res = await apiHandler.businessSubCategory.lookup(
        `business_category_id=${vendorDetails.business_category_id}`,
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
  };

  useEffect(() => {
    if (vendorDetails.business_category_id) {
      let obj = { ...vendorDetails };

      if (loadedOnce) {
        obj.business_sub_category_id = [];
      }
      setVendorDetails(obj);
      loadSubCategory();
    }
  }, [vendorDetails?.business_category_id]);

  const handleChangeContacts = (index, value) => {
    const updatedData = { ...vendorDetails };
    updatedData.contacts[index] = value;
    setVendorDetails(updatedData);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024 * 5) {
        showToast("error", "File size can not exceed 5 MB");
        return;
      }

      if (!file.type.includes("image")) {
        showToast("error", `Supported format (IMAGE)`);
        return;
      }

      dispatch(setIsLoading(true));
      try {
        const formData = new FormData();
        formData.append("VENDOR_LOGO", file);
        const res = await apiHandler.vendorDoc.vendorDocument(formData);

        if (res.status === 200 || res.status === 201) {
          showToast("success", res?.data.message);
          fetchVendorDetails();
        } else {
          showToast("error", res?.data.message);
        }
      } catch (error) {
        showToast("error", error.response?.data?.message || error.message);
      }
      dispatch(setIsLoading(false));
    }
  };

  const handleDropdownChange = (category: any, value: any) => {
    const updatedData = { ...vendorDetails };
    updatedData[category] = value?._id;
    if (category === "business_category_id") {
      updatedData.business_category_code = value.value_code;
    }
    if (category === "state") {
      updatedData.city = "";
      setState(value?.state);
    }
    setVendorDetails(updatedData);
    validateFields(category, value);
  };

  const handleCheck = (e, obj) => {
    let idArr = [...vendorDetails.business_sub_category_id];

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
    setVendorDetails({ ...vendorDetails, business_sub_category_id: idArr });
  };

  const handleSendOtp = async (v, primary) => {
    try {
      dispatch(setIsLoading(true));

      const res = await apiHandler.vendor.vendorSendOtp({
        _id: vendorDetails._id,
        full_name: vendorDetails.full_name,
        email: vendorDetails.primary_email,
        contact: v.contact,
        primary: primary,
      });

      if (res.status === 200 || res.status === 201) {
        showToast("success", res.data.message);
        primary
          ? setPrimaryContact((prev) => ({
              ...prev,
              otpSend: true,
            }))
          : handleContactChange("otpSend", true);
        setTimer(60);
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  const handleVerifyOtp = async (v, primary) => {
    if (v.otpSend && v.otp && !v.verified) {
      dispatch(setIsLoading(true));
      try {
        const res = await apiHandler.vendor.vendorVerifyOtp({
          _id: vendorDetails._id,
          full_name: vendorDetails.full_name,
          email: vendorDetails.primary_email,
          contact: v.contact,
          otp: v.otp,
          primary: primary,
        });
        if (res.status === 200 || res.status === 201) {
          showToast("success", res.data.message);
          fetchVendorDetails();
          setPrimaryContact({});
          setContacts([]);
        } else {
          showToast("error", res.data.message);
        }
      } catch (error) {
        showToast("error", error.response?.data?.message || error.message);
      }
      dispatch(setIsLoading(false));
    }
  };

  const handleResendOtp = async (v, primary) => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.vendor.vendorReSendOtp({
        _id: vendorDetails._id,
        full_name: vendorDetails.full_name,
        email: vendorDetails.primary_email,
        contact: v.contact,
        primary: primary,
      });
      if (res.status === 200 || res.status === 201) {
        showToast("success", res.data.message);
        primary
          ? setPrimaryContact((prev) => ({
              ...prev,
              otpSend: true,
            }))
          : handleContactChange("otpSend", true);
        setTimer(60);
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  const handleRemoveContacts = (index) => {
    const updatedData = { ...vendorDetails };
    updatedData.contacts.splice(index, 1);
    setVendorDetails(updatedData);
  };

  const handleContactChange = (path: string, value: any) => {
    const updatedData = [...contacts];
    updatedData[0][path] = value;
    setContacts(updatedData);
  };

  const removeImage = async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.vendorDoc.vendorDocumentDelete(
        vendorLogo._id,
      );

      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data.message);
        fetchVendorDetails();
        setOpenDeleteModal(false);
      } else {
        showToast("error", res?.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  const handleSubmit = async (data) => {
    try {
      setContacts([]);
      data.contacts = data.contacts.filter((v) => v !== "");
      dispatch(setIsLoading(true));
      const res = await apiHandler.vendor.vendorProfileUpdate(
        userData?.user_id,
        { ...data, updateSection: "manage_account" },
      );

      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data.message);
        fetchVendorDetails();
      } else {
        showToast("error", res?.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  const validateFields = (label: string, value: string) => {
    let error = "";

    switch (label) {
      case "company_name":
        if (isEmpty(value)) error = "Please enter company name";
        break;
      case "business_category_id":
        if (isEmpty(value)) error = "Please select business category";
        break;
      case "business_sub_category_id":
        if (isEmpty(value)) error = "Please select business sub category";
        break;
      case "full_name":
        if (isEmpty(value)) error = "Please enter your full name";
        break;
      case "primary_email":
        if (isEmpty(value)) error = "Please enter your email address";
        else if (!/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
        break;
      case "primary_contact":
        if (isEmpty(value)) error = "Please enter your phone number";
        else if (!/^\d{10}$/.test(value)) error = "Invalid phone number";
        break;
      case "location_id":
        if (isEmpty(value)) error = "Please select city you provide service";
        break;
      case "city":
        if (isEmpty(value)) error = "Please enter your city";
        break;
      case "state":
        if (isEmpty(value)) error = "Please enter your state";
        break;
      case "service_location_id":
        if (isEmpty(value)) error = "Please select service location";
        break;
      case "no_of_employees":
        if (!value) error = "Please enter number of employees";
        break;
      case "budget":
        if (!value) error = "Please enter budget";
        break;
      case "establishment_year":
        if (!value) error = "Please select establishment year";
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
      default:
        break;
    }

    const errObj = { ...errors, [label]: error };
    setErrors(errObj);
    return errObj;
  };

  const handleSave = async () => {
    let newErrors = {},
      requiredFields = [];

    requiredFields = [
      "company_name",
      "business_category_id",
      "business_sub_category_id",
      "full_name",
      "primary_email",
      "primary_contact",
      "location_id",
      "city",
      "state",
      "establishment_year",
      "no_of_employees",
      "budget",
    ];
    if (isGstNumber) {
      requiredFields.push("gst_number");
    } else {
      requiredFields.push("pan_number");
    }

    requiredFields.forEach((field) => {
      const err = validateFields(field, vendorDetails[field]);
      if (err[field]) {
        newErrors[field] = err[field];
      }
    });
    if (
      Object.keys(vendorDetails?.social_presence).every((key) =>
        isEmpty(vendorDetails?.social_presence?.[key]),
      )
    ) {
      newErrors["social_presence"] =
        "Please enter any of the one link to above";
    } else {
      newErrors["social_presence"] = {};
      Object.keys(vendorDetails?.social_presence).forEach((key) => {
        if (
          vendorDetails?.social_presence?.[key] &&
          !validateWebsiteRegex.test(vendorDetails?.social_presence?.[key])
        ) {
          newErrors["social_presence"][key] = "Please enter valid link";
        } else {
          newErrors["social_presence"][key] = "";
        }
      });
      if (Object.values(newErrors["social_presence"]).every((v) => v === "")) {
        delete newErrors?.social_presence;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      handleSubmit(vendorDetails);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="h-6 w-2 rounded-md bg-green-50 sm:h-8 sm:w-4"></div>
        <h4 className="text-20-600 text-primary-800">Account Information</h4>
      </div>

      <div className="flex flex-col">
        <div className="mb-3 flex flex-col items-start gap-2 sm:mb-0 sm:flex-row sm:items-center sm:gap-3">
          <div className="my-3 flex max-h-20 min-h-20 w-fit min-w-20 max-w-20 items-center justify-center overflow-hidden rounded-full border-4 border-orange-100 sm:my-6 sm:max-h-24 sm:min-h-24 sm:min-w-24 sm:max-w-24">
            {isEmpty(vendorLogo?.doc_path) ? (
              <PlusIcon className="max-h-14 min-h-12 min-w-12 max-w-14" />
            ) : (
              <CustomImage
                src={convertMediaUrl(vendorLogo.doc_path)}
                alt="vendor logo"
                className="max-h-20 min-h-20 min-w-20 max-w-20 rounded-full object-cover sm:max-h-24 sm:min-h-24 sm:min-w-24 sm:max-w-24"
              />
            )}
          </div>
          <div className="flex gap-4">
            <label htmlFor="file-upload" className="relative cursor-pointer">
              {!isViewOnly ? (
                <button className="btn-fill-hover h-auto w-auto cursor-pointer rounded-xl border-2 border-blue-100 bg-blue-100 px-2 py-1 text-sm font-semibold text-primary-100 sm:px-3 sm:py-2 md:px-4 md:py-2.5">
                  <div className="flex items-end justify-end gap-1 sm:gap-2">
                    <PlusIcon className="h-4 w-4 md:h-5 md:w-5" />
                    <p className="text-xs md:text-sm">Upload Logo</p>
                  </div>
                </button>
              ) : null}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="file-upload"
                disabled={isViewOnly}
                className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>
            <div>
              {!isViewOnly && !isEmpty(vendorLogo?.doc_path) ? (
                <CustomButton
                  text="Remove"
                  className="btn-outline-hover border-primary-50 px-4 py-1.5 text-primary-800 sm:px-5 sm:py-2"
                  onClick={() => setOpenDeleteModal(true)}
                />
              ) : null}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-y-6">
          <div className="col-span-2">
            <CustomInput
              toolTipText="Full Name"
              label="Full Name"
              disabled={isViewOnly}
              value={vendorDetails.full_name}
              onChange={(e) =>
                handleInputChange("full_name", e.target.value, setErrors)
              }
            />
            {errors?.full_name ? (
              <p className="error-text">{errors?.full_name}</p>
            ) : null}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              toolTipText="Company Name"
              label="Company Name"
              value={vendorDetails.company_name}
              disabled={isViewOnly}
              onChange={(e) =>
                handleInputChange("company_name", e.target.value, setErrors)
              }
            />
            {errors?.company_name ? (
              <p className="error-text">{errors?.company_name}</p>
            ) : null}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <LabelField
              labelText="Business Category"
              toolTipText="Business Category"
              className="mb-1.5"
            />
            <FetchDropdown
              placeholder="Select Business Category"
              value={vendorDetails.business_category_id}
              endPoints={apiHandler.businessCategory.lookup}
              filterStr="NA"
              func={handleDropdownChange}
              display="business_category_name"
              objKey="business_category_id"
              required
              isComponentDisabled={true}
            />
            {errors?.business_category_id ? (
              <p className="error-text">{errors?.business_category_id}</p>
            ) : null}
          </div>
          {isViewOnly &&
          isEmpty(vendorDetails?.business_sub_category_id) ? null : (
            <div className="col-span-2">
              <LabelField
                labelText="Business Sub Category"
                toolTipText="Select Business Sub Category"
              />
              <div>
                {isViewOnly ? (
                  <div className="flex gap-4">
                    {businessSubCategoryOptions
                      ?.filter((i) =>
                        vendorDetails?.business_sub_category_id?.includes(
                          i?._id,
                        ),
                      )
                      ?.map((i) => (
                        <p key={i?._id}>{i?.business_sub_category_name}</p>
                      ))}
                  </div>
                ) : (
                  businessSubCategoryOptions?.map((option) => (
                    <StyledFormControlLabel
                      key={option._id}
                      className="pl-1"
                      control={
                        <StyledCheckbox
                          icon={<CustomCheckBox className="h-5 w-5" />}
                          checkedIcon={
                            <CustomCheckBox checked className="h-5 w-5" />
                          }
                          checked={vendorDetails?.business_sub_category_id?.includes(
                            option?._id,
                          )}
                          onChange={(e) => handleCheck(e, option)}
                        />
                      }
                      label={option.business_sub_category_name}
                    />
                  ))
                )}
                {errors?.business_sub_category_id ? (
                  <p className="error-text">
                    {errors?.business_sub_category_id}
                  </p>
                ) : null}
              </div>
            </div>
          )}
          <div className="col-span-2">
            <CustomInput
              toolTipText="Email"
              label="Email"
              disabled={isViewOnly || true}
              value={vendorDetails.primary_email}
              onChange={(e) =>
                handleInputChange("primary_email", e.target.value, setErrors)
              }
            />
            {errors?.primary_email ? (
              <p className="error-text">{errors?.primary_email}</p>
            ) : null}
          </div>

          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              toolTipText="Website link"
              disabled={isViewOnly}
              label="Website link"
              onChange={(e) =>
                handleInputChange(
                  "social_presence.website",
                  e.target.value,
                  setErrors,
                )
              }
              value={vendorDetails?.social_presence?.website}
            />
            {errors?.social_presence?.website ? (
              <p className="error-text">{errors?.social_presence?.website}</p>
            ) : null}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              toolTipText="Instagram link"
              disabled={isViewOnly}
              label="Instagram link"
              onChange={(e) =>
                handleInputChange(
                  "social_presence.instagram",
                  e.target.value,
                  setErrors,
                )
              }
              value={vendorDetails?.social_presence?.instagram}
            />
            {errors?.social_presence?.instagram ? (
              <p className="error-text">{errors?.social_presence?.instagram}</p>
            ) : null}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              toolTipText="Facebook link"
              disabled={isViewOnly}
              label="Facebook link"
              onChange={(e) =>
                handleInputChange(
                  "social_presence.facebook",
                  e.target.value,
                  setErrors,
                )
              }
              value={vendorDetails?.social_presence?.facebook}
            />
            {errors?.social_presence?.facebook ? (
              <p className="error-text">{errors?.social_presence?.facebook}</p>
            ) : null}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              toolTipText="YouTube link"
              disabled={isViewOnly}
              label="YouTube link"
              onChange={(e) =>
                handleInputChange(
                  "social_presence.youtube",
                  e.target.value,
                  setErrors,
                )
              }
              value={vendorDetails?.social_presence?.youtube}
            />
            {errors?.social_presence?.youtube ? (
              <p className="error-text">{errors?.social_presence?.youtube}</p>
            ) : null}
          </div>
          {typeof errors?.social_presence === "string" ? (
            <p className="error-text">{errors?.social_presence}</p>
          ) : null}
          <div className="col-span-2 flex flex-col gap-3">
            <div className="relative h-auto w-full">
              <CustomInput
                toolTipText="Primary mobile number will not update until user verify by providing valid otp"
                label="Primary Mobile Number"
                disabled={isViewOnly || true}
                type="number"
                value={
                  isEmpty(primaryContact)
                    ? vendorDetails.primary_contact
                    : primaryContact?.contact
                }
                maxLength={10}
                onChange={(e) => {
                  if (isEmpty(primaryContact)) {
                    setPrimaryContact({
                      contact: e?.target?.value,
                      otp: "",
                      otpSend: false,
                      verified: false,
                    });
                  } else {
                    setPrimaryContact((prev) => ({
                      ...prev,
                      contact: e?.target?.value,
                    }));
                  }
                }}
              />
              {isEmpty(primaryContact) ? (
                <div className="absolute bottom-1.5 right-1 flex items-center rounded-lg p-1 text-white sm:right-2 sm:p-2">
                  <Tooltip title="Verified" placement="top">
                    <div>
                      <TickIcon className="!h-5 !w-5" stroke={"#23C55E"} />
                    </div>
                  </Tooltip>
                </div>
              ) : (
                <div className="absolute bottom-[9px] right-1.5 mt-2 sm:bottom-1.5">
                  {!primaryContact?.verified && !primaryContact?.otpSend && (
                    <CustomButton
                      text="Verify"
                      disabled={
                        !primaryContact?.contact ||
                        primaryContact?.contact?.length < 10
                      }
                      className={`w-fit !rounded-md !border !px-2 !py-1.5 sm:min-w-14 sm:bg-primary-200 ${primaryContact?.contact && primaryContact?.contact?.length >= 10 ? "!border-blue-100 !text-blue-100" : "!border-primary-400 !text-primary-400"}`}
                      onClick={() => handleSendOtp(primaryContact, true)}
                    />
                  )}
                </div>
              )}
            </div>

            {!isEmpty(primaryContact) &&
              !primaryContact?.verified &&
              primaryContact?.otpSend && (
                <div>
                  <div className="relative">
                    <CustomInput
                      className="!mt-0"
                      label=""
                      name="OTP"
                      type="number"
                      value={primaryContact?.otp}
                      maxLength={6}
                      onChange={(e) => {
                        setPrimaryContact((prev) => ({
                          ...prev,
                          otp: e?.target?.value,
                        }));
                      }}
                      placeholder="Enter 6 digit OTP"
                    />
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                      {!primaryContact?.verified && (
                        <CustomButton
                          text="Verify"
                          disabled={
                            !primaryContact?.otp ||
                            primaryContact?.otp?.length < 6
                          }
                          className={`w-full min-w-20 !rounded-md !border bg-primary-200 !px-2 !py-1.5 ${primaryContact?.otp && primaryContact?.otp.length >= 6 ? "!border-blue-100 !text-blue-100" : "!border-primary-400 !text-primary-400"}`}
                          onClick={() => handleVerifyOtp(primaryContact, true)}
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
                      onClick={() => handleResendOtp(primaryContact, true)}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}
          </div>

          <div className="col-span-2">
            <LabelField
              labelText="Location"
              toolTipText="Location"
              className="mb-1.5"
            />
            <FetchDropdown
              placeholder="Please select location here"
              value={vendorDetails.location_id}
              endPoints={apiHandler.values.cities}
              filterStr="NA"
              func={handleDropdownChange}
              display="name"
              objKey="location_id"
              required
              isComponentDisabled={isViewOnly}
            />
            {errors?.location_id ? (
              <p className="error-text">{errors?.location_id}</p>
            ) : null}
          </div>
          {isViewOnly && isEmpty(vendorDetails?.contacts) ? null : (
            <div className="col-span-2">
              <LabelField
                labelText="Secondary Mobile Number"
                toolTipText="Secondary mobile number will not update until user verify by providing valid otp"
              />
              {vendorDetails.contacts.map((number, index) => (
                <div
                  key={index}
                  className="mt-3 flex items-center gap-1 sm:gap-3"
                >
                  <div className="relative h-auto w-full">
                    <CustomInput
                      type="number"
                      value={number}
                      maxLength={10}
                      onChange={(e) =>
                        handleChangeContacts(index, e.target.value)
                      }
                      className="!my-0 block w-full rounded-lg border-gray-300 px-3 py-2"
                      placeholder={`${index + 1}.`}
                      disabled
                    />
                    <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center rounded-lg p-1 text-white sm:right-2 sm:p-2">
                      <Tooltip title="Verified" placement="top">
                        <div>
                          <TickIcon className="!h-5 !w-5" stroke={"#23C55E"} />
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                  {!isViewOnly ? (
                    <Tooltip title="Delete" placement="top">
                      <button
                        className="z-10 rounded-lg text-red-300"
                        onClick={() => handleRemoveContacts(index)}
                      >
                        <DeleteIcon className="h-5 w-5" />
                      </button>
                    </Tooltip>
                  ) : null}
                </div>
              ))}

              {contacts.map((v, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="relative">
                    <CustomInput
                      type="number"
                      value={v.contact}
                      maxLength={10}
                      onChange={(e) => {
                        handleContactChange("contact", e?.target?.value);
                        if (v.otpSend) {
                          handleContactChange("otpSend", false);
                        }
                      }}
                      placeholder={`${[...vendorDetails.contacts, ...contacts].length}.`}
                    />

                    <div className="absolute bottom-[9px] right-1.5 mt-2 sm:bottom-1.5">
                      {!v.verified && !v.otpSend && (
                        <CustomButton
                          text="Verify"
                          disabled={!v.contact || v.contact.length < 10}
                          className={`w-fit !rounded-md !border !px-2 !py-1.5 sm:min-w-14 sm:bg-primary-200 ${v.contact && v.contact.length >= 10 ? "!border-blue-100 !text-blue-100" : "!border-primary-400 !text-primary-400"}`}
                          onClick={() => handleSendOtp(v, false)}
                        />
                      )}
                    </div>
                  </div>

                  {!v.verified && v.otpSend && (
                    <div>
                      <div className="relative">
                        <CustomInput
                          className="!mt-0"
                          label=""
                          name="OTP"
                          type="number"
                          value={v.otp}
                          maxLength={6}
                          onChange={(e) =>
                            handleContactChange("otp", e?.target?.value)
                          }
                          placeholder="Enter 6 digit OTP"
                        />
                        <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                          {!v.verified && (
                            <CustomButton
                              text="Verify"
                              disabled={!v.otp || v.otp.length < 6}
                              className={`w-full min-w-20 !rounded-md !border bg-primary-200 !px-2 !py-1.5 ${v.otp && v.otp.length >= 6 ? "!border-blue-100 !text-blue-100" : "!border-primary-400 !text-primary-400"}`}
                              onClick={() => handleVerifyOtp(v, false)}
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
                          onClick={() => handleResendOtp(v, false)}
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {!isViewOnly
                ? vendorDetails.contacts.length < 4 && (
                    <CustomButton
                      disabled={contacts.length}
                      text="Add"
                      onClick={() =>
                        setContacts([
                          {
                            contact: "",
                            otp: "",
                            otpSend: false,
                            verified: false,
                          },
                        ])
                      }
                      className="text-15-700 btn-fill-hover mt-3 h-fit w-fit !rounded-xl border-2 border-blue-100 bg-blue-100 px-2 py-1.5 text-primary-100 hover:!border-blue-600 hover:!bg-blue-600 sm:px-3 sm:py-1.5"
                    />
                  )
                : null}
            </div>
          )}
          <div className="col-span-2 flex flex-col gap-y-1 md:gap-y-3">
            <div>
              <CustomInput
                toolTipText="Address"
                label="Address"
                multiple
                disabled={isViewOnly}
                className="!py-4 !pb-20"
                isTextArea
                value={vendorDetails?.address}
                onChange={(e) =>
                  handleInputChange("address", e.target.value, setErrors)
                }
              />
              {errors?.address ? (
                <p className="error-text">{errors?.address}</p>
              ) : null}
            </div>
            <div className="flex w-full flex-col gap-x-4 gap-y-2 md:flex-row">
              <div className="w-full">
                <FetchDropdown
                  required
                  label="State"
                  placeholder={
                    !isViewOnly
                      ? "Enter Your State (Required)"
                      : "No State Selected"
                  }
                  value={vendorDetails?.state}
                  endPoints={apiHandler.values.stateList}
                  filterStr={`value=${vendorDetails?.business_category_code}`}
                  isComponentDisabled={isViewOnly}
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
                  label="City"
                  placeholder={
                    !isViewOnly
                      ? "Enter Your City (Required)"
                      : "No City Selected"
                  }
                  value={vendorDetails?.city}
                  isComponentDisabled={
                    isEmpty(vendorDetails?.state) || isViewOnly
                  }
                  endPoints={apiHandler.values.cityList}
                  filterStr={`state=${state}&value=${vendorDetails?.business_category_code}`}
                  func={handleDropdownChange}
                  objKey="city"
                  display="city"
                />
                {errors?.city ? (
                  <p className="error-text">{errors?.city}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-5 flex items-center gap-3 sm:mb-10">
          <div className="h-6 w-2 rounded-md bg-green-50 sm:h-8 sm:w-4"></div>
          <h4 className="text-20-600 text-primary-800">Company Info</h4>
        </div>
        <div className="space-y-2 sm:space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              {!isViewOnly ? (
                <CustomDatePicker
                  value={vendorDetails.establishment_year}
                  onChange={(newValue) =>
                    handleInputChange("establishment_year", newValue, setErrors)
                  }
                  picker="year"
                  placeholder="Click to change or add establishment year"
                  label="Establishment Year"
                  toolTipText="Establishment Year"
                  maxDate={new Date()}
                  disabled={isViewOnly}
                />
              ) : (
                <CustomInput
                  placeholder="Click to change or add establishment year"
                  label="Establishment Year"
                  disabled={isViewOnly}
                  value={
                    vendorDetails?.establishment_year
                      ? moment(vendorDetails.createdAt).format("YYYY")
                      : ""
                  }
                />
              )}
              {errors?.establishment_year ? (
                <p className="error-text">{errors.establishment_year}</p>
              ) : null}
            </div>
            <div>
              <CustomInput
                toolTipText="Number of employee"
                placeholder="Click to change or add number of employees"
                label="Number of employee"
                disabled={isViewOnly}
                type="number"
                value={vendorDetails?.no_of_employees}
                onChange={(e) =>
                  handleInputChange(
                    "no_of_employees",
                    e.target.value,
                    setErrors,
                  )
                }
              />
              {errors?.no_of_employees ? (
                <p className="error-text">{errors?.no_of_employees}</p>
              ) : null}
            </div>
          </div>
          <div>
            <CustomInput
              toolTipText="Budget"
              placeholder="Your Event Services Start From (₹)"
              disabled={isViewOnly}
              label="Budget"
              type="number"
              value={vendorDetails?.budget}
              onChange={(e) =>
                handleInputChange("budget", e.target.value, setErrors)
              }
            />
            {errors?.budget ? (
              <p className="error-text">{errors?.budget}</p>
            ) : null}
          </div>
          <div>
            <LabelField
              labelText="Top 3 Client Names"
              toolTipText="Top 3 Client Names"
            />
            <div className="grid gap-x-4 lg:grid-cols-3">
              {[0, 1, 2].map((clientName, index) => (
                <CustomInput
                  key={index}
                  disabled={isViewOnly}
                  placeholder={`${index + 1}.`}
                  value={vendorDetails?.top3_client_name[clientName]}
                  onChange={(e) =>
                    handleInputChange(
                      `top3_client_name.${index}`,
                      e.target.value,
                      setErrors,
                    )
                  }
                />
              ))}
            </div>
          </div>
          <div className="flex w-full flex-col lg:flex-row">
            {!isViewOnly ? (
              <div className="lg:w-2/5">
                <LabelField
                  labelText="Do you have a GST Number?"
                  toolTipText="if you have a GST Number select 'Yes'"
                />
                <CustomSwitch
                  selected={isGstNumber}
                  setSelected={setIsGstNumber}
                />
              </div>
            ) : null}
            <div className="lg:w-3/5">
              <CustomInput
                disabled={isViewOnly}
                label={
                  isGstNumber
                    ? "Enter your GST Number here"
                    : "Enter your PAN Number here"
                }
                name={
                  isGstNumber
                    ? "Enter your GST Number here"
                    : "Enter your PAN Number here"
                }
                toolTipText={isGstNumber ? "GST Number" : "PAN Number"}
                value={
                  isGstNumber
                    ? vendorDetails.gst_number
                    : vendorDetails.pan_number
                }
                onChange={(e) => {
                  if (isGstNumber && e.target.value.length <= 15) {
                    handleInputChange(
                      "gst_number",
                      e.target.value.toUpperCase(),
                      setErrors,
                    );
                  } else if (!isGstNumber && e.target.value.length <= 10) {
                    handleInputChange(
                      "pan_number",
                      e.target.value.toUpperCase(),
                      setErrors,
                    );
                  }
                }}
                placeholder={isGstNumber ? "GST Number" : "PAN Number"}
              />

              {isGstNumber ? (
                errors?.gst_number ? (
                  <p className="error-text">{errors?.gst_number}</p>
                ) : null
              ) : errors?.pan_number ? (
                <p className="error-text">{errors?.pan_number}</p>
              ) : null}
            </div>
          </div>
          {!isViewOnly ? (
            <div>
              <LabelField
                labelText="Company registration details"
                toolTipText="Company registration details"
              />
              <VendorDocumentUpload />
            </div>
          ) : null}
        </div>

        <PageAction
          className="!mt-2 w-full sm:!mt-8 sm:py-0"
          btnPrimaryLabel="Cancel"
          btnPrimaryClassName="hover:!bg-primary-100 hover:!text-blue-100"
          btnSecondaryLabel={!isViewOnly ? "Save" : null}
          btnSecondaryClassName="border-2 hover:!bg-blue-100 hover:!text-primary-100"
          btnPrimaryFun={() => router.back()}
          btnSecondaryFun={!isViewOnly ? handleSave : null}
        />
      </div>
      <DeleteModal
        func={removeImage}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
      />
    </>
  );
};

export default ManageAccount;
