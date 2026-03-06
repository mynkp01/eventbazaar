"use client";
import { apiHandler } from "@api/apiHandler";
import { backgroundGradient, Logo } from "@assets/index";
import CustomButton from "@components/CustomButton";
import CustomInput from "@components/CustomInput";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ROUTES } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

const Page = () => {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [details, setDetails] = useState({
    newPin: "",
    confirmPin: "",
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { token } = useParams();

  const onChangeText = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setErrors({});

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

      if (!token) {
        showToast("error", "Expired Link");
        setTimeout(() => {
          router.push(ROUTES.vendor.signIn);
        }, 1500);
        return;
      }
      try {
        const res = await apiHandler.vendor.vendorResetPin({
          token: token,
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
      className="flex h-full min-h-screen w-full items-center justify-center bg-cover bg-[center_center] sm:p-5 sm:px-3 sm:py-5"
      style={{
        backgroundImage: `url(${backgroundGradient.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col">
        <div className="h-full w-full rounded-[20px] bg-white p-10 shadow-loginContainerShadow md:w-[60vw] lg:p-16 xl:w-[40vw]">
          <div className="flex flex-col justify-center">
            <div className="mr-auto sm:mb-10">
              <Logo className="h-32 w-32 sm:h-full sm:w-full" />
            </div>
            <h1 className="mb-4 text-4xl font-semibold tracking-[-2px] text-primary-800 lg:text-5xl">
              Reset Pin
            </h1>
            <p className="text-14 lg:text-16 text-grey-200">
              Please Enter Your New Pin And Confirm Pin.
            </p>
            <div className="mt-12 w-full">
              <div className="flex w-full flex-col gap-4">
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute inset-y-0 right-4 flex items-center ${
                      errors?.confirmPin ? "top-2" : "top-7 sm:top-[34px]"
                    }`}
                  >
                    {!showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                  {errors?.confirmPin && (
                    <p className="error-text">{errors?.confirmPin}</p>
                  )}
                </div>
                <div className="mt-8 flex w-full flex-col items-center gap-2 lg:mt-12 lg:flex-row lg:gap-4">
                  <CustomButton
                    type="button"
                    onClick={handleSubmit}
                    className={`text-15-700 btn-outline-hover w-full rounded-xl border border-blue-100 px-4 py-2 text-blue-100 lg:w-24`}
                    text="Submit"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
