"use client";
import { apiHandler } from "@api/apiHandler";
import { EBLogoRoundedSvg, PlusMinusIcon, WhatsApp } from "@assets/index";
import CustomButton from "@components/CustomButton";
import CustomInput from "@components/CustomInput";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { selectUser, setVisibleLoginModal } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import moment from "moment";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty, showToast } from "src/utils/helper";

const CustomDatePicker = dynamic(() => import("@components/CustomDatePicker"), {
  ssr: true,
});

const FetchDropdown = dynamic(() => import("@components/FetchDropdown"), {
  ssr: true,
});

interface Details {
  full_name: string;
  contact_number: string;
  email: string;
  date: string;
  bazar_buddy_plan_id: string;
  message: string;
}

const initialForm = {
  full_name: "",
  contact_number: "",
  email: "",
  date: "",
  bazar_buddy_plan_id: "",
  message: "",
};

export const PlanData = ({ Plan }) => {
  const dispatch = useAppDispatch();
  const userData = useSelector(selectUser);

  const createOrderId = async (plan) => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.razorpay.customerCreateOrderID({
        plan_id: plan._id,
      });
      if (res.status === 200 || res.status === 201) {
        return res.data.data;
      } else {
        showToast("error", res?.data?.message);
        return null;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
      return null;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  async function verifyPayment(data = {}) {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.razorpay.customerVerifiy(data);

      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data?.message);
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  const handlePayment = async (plan) => {
    try {
      if (isEmpty(userData)) {
        dispatch(setVisibleLoginModal(true));
      } else {
        const order = await createOrderId(plan);
        if (isEmpty(order)) return;
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          image: EBLogoRoundedSvg.src,
          name: userData?.full_name,
          description: `${userData?.full_name} buying plan ${plan.plan_name} of bazaar buddy`,
          order_id: order?.id,
          handler: async function (response: any) {
            await verifyPayment(options);
          },
          prefill: {
            name: userData?.full_name,
            email: userData?.primary_email,
          },
          theme: {
            color: "#27A376",
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.on("payment.failed", function (response: any) {
          showToast("error", response?.error?.description);
        });
        paymentObject.open();
      }
    } catch (error) {}
  };

  return (
    <div className="grid gap-3 md:gap-5 lg:grid-cols-3">
      {Plan.map((item, index) => (
        <div
          key={index}
          className="flex flex-col justify-between gap-3 rounded-lg border p-3 md:gap-5 md:p-5"
        >
          <div className="flex flex-col gap-3 md:gap-5">
            <div className="flex flex-col text-base md:gap-3 md:text-lg">
              <div className="flex justify-between font-semibold">
                <p className="text-lg md:text-xl">{item.plan_name}</p>
                <p className="text-green-400">₹ {item.price}</p>
              </div>
              <p className="text-sm text-gray-600 md:text-base">
                {item.validity} Days Validity
              </p>
            </div>
            <hr />
            <div className="flex flex-col gap-4">
              {item?.description?.map((feature, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <p
                      style={{
                        backgroundColor: item?.colorClass
                          ? item?.colorClass
                          : "",
                      }}
                      className="h-5 w-1.5 rounded sm:h-6 sm:w-2 md:h-7 md:w-2.5"
                    />
                    <p className="text-base font-semibold md:text-xl">
                      {feature.header}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 md:text-base">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-2 md:gap-4">
            <button
              onClick={() => handlePayment(item)}
              type="button"
              className="flex h-10 w-full items-center justify-center overflow-hidden rounded-lg border bg-green-400 text-sm text-white transition-all duration-300 hover:border-green-400 hover:bg-primary-100 hover:text-green-400 md:h-12 md:rounded-xl md:text-base"
            >
              Continue
            </button>
            <a
              href="https://wa.me/+917436044777"
              target="_blank"
              className="flex aspect-square h-full items-center justify-center rounded-lg border border-green-400"
            >
              <WhatsApp className="h-5 w-5" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export const BazaarBuddyForm = () => {
  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Details>(initialForm);

  const validateField = (label: string, value: string) => {
    let error = "";

    switch (label) {
      case "full_name":
        if (!value.trim()) error = "Please enter your name";
        break;
      case "email":
        if (!value.trim()) error = "Please enter your email address";
        else if (!/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
        break;
      case "contact_number":
        if (!value.trim()) error = "Please enter your contact number";
        else if (!/^\d{10}$/.test(value)) error = "Invalid contact number";
        break;
      case "message":
        if (!value.trim()) error = "Please enter message";
        break;
      case "bazar_buddy_plan_id":
        if (!value.trim()) error = "Please select plan";
        break;
      case "date":
        if (!value.trim()) error = "Please select date";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [label]: error }));
    return { ...errors, [label]: error };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleFetchDropdownChange = useCallback((name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value?._id || "" }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  }, []);

  const handleSubmit = async () => {
    let newErrors = {};

    const requiredFields = [
      "full_name",
      "contact_number",
      "email",
      "date",
      "bazar_buddy_plan_id",
      "message",
    ];

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
      const { data, status } =
        await apiHandler.bazaarBuddyConsultant.post(formData);
      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        setFormData(initialForm);
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
    <div className="flex flex-col justify-center gap-2 md:gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-2xl font-medium text-black-50 sm:text-3xl">
          Get Help with Bazaar Buddy Consultation
        </p>
        <p className="text-sm text-gray-500 md:text-base">
          Explore wedding ideas | Get wedding checklist | Shortlist Vendors
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2 md:gap-4 lg:grid-cols-2">
        <div>
          <CustomInput
            name="full_name"
            label="Full Name"
            className="!mt-0 bg-white"
            labelClass="text-gray-500"
            value={formData.full_name}
            onChange={handleInputChange}
            required
          />
          <p className="error-text">{errors?.full_name}</p>
        </div>

        <div>
          <CustomInput
            className="!mt-0 bg-white"
            label="Contact Number"
            id="contact"
            type="number"
            value={formData.contact_number}
            maxLength={10}
            required
            onChange={handleInputChange}
            name="contact_number"
          />
          <p className="error-text">{errors?.contact_number}</p>
        </div>

        <div>
          <CustomInput
            label="Email"
            className="!mt-0 bg-white"
            labelClass="text-gray-500"
            type="email"
            name="email"
            value={formData.email}
            required
            onChange={handleInputChange}
          />
          <p className="error-text">{errors?.email}</p>
        </div>

        <div>
          <CustomDatePicker
            value={formData.date}
            onChange={(newDate) =>
              handleInputChange({
                target: {
                  name: "date",
                  value: moment(newDate).toISOString(),
                },
              })
            }
            name="date"
            format={{ date: "DD-MM-YYYY" }}
            className="!h-12 !bg-white"
            labelClassName="!mb-2"
            label="Date"
            minDate={new Date()}
            required
          />
          <p className="error-text">{errors?.date}</p>
        </div>
      </div>
      <div>
        <FetchDropdown
          label="Select Plan"
          required
          placeholder="Select plan"
          value={formData.bazar_buddy_plan_id}
          endPoints={apiHandler.bazaarBuddyPlan.lookup}
          filterStr="NA"
          func={handleFetchDropdownChange}
          containerClass="!mt-0"
          textMenuSx={(customStyles) => ({
            ...customStyles,
            "& .MuiInputBase-root": {
              ...customStyles["& .MuiInputBase-root"],
              background: "white !important",
            },
          })}
          objKey="bazar_buddy_plan_id"
          display="plan_name"
        />
        <p className="error-text">{errors?.bazar_buddy_plan_id}</p>
      </div>
      <div>
        <CustomInput
          name="message"
          type="text"
          value={formData?.message}
          onChange={handleInputChange}
          className="!mt-2 h-24 w-full rounded !bg-white !p-4"
          isTextArea
          label="Message"
          required
        />
        {errors?.message && (
          <p className="error-text mt-1 text-sm text-red-500">
            {errors?.message}
          </p>
        )}
      </div>
      <CustomButton
        className="!flex !h-12 !w-full !items-center !justify-center !rounded-md !border !bg-green-400 !text-white !transition-all !duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400"
        text={"Submit"}
        onClick={handleSubmit}
      />
    </div>
  );
};

export const FAQ = ({ FAQs }) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div className="w-full rounded-[10px] border border-white-100 before:!bg-white-100">
      {FAQs.map((item, index) => (
        <Accordion
          key={index}
          expanded={expanded === item._id}
          onChange={() => setExpanded(expanded === item._id ? null : item._id)}
        >
          <AccordionSummary>
            {item.question}
            <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full p-0.5">
              <PlusMinusIcon isFocused={expanded === item?._id} />
            </div>
          </AccordionSummary>

          <AccordionDetails>{item.answer}</AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};
