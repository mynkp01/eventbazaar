"use client";

import { apiHandler } from "@api/apiHandler";
import { CustomCheckBox } from "@assets/index";
import CustomButton from "@components/CustomButton";
import CustomInput from "@components/CustomInput";
import { useRef, useState } from "react";
import {
  showPopup,
  showToast,
  StyledCheckbox,
  StyledFormControlLabel,
} from "src/utils/helper";

interface Details {
  name: string;
  email: string;
  company_name: string;
  contact: string;
  concent: boolean;
  isEnterprise?: boolean;
}

export default function ContactFormSection() {
  const fullNameRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const [submitButtonLoading, setSubmitButtonLoading] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<Details>();
  const [details, setDetails] = useState<Details>({
    name: "",
    email: "",
    company_name: "",
    contact: "",
    concent: false,
  });

  const handleInputChange = (path: string, value: string | boolean) => {
    setDetails((prevState) => {
      const newState = { ...prevState };
      newState[path] = value;
      return newState;
    });

    setErrors((prevState) => {
      const newState = { ...prevState };
      newState[path] = "";
      return newState;
    });
  };

  const validateFields = (label: string, value: string | boolean) => {
    let error = "";

    switch (label) {
      case "name":
        if (!value) error = "Please enter your name";
        break;
      case "company_name":
        if (!value) error = "Please enter your company name";
        break;
      case "email":
        if (!value) error = "Please enter your email address";
        else if (!/^\S+@\S+\.\S+$/.test(value as string))
          error = "Invalid email format";
        break;
      case "contact":
        if (!value) error = "Please enter your contact number";
        else if (!/^\d{10}$/.test(value as string))
          error = "Invalid contact number";
        break;
      case "concent":
        if (!value) error = "Please agree to concent";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [label]: error }));
    return { ...errors, [label]: error };
  };

  const handleSubmit = async () => {
    let newErrors = {};

    Object.keys(details).forEach((key) => {
      const err = validateFields(key, details[key]);
      if (err[key]) {
        newErrors[key] = err[key];
      }
    });

    if (Object.keys(newErrors).length === 0) {
      setSubmitButtonLoading(true);
      try {
        const res = await apiHandler.landing.enquiryMail(details);

        if (res.status === 200 || res.status === 201) {
          showPopup(
            "success",
            `Submitted !! Thank You For Sharing the details, Our Team Will Get Back To You Soon.`,
            { confirmButtonText: "OK" },
          );
          setDetails((prevData) => {
            let data = { ...prevData };
            delete data.isEnterprise;
            data = {
              ...data,
              name: "",
              email: "",
              contact: "",
              company_name: "",
              concent: false,
            };
            return data;
          });
        } else {
          showToast("error", res.data?.message);
        }
      } catch (error) {
        showToast("error", error.response?.data?.message || error.message);
      } finally {
        setSubmitButtonLoading(false);
      }
    }
  };

  return (
    <div className="gap-2 rounded-xl bg-white p-8">
      <p className="pb-6 text-3xl font-semibold">Have Query? Reach Us Now!</p>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-2">
        <div>
          <CustomInput
            ref={fullNameRef}
            label="Full Name"
            labelClass="text-gray-500"
            value={details.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <p className="error-text">{errors?.name}</p>
        </div>

        <div>
          <CustomInput
            label="Company Name"
            labelClass="text-gray-500"
            value={details.company_name}
            onChange={(e) => handleInputChange("company_name", e.target.value)}
          />
          <p className="error-text">{errors?.company_name}</p>
        </div>

        <div>
          <CustomInput
            label="Email"
            labelClass="text-gray-500"
            type="email"
            value={details.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <p className="error-text">{errors?.email}</p>
        </div>

        <div>
          <CustomInput
            type="number"
            label="Contact Number"
            id="contact"
            value={details.contact}
            maxLength={10}
            onChange={(e) => handleInputChange("contact", e.target.value)}
            name="contact"
          />
          <p className="error-text">{errors?.contact}</p>
        </div>
      </div>

      <div>
        <StyledFormControlLabel
          className="!text-gray pl-1-500"
          classes={{ label: "!text-gray-500" }}
          control={
            <StyledCheckbox
              icon={<CustomCheckBox className="h-5 w-5" />}
              checkedIcon={<CustomCheckBox checked className="w-5" />}
              checked={details.concent}
              onChange={(e) => handleInputChange("concent", e.target.checked)}
            />
          }
          label="I Wish To Receive EventBazaar.com Update"
        />
        <p className="error-text">{errors?.concent}</p>
      </div>

      <CustomButton
        ref={submitRef}
        loading={submitButtonLoading}
        className="!flex !h-12 !w-full !items-center !justify-center !rounded-md !border !bg-green-400 !text-white !transition-all !duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400"
        onClick={handleSubmit}
        text={"Submit"}
      />
    </div>
  );
}
