import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { selectUser } from "@redux/slices/authSlice";
import {
  selectCitiesData,
  selectVendorsMenu,
  selectVerticalsAndEventTypes,
  setSelectedCity,
} from "@redux/slices/lookupSlice";
import { useAppDispatch } from "@redux/store/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES } from "src/utils/Constant";
import { isEmpty } from "src/utils/helper";
import { customEncodeURIComponent } from "src/utils/helper.server";

const MobileTopMenu = ({ setIsOpen, defaultOpened }) => {
  const dispatch = useAppDispatch();

  const userData = useSelector(selectUser);
  const citiesData = useSelector(selectCitiesData);
  const vendorsMenus = useSelector(selectVendorsMenu);
  const verticalsAndEventTypesData = useSelector(selectVerticalsAndEventTypes);

  const [menuExpanded, setMenuExpanded] = useState<string | null>(null);
  const [subMenuExpanded, setSubMenuExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!isEmpty(defaultOpened)) {
      setMenuExpanded(defaultOpened);
    }
  }, [defaultOpened]);

  const [mobileMenu, setMobileMenu] = useState([
    {
      id: "event_types",
      label: "Event Types",
      submenu: verticalsAndEventTypesData?.map((vertical) => ({
        id: vertical._id,
        label: vertical.event_vertical_name,
        submenu: [
          {
            id: `events_${vertical._id}`,
            data: vertical["event-types"]?.map((event) => ({
              id: event._id,
              label: event.event_type_name,
              href: `${ROUTES.client.events}/${customEncodeURIComponent(vertical?.event_vertical_name)}/${customEncodeURIComponent(event?.event_type_name)}`,
              onClick: () => setIsOpen(false),
            })),
          },
        ],
      })),
    },
    {
      id: "vendors",
      label: "Vendors",
      submenu: vendorsMenus?.map((menu) => ({
        id: menu?._id,
        label: menu?.key_1,
        path: "",
        submenu: menu?.category_1?.map((subMenu) => ({
          id: subMenu?._id,
          label: subMenu?.key_2,
          data: subMenu?.category_2?.map((category) => ({
            id: category?._id,
            label: category?.business_sub_category_name,
            href: `${ROUTES.client.category}/${customEncodeURIComponent(category?.business_sub_category_name)}`,
            onClick: () => setIsOpen(false),
          })),
        })),
      })),
    },
    {
      id: "explore_city",
      label: "Explore city",
      submenu: citiesData?.map((city) => ({
        id: city._id,
        label: city.name,
        href: `${ROUTES.client.city}/${customEncodeURIComponent(city?.name)}`,
        onClick: () => {
          dispatch(setSelectedCity(city));
          setIsOpen(false);
        },
        city: city,
      })),
    },
    {
      id: "artist",
      label: "Artist",
      href: ROUTES.client.artist,
      onClick: () => setIsOpen(false),
    },
    {
      id: "venues",
      label: "Venues",
      href: ROUTES.client.venues,
      onClick: () => setIsOpen(false),
    },
    {
      id: "resources",
      label: "Resources",
      submenu: [
        // {
        //   id: 0,
        //   label: "Real Event Stories",
        //   description:
        //     "Showcasing real events that have been organized with vendors on the platform",
        // },
        {
          id: 1,
          label: "Trend Gallery",
          href: ROUTES.client.trendGallery,
          onClick: () => setIsOpen(false),
          description:
            "A blog dedicated to sharing insights, tips, and updates on the event industry",
        },
        {
          id: 2,
          label: "Blogs",
          href: ROUTES.client.blogs,
          onClick: () => setIsOpen(false),
          description:
            "A community forum where users can connect, share, and discuss event-related topics",
        },
        // {
        //   id: 3,
        //   label: "Educational Videos",
        //   href: ROUTES.client.educationalVideo,
        //   onClick: () => setIsOpen(false),
        //   description:
        //     "A dedicated support team available to assist users with any inquiries or issues",
        // },
      ],
    },
  ]);

  useEffect(() => {
    setMobileMenu((prevData) => {
      let data = [...prevData];

      // if (
      //   !isEmpty(userData) &&
      //   userData?.user_type === USER_TYPES.CUSTOMER &&
      //   isEmpty(data.find((i) => i?.id === "inbox"))
      // ) {
      //   data.push({
      //     id: "inbox",
      //     label: "Inbox",
      //     href: ROUTES.client.inbox,
      //     onClick: () => setIsOpen(false),
      //   });
      // }

      if (
        !isEmpty(userData) &&
        isEmpty(data.find((i) => i?.id === "shortlists"))
      ) {
        data.push({
          id: "shortlists",
          label: "Shortlist",
          href: ROUTES.client.shortlists,
          onClick: () => setIsOpen(false),
        });
      }

      return data;
    });
  }, [userData]);

  return (
    <div>
      <style>{`
        .MuiAccordion-root {
          font-weight: 400 !important;
        }
        .MuiAccordionSummary-root {
          font-weight: 400 !important;
        }
        .MuiAccordionDetails-root {
          font-weight: 400 !important;
        }
      `}</style>

      {mobileMenu.map((item, index) => (
        <Accordion
          key={item.id || `menu-${index}`}
          expanded={isEmpty(item.submenu) ? null : menuExpanded === item.id}
          className="!my-0 !bg-inherit !shadow-none"
          onChange={() =>
            setMenuExpanded((prevValue) =>
              prevValue === item.id ? null : item.id,
            )
          }
        >
          <AccordionSummary
            onClick={() => {
              if (item?.onClick) {
                item?.onClick();
              }
            }}
            expandIcon={
              isEmpty(item.submenu) ? null : (
                <ExpandMoreIcon className="!text-green-400" />
              )
            }
            className="!m-0 !flex !items-center !text-base"
          >
            <Link
              href={item?.href || ""}
              className={`w-full ${item?.href ? "" : "pointer-events-none"}`}
            >
              {item.label}
            </Link>
          </AccordionSummary>
          <AccordionDetails className="!m-0 !py-0 !text-xs">
            {!isEmpty(item.submenu)
              ? item.submenu.map((submenuItem, subIndex) => (
                  <Accordion
                    key={submenuItem.id || `submenu-${subIndex}`}
                    expanded={
                      !isEmpty(submenuItem?.submenu)
                        ? subMenuExpanded === submenuItem?.id
                        : false
                    }
                    onClick={submenuItem?.onClick}
                    className="!my-0 !bg-inherit !shadow-none"
                    onChange={() =>
                      setSubMenuExpanded((prevValue) =>
                        prevValue === submenuItem.id ? null : submenuItem.id,
                      )
                    }
                  >
                    <AccordionSummary
                      expandIcon={
                        !isEmpty(submenuItem?.submenu) ? (
                          <ExpandMoreIcon className="!text-green-400" />
                        ) : null
                      }
                      sx={{
                        "&.Mui-expanded": {
                          borderBottom: "1px solid #ababab",
                        },
                      }}
                    >
                      <Link
                        href={submenuItem?.href || ""}
                        className={`w-full ${
                          submenuItem?.href ? "" : "pointer-events-none"
                        }`}
                      >
                        {submenuItem?.label}
                      </Link>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="m-4 mb-0 flex flex-col gap-4 text-sm">
                        {submenuItem?.submenu?.map((i, subSubIndex) =>
                          !isEmpty(i.data) ? (
                            <>
                              {!isEmpty(i?.label) ? (
                                <p className="font-semibold uppercase text-green-400">
                                  {i?.label}
                                </p>
                              ) : null}
                              <div
                                key={i?.id || `sub-submenu-${subSubIndex}`}
                                className="flex flex-col gap-2"
                              >
                                {i.data.map((childItem, childIndex) => (
                                  <div
                                    onClick={childItem.onClick}
                                    className="hover:text-green-400"
                                    key={
                                      childItem?.id ||
                                      `submenu-child-${childIndex}`
                                    }
                                  >
                                    <Link
                                      href={childItem?.href || ""}
                                      className={`w-full ${childItem?.href ? "" : "pointer-events-none"}`}
                                    >
                                      {childItem?.label}
                                    </Link>
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : (
                            <div
                              key={i?.id || `sub-submenu-${subSubIndex}`}
                              onClick={i?.onClick}
                            >
                              <Link
                                href={i?.href || ""}
                                className={`w-full ${i?.href ? "" : "pointer-events-none"}`}
                              >
                                {i?.label}
                              </Link>
                            </div>
                          ),
                        )}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                ))
              : null}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default MobileTopMenu;
