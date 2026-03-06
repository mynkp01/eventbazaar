"use client";
import { apiHandler } from "@api/apiHandler";
import LabelField from "@components/LabelField";
import PageAction from "@components/PageAction";
import { Modal } from "@mui/material";
import { selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { showToast } from "src/utils/helper";
const CKEditorComp = dynamic(() => import("@components/CKEditorComp"), {
  ssr: false,
});

const PaymentPolicies = () => {
  const dispatch = useAppDispatch();
  const userData = useSelector(selectUser);

  const [details, setDetails] = useState({
    // advance_for_booking: "",
    // payment_on_event_date: "",
    // payment_on_delivery: "",
    payment_policy: "",
    cancellation_policy: "",
  });
  const [errors, setErrors] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);

  const onChangeText = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
    validateFields(e.target.name, e.target.value);
  };

  useEffect(() => {
    getPaymentPoliciesData();
  }, []);

  const getPaymentPoliciesData = async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.paymentPolicies.get(userData?.user_id);

      if (res.status === 200 || res.status === 201) {
        if (res.data.data) setDetails(res.data.data);
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  const validateFields = (label: string, value: string) => {
    let error = "";

    switch (label) {
      case "payment_policy":
        if (!value.trim()) error = "Please enter payment policy";
        break;
      case "advance_for_booking":
        if (!value.trim()) error = "Please enter advance payment amount";
        break;
      case "payment_on_event_date":
        if (!value.trim()) error = "Please enter payment on event date amount";
        break;
      case "payment_on_delivery":
        if (!value.trim()) error = "Please enter payment on delivery amount";
        break;
      case "cancellation_policy":
        if (!value.trim()) error = "Please enter cancellation policy";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [label]: error }));
    return { ...errors, [label]: error };
  };

  const onClickSave = async () => {
    let newErrors = {};
    const requiredFields = [
      // "advance_for_booking",
      // "payment_on_event_date",
      // "payment_on_delivery",
      "payment_policy",
      "cancellation_policy",
    ];

    requiredFields.forEach((field) => {
      const err = validateFields(field, details[field]);
      if (err[field]) {
        newErrors[field] = err[field];
      }
    });

    if (Object.keys(newErrors).length === 0) {
      setConfirmationModal(true);
    }
  };

  const onConfirmSave = async () => {
    dispatch(setIsLoading(true));
    try {
      // const res = details?._id
      // ? await apiHandler.paymentPolicies.patch(details?._id, details)
      // : await apiHandler.paymentPolicies.post({
      //     ...details,
      //     vendor_id: userData?.user_id,
      //   });
      const res = await apiHandler.paymentPolicies.post({
        ...details,
        vendor_id: userData?.user_id,
      });

      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data?.message);
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    setConfirmationModal(false);
    dispatch(setIsLoading(false));
  };

  const handleInputChange = (field: string, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="flex flex-col gap-4">
      <style>
        {`
          .ck-editor__editable {
            height: 200px !important;
          }
        `}
      </style>
      <h3 className="heading-40">Payment & Cancellation Policy</h3>
      <div className="rounded-xl bg-primary-100">
        <div className="flex w-full flex-col gap-4 p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative">
              <LabelField
                labelText="Payment Policy"
                toolTipText="Payment Policy"
              />
              <div>
                <CKEditorComp
                  value={details?.payment_policy}
                  maxChars={500}
                  onChange={(data) => {
                    handleInputChange("payment_policy", data);
                  }}
                />
              </div>
              {errors?.payment_policy && (
                <p className="error-text">{errors?.payment_policy}</p>
              )}
            </div>
            <div className="relative">
              <LabelField
                labelText="Cancellation Policy"
                toolTipText="Cancellation Policy"
              />
              <div>
                <CKEditorComp
                  value={details?.cancellation_policy}
                  maxChars={500}
                  onChange={(data) => {
                    handleInputChange("cancellation_policy", data);
                  }}
                />
              </div>
              {errors?.cancellation_policy && (
                <p className="error-text">{errors?.cancellation_policy}</p>
              )}
            </div>
            {/* <div className="relative">
              <CustomInput
                type="text"
                label="Advance for Booking"
                required
                id="advance_for_booking"
                value={details.advance_for_booking}
                onChange={onChangeText}
                name="advance_for_booking"
              />
              {errors?.advance_for_booking ? (
                <p className="error-text">{errors?.advance_for_booking}</p>
              ) : null}
            </div>
            <div className="relative">
              <CustomInput
                type="text"
                label="Payment on Event Date"
                required
                id="payment_on_event_date"
                name="payment_on_event_date"
                value={details.payment_on_event_date}
                onChange={onChangeText}
              />
              {errors?.payment_on_event_date ? (
                <p className="error-text">{errors?.payment_on_event_date}</p>
              ) : null}
            </div>
            <div className="relative">
              <CustomInput
                type="text"
                label="Payment on Delivery"
                required
                id="payment_on_delivery"
                name="payment_on_delivery"
                value={details.payment_on_delivery}
                onChange={onChangeText}
              />
              {errors?.payment_on_delivery ? (
                <p className="error-text">{errors?.payment_on_delivery}</p>
              ) : null}
            </div>
            <div className="relative">
              <CustomInput
                type="text"
                label="Cancellation Policy"
                id="cancellation_policy"
                name="cancellation_policy"
                value={details.cancellation_policy}
                onChange={onChangeText}
              />
            </div> */}
          </div>
          <PageAction
            className="!mt-0 w-full"
            btnSecondaryLabel="Save"
            btnSecondaryClassName="!py-2 sm:!w-fit !w-full !px-6 sm:!px-16 !border-blue-100 !bg-blue-100 !text-primary-100 hover:!bg-primary-100 hover:!text-blue-100"
            btnSecondaryFun={onClickSave}
          />
        </div>

        <Modal
          open={confirmationModal}
          onClose={() => setConfirmationModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="flex items-center justify-center p-6 sm:p-8"
        >
          <div className="flex max-w-sm flex-col gap-6 rounded-xl bg-primary-100 p-4 sm:p-6">
            <p className="text-16-600 text-center">
              Are you sure you want to submit the information you entered?
            </p>
            <div className="flex gap-4">
              <button
                onClick={onConfirmSave}
                className="text-16-600 shadow-outer h-fit w-full rounded-lg border border-blue-100 p-2 text-blue-100"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmationModal(false)}
                className="text-16-600 shadow-outer h-fit w-full rounded-lg border border-red-300 p-2 text-red-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PaymentPolicies;
