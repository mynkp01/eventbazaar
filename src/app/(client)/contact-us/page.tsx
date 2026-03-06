"use client";
import { apiHandler } from "@api/apiHandler";
import { CallIcon, MailLight } from "@assets/index";
import CustomInput from "@components/CustomInput";
import LabelField from "@components/LabelField";
import { selectUser, setVisibleLoginModal } from "@redux/slices/authSlice";
import { selectSelectedCity } from "@redux/slices/lookupSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MAILS } from "src/utils/Constant";
import { isEmpty, showToast } from "src/utils/helper";

const SendMessageTab = () => {
  const InquiryFor = [
    { name: "Vendor", value: "vendor" }, // First index is default
    { name: "Customer", value: "customer" },
  ];

  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const selectedCity = useSelector(selectSelectedCity);

  const [contactData, setContactData] = useState<{
    name?: string;
    email?: string;
    contact?: string;
    message?: string;
  }>(null);
  const [errors, setErrors] = useState<typeof contactData>(null);
  const [selectedTab, setSelectedTab] = useState(InquiryFor[0]);

  useEffect(() => {
    setContactData({
      name: user?.full_name,
      email: user?.primary_email ? user?.primary_email : user?.email,
      contact: user?.primary_contact ? user?.primary_contact : user?.contact,
      message: "",
    });
  }, [user]);

  const onClickSendMessage = async () => {
    try {
      if (isEmpty(selectedCity)) {
        showToast("error", "Please select a city first");
        return;
      }

      dispatch(setIsLoading(true));

      const { data, status } = await apiHandler.landing.enquiryMail({
        ...contactData,
        isVendor: selectedTab.value === InquiryFor[0].value,
      });

      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        if (!isEmpty(user)) {
          setContactData((prevData) => ({ ...prevData, message: "" }));
        } else {
          setContactData(null);
        }
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const validateFields = (label: string, value: string) => {
    let error = "";

    switch (label) {
      case "name":
        if (isEmpty(value.trim())) error = "Please enter your name";
        break;
      case "email":
        if (isEmpty(value.trim())) error = "Please enter your email address";
        else if (!/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
        break;
      case "contact":
        if (isEmpty(value.trim())) error = "Please enter your contact number";
        else if (!/^\d{10}$/.test(value)) error = "Invalid contact number";
        break;
      case "message":
        if (isEmpty(value.trim())) error = "Please enter message";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [label]: error }));
    return { ...errors, [label]: error };
  };

  const handleSendMessageChange = (e) => {
    const { name, value } = e?.target;

    setContactData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateFields(name, value),
    }));
  };

  const handleSendMessageClick = async () => {
    if (isEmpty(user)) {
      dispatch(setVisibleLoginModal(true));
      return;
    }

    let newErrors = {};

    Object.keys(contactData).forEach((key) => {
      const err = validateFields(key, contactData[key]);
      if (err[key]) {
        newErrors[key] = err[key];
      }
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await onClickSendMessage();
    }
  };

  return (
    <div className="gap-3 rounded-lg bg-white p-4 text-gray-700 shadow-lg lg:w-6/12 xl:w-4/12">
      <div className="flex items-center gap-2">
        <LabelField labelText="Inquiry For: " />
        <div className="w-fit rounded-full bg-gray-200 p-1">
          {InquiryFor.map((item) => (
            <button
              key={item.value}
              onClick={() => setSelectedTab(item)}
              className={`relative rounded-full px-1 py-1 text-sm font-medium transition-colors duration-200 ease-in-out sm:px-4 sm:py-1.5 ${
                selectedTab.value === item.value
                  ? "text-gray-900 shadow-switchButton"
                  : "text-gray-500"
              }`}
              style={{ minWidth: "80px" }}
            >
              {selectedTab.value === item.value && (
                <motion.div
                  layoutId="bubble"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}
              <span className="relative flex items-center justify-center">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <CustomInput
          name="name"
          value={contactData?.name}
          onChange={handleSendMessageChange}
          placeholder="Enter your name"
          disabled={!isEmpty(user)}
        />
      </div>
      <div className="flex-1">
        <CustomInput
          name="email"
          type="email"
          value={contactData?.email}
          onChange={handleSendMessageChange}
          placeholder="Enter your email"
          disabled={!isEmpty(user)}
        />
      </div>
      <div className="flex-1">
        <CustomInput
          name="contact"
          type="number"
          value={contactData?.contact}
          onChange={handleSendMessageChange}
          maxLength={10}
          placeholder="Enter your contact"
          disabled={!isEmpty(user)}
        />
      </div>
      <div className="my-2 flex-1">
        <CustomInput
          name="message"
          type="text"
          value={contactData?.message}
          onChange={handleSendMessageChange}
          className="!mt-1 !min-h-24 w-full rounded !p-2"
          isTextArea
          label="Message"
          required
        />
        {errors?.message && (
          <p className="error-text !mt-0 text-sm text-red-500">
            {errors?.message}
          </p>
        )}
      </div>
      <button
        onClick={handleSendMessageClick}
        className="flex h-12 w-full items-center justify-center rounded-md border bg-green-400 p-1.5 text-white transition-all duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400"
      >
        Send Message
      </button>
    </div>
  );
};

const ContactUs = () => {
  return (
    <div className="grid w-full items-start gap-20 px-6 py-14 xs:p-14 md:p-20 lg:flex lg:p-24">
      <div className="flex flex-col gap-7 lg:w-6/12 xl:w-8/12">
        <div className="flex flex-col gap-2.5">
          <p className="text-3xl font-semibold md:text-4xl">Contact Us</p>
          {/* <p className="text-sm md:text-base">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has survived
            not only five centuries, but also the leap
          </p> */}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5">
            <p className="text-lg font-semibold md:text-xl">Vendors</p>
            <p className="text-sm md:text-base">
              If you are a registered vendor or a business looking to promote
              your brand on our portal, please send in your queries at{" "}
              <Link
                href={`mailto:${MAILS.VENDORS_MAIL}`}
                className="group flex items-center gap-1 text-left hover:text-green-400"
              >
                <MailLight className="size-4 transition-all duration-300 group-hover:scale-125" />
                <p>{MAILS.VENDORS_MAIL}</p>
              </Link>
              <Link
                href="tel:+917436044777"
                className="group flex items-center gap-1 text-left hover:text-green-400"
              >
                <CallIcon
                  className="size-4 transition-all duration-300 group-hover:scale-125"
                  fill="currentColor"
                />
                <p>+91 74360 44777</p>
              </Link>
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="text-lg font-semibold md:text-xl">Customer</p>
            <p>
              We love to hear from our precious users. For any feedback or
              queries simply write in to{" "}
              <Link
                href={`mailto:${MAILS.INFO_MAIL}`}
                className="group flex items-center gap-1 text-left hover:text-green-400"
              >
                <MailLight className="size-4 transition-all duration-300 group-hover:scale-125" />
                <p>{MAILS.INFO_MAIL}</p>
              </Link>
              <Link
                href="tel:+917435044777"
                className="group flex items-center gap-1 text-left hover:text-green-400"
              >
                <CallIcon
                  className="size-4 transition-all duration-300 group-hover:scale-125"
                  fill="currentColor"
                />
                <p>+91 74350 44777</p>
              </Link>
            </p>
          </div>
        </div>
      </div>

      <SendMessageTab />
    </div>
  );
};

export default ContactUs;
