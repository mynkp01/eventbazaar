"use client";
import { ChangeEventHandler, useEffect, useRef } from "react";

/**
 * OTPInput component
 * @param {Object} props
 * @param {(ChangeEventHandler<HTMLInputElement> & { target: { name: string, value: string } })} props.onChangeText - Function to handle input changes
 * @param {Function} props.handleBack - Function to handle back button click
 * @param {Function} props.handleConfirm - Function to handle confirm button click
 * @param {string} props.errorText - Error text to display
 * @param {boolean} props.loading - Loading state
 * @param {string} props.value - Current OTP value
 * @param {number} props.otpLength - Length of the OTP
 * @param {string} props.contactNumber - Contact number
 * @returns {JSX.Element} OTPInput component
 */
const OTPInput = ({
  onChangeText,
  handleBack,
  handleConfirm,
  errorText,
  loading = null,
  value,
  otpLength = 6,
  phoneNumber = "",
}) => {
  const details = { otp: value };

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
    inputRefs.current?.[0]?.focus();
  }, []);

  const handleChange = (value, index) => {
    if (value.length > 1) {
      const newOtp = [...details.otp];
      const pastedValue = value.slice(0, 6 - index).split("");
      pastedValue.forEach((char, i) => {
        if (index + i < 6) {
          newOtp[index + i] = char;
        }
      });

      onChangeText({ target: { name: "otp", value: newOtp.join("") } });

      const nextEmptyIndex = newOtp.findIndex((v, i) => i > index && !v);
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      inputRefs.current[focusIndex].focus();
      if (focusIndex === 5) {
        inputRefs.current[5].blur();
      }
    } else {
      const newOtp = [...details.otp];
      newOtp[index] = value;
      onChangeText({ target: { name: "otp", value: newOtp.join("") } });

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, key) => {
    if (key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    if (key === "Backspace" && !details.otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <div className="mx-auto flex w-full flex-row items-center justify-between gap-3">
      <div className="flex w-full !gap-2 lg:!gap-3">
        {[...new Array(otpLength)].map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="number"
            inputMode="numeric"
            pattern="\d*"
            maxLength={otpLength}
            value={details.otp[index] || ""}
            placeholder=""
            onPaste={(e) =>
              handleChange(e.clipboardData.getData("Text"), index)
            }
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(index, e.key)}
            className="!h-12 !w-full !max-w-16 !rounded-xl bg-primary-200 !p-0 !text-center !text-xs !placeholder-gray-400 hover:!border-blue-300 focus:!border-blue-300 sm:!text-sm lg:!h-14"
          />
        ))}
      </div>
      {errorText ? <p className="error-text">{errorText}</p> : null}
    </div>
  );
};

export default OTPInput;
