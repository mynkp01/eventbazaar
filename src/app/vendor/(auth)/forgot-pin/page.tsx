"use client";
import { apiHandler } from "@api/apiHandler";
import { backgroundGradient, Logo } from "@assets/index";
import CustomButton from "@components/CustomButton";
import CustomInput from "@components/CustomInput";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ROUTES } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

const Page = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [details, setDetails] = useState({
    contact_number: "",
    newPin: "",
    confirmPin: "",
  });
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [sendOtp, setSendOtp] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onChangeText = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

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

  const handleSendOtp = async () => {
    try {
      if (!details.contact_number || details.contact_number.length !== 10) {
        setErrors({
          contact_number: "Please enter a valid 10-digit phone number",
        });
        return;
      }

      dispatch(setIsLoading(true));
      const res = await apiHandler.common.sendOtp({
        contact: details.contact_number,
        primary: false,
        type: "Reset Pin",
        type_code: "reset_pin",
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

  const handleVerifyOtp = async () => {
    if (!details.contact_number || details.contact_number.length !== 10) {
      setErrors({
        contact_number: "Please enter a valid 10-digit phone number",
      });
      return;
    }

    if (sendOtp && otp && !isOtpVerified) {
      try {
        dispatch(setIsLoading(true));
        const res = await apiHandler.common.verifyOtp({
          contact: details.contact_number,
          primary: false,
          otp: otp,
          type: "Reset Pin",
          type_code: "reset_pin",
        });
        if (res.status === 200 || res.status === 201) {
          showToast("success", res.data.message);
          setIsOtpVerified(true);
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
    if (!details.contact_number || details.contact_number.length !== 10) {
      setErrors({
        contact_number: "Please enter a valid 10-digit phone number",
      });
      return;
    }

    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.common.reSendOtp({
        contact: details.contact_number,
        primary: false,
        type: "Reset Pin",
        type_code: "reset_pin",
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

  const handleSubmit = async () => {
    try {
      setErrors({});

      if (!details.contact_number || details.contact_number.length !== 10) {
        setErrors({
          contact_number: "Please enter a valid 10-digit phone number",
        });
        return;
      }

      if (!details.newPin || details.newPin.length !== 4) {
        setErrors((prev) => ({
          ...prev,
          newPin: "Please enter a valid 4-digit pin",
        }));
        return;
      }

      if (!details.confirmPin || details.confirmPin.length !== 4) {
        setErrors((prev) => ({
          ...prev,
          confirmPin: "Please confirm your 4-digit pin",
        }));
        return;
      }

      if (details.newPin !== details.confirmPin) {
        setErrors((prev) => ({
          ...prev,
          confirmPin: "Pin does not match",
        }));
        return;
      }

      try {
        const res = await apiHandler.vendor.vendorResetPin({
          primary_contact: details.contact_number,
          newPin: details.newPin,
        });

        if (res.status === 200) {
          showToast("success", res.data.message);
          router.push(ROUTES.vendor.signIn);
        } else {
          showToast("error", res.data?.message);
        }
      } catch (error) {
        showToast("error", error.response?.data?.message || error.message);
      }
    } catch (error) {}
    dispatch(setIsLoading(false));
  };

  return (
    <div
      className={`flex h-full min-h-screen w-full items-center justify-center bg-cover bg-[center_center] sm:p-5 sm:px-3 sm:py-5`}
      style={{
        backgroundImage: `url(${backgroundGradient.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col">
        <div className="flex h-full w-screen flex-col justify-center rounded-[20px] bg-white p-4 shadow-loginContainerShadow xs:w-full xs:p-10 sm:w-[80vw] md:w-[60vw] lg:w-[40vw] lg:p-16 xl:w-[40vw]">
          <div className="flex flex-col justify-center gap-8">
            <div className="mr-auto">
              <Logo className="w-32 sm:w-full" />
            </div>
            {/* <h1 className="text-4xl font-semibold tracking-[-2px] text-primary-800 lg:text-5xl">
              Forget Pin
            </h1> */}
            {/* <p className="text-14 lg:text-16 text-[#52525B]">
              Please Enter Your Phone Number.
            </p> */}
            <div className="w-full">
              <div className="flex w-full flex-col gap-4">
                <div className="relative">
                  <CustomInput
                    type="number"
                    label="Phone Number"
                    name="contact_number"
                    disabled={isOtpVerified}
                    value={details.contact_number}
                    maxLength={10}
                    onChange={onChangeText}
                    placeholder="Enter your phone number"
                  />
                  {errors?.contact_number && (
                    <p className="error-text text-red-600">
                      {errors?.contact_number}
                    </p>
                  )}

                  <div className="absolute bottom-[9px] right-1.5 mt-2 sm:bottom-1.5">
                    {!isOtpVerified && !sendOtp && (
                      <CustomButton
                        text="Verify"
                        disabled={
                          !details.contact_number ||
                          details.contact_number.length < 10
                        }
                        className={`w-fit !rounded-md !border !px-2 !py-1.5 sm:min-w-14 sm:bg-primary-200 ${details.contact_number && details.contact_number.length >= 10 ? "!border-blue-100 !text-blue-100" : "!border-primary-400 !text-primary-400"}`}
                        onClick={() => handleSendOtp()}
                      />
                    )}
                  </div>
                </div>

                {sendOtp && (
                  <div>
                    <div className="relative">
                      <CustomInput
                        label=""
                        name="OTP"
                        type="number"
                        value={otp}
                        maxLength={6}
                        onChange={(e) => setOtp(e.target.value)}
                        disabled={isOtpVerified}
                        placeholder="Enter 6 digit OTP"
                      />
                      <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                        {!isOtpVerified && (
                          <CustomButton
                            text="Verify"
                            disabled={!otp || otp.length < 6 || isOtpVerified}
                            className={`w-fit !rounded-md !border bg-primary-200 !px-2 !py-1.5 sm:min-w-14 ${otp && otp.length >= 6 ? "!border-blue-100 !text-blue-100" : "!border-primary-400 !text-primary-400"}`}
                            onClick={handleVerifyOtp}
                          />
                        )}
                      </div>
                    </div>
                    {!isOtpVerified ? (
                      timer > 0 ? (
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
                      )
                    ) : null}
                  </div>
                )}

                {isOtpVerified && (
                  <>
                    <div className="relative">
                      <CustomInput
                        type={showPassword ? "text" : "password"}
                        label="PIN"
                        id="newPin"
                        name="newPin"
                        value={details.newPin}
                        maxLength={4}
                        onChange={(e) => {
                          if (!e.target.value || /^\d+$/.test(e.target.value)) {
                            onChangeText(e);
                          }
                        }}
                        placeholder="Please enter your 4 digit pin"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute inset-y-0 right-4 flex items-center ${
                          errors?.newPin ? "top-2" : "top-7 sm:top-[34px]"
                        }`}
                      >
                        {!showPassword ? <VisibilityOff /> : <Visibility />}
                      </button>
                      {errors?.newPin && (
                        <p className="error-text">{errors?.newPin}</p>
                      )}
                    </div>

                    <div className="relative">
                      <CustomInput
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirm PIN"
                        id="confirmPin"
                        name="confirmPin"
                        value={details.confirmPin}
                        maxLength={4}
                        onChange={onChangeText}
                        placeholder="Please confirm your 4 digit pin"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className={`absolute inset-y-0 right-4 flex items-center ${
                          errors?.confirmPin ? "top-2" : "top-7 sm:top-[34px]"
                        }`}
                      >
                        {!showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </button>
                      {errors?.confirmPin && (
                        <p className="error-text">{errors?.confirmPin}</p>
                      )}
                    </div>

                    <div className="mt-8 flex w-full flex-col items-center gap-2 lg:mt-12 lg:flex-row lg:gap-4">
                      <CustomButton
                        type="button"
                        className={`text-15-700 btn-outline-hover w-full rounded-xl border border-blue-100 px-4 py-2 text-blue-100 lg:w-24`}
                        onClick={handleSubmit}
                        text="Submit"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
