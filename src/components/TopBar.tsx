"use client";
import { apiHandler } from "@api/apiHandler";
import { PreviewProfile } from "@assets/index";
import {
  Logout,
  ManageAccountsOutlined,
  SettingsOutlined,
  SubscriptionsOutlined,
} from "@mui/icons-material";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import {
  logout,
  logoutAdmin,
  selectAdminUser,
  selectUser,
} from "@redux/slices/authSlice";
import { setSelectedCity } from "@redux/slices/lookupSlice";
import { setIsLoading, setUtilsLogout } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { PLAN_CODE, ROUTES, USER_TYPES } from "src/utils/Constant";
import { isAdminRoute, showToast, useSidebarState } from "src/utils/helper";
import { customEncodeURIComponent } from "src/utils/helper.server";
import CustomButton from "./CustomButton";

const TopBar = () => {
  const isSidebarOpen = useSidebarState();

  const router = useRouter();

  const dispatch = useAppDispatch();
  const userData = useSelector(selectUser);
  const adminData = useSelector(selectAdminUser);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userIcon, setUserIcon] = React.useState(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    let icon = null;

    if (adminData?.user_type === USER_TYPES.ADMIN && isAdminRoute()) {
      if (adminData?.full_name?.split(" ").length > 1) {
        icon = `${adminData?.full_name?.split(" ")[0].charAt(0)?.toUpperCase()}${adminData?.full_name?.split(" ")[1].charAt(0)?.toUpperCase()}`;
      } else {
        icon = adminData?.full_name?.slice(0, 2)?.toUpperCase();
      }
    } else {
      if (userData?.full_name?.split(" ").length > 1) {
        icon = `${userData?.full_name?.split(" ")[0].charAt(0)?.toUpperCase()}${userData?.full_name?.split(" ")[1].charAt(0)?.toUpperCase()}`;
      } else {
        icon = userData?.full_name?.slice(0, 2)?.toUpperCase();
      }
    }
    setUserIcon(icon);
  }, [userData, adminData]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    dispatch(setIsLoading(true));
    try {
      const res =
        adminData?.user_type === USER_TYPES.ADMIN && isAdminRoute()
          ? await apiHandler.admin.adminSignOut()
          : userData?.user_type === USER_TYPES.VENDOR
            ? await apiHandler.vendor.vendorSignOut()
            : null;
      if (res?.status === 200 || res?.status === 201) {
        showToast("success", res?.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (adminData?.user_type === USER_TYPES.ADMIN && isAdminRoute()) {
        Cookies.remove("admin_token");
        Cookies.remove("admin_id");
        Cookies.remove("admin_user_type");
        dispatch(logoutAdmin());
        router.push(ROUTES.admin.vendor);
      } else {
        Cookies.remove("token");
        Cookies.remove("user_type");
        dispatch(logout());
        router.push(ROUTES.landingPage);
      }
      dispatch(setUtilsLogout());
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className="h-[67px] w-full sm:h-20">
      <div
        className={`${
          isSidebarOpen
            ? "w-full lg:w-[calc(100%-16.67%)]"
            : "w-[calc(100%-76px)]"
        } fixed right-0 z-40 ml-px flex h-fit items-center justify-end gap-2 bg-primary-100 py-3 sm:gap-4 sm:p-5 lg:h-20`}
      >
        {!isAdminRoute() && userData?.user_type === USER_TYPES.VENDOR ? (
          <>
            <Tooltip title="View Profile">
              <Link
                href={`${ROUTES.client.vendorDetails}/${customEncodeURIComponent(userData?.company_name)}-${userData?.user_id}`}
                // target="_blank"
                className="btn-outline-hover text-15-700 flex h-fit w-fit items-center gap-1 overflow-hidden rounded-xl border-2 border-primary-50 px-2 py-1 text-primary-800 sm:px-3 sm:py-2"
                onClick={() => dispatch(setSelectedCity(userData?.location))}
              >
                <PreviewProfile className="size-4 md:size-5" />
              </Link>
            </Tooltip>

            <CustomButton
              text={`${userData?.plan_name}`}
              className="btn-outline-hover border-primary-50 px-2 py-1.5 text-primary-800 sm:px-3.5 sm:py-1.5"
            />
            {userData?.plan_code !== PLAN_CODE.enterprise && (
              <CustomButton
                text="Upgrade"
                onClick={() => router.push(`${ROUTES.vendor.subscriptions}`)}
                className="btn-fill-hover border-blue-100 bg-blue-100 px-2 py-1.5 text-primary-100 sm:px-3.5 sm:py-1.5"
              />
            )}
          </>
        ) : null}

        <div>
          <Box
            sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          >
            <IconButton
              onClick={handleClick}
              size="small"
              // aria-controls={open ? 'account-menu' : undefined}
              // aria-haspopup="true"
              // aria-expanded={open ? 'true' : undefined}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 font-bold sm:h-10 sm:w-10">
                {userIcon}
              </div>
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {!isAdminRoute() && userData?.user_type === USER_TYPES.VENDOR ? (
              <>
                {" "}
                <MenuItem
                  onClick={() => {
                    router.push(`${ROUTES.vendor.profile}`);
                  }}
                >
                  <ListItemIcon>
                    <ManageAccountsOutlined fontSize="small" />
                  </ListItemIcon>
                  Manage Account
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push(`${ROUTES.vendor.subscriptions}`);
                  }}
                >
                  <ListItemIcon>
                    <SubscriptionsOutlined fontSize="small" />
                  </ListItemIcon>
                  Manage Subscriptions
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push(ROUTES.vendor.settings);
                  }}
                >
                  <ListItemIcon>
                    <SettingsOutlined fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
              </>
            ) : null}
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
