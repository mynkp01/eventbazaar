"use client";
import { apiHandler } from "@api/apiHandler";
import {
  BlogsIcon,
  HeartIcon,
  landingBackgroundGradient,
  LeftArrowIcon,
  Logo,
  NoImage,
  TrendGalleryIcon,
} from "@assets/index";
import {
  Corporate,
  DecorSetupRentals,
  EventServicesTab,
  FashionStyling,
  SpecialServices,
  Venues,
} from "@components/VendorsMenuComp";
import { DashboardOutlined, Logout } from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import {
  logout,
  selectUser,
  setVisibleLoginModal,
} from "@redux/slices/authSlice";
import {
  selectCitiesData,
  selectSelectedCity,
  selectVendorsMenu,
  selectVerticalsAndEventTypes,
  setSelectedCity,
  setSubCategories,
  setVendorsMenu,
  setVerticalsAndEventTypes,
} from "@redux/slices/lookupSlice";
import { setIsLoading, setUtilsLogout } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES, USER_TYPES, VENDOR_MENUS } from "src/utils/Constant";
import { convertMediaUrl, isEmpty, showToast } from "src/utils/helper";
import { customEncodeURIComponent } from "src/utils/helper.server";
import CustomImage from "./CustomImage";
import MobileTopMenu from "./MobileTopMenu";

const FetchDropdown = dynamic(() => import("@components/FetchDropdown"), {
  ssr: true,
});
const Login = dynamic(() => import("@components/Login"), {
  ssr: true,
});

enum MenuIds {
  resource = "resource-menu",
  profile = "profile-menu",
}

