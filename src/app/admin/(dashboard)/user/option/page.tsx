"use client";
import { apiHandler } from "@api/apiHandler";
import { CustomCheckBox } from "@assets/index";
import CustomInput from "@components/CustomInput";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  selectAdminSideBar,
  selectAdminUser,
  selectPermissions,
  setPermissions,
} from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "src/hooks/UseSocket";
import { LOOKUP_VALUES, PERMISSIONS } from "src/utils/Constant";
import { isEmpty, showToast, StyledCheckbox } from "src/utils/helper";

const Page = () => {
  const permissionsActions = ["create", "update", "delete", "read"];

  const dispatch = useAppDispatch();
  const permissions = useSelector(selectPermissions);
  const sidebar = useSelector(selectAdminSideBar);
  const adminData = useSelector(selectAdminUser);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const isViewOnly = searchParams.get("view") === "1";

  const { socket, isConnected, error } = useSocket();

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pagePermissions, setPagePermissions] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    primary_email: "",
    primary_contact: "",
    role_name: "",
    pin: "",
    permissions: [],
  });

  useEffect(() => {
    fetchRolesPermission();
  }, [userId]);

  useEffect(() => {
    setPagePermissions(
      permissions?.find(
        (n) =>
          n?.module?.value_code ===
          sidebar?.find((v) => pathname.includes(v?.path))?.value_code,
      )?.permissions,
    );
  }, [permissions, sidebar, pathname]);

  useEffect(() => {
    if (!socket || !isConnected || !userId) return;
    socket.emit("join-room", { room: userId?.toLowerCase() });

    const handleUpdatedPermission = (data) => {
      if (userId === adminData?.user_id) dispatch(setPermissions(data));
    };

    socket.on("updatedPermission", handleUpdatedPermission);

    return () => {
      socket.off("updatedPermission");
      socket.emit("leave-room", { room: userId?.toLowerCase() });
    };
  }, [isConnected, socket, userId]);

  const fetchUserDetails = async (roles) => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.admin.get(userId);
      if (status === 200 || status === 201) {
        const user = data?.data;

        const filteredArray = roles?.filter(
          (i) =>
            i?._id !==
            user?.permissions?.find((j) => j?.module?._id === i?._id)?.module
              ?._id,
        );

        const formattedPermissions = [
          ...user?.permissions,
          ...filteredArray?.map((v) => ({
            module: v,
            permissions: {
              create: false,
              read: false,
              update: false,
              delete: false,
            },
          })),
        ]?.sort((a, b) =>
          a?.module?.name
            ?.toLowerCase()
            ?.localeCompare(b?.module?.name?.toLowerCase()),
        );

        setFormData({
          full_name: user?.full_name || "",
          primary_email: user?.primary_email || "",
          primary_contact: user?.primary_contact || "",
          role_name: user?.role_name || "",
          pin: user?.pin || "",
          permissions: formattedPermissions,
        });
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const fetchRolesPermission = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.values.lookup(
        `value=${LOOKUP_VALUES.SYSTEM_MODULES}`,
      );

      if (status === 200 || status === 201) {
        const roles = data?.data || [];

        if (userId) {
          await fetchUserDetails(roles);
        } else {
          const formattedPermissions = [
            ...roles?.map((v) => ({
              module: v,
              permissions: {
                create: false,
                read: false,
                update: false,
                delete: false,
              },
            })),
          ]?.sort((a, b) =>
            a?.module?.name
              ?.toLowerCase()
              ?.localeCompare(b?.module?.name?.toLowerCase()),
          );
          setFormData((prev) => ({
            ...prev,
            permissions: formattedPermissions,
          }));
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

  useEffect(() => {
    if (pagePermissions !== null) {
      if (
        !pagePermissions?.[PERMISSIONS.CREATE] ||
        !pagePermissions?.[PERMISSIONS.UPDATE]
      ) {
        // router.back();
        window.close();
      }
    }
  }, [permissions]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "full_name":
        if (!value.trim()) return "Please enter a full name.";
        break;
      case "primary_email":
        if (!value.trim()) return "Please enter a primary email.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Enter a valid email address.";
        break;
      case "primary_contact":
        if (!value.trim()) return "Please enter a primary contact.";
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value))
          return "Enter a valid 10-digit contact number.";
        break;
      case "role_name":
        if (!value.trim()) return "Please enter a role name.";
        break;
      case "pin":
        if (!value.trim()) return "Please enter your 4 digit pin";
        else if (value.length < 4) return "Please enter your 4 digit pin";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async () => {
    if (isViewOnly) return;
    const newErrors = {};
    const requiredFields = ["full_name", "primary_email", "primary_contact"];
    if (!userId) {
      requiredFields.push("pin");
    }
    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      dispatch(setIsLoading(true));

      let finalData = {
        ...formData,
        permissions: formData?.permissions?.map((i) => ({
          ...i,
          module: i?.module?._id,
        })),
      };

      const { data, status } = userId
        ? await apiHandler.admin.patch(userId, finalData)
        : await apiHandler.admin.post(finalData);

      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        socket.emit("permission", { room: userId?.toLowerCase() });
        // router.push(ROUTES.admin.user);
        window.close();
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handlePermissionChange = (e, per, action) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev?.permissions?.map((perm) => {
        if (per?.module?._id === perm?.module?._id) {
          return {
            ...perm,
            permissions: {
              ...perm?.permissions,
              [action]: e.target.checked,
              read:
                action !== "read"
                  ? e.target.checked || perm?.permissions?.read
                  : Object.keys(perm?.permissions)
                      ?.filter((key) => key !== action)
                      ?.some((i) => perm?.permissions?.[i]) || e.target.checked,
            },
          };
        } else {
          return perm;
        }
      }),
    }));
  };

  const handleToggleAll = (e) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev?.permissions?.map((perm) => {
        return {
          ...perm,
          permissions: {
            create: e.target.checked,
            update: e.target.checked,
            delete: e.target.checked,
            read: e.target.checked,
          },
        };
      }),
    }));
  };

  const handleColumnToggle = (e, action) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev?.permissions?.map((perm) => {
        return {
          ...perm,
          permissions: {
            ...perm?.permissions,
            [action]: e.target.checked,
            read:
              action !== "read"
                ? e.target.checked || perm?.permissions?.read
                : Object.keys(perm?.permissions)
                    ?.filter((key) => key !== action)
                    ?.some((i) => perm?.permissions?.[i]) || e.target.checked,
          },
        };
      }),
    }));
  };

  const handleRowToggle = (e, perm) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev?.permissions?.map((v) => {
        if (v?.module?._id === perm?.module?._id) {
          return {
            ...v,
            permissions: {
              create: e.target.checked,
              update: e.target.checked,
              delete: e.target.checked,
              read: e.target.checked,
            },
          };
        } else {
          return v;
        }
      }),
    }));
  };

  return pagePermissions?.[PERMISSIONS.CREATE] ||
    pagePermissions?.[PERMISSIONS.UPDATE] ? (
    <div className="border-wh-300 flex flex-col items-center gap-4 rounded-2xl border bg-white">
      <div className="flex w-full flex-col gap-4 p-4 md:p-6">
        <h1 className="text-xl font-bold">
          {userId ? (isViewOnly ? "View User" : "Edit User") : "Add New User"}
        </h1>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <CustomInput
              label="Full Name"
              name="full_name"
              placeholder="Enter full name"
              value={formData?.full_name}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required
            />
            {errors?.full_name && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors?.full_name}
              </p>
            )}
          </div>
          <div className="flex-1">
            <CustomInput
              label="Primary Email"
              name="primary_email"
              placeholder="Enter primary email"
              value={formData?.primary_email}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required
            />
            {errors?.primary_email && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors?.primary_email}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <CustomInput
              type="number"
              label="Primary Contact"
              name="primary_contact"
              placeholder="Enter primary contact"
              value={formData?.primary_contact}
              maxLength={10}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required
            />
            {errors?.primary_contact && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors?.primary_contact}
              </p>
            )}
          </div>
          {!isViewOnly && (
            <div className="relative flex-1">
              <CustomInput
                type={showPassword ? "text" : "password"}
                label="PIN"
                id="pin"
                name="pin"
                maxLength={4}
                required={!userId}
                value={formData?.pin}
                onChange={(e) => {
                  if (!e.target.value || /^\d+$/.test(e.target.value)) {
                    handleInputChange(e);
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
              {errors?.pin && (
                <p className="error-text mt-1 text-sm text-red-500">
                  {errors?.pin}
                </p>
              )}
            </div>
          )}
        </div>

        {isEmpty(formData?.permissions) ? null : (
          <div className="mt-4">
            <div className="flex flex-col items-center justify-between sm:flex-row sm:items-start">
              <h1 className="text-xl font-bold">
                {isViewOnly ? "View Permissions" : "Assign Permissions"}
              </h1>
            </div>
            <div className="mt-2 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      <StyledCheckbox
                        icon={<CustomCheckBox className="h-5 w-5" />}
                        checkedIcon={
                          <CustomCheckBox checked className="h-5 w-5" />
                        }
                        disabled={isViewOnly}
                        checked={formData?.permissions?.every((v) =>
                          permissionsActions?.every(
                            (action) => v?.permissions?.[action],
                          ),
                        )}
                        onChange={handleToggleAll}
                      />
                      Module Name
                    </th>
                    {permissionsActions?.map((action) => (
                      <th
                        key={action}
                        className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        <StyledCheckbox
                          icon={<CustomCheckBox className="h-5 w-5" />}
                          checkedIcon={
                            <CustomCheckBox checked className="h-5 w-5" />
                          }
                          disabled={isViewOnly}
                          checked={formData?.permissions?.every(
                            (v) => v?.permissions?.[action],
                          )}
                          onChange={(e) => handleColumnToggle(e, action)}
                        />
                        {action}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {formData?.permissions?.map((perm) => {
                    return (
                      <>
                        <tr key={perm?.module?._id}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <StyledCheckbox
                              icon={<CustomCheckBox className="h-5 w-5" />}
                              checkedIcon={
                                <CustomCheckBox checked className="h-5 w-5" />
                              }
                              disabled={isViewOnly}
                              checked={Object.values(perm?.permissions)?.every(
                                Boolean,
                              )}
                              onChange={(e) => handleRowToggle(e, perm)}
                            />
                            {perm?.module?.name}
                          </td>
                          {permissionsActions?.map((action) => (
                            <td
                              className="whitespace-nowrap px-6 py-4"
                              key={action}
                            >
                              <StyledCheckbox
                                icon={<CustomCheckBox className="h-5 w-5" />}
                                checkedIcon={
                                  <CustomCheckBox checked className="h-5 w-5" />
                                }
                                disabled={isViewOnly}
                                checked={perm?.permissions?.[action]}
                                onChange={(e) =>
                                  handlePermissionChange(e, perm, action)
                                }
                              />
                            </td>
                          ))}
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-row gap-4">
          <button
            type="button"
            onClick={() => window.close()}
            className="text-15-700 btn-fill-hover h-fit w-fit rounded-xl border-2 border-blue-100 bg-blue-100 p-1.5 text-primary-100 sm:px-3 sm:py-2.5"
          >
            Cancel
          </button>
          {!isViewOnly && (
            <button
              type="button"
              onClick={handleSubmit}
              className="shadow-outer h-fit w-fit rounded-xl border border-blue-100 bg-primary-100 p-1.5 text-blue-100 sm:px-3 sm:py-2.5"
            >
              {userId ? "Update" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Page;
