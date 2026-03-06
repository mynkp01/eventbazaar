"use client";
import apiClient from "@api/apiClient";
import { apiHandler } from "@api/apiHandler";
import { backgroundGradient, Logo } from "@assets/index";
import CustomButton from "@components/CustomButton";
import CustomInput from "@components/CustomInput";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  logout,
  selectAdminUser,
  selectUser,
  setAdminUser,
  setPermissions,
} from "@redux/slices/authSlice";
import { setIsLoading, setUtilsLogout } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES, USER_TYPES } from "src/utils/Constant";
import {
  encrypt,
  isEmpty,
  showLogoutConfirmationWhileOverrideInfo,
  showToast,
} from "src/utils/helper";

const AdminSignIn = () => {
  const userData = useSelector(selectUser);
  const adminData = useSelector(selectAdminUser);

  const router = useRouter();

  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [details, setDetails] = useState({
    primary_contact: "",
    pin: "",
  });

  const onChangeText = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const validateFields = (label: string, value: string) => {
    let error = "";

    switch (label) {
      case "primary_contact":
        if (!value.trim()) error = "Phone number is required";
        else if (!/^\d{10}$/.test(value)) error = "Invalid phone number";
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

  const handleSubmit = async () => {
    try {
      let newErrors = {};
      const requiredFields = ["primary_contact", "pin"];

      requiredFields.forEach((field) => {
        const err = validateFields(field, details[field]);
        if (err[field]) {
          newErrors[field] = err[field];
        }
      });

      if (Object.keys(newErrors).length === 0) {
        dispatch(setIsLoading(true));

        try {
          const res = await apiClient.post("/admin-sign-in", details);

          if (
            (res.status === 200 || res.status === 201) &&
            !isEmpty(res?.data.data)
          ) {
            showToast("success", res?.data.message);
            let data = res?.data?.data;
            Cookies.set("admin_token", encrypt(data?.token), { expires: 30 });
            Cookies.set("admin_id", encrypt(data?.user_id), { expires: 30 });
            Cookies.set("admin_user_type", encrypt(data?.user_type), {
              expires: 30,
            });
            dispatch(setAdminUser(data));
            dispatch(setPermissions(data?.permissions));
            router.push(ROUTES.admin.dashboard);
          }
        } catch (error) {
          showToast("error", error.response?.data?.message || error.message);
          dispatch(setIsLoading(false));
        }
      }
    } catch (error) {
      dispatch(setIsLoading(false));
    }
    dispatch(setIsLoading(false));
  };

  const handleLogout = async () => {
    try {
      if (userData?.user_type === USER_TYPES.CUSTOMER) {
        apiHandler.client.customerSignout(
          {},
          {
            headers: { Authorization: `Bearer ${userData?.token}` },
          },
        );
      } else if (userData?.user_type === USER_TYPES.VENDOR) {
        apiHandler.vendor.vendorSignOut(
          {},
          {
            headers: { Authorization: `Bearer ${userData?.token}` },
          },
        );
      }
      Cookies.remove("token");
      Cookies.remove("user_type");
      dispatch(logout());
      dispatch(setUtilsLogout());
    } catch (error) {
      console.error(error);
    }
    await handleSubmit();
  };

  const onClickSignIn = (e) => {
    if (
      (!isEmpty(adminData) || !isEmpty(userData)) &&
      adminData?.user_type !== USER_TYPES.ADMIN
    ) {
      e.preventDefault();
      e.stopPropagation();

      showLogoutConfirmationWhileOverrideInfo(
        isEmpty(adminData) ? userData?.user_type : adminData?.user_type,
        handleLogout,
      );
    } else {
      handleSubmit();
    }
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
              Welcome!
            </h1>
            {/* <p className="text-14 lg:text-16 text-[#52525B]">
              Clarity provides you with the essential elements and tools
              required to build a genuinely professional website
            </p> */}

            <div
              className="flex w-full flex-col gap-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onClickSignIn(e);
                }
              }}
            >
              <div className="flex w-full flex-col">
                <CustomInput
                  type="number"
                  label="Contact number"
                  id="primary_contact"
                  value={details.primary_contact}
                  maxLength={10}
                  onChange={onChangeText}
                  name="primary_contact"
                />
                {errors?.primary_contact ? (
                  <p className="error-text">{errors?.primary_contact}</p>
                ) : null}
              </div>
              <div className="relative">
                <CustomInput
                  type={showPassword ? "text" : "password"}
                  label="PIN"
                  id="pin"
                  name="pin"
                  value={details.pin}
                  maxLength={4}
                  onChange={(e) => {
                    if (!e.target.value || /^\d+$/.test(e.target.value)) {
                      onChangeText(e);
                    }
                  }}
                  placeholder="Please enter your 4 digit PIN"
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
              <div className="mt-8 flex w-full flex-col items-center gap-2 lg:mt-12 lg:flex-row lg:gap-4">
                <CustomButton
                  text="Sign In"
                  className={`text-15-700 btn-outline-hover w-full rounded-xl border border-blue-100 px-4 py-2 text-blue-100 lg:w-24`}
                  onClick={onClickSignIn}
                />
              </div>
              {/* <p className="text-14-600 mt-1 text-center font-light lg:text-left">
                  {`Forgot Pin? `}
                  <Link
                    href={ROUTES.admin.forgotPin}
                    className="cursor-pointer font-semibold text-blue-100"
                  >
                    Reset pin
                  </Link>
                </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