export const EventTypesDropdown = ({
  eventTypes,
  currentVertical,
  setCurrentVertical,
}) => {
  const [eventHover, setEventHover] = useState(null);
  const routes = useRouter();

  return (
    <>
      <div className="container mx-auto grid gap-5">
        <div>
          <Tabs
            className="order-2 px-4 py-3 md:order-1"
            orientation="horizontal"
            variant="scrollable"
            value={currentVertical?._id}
            onChange={(e, newValue) => setCurrentVertical(newValue)}
            onMouseEnter={() => setEventHover(null)}
            aria-label="Main Tabs"
            sx={{
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
              "& .MuiTabs-indicator": {
                display: "none",
              },
              "& .MuiTab-root": {
                textTransform: "capitalize",
              },
            }}
          >
            {eventTypes?.map((tab) => (
              <Tab
                key={tab?._id}
                onClick={() => setCurrentVertical(tab)}
                onMouseEnter={() => setCurrentVertical(tab)}
                label={
                  <div className="text-start">
                    <p className="text-base font-medium text-black">
                      {tab?.event_vertical_name} Events
                    </p>
                  </div>
                }
                className={`flex w-fit !items-start py-2 !font-medium !text-black ${
                  currentVertical?._id === tab?._id ? "!bg-primary-300" : ""
                } hover:bg-gray-100`}
              />
            ))}
          </Tabs>
          <div className="border"></div>
          <div className="w-full">
            <div className="grid grid-cols-4 gap-x-6 bg-[linear-gradient(to_right,#FFFFFF_0%,#FFFFFF_25%,#F7F7F7_25%,#F7F7F7_50%,#FFFFFF_50%,#FFFFFF_75%,#F7F7F7_75%,#F7F7F7_100%)] p-4">
              {currentVertical?.["event-types"]?.map((event, index) => (
                <Link
                  key={event?._id || index}
                  onMouseEnter={() => setEventHover(event)}
                  className="flex w-full cursor-pointer items-center justify-between px-5 py-1 hover:text-green-400"
                  href={
                    event?.event_type_name
                      ? `${ROUTES.client.events}/${customEncodeURIComponent(
                          currentVertical?.event_vertical_name,
                        )}/${customEncodeURIComponent(event?.event_type_name)}`
                      : ""
                  }
                >
                  <p className="py-1">{event?.event_type_name}</p>
                  <div
                    className={`${event?.event_type_name && event?._id === eventHover?._id ? "!min-size-5 !size-5" : ""} size-0 overflow-hidden`}
                  >
                    <LeftArrowIcon
                      key={event?._id || index}
                      className={`${event?.event_type_name && event?._id === eventHover?._id ? "!size-5 !-rotate-45" : ""} size-full rotate-0 transition-all duration-300 ease-in-out`}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const VendorDropdown = ({
  vendorsMenus,
  currentVendorsMenu,
  setCurrentVendorsMenu,
}) => {
  const [eventHover, setEventHover] = useState(null);

  return (
    <>
      <div className="container mx-auto grid gap-5">
        <div className="overflow-hidden">
          <Tabs
            className="order-2 py-3 md:order-1 xl:px-4"
            orientation="horizontal"
            variant="scrollable"
            value={currentVendorsMenu?._id}
            onMouseEnter={() => setEventHover(null)}
            onChange={(e, newValue) => setCurrentVendorsMenu(newValue)}
            aria-label="Main Tabs"
            sx={{
              "& .MuiTabs-flexContainer": {
                gap: "3px",
              },
              "& .MuiTabs-indicator": {
                display: "none",
              },
              "& .MuiTab-root": {
                textTransform: "capitalize",
              },
            }}
          >
            {vendorsMenus?.map((menu) => (
              <Tab
                onClick={() => setCurrentVendorsMenu(menu)}
                onMouseEnter={() => setCurrentVendorsMenu(menu)}
                key={menu?._id}
                label={
                  <div className="text-start">
                    <p className="text-base font-medium text-black">
                      {menu?.key_1}
                    </p>
                  </div>
                }
                value={menu?._id}
                className={`flex w-fit !items-start py-2 !font-medium !text-black ${
                  currentVendorsMenu?._id === menu?._id ? "!bg-primary-300" : ""
                } hover:bg-gray-100`}
              />
            ))}
          </Tabs>
          <div className="border"></div>
          {(() => {
            switch (currentVendorsMenu?.code) {
              case VENDOR_MENUS.DECOR_AND_SETUP_RENTALS:
                return (
                  <DecorSetupRentals
                    eventHover={eventHover}
                    setEventHover={setEventHover}
                    currentVendorsMenu={currentVendorsMenu}
                  />
                );
              case VENDOR_MENUS.VENUES:
                return (
                  <Venues
                    eventHover={eventHover}
                    setEventHover={setEventHover}
                    currentVendorsMenu={currentVendorsMenu}
                  />
                );
              case VENDOR_MENUS.FASHION_AND_STYLING:
                return (
                  <FashionStyling
                    eventHover={eventHover}
                    setEventHover={setEventHover}
                    currentVendorsMenu={currentVendorsMenu}
                  />
                );
              case VENDOR_MENUS.CORPORATE:
                return (
                  <Corporate
                    eventHover={eventHover}
                    setEventHover={setEventHover}
                    currentVendorsMenu={currentVendorsMenu}
                  />
                );
              case VENDOR_MENUS.SPECIAL_SERVICES:
                return (
                  <SpecialServices
                    eventHover={eventHover}
                    setEventHover={setEventHover}
                    currentVendorsMenu={currentVendorsMenu}
                  />
                );
              default:
                return (
                  <EventServicesTab
                    eventHover={eventHover}
                    setEventHover={setEventHover}
                    currentVendorsMenu={currentVendorsMenu}
                  />
                );
            }
          })()}
        </div>
      </div>
    </>
  );
};

export const ExploreCityDropdown = () => {
  const selectedCity = useSelector(selectSelectedCity);
  const citiesData = useSelector(selectCitiesData);

  const [hoveredCity, setHoveredCity] = useState(
    selectedCity ? selectedCity : citiesData?.[0] ? citiesData[0] : null,
  );

  return (
    <>
      <div className="container mx-auto grid">
        <div className="flex gap-5 divide-x-2 p-5">
          <div className="flex aspect-square w-full min-w-[230px] max-w-[380px] flex-col gap-5 2xl:min-w-[380px]">
            <CustomImage
              src={
                hoveredCity !== null
                  ? convertMediaUrl(hoveredCity?.vertical_path)
                  : selectedCity?.vertical_path
                    ? convertMediaUrl(selectedCity?.vertical_path)
                    : NoImage
              }
              className="!aspect-square rounded-xl object-cover"
            />
          </div>
          <div className="max-h-[380px] min-h-[230px] w-full gap-5 overflow-y-auto 2xl:min-h-[380px]">
            <div className="relative col-span-2 grid w-full flex-grow auto-rows-max gap-y-8 pl-7">
              <div className="grid grid-cols-3 gap-5">
                {citiesData?.map((city, i) => {
                  return (
                    <Link
                      href={`${ROUTES.client.city}/${customEncodeURIComponent(city?.name)}`}
                      key={city?._id}
                      onMouseEnter={() => setHoveredCity(city)}
                      className="flex auto-rows-max gap-2 rounded-md p-2 hover:bg-primary-300 hover:text-green-400"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl">
                          <CustomImage
                            key={i}
                            src={convertMediaUrl(city?.vector_path)}
                            height={"100%"}
                            width={"100%"}
                            className="!h-full !w-full"
                            loaderClasses={{
                              container: "!p-2.5 !h-10 !w-10 !min-w-10",
                              loader: "!h-full !w-full flex items-center",
                            }}
                          />
                        </div>
                        <p>{city?.name}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const ResourcesDropdown = () => {
  const ResourcesData = [
    // {
    //   _id: 0,
    //   title: "Real Event Stories",
    //   icon: RealEventStories,
    //   href: "",
    //   description:
    //     "Showcasing real events that have been organized with vendors on the platform",
    // },
    {
      _id: 1,
      title: "Trend Gallery",
      icon: TrendGalleryIcon,
      href: ROUTES.client.trendGallery,
      description:
        "A blog dedicated to sharing insights, tips, and updates on the event industry",
    },
    {
      _id: 2,
      title: "Blogs",
      icon: BlogsIcon,
      href: ROUTES.client.blogs,
      description:
        "A community forum where users can connect, share, and discuss event-related topics",
    },
    // {
    //   _id: 3,
    //   title: "Educational Videos",
    //   icon: EducationalVideo,
    //   href: ROUTES.client.educationalVideo,
    //   description:
    //     "A dedicated support team available to assist users with any inquiries or issues",
    // },
  ];

  return (
    <div className="w-full gap-5 p-2">
      {ResourcesData?.map((item) => {
        return (
          <Link
            key={item?._id}
            className={`group flex w-56 items-center gap-2 p-2 hover:bg-primary-300 ${!isEmpty(item?.href) ? "hover:text-green-400" : "pointer-events-none"}`}
            href={item?.href}
          >
            <item.icon className="size-7 min-h-7 min-w-7 text-green-400" />
            <div className="flex flex-col gap-2 text-left">
              <p>{item?.title}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

const ClientHeader = ({
  focusedPopover,
  setFocusedPopover,
  isOpen,
  setIsOpen,
}) => {
  const userData = useSelector(selectUser);

  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const isCityPage = pathname.startsWith(ROUTES.client.city);

  const routes = useRouter();
  const selectedCity = useSelector(selectSelectedCity);
  const verticalsAndEventTypesData = useSelector(selectVerticalsAndEventTypes);
  const vendorsMenus = useSelector(selectVendorsMenu);

  const [currentVertical, setCurrentVertical] = useState(null);
  const [currentVendorsMenu, setCurrentVendorsMenu] = useState(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState<
    null | { [K in MenuIds]: HTMLElement | null }
  >(null);

  useEffect(() => {
    const functionForResizingScreen = () => {
      setIsOpen(false);
      setFocusedPopover(null);
    };

    window.addEventListener("resize", functionForResizingScreen);

    return () => {
      window.removeEventListener("resize", functionForResizingScreen);
    };
  }, [setFocusedPopover, setIsOpen]);

  useEffect(() => {
    requestAnimationFrame(() => {
      fetchEventVerticals();
      fetchSubCategory();
      fetchVendorsMenu();
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos === 0 || isOpen) {
        setVisible(true);
        return;
      }

      const isScrollingDown = prevScrollPos < currentScrollPos;

      setVisible(!isScrollingDown);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, isOpen /* focusedPopover */]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event.currentTarget.id === MenuIds.profile) {
      setAnchorEl({
        [MenuIds.profile]: event.currentTarget,
        [MenuIds.resource]: null,
      });
    } else {
      setAnchorEl({
        [MenuIds.profile]: null,
        [MenuIds.resource]: event.currentTarget,
      });
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    dispatch(setIsLoading(true));
    try {
      const res =
        userData?.user_type === USER_TYPES.VENDOR
          ? await apiHandler.vendor.vendorSignOut()
          : userData?.user_type === USER_TYPES.CUSTOMER
            ? await apiHandler.client.customerSignout()
            : null;

      if (res?.status === 200 || res?.status === 201) {
        showToast("success", res?.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      Cookies.remove("token");
      Cookies.remove("user_type");
      dispatch(logout());
      dispatch(setUtilsLogout());
      dispatch(setIsLoading(false));
      routes.push(ROUTES.home);
    }
  };

  const handleFetchDropdownChange = async (_, value) => {
    dispatch(setIsLoading(true));
    if (!isEmpty(value)) {
      dispatch(setSelectedCity(value));
      if (isCityPage) {
        window.location.href = `${ROUTES.client.city}/${customEncodeURIComponent(value?.name)}`;
      }
    } else {
      dispatch(setSelectedCity(null));
    }
    dispatch(setIsLoading(false));
  };

  const fetchVendorsMenu = async () => {
    try {
      const { data, status } = await apiHandler.vendorsMenu.get();
      if (status === 200 || status === 201) {
        setCurrentVendorsMenu(data?.data?.[0]);
        dispatch(setVendorsMenu(data?.data));
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const fetchEventVerticals = async () => {
    try {
      const { data, status } =
        await apiHandler.eventType.eventVerticalAndEventType();
      if (status === 200 || status === 201) {
        data.data = data?.data?.map((v) => {
          let length = v?.["event-types"]?.length % 4;
          length = 4 - length;
          for (let i = 0; i < length; i++) {
            v?.["event-types"].push({});
          }

          return v;
        });
        setCurrentVertical(data?.data?.[0]);
        dispatch(setVerticalsAndEventTypes(data?.data));
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const fetchSubCategory = async () => {
    try {
      const { data, status } =
        await apiHandler.client.subCategoryList(`limit=500`);

      if (status === 200 || status === 201) {
        dispatch(setSubCategories(data?.data?.records));
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const showLogin = () => {
    dispatch(setVisibleLoginModal(true));
  };

  const ClientTabsDataLeft = [
    {
      id: "event_types",
      label: "Event Types",
      path: "",
      component: (
        <EventTypesDropdown
          eventTypes={verticalsAndEventTypesData}
          currentVertical={currentVertical}
          setCurrentVertical={setCurrentVertical}
        />
      ),
    },
    {
      id: "vendors",
      label: "Vendors",
      path: "",
      component: (
        <VendorDropdown
          vendorsMenus={vendorsMenus}
          currentVendorsMenu={currentVendorsMenu}
          setCurrentVendorsMenu={setCurrentVendorsMenu}
        />
      ),
    },
    {
      id: "explore_city",
      label: "Explore City",
      path: "",
      component: <ExploreCityDropdown />,
    },
    {
      id: "artist",
      label: "Artist",
      path: ROUTES.client.artist,
    },
    {
      id: "venues",
      label: "Venues",
      path: ROUTES.client.venues,
    },
  ];

  const ClientTabsDataRight = [
    {
      id: "resources",
      label: "Resources",
      path: "",
      component: <ResourcesDropdown />,
    },
  ];

  return (
    <div
      id="client-header"
      className={`sticky top-0 z-[1200] w-full transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="w-full">
        <div
          style={{ backgroundImage: `url(${landingBackgroundGradient.src})` }}
          className="h-fit w-full bg-cover bg-center bg-no-repeat"
        >
          <div className="flex h-full w-full flex-col justify-center gap-2.5 px-6 py-2 md:flex-row md:items-center md:justify-between lg:px-24">
            <div className="flex w-full items-center gap-2 md:w-60">
              <p className="whitespace-nowrap">Select City</p>
              <FetchDropdown
                containerClass="!mt-0 !h-6"
                className="!flex !items-center !overflow-hidden !rounded-md placeholder:!font-light placeholder:!text-black"
                placeholder="All Cities"
                value={selectedCity?._id}
                endPoints={apiHandler.values.cities}
                filterStr="NA"
                display="name"
                disableClearable={false}
                func={handleFetchDropdownChange}
                required
              />
            </div>
            <p className="text-16-400 !font-light text-customer-primary-100">
              Looking for Vendor Portal ?{" "}
              <Link href={ROUTES.landingPage} className="text-16-600">
                Click here
              </Link>
            </p>
          </div>
        </div>

        <div
          className={`bg-customer-secondary-100 ${isOpen ? "shadow-sm" : ""}`}
        >
          <div className="flex items-center justify-between px-6 md:pb-0 lg:px-24">
            <div className="flex h-20 w-full items-center gap-10">
              <a href={`/`}>
                <Logo height={36} />
              </a>

              <div className="text-16-400 hidden items-center gap-5 !font-normal lg:flex">
                {ClientTabsDataLeft.map((i) => (
                  <div
                    key={i.id}
                    className="group py-7"
                    onMouseLeave={() => setFocusedPopover(null)}
                    onMouseEnter={() => setFocusedPopover(i?.id)}
                  >
                    <Link href={i.path} className="relative pb-[29px]">
                      {i.label}
                      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-green-400 transition-all duration-300 group-hover:w-full" />
                    </Link>
                    {focusedPopover === i.id && isEmpty(i?.path) ? (
                      <div className="absolute left-0 right-0 top-full z-50 mx-auto grid w-full max-w-[1320px] gap-5 bg-white shadow-xl transition-all duration-500 ease-in">
                        {i.component}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex h-20 items-center gap-5">
              <div className="text-16-400 hidden items-center gap-5 !font-normal lg:flex">
                {ClientTabsDataRight.map((i) => (
                  <div
                    key={i.id}
                    className="group relative py-7"
                    onMouseLeave={() => setFocusedPopover(null)}
                    onMouseEnter={() => setFocusedPopover(i?.id)}
                  >
                    <Link href={i.path} className="pb-[29px]">
                      {i.label}
                      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-green-400 transition-all duration-300 group-hover:w-full" />
                    </Link>
                    {focusedPopover === i.id && isEmpty(i?.path) ? (
                      <div className="absolute right-0 top-full z-50 w-max gap-5 bg-white shadow-xl transition-all duration-500 ease-in">
                        {i.component}
                      </div>
                    ) : null}
                  </div>
                ))}

                {!isEmpty(userData) ? (
                  <Tooltip title="Shortlist">
                    <IconButton
                      onClick={() => {
                        routes.push(ROUTES.client.shortlists);
                      }}
                    >
                      <HeartIcon className="size-6" />
                    </IconButton>
                  </Tooltip>
                ) : null}

                {/* {!isEmpty(userData) &&
                userData?.user_type === USER_TYPES.CUSTOMER ? (
                  <Tooltip title="Inbox">
                    <IconButton
                      onClick={() => routes.push(ROUTES.client.inbox)}
                      size="small"
                    >
                      <MailLight className="size-7" />
                    </IconButton>
                  </Tooltip>
                ) : null} */}
              </div>

              {isEmpty(userData) ? (
                <>
                  <div className="text-16-400 hidden items-center gap-2 !font-normal lg:flex">
                    <button
                      onClick={showLogin}
                      className="whitespace-nowrap rounded-lg border border-customer-primary-100 bg-transparent px-2 py-1 text-customer-primary-100 transition-all duration-300 hover:!border-customer-primary-100 hover:!bg-customer-primary-100 hover:!text-primary-200 sm:px-3 sm:py-1 sm:text-sm"
                    >
                      Login
                    </button>
                  </div>
                  <div className="flex gap-2 lg:hidden">
                    <button
                      onClick={() => {
                        setFocusedPopover(null);
                        setIsOpen(!isOpen);
                      }}
                      className="flex items-center justify-center rounded-md !p-2"
                      aria-expanded="false"
                    >
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={
                            isOpen
                              ? "M6 18L18 6M6 6l12 12"
                              : "M4 6h16M4 12h16M4 18h16"
                          }
                        />
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-16-400 flex items-center gap-2 !font-normal">
                  <div>
                    <IconButton
                      id={MenuIds.profile}
                      onClick={handleClick}
                      size="small"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-400 font-bold sm:h-10 sm:w-10">
                        {userData?.full_name?.split(" ").length > 1
                          ? `${userData?.full_name?.split(" ")[0].charAt(0)?.toUpperCase()}${userData?.full_name?.split(" ")[1].charAt(0)?.toUpperCase()}`
                          : userData?.full_name?.slice(0, 2)?.toUpperCase()}
                      </div>
                    </IconButton>

                    <Menu
                      anchorEl={anchorEl?.[MenuIds.profile]}
                      open={Boolean(anchorEl?.[MenuIds.profile])}
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
                      {!isEmpty(userData) &&
                      userData?.user_type === USER_TYPES.VENDOR ? (
                        <MenuItem>
                          <Link
                            href={ROUTES.vendor.dashboard}
                            target="_blank"
                            className="flex items-center"
                          >
                            <ListItemIcon>
                              <DashboardOutlined fontSize="small" />
                            </ListItemIcon>
                            Go To Dashboard
                          </Link>
                        </MenuItem>
                      ) : null}
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </div>
                  <div className="lg:hidden">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="flex items-center justify-center rounded-md"
                      aria-expanded="false"
                    >
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={
                            isOpen
                              ? "M6 18L18 6M6 6l12 12"
                              : "M4 6h16M4 12h16M4 18h16"
                          }
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isOpen ? (
            <>
              <div className="flex max-h-[350px] flex-col overflow-y-auto pb-5 lg:hidden">
                <div className="text-16-400 flex flex-col gap-5 px-6 !font-normal text-black-50 lg:px-24">
                  <MobileTopMenu
                    setIsOpen={setIsOpen}
                    defaultOpened={focusedPopover}
                  />
                </div>

                {isEmpty(userData) ? (
                  <>
                    <div className="mx-6 mb-6 flex min-h-[1px] w-auto bg-[rgba(0,0,0,0.3)] lg:mx-24 lg:hidden" />
                    <div className="text-16-400 flex items-center gap-2 px-6 !font-normal lg:px-24">
                      <button
                        onClick={showLogin}
                        className="w-full rounded-lg border border-customer-primary-100 bg-transparent px-2 py-2 text-customer-primary-100 transition-all duration-300 hover:!border-customer-primary-100 hover:!bg-customer-primary-100 hover:!text-primary-200 sm:px-3 sm:text-sm"
                      >
                        Login
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>

      <Login />
    </div>
  );
};

export default ClientHeader;
