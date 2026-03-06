"use client";
import { apiHandler } from "@api/apiHandler";
import {
  CallIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  Location,
  Logo,
  MailLight,
  PinterestIcon,
  YouTubeIcon,
} from "@assets/index";
import { setVisibleLoginModal } from "@redux/slices/authSlice";
import { selectCitiesData, setCities } from "@redux/slices/lookupSlice";
import { useAppDispatch } from "@redux/store/store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Dispatch,
  Fragment,
  MouseEventHandler,
  SetStateAction,
  useEffect,
} from "react";
import { useSelector } from "react-redux";
import { MAILS, ROUTES } from "src/utils/Constant";
import { isEmpty, showToast } from "src/utils/helper";
import { customEncodeURIComponent } from "src/utils/helper.server";

interface FooterDataInterface {
  id?: number;
  title?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  href?: string;
}

const Footer = ({
  setFocusedPopover,
  setIsOpen,
}: {
  setFocusedPopover?: Dispatch<SetStateAction<string | null>>;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const routes = useRouter();
  const path = usePathname();
  const citiesData = useSelector(selectCitiesData);

  useEffect(() => {
    requestAnimationFrame(() => {
      fetchCities();
    });
  }, []);

  const fetchCities = async () => {
    try {
      const { data, status } = await apiHandler.city.lookup();
      if (status === 200 || status === 201) {
        dispatch(setCities(data?.data));
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const OurServices: FooterDataInterface[] = [
    {
      id: 0,
      title: "Explore Vendors By Category",
      onClick: () => {
        if (
          [
            ROUTES.landingPage,
            ROUTES.privacyPolicy,
            ROUTES.termsConditions,
          ].some((v) => path?.includes(v))
        ) {
          routes.push(ROUTES.home);
        } else {
          setIsOpen ? setIsOpen(true) : null;
          setFocusedPopover ? setFocusedPopover("vendors") : null;
        }
      },
    },
    {
      id: 1,
      title: "Explore Vendors By Event Type",
      onClick: () => {
        if (
          [
            ROUTES.landingPage,
            ROUTES.privacyPolicy,
            ROUTES.termsConditions,
          ].some((v) => path?.includes(v))
        ) {
          routes.push(ROUTES.home);
        } else {
          setIsOpen ? setIsOpen(true) : null;
          setFocusedPopover ? setFocusedPopover("event_types") : null;
        }
      },
    },
    {
      id: 2,
      title: "Bazaar Buddy",
      onClick: () => routes.push(ROUTES.client.bazaarBuddy),
      href: ROUTES.client.bazaarBuddy,
    },
    {
      id: 3,
      title: "Blogs",
      onClick: () => routes.push(ROUTES.client.blogs),
      href: ROUTES.client.blogs,
    },
  ];
  const AboutUs: FooterDataInterface[] = [
    {
      id: 0,
      title: "Our story",
      onClick: () => routes.push(ROUTES.client.ourStory),
      href: ROUTES.client.ourStory,
    },
    {
      id: 1,
      title: "Become a vendor",
      onClick: () => routes.push(ROUTES.vendor.signUp),
      href: ROUTES.vendor.signUp,
    },
    // { id: 2, title: "Refer a friend" },
    // { id: 3, title: "Reviews" },
    {
      id: 4,
      title: "Careers",
      onClick: () => routes.push(ROUTES.client.contactUs),
      href: ROUTES.client.careers,
    },
    {
      id: 5,
      title: "PR",
      onClick: () => routes.push(ROUTES.client.pr),
      href: ROUTES.client.pr,
    },
  ];
  const AdviceAndSupport: FooterDataInterface[] = [
    {
      id: 0,
      title: "FAQ’s",
      onClick: () => routes.push(ROUTES.client.faqs),
      href: ROUTES.client.faqs,
    },
    {
      id: 1,
      title: "Contact Us",
      onClick: () => routes.push(ROUTES.client.contactUs),
      href: ROUTES.client.contactUs,
    },
  ];
  const FooterRowContent: FooterDataInterface[] = [
    {
      id: 0,
      title: "Privacy Policy",
      onClick: () => routes.push(ROUTES.privacyPolicy),
      href: ROUTES.privacyPolicy,
    },
    {
      id: 1,
      title: "Terms & Conditions",
      onClick: () => routes.push(ROUTES.termsConditions),
      href: ROUTES.termsConditions,
    },
    {
      id: 2,
      title: "Disclaimer",
      onClick: () => routes.push(ROUTES.disclaimer),
      href: ROUTES.disclaimer,
    },
  ];

  return (
    <div className="bg-[#EFF7F2] px-5 sm:px-12 md:px-16 lg:px-24">
      {/* <div className="h-[1px] w-full bg-[linear-gradient(90deg,rgb(2,66,136)_5.25%,rgb(170,254,105)_129.56%)]" /> */}

      <div className="grid gap-3 py-5 text-left xs:grid-cols-2 md:grid-cols-3 md:py-10 lg:grid-cols-5 xl:gap-5">
        {/* Our Services */}
        <div className="flex flex-col gap-4 md:gap-6">
          <h2 className="text-lg font-medium text-black-300 md:text-xl">
            Our Services
          </h2>
          <div className="flex flex-col gap-2.5 text-xs text-grey-400 md:text-sm">
            {OurServices.map((i) =>
              i?.href ? (
                <Link
                  key={i.id}
                  href={i?.href}
                  className={`text-left ${isEmpty(i?.href) ? "cursor-default" : "hover:text-green-400"}`}
                >
                  {i.title}
                </Link>
              ) : (
                <button
                  key={i.id}
                  onClick={i?.onClick}
                  className={`text-left ${isEmpty(i?.onClick) ? "cursor-default" : "hover:text-green-400"}`}
                >
                  {i.title}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 md:gap-6">
          <h2 className="text-lg font-medium text-black-300 md:text-xl">
            Cities
          </h2>
          <div className="flex w-fit flex-col gap-2.5 text-xs text-grey-400 md:text-sm">
            {citiesData
              ?.reduce((rows: any[], city: any, index: number) => {
                if (index % 2 === 0) {
                  rows.push(
                    [citiesData[index], citiesData[index + 1]].filter(Boolean),
                  );
                }
                return rows;
              }, [])
              .map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 gap-6 text-xs text-grey-400 md:text-sm"
                >
                  {row.map((city) => (
                    <Link
                      href={`${ROUTES.client.city}/${customEncodeURIComponent(city?.name)}`}
                      key={city?._id}
                      className={`text-left hover:text-green-400`}
                    >
                      {city?.name}
                    </Link>
                  ))}
                </div>
              ))}
          </div>
        </div>

        {/* About */}
        <div className="flex flex-col gap-4 md:gap-6">
          <h2 className="text-lg font-medium text-black-300 md:text-xl">
            About
          </h2>
          <div className="flex flex-col gap-2.5 text-xs text-grey-400 md:text-sm">
            {AboutUs.map((i) =>
              i?.href ? (
                <Link
                  key={i.id}
                  href={i?.href}
                  className={`text-left ${isEmpty(i?.href) ? "cursor-default" : "hover:text-green-400"}`}
                >
                  {i.title}
                </Link>
              ) : (
                <button
                  key={i.id}
                  onClick={i?.onClick}
                  className={`text-left ${isEmpty(i?.onClick) ? "cursor-default" : "hover:text-green-400"}`}
                >
                  {i.title}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Advice and support */}
        <div className="flex flex-col gap-4 md:gap-6">
          <h2 className="text-lg font-medium text-black-300 md:text-xl">
            Advice and support
          </h2>
          <div className="flex flex-col gap-2.5 text-xs text-grey-400 md:text-sm">
            {AdviceAndSupport.map((i) => (
              <Fragment key={i.id}>
                {i?.href ? (
                  <Link
                    key={i.id}
                    href={i?.href}
                    className={`text-left ${isEmpty(i?.href) ? "cursor-default" : "hover:text-green-400"}`}
                  >
                    {i.title}
                  </Link>
                ) : (
                  <button
                    key={i.id}
                    onClick={i?.onClick}
                    className={`text-left ${isEmpty(i?.onClick) ? "cursor-default" : "hover:text-green-400"}`}
                  >
                    {i.title}
                  </button>
                )}
              </Fragment>
            ))}

            <hr />

            <div className="flex w-full flex-col gap-1">
              <p className="font-bold">For Vendors:</p>
              <Link
                href={`mailto:${MAILS.VENDORS_MAIL}`}
                className="group flex items-center gap-1.5 text-left hover:text-green-400"
              >
                <MailLight className="size-4 min-h-4 min-w-4 transition-all duration-300 group-hover:scale-125" />
                <p>{MAILS.VENDORS_MAIL}</p>
              </Link>
              <Link
                href="tel:+917436044777"
                className="group flex items-center gap-1.5 text-left hover:text-green-400"
              >
                <CallIcon
                  className="size-4 min-h-4 min-w-4 transition-all duration-300 group-hover:scale-125"
                  fill="currentColor"
                />
                <p>+91 74360 44777</p>
              </Link>
            </div>

            <hr />

            <div className="flex w-full flex-col gap-1">
              <p className="font-bold">For Customers:</p>
              <Link
                href={`mailto:${MAILS.INFO_MAIL}`}
                className="group flex items-center gap-1.5 text-left hover:text-green-400"
              >
                <MailLight className="size-4 min-h-4 min-w-4 transition-all duration-300 group-hover:scale-125" />
                <p>{MAILS.INFO_MAIL}</p>
              </Link>
              <Link
                href="tel:+917435044777"
                className="group flex items-center gap-1.5 text-left hover:text-green-400"
              >
                <CallIcon
                  className="size-4 min-h-4 min-w-4 transition-all duration-300 group-hover:scale-125"
                  fill="currentColor"
                />
                <p>+91 74350 44777</p>
              </Link>
            </div>

            <hr />

            <div className="flex w-full flex-col gap-1">
              <Link
                href="https://maps.app.goo.gl/2AiXT3uxUohZwz8B7"
                target="_blank"
                className="group flex gap-1.5 text-left hover:text-green-400"
              >
                <Location
                  className="size-4 min-h-4 min-w-4 transition-all duration-300 group-hover:scale-125"
                  fill="currentColor"
                  strokeWidth={0.04}
                  stroke="currentColor"
                />
                <p>
                  Eventbazaar.com, B-912, Mondeal Square, Prahladnagar,
                  Manekbag, Ahmedabad, Gujarat, 380015
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Us */}
        {/* <div className="flex flex-col gap-4 md:gap-6">
          <h1 className="text-lg font-medium text-black-300 md:text-xl">
            Contact Us
          </h1>
          <div className="flex flex-col gap-2.5 text-xs text-grey-400 md:text-sm">
            <div className="relative flex flex-col gap-2.5 overflow-hidden rounded-lg border border-gray-200 p-[1px]">
              <div className="flex h-full w-full flex-col gap-2 rounded-[7px] bg-white p-2.5">
                <p className="font-medium">EventBazaar.com Private Limited</p>
                <div>
                  <Link
                    href="https://maps.app.goo.gl/2AiXT3uxUohZwz8B7"
                    target="_blank"
                    className="group flex gap-1.5 text-left hover:text-green-400"
                  >
                    <Location
                      className="size-4 min-h-4 min-w-4 transition-all duration-300 group-hover:scale-125"
                      fill="currentColor"
                      strokeWidth={0.04}
                      stroke="currentColor"
                    />
                    <p>
                      B-912, Mondeal Square, Prahladnagar, Manekbag, Ahmedabad,
                      Gujarat, 380015
                    </p>
                  </Link>
                  <Link
                    href="tel:+919898802500"
                    className="group flex items-center gap-1.5 text-left hover:text-green-400"
                  >
                    <CallIcon
                      className="size-4 min-h-4 min-w-4 transition-all duration-300 group-hover:scale-125"
                      fill="currentColor"
                    />
                    <p>+91 98988 02500</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Company Section */}
        <div className="flex flex-col gap-2">
          <Logo
            className="cursor-pointer xs:w-fit"
            onClick={() => {
              if (
                [
                  ROUTES.landingPage,
                  ROUTES.privacyPolicy,
                  ROUTES.termsConditions,
                ].some((v) => path?.includes(v))
              ) {
                routes.push(ROUTES.landingPage);
              } else {
                routes.push(ROUTES.home);
              }
            }}
          />
          <Link
            href={ROUTES.vendor.signIn}
            className="group relative h-8 w-full max-w-[200px] overflow-hidden rounded-md p-[1px] sm:h-10"
          >
            <div className="absolute inset-0 z-[1] h-full w-full bg-[linear-gradient(90deg,rgb(2,66,136)_5.25%,rgb(170,254,105)_129.56%)] transition-all duration-300 group-hover:rotate-180" />
            <div className="absolute inset-[1px] z-[2] flex flex-col items-center justify-center whitespace-nowrap rounded-[5px] bg-[#EFF7F2] px-8 text-xs font-medium group-hover:text-green-400 sm:text-sm md:text-base">
              Vendor Login
            </div>
          </Link>

          <button
            onClick={() => {
              if (
                [
                  ROUTES.landingPage,
                  ROUTES.privacyPolicy,
                  ROUTES.termsConditions,
                ].some((v) => path?.includes(v))
              ) {
                routes.push(ROUTES.home);
              } else {
                dispatch(setVisibleLoginModal(true));
              }
            }}
            className="group relative h-8 w-full max-w-[200px] overflow-hidden rounded-md p-[1px] sm:h-10"
          >
            <div className="absolute inset-0 z-[1] h-full w-full bg-[linear-gradient(90deg,rgb(2,66,136)_5.25%,rgb(170,254,105)_129.56%)] transition-all duration-300 group-hover:rotate-180" />
            <div className="absolute inset-[1px] z-[2] flex flex-col items-center justify-center whitespace-nowrap rounded-[5px] bg-[#EFF7F2] px-8 text-xs font-medium group-hover:text-green-400 sm:text-sm md:text-base">
              Customer Login
            </div>
          </button>

          <div className="mt-6 flex gap-4 text-sm">
            <Link
              href={ROUTES.facebook}
              target="_blank"
              className="transition-all duration-300 hover:scale-125"
            >
              <FacebookIcon className="size-5 hover:text-green-400 md:size-6" />
            </Link>
            <Link
              href={ROUTES.pinterest}
              target="_blank"
              className="transition-all duration-300 hover:scale-125"
            >
              <PinterestIcon className="size-5 hover:text-green-400 md:size-6" />
            </Link>
            <Link
              href={ROUTES.instagram}
              target="_blank"
              className="transition-all duration-300 hover:scale-125"
            >
              <InstagramIcon className="size-5 hover:text-green-400 md:size-6" />
            </Link>
            <Link
              href={ROUTES.linkedin}
              target="_blank"
              className="transition-all duration-300 hover:scale-125"
            >
              <LinkedinIcon className="size-5 hover:text-green-400 md:size-6" />
            </Link>
            <Link
              href={ROUTES.youtube}
              target="_blank"
              className="transition-all duration-300 hover:scale-125"
            >
              <YouTubeIcon className="size-5 hover:text-green-400 md:size-6" />
            </Link>
          </div>
        </div>
      </div>

      <div className="h-[1px] w-full bg-[linear-gradient(90deg,rgb(2,66,136)_5.25%,rgb(170,254,105)_129.56%)]" />

      <div className="flex flex-col items-center justify-between gap-6 py-4 text-xs text-black-200 md:text-sm lg:flex-row lg:gap-28">
        <div className="flex items-center gap-5">
          {FooterRowContent.map((i) =>
            i?.href ? (
              <Link
                key={i.id}
                href={i?.href}
                className={`text-left ${isEmpty(i?.href) ? "cursor-default" : "hover:text-green-400"}`}
              >
                {i.title}
              </Link>
            ) : (
              <button
                key={i.id}
                onClick={i?.onClick}
                className={`text-left ${isEmpty(i?.onClick) ? "cursor-default" : "hover:text-green-400"}`}
              >
                {i.title}
              </button>
            ),
          )}
        </div>
        <p>©️ 2025 Event Bazaar Private Limited. All rights reserved</p>
      </div>
    </div>
  );
};
export default Footer;
