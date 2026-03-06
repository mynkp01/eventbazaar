"use client";
import { DownArrow, EBLogoRounded, Logo } from "@assets/index";
import { useMediaQuery } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import {
  selectAdminUser,
  selectPermissions,
  selectUser,
  setAdminSideBar,
} from "@redux/slices/authSlice";
import { useAppDispatch } from "@redux/store/store";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  BUSINESS_CATEGORY,
  PLAN_RULE,
  ROUTES,
  USER_TYPES,
} from "src/utils/Constant";
import {
  convertMediaUrl,
  copyToClipboard,
  encrypt,
  isAdminRoute,
  isEmpty,
  showPopup,
  showToast,
} from "src/utils/helper";
import {
  adminSideBarData,
  customerSideBarData,
  SideBarBottomData,
  vendorSideBarData,
} from "src/utils/SidebarData";
import CustomImage from "./CustomImage";

const SideBar = () => {
  const userData = useSelector(selectUser);
  const adminData = useSelector(selectAdminUser);

  let dashboardRoute =
    adminData?.user_type === USER_TYPES.ADMIN && isAdminRoute()
      ? ROUTES.admin.dashboard
      : userData?.user_type === USER_TYPES.VENDOR
        ? ROUTES.vendor.dashboard
        : ROUTES.landingPage;

  const isMobile = useMediaQuery("(max-width:600px)");
  const permissions = useSelector(selectPermissions);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const isMobileRef = useRef(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [sideBarData, setSideBarData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    if (adminData?.user_type === USER_TYPES.ADMIN && isAdminRoute()) {
      const filteredSideBarData = adminSideBarData?.filter((item) => {
        const permission = permissions?.find(
          (perm) => perm?.module?.value_code === item?.value_code,
        );

        return item?.value_code ? permission?.permissions?.read : true;
      });
      setSideBarData(filteredSideBarData);
      dispatch(setAdminSideBar(filteredSideBarData));
    } else if (userData?.user_type === USER_TYPES.VENDOR) {
      setSideBarData(vendorSideBarData);
    } else if (userData?.user_type === USER_TYPES.CUSTOMER) {
      setSideBarData(customerSideBarData);
    } else {
      setSideBarData([]);
    }
  }, [userData?.user_type, adminData?.user_type, permissions]);

  const getDropdownActiveState = (item) => {
    if (!item.dropdown) return { isActive: false, activeChildId: null };
    const activeChild = item.dropdown.find((dropdownItem) =>
      pathname.includes(dropdownItem?.path?.split("?")?.[0]),
    );
    return { isActive: !!activeChild, activeChildId: activeChild?.id };
  };

  useEffect(() => {
    const activeDropdown = sideBarData.find(
      (item) =>
        item.dropdown &&
        item.dropdown.some((dropdownItem) =>
          pathname.includes(dropdownItem?.path?.split("?")?.[0]),
        ),
    );
    if (activeDropdown) {
      setOpenDropdown(activeDropdown.id);
    }
  }, [pathname]);

  const handleResize = useCallback(() => {
    if (window) {
      const isMobile = window.innerWidth <= 600;
      isMobileRef.current = isMobile;
      setIsSidebarOpen(window.innerWidth > 1024);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isMobile = window.innerWidth <= 768;
      if (
        isMobile &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
        document.body.classList.remove("no-scroll");
      }
    };

    const handleSidebarToggle = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile && isSidebarOpen) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
    };

    handleSidebarToggle();

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchmove", handleClickOutside);
    document.addEventListener("scroll", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchmove", handleClickOutside);
      document.removeEventListener("scroll", handleClickOutside);
      document.body.classList.remove("no-scroll");
    };
  }, [isSidebarOpen]);

  return (
    <>
      {isSidebarOpen && (
        <div
          className={
            "fixed z-50 h-full w-full bg-black bg-opacity-25 transition-all duration-[350ms] ease-in-out lg:hidden"
          }
        />
      )}
      <aside
        id="sidebar"
        ref={sidebarRef}
        className={`${
          isSidebarOpen
            ? "z-50 w-[60%] shadow xs:w-[40%] lg:w-full"
            : "!w-[76px]"
        } overflow-y-auto lg:relative lg:max-w-[16.67%] ${isMobileRef.current && isSidebarOpen ? "fixed h-full" : ""}`}
      >
        <div
          className={`fixed flex h-full flex-col justify-between bg-primary-100 ${
            isSidebarOpen ? "w-[60%] shadow xs:w-[40%] lg:w-full" : "w-[76px]"
          } z-50 overflow-y-auto overflow-x-hidden lg:max-w-[16.67%]`}
        >
          <div
            className={`overflow-y-auto overflow-x-hidden ${isSidebarOpen ? "p-4 lg:p-2 xl:p-4" : "p-4"}`}
          >
            <div
              className={`flex h-fit justify-between ${
                isSidebarOpen ? "mb-8 gap-2" : "mb-2 flex-col-reverse gap-5"
              }`}
            >
              {!isAdminRoute() ? (
                <div
                  className={`flex items-center justify-center ${isSidebarOpen ? "gap-1 xl:gap-2" : "gap-0"}`}
                >
                  <Link
                    href={dashboardRoute}
                    className={`${isSidebarOpen ? "max-h-12 min-h-12 min-w-12 max-w-12" : "max-h-10 min-h-10 min-w-10 max-w-10"} flex items-center justify-center overflow-hidden rounded-full`}
                  >
                    {isEmpty(userData) || isEmpty(userData?.logo) ? (
                      <EBLogoRounded
                        className={`${isSidebarOpen ? "max-h-10 min-h-10 min-w-10 max-w-10" : "max-h-8 min-h-8 min-w-8 max-w-8"}`}
                      />
                    ) : (
                      <CustomImage
                        src={convertMediaUrl(userData?.logo)}
                        alt="user logo"
                        className={`${isSidebarOpen ? "max-h-12 min-h-12 min-w-12 max-w-12" : "max-h-10 min-h-10 min-w-10 max-w-10"} object-cover`}
                      />
                    )}
                  </Link>
                  <p
                    className={`text-14-600 text-primary-500 ${
                      isSidebarOpen ? "opacity-100" : "w-0 opacity-0"
                    } `}
                  >
                    {userData?.company_name}
                  </p>
                </div>
              ) : (
                <div
                  className={`flex items-center justify-center ${isSidebarOpen ? "gap-1 xl:gap-2" : "gap-0"}`}
                >
                  <Link
                    href={dashboardRoute}
                    className={`${isSidebarOpen ? "max-h-12 min-h-12 min-w-12 max-w-12" : "max-h-10 min-h-10 min-w-10 max-w-10"} flex items-center justify-center overflow-hidden rounded-full`}
                  >
                    <EBLogoRounded
                      className={`${isSidebarOpen ? "max-h-10 min-h-10 min-w-10 max-w-10" : "max-h-8 min-h-8 min-w-8 max-w-8"}`}
                    />
                  </Link>
                  <p
                    className={`text-14-600 text-primary-500 ${
                      isSidebarOpen ? "opacity-100" : "w-0 opacity-0"
                    } `}
                  >
                    EventBazaar.com
                  </p>
                </div>
              )}
              <div
                className={`flex h-fit items-center justify-center rounded-xl bg-primary-200 p-2.5 ${
                  isSidebarOpen ? "open" : ""
                }`}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <label className="buttons__burger" htmlFor="burger">
                  <span></span>
                  <span></span>
                  <span></span>
                </label>
              </div>
            </div>
            <nav className={`flex flex-col gap-y-1`}>
              {sideBarData.map((item) => {
                const { isActive: isDropdownActive } =
                  getDropdownActiveState(item);
                return (
                  <Fragment key={item.id}>
                    <div>
                      {!isEmpty(item.dropdown) ? (
                        <Tooltip
                          slotProps={{
                            tooltip: {
                              sx: {
                                bgcolor: "common.white",
                                padding: "10px",
                              },
                            },
                          }}
                          placement="right"
                          title={
                            isSidebarOpen
                              ? ""
                              : item.dropdown.map((dropdownItem) => (
                                  <Link
                                    href={dropdownItem.path}
                                    key={dropdownItem.id}
                                  >
                                    <div
                                      key={dropdownItem.id}
                                      className={`text-14-600 my-2 rounded-xl bg-primary-50 p-2 ${
                                        pathname.includes(
                                          dropdownItem?.path?.split("?")?.[0],
                                        )
                                          ? "text-primary-800"
                                          : "text-primary-500"
                                      }`}
                                    >
                                      {dropdownItem.label}
                                    </div>
                                  </Link>
                                ))
                          }
                        >
                          <div>
                            <button
                              onClick={() => {
                                setOpenDropdown((prev) => {
                                  return prev === item.id ? null : item.id;
                                });
                                Cookies.set("opn", encrypt(item.value_code));
                                if (!isSidebarOpen) {
                                  setIsSidebarOpen(true);
                                }
                              }}
                              className={`group flex w-full items-center justify-between rounded-xl ${
                                isSidebarOpen ? "gap-3 p-2.5" : "p-2.5"
                              } ${
                                isDropdownActive
                                  ? "bg-primary-50 text-primary-800 shadow-inner"
                                  : "text-primary-500 hover:bg-primary-50 hover:bg-opacity-40 hover:shadow-inner"
                              }`}
                            >
                              <div
                                className={`flex items-center ${isSidebarOpen && isMobile ? "gap-1.5" : "gap-3"}`}
                              >
                                <span>
                                  <item.icon />
                                </span>
                                {isSidebarOpen && (
                                  <span
                                    className={`text-14-600 ${
                                      isSidebarOpen
                                        ? "opacity-100"
                                        : "w-0 opacity-0"
                                    } text-left transition-all duration-[350ms] ease-in-out`}
                                  >
                                    {item.label}
                                  </span>
                                )}
                              </div>
                              {isSidebarOpen &&
                                (openDropdown === item.id ? (
                                  <DownArrow className="rotate-180 transform text-primary-500 transition duration-[350ms] ease-in-out" />
                                ) : (
                                  <DownArrow className="text-primary-500 transition duration-[350ms] ease-in-out" />
                                ))}
                            </button>

                            {openDropdown === item.id && isSidebarOpen && (
                              <div className="ml-8 mt-2 flex flex-col gap-2">
                                {item.dropdown
                                  ?.filter((_) => {
                                    if (_?.path === ROUTES.vendor.venues) {
                                      return [
                                        BUSINESS_CATEGORY.EVENT_VENUE,
                                        BUSINESS_CATEGORY.HOTELS_RESORTS,
                                      ].includes(
                                        userData?.business_category_id
                                          ?.value_code,
                                      );
                                    } else {
                                      return true;
                                    }
                                  })
                                  ?.map((dropdownItem) => (
                                    <ul
                                      key={dropdownItem.id}
                                      onClick={(e) => {
                                        if (
                                          dropdownItem?.path ===
                                            ROUTES.vendor.venues &&
                                          ![
                                            BUSINESS_CATEGORY.EVENT_VENUE,
                                            BUSINESS_CATEGORY.HOTELS_RESORTS,
                                          ].includes(
                                            userData?.business_category_id
                                              ?.value_code,
                                          )
                                        ) {
                                          showPopup(
                                            "info",
                                            `You are not allowed to access this page`,
                                            {
                                              confirmButtonText: "Upgrade Now",
                                              showCancelButton: true,
                                              onClickConfirm: () => {
                                                router.push(
                                                  `${ROUTES.vendor.subscriptions}`,
                                                );
                                              },
                                            },
                                          );
                                          return;
                                        }
                                        dropdownItem.copy
                                          ? copyToClipboard(
                                              `${dropdownItem.copy}/${userData?.user_id}`,
                                            )
                                              .then(() =>
                                                showToast(
                                                  "success",
                                                  "Copied to clipboard",
                                                ),
                                              )
                                              .catch(() =>
                                                console.error(
                                                  "error",
                                                  "Please copy again",
                                                ),
                                              )
                                          : router.push(dropdownItem.path);
                                        isMobile && setIsSidebarOpen(false);
                                      }}
                                      className="list-none rounded-xl hover:bg-primary-50 hover:bg-opacity-40 hover:shadow-inner"
                                    >
                                      <li
                                        className={`text-14-600 flex cursor-pointer items-center rounded-xl p-2 ${
                                          pathname.includes(
                                            dropdownItem?.path?.split("?")?.[0],
                                          )
                                            ? "bg-primary-50 text-primary-800 shadow-inner"
                                            : "text-primary-500"
                                        }`}
                                      >
                                        {dropdownItem.label}
                                      </li>
                                    </ul>
                                  ))}
                              </div>
                            )}
                          </div>
                        </Tooltip>
                      ) : (
                        <div
                          onClick={() => {
                            Cookies.set("opn", encrypt(item.value_code));
                            if (item.path === ROUTES.vendor.analytics) {
                              showPopup(
                                "info",
                                `Want To Know Business Insights?`,
                                {
                                  confirmButtonText: "Upgrade Now",
                                  showCancelButton: true,
                                  onClickConfirm: () => {
                                    router.push(
                                      `${ROUTES.vendor.subscriptions}`,
                                    );
                                  },
                                },
                              );
                              return;
                            }
                            // if (item.path === ROUTES.vendor.trendGallery) {
                            //   const ruleValue =
                            //     userData?.price_rule?.rules?.find(
                            //       (i) =>
                            //         i?.rule_code === PLAN_RULE.INSPIRATION_REEL,
                            //     )?.value;

                            //   if (ruleValue === 0) {
                            //     showPopup(
                            //       "info",
                            //       `Want To Inspire Your Customers With Work?`,
                            //       {
                            //         confirmButtonText: "Upgrade Now",
                            //         showCancelButton: true,
                            //         onClickConfirm: () => {
                            //           router.push(
                            //             `${ROUTES.vendor.subscriptions}`,
                            //           );
                            //         },
                            //       },
                            //     );
                            //     return;
                            //   }
                            // }
                            // if (item.path === ROUTES.vendor.leads) {
                            //   const ruleValue =
                            //     userData?.price_rule?.rules?.find(
                            //       (i) => i?.rule_code === PLAN_RULE.LEADS,
                            //     )?.value;

                            //   if (ruleValue === 0) {
                            //     showPopup(
                            //       "info",
                            //       `Want To Generate More Leads?`,
                            //       {
                            //         confirmButtonText: "Upgrade Now",
                            //         showCancelButton: true,
                            //         onClickConfirm: () => {
                            //           router.push(
                            //             `${ROUTES.vendor.subscriptions}`,
                            //           );
                            //         },
                            //       },
                            //     );
                            //     return;
                            //   }
                            // }
                            // if (item.path === ROUTES.vendor.ebCommunity) {
                            //   const ruleValue =
                            //     userData?.price_rule?.rules?.find(
                            //       (i) =>
                            //         i?.rule_code === PLAN_RULE.B2B_COMMUNITY,
                            //     )?.value;

                            //   if (ruleValue !== true) {
                            //     showPopup(
                            //       "info",
                            //       `Want To Be Part Of The Largest B2B Community?`,
                            //       {
                            //         confirmButtonText: "Upgrade Now",
                            //         showCancelButton: true,
                            //         onClickConfirm: () => {
                            //           router.push(
                            //             `${ROUTES.vendor.subscriptions}`,
                            //           );
                            //         },
                            //       },
                            //     );
                            //     return;
                            //   }
                            // }
                            router.push(item.path);
                            isMobile && setIsSidebarOpen(false);
                          }}
                        >
                          <Tooltip
                            title={isSidebarOpen ? "" : item.label}
                            placement="right"
                          >
                            <div
                              style={
                                pathname.includes(item?.path?.split("?")?.[0])
                                  ? item.activeClassName
                                  : item.inActiveClassName
                              }
                              className={`group flex cursor-pointer items-center rounded-xl ${
                                isSidebarOpen
                                  ? "gap-3 p-2.5"
                                  : "justify-center p-2.5"
                              } ${
                                pathname.includes(item?.path?.split("?")?.[0])
                                  ? "bg-primary-50 text-primary-800 shadow-inner"
                                  : "text-primary-500 hover:bg-primary-50 hover:bg-opacity-40 hover:shadow-inner"
                              }`}
                            >
                              {item.icon ? (
                                <span>
                                  <item.icon className="h-5" />
                                </span>
                              ) : null}
                              {isSidebarOpen && (
                                <span
                                  className={`text-14-600 ${
                                    isSidebarOpen
                                      ? "opacity-100"
                                      : "w-0 opacity-0"
                                  } transition-all duration-[350ms] ease-in-out`}
                                >
                                  {item.label}
                                </span>
                              )}
                              {isSidebarOpen && item.badge ? (
                                (item.path === ROUTES.vendor.trendGallery &&
                                  userData?.price_rule?.rules?.find(
                                    (i) =>
                                      i?.rule_code ===
                                      PLAN_RULE.INSPIRATION_REEL,
                                  )?.value === 0) ||
                                (item.path === ROUTES.vendor.leads &&
                                  userData?.price_rule?.rules?.find(
                                    (i) => i?.rule_code === PLAN_RULE.LEADS,
                                  )?.value === 0) ||
                                (item.path === ROUTES.vendor.ebCommunity &&
                                  userData?.price_rule?.rules?.find(
                                    (i) =>
                                      i?.rule_code === PLAN_RULE.B2B_COMMUNITY,
                                  )?.value !== true) ||
                                item.path === ROUTES.vendor.analytics ? (
                                  <div className="ml-auto">
                                    <span>
                                      <item.badge className="h-5" />
                                    </span>
                                  </div>
                                ) : null
                              ) : null}
                            </div>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                    {item.hr && <hr />}
                  </Fragment>
                );
              })}
            </nav>
          </div>

          {isSidebarOpen && (
            <div className="flex flex-col gap-4 bg-primary-100 p-4">
              <Logo className="h-7 w-28" />
              <hr />
              {SideBarBottomData.map((item) => {
                return (
                  <div key={item.id}>
                    <Tooltip
                      title={isSidebarOpen ? "" : item.label}
                      placement="right"
                    >
                      <div
                        className={`group flex cursor-pointer items-center gap-3 rounded-xl text-primary-500`}
                      >
                        <span>
                          <item.icon className="h-5" />
                        </span>
                        {isSidebarOpen && (
                          <>
                            <Link
                              href={item.path}
                              className={`text-12-600 ${
                                isSidebarOpen ? "opacity-100" : "w-0 opacity-0"
                              } transition-all duration-[350ms] ease-in-out ${item?.className || ""}`}
                            >
                              {item.label}
                            </Link>
                            {item.badge && (
                              <div className="ml-auto flex size-5 items-center justify-center rounded-md bg-purple-100">
                                <span className="text-12-600 text-center text-primary-800">
                                  {item.badge}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideBar;
