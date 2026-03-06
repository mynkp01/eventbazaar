import { logout, logoutAdmin } from "@redux/slices/authSlice";
import { setUtilsLogout } from "@redux/slices/utilSlice";
import { store } from "@redux/store/store";
import axios from "axios";
import Cookies from "js-cookie";
import { ROUTES } from "src/utils/Constant";
import { decrypt, isAdminRoute } from "src/utils/helper";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:8080",
});

apiClient.interceptors.request.use(
  function (config) {
    const token = decrypt(Cookies.get("token") || "");
    const adminToken = decrypt(Cookies.get("admin_token") || "");
    const clientIP = decrypt(Cookies.get("clientIP") || "");
    const adminId = decrypt(Cookies.get("admin_id") || "");

    if (adminId) {
      config.headers["AdminId"] = adminId;
    }

    if (clientIP) {
      config.headers["X-Forwarded-For"] = clientIP;
    }

    if (!config.headers.Authorization) {
      if (isAdminRoute()) {
        config.headers.Authorization = adminToken
          ? `Bearer ${adminToken}`
          : null;
      } else {
        config.headers.Authorization = token ? `Bearer ${token}` : null;
      }
    }

    return config;
  },

  function (error) {
    return Promise.reject({
      error,
      message: error?.response?.data?.message || "Something Went Wrong !!",
    });
  },
);

apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      if (isAdminRoute()) {
        Cookies.remove("admin_token");
        Cookies.remove("admin_id");
        Cookies.remove("admin_user_type");
        store.dispatch(logoutAdmin());
      } else {
        Cookies.remove("token");
        Cookies.remove("user_type");
        store.dispatch(logout());
      }
      store.dispatch(setUtilsLogout());

      if (window) {
        // window.location.href = ROUTES.home;
      }
    }

    return Promise.reject({
      error,
      message: error?.response?.data?.message || "Something Went Wrong !!",
    });
  },
);

export default apiClient;
