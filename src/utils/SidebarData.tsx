import {
  CallIcon,
  CustomersIcon,
  FillLockIcon,
  Home,
  Inspiration,
  Leads,
  MailLight,
  MemberShip,
  Message,
  PrivacyLight,
  StarIcon,
} from "@assets/index";
import { MAILS, ROUTES } from "./Constant";

// export const vendorSideBarData = [
//   {
//     id: 0,
//     label: "Home",
//     path: ROUTES.vendor.dashboard,
//     icon: Home,
//   },
//   {
//     id: 1,
//     label: "Profile",
//     path: `${ROUTES.vendor.profile}?id=${store.getState()?.auth?.user?.user_id}`,
//     icon: PrivacyLight,
//   },
//   {
//     id: 2,
//     label: "Leads",
//     path: ROUTES.vendor.leads,
//     icon: Leads,
//     // badge: FillLockIcon,
//   },
//   {
//     id: 3,
//     label: "Trend Gallery",
//     path: ROUTES.vendor.trendGallery,
//     icon: Reels,
//     badge: FillLockIcon,
//   },
//   {
//     id: 4,
//     label: "EB Community",
//     path: ROUTES.vendor.ebCommunity,
//     icon: Message,
//     badge: FillLockIcon,
//   },
//   {
//     id: 5,
//     label: "Analytics",
//     path: ROUTES.vendor.analytics,
//     icon: Inspiration,
//     hr: true,
//     badge: FillLockIcon,
//   },
//   {
//     id: 6,
//     label: "Company Web Page",
//     icon: CustomersIcon,
//     dropdown: [
//       { id: 11, label: "About us", path: ROUTES.vendor.aboutUs },
//       { id: 12, label: "Keywords", path: ROUTES.vendor.keywords },
//       // { id: 13, label: "Services we provide", path: ROUTES.vendor.servicesWeProvide },
//       { id: 14, label: "FAQ's & Payment Policy", path: ROUTES.vendor.faqs },
//       { id: 15, label: "Cover Image", path: ROUTES.vendor.coverImage },
//       { id: 16, label: "Brochure upload", path: ROUTES.vendor.brochure },
//       { id: 17, label: "Venues", path: ROUTES.vendor.venues },
//       // { id: 17, label: "Payment Policy", path: ROUTES.vendor.paymentPolicies},
//     ],
//   },
//   {
//     id: 7,
//     label: "Portfolio",
//     path: ROUTES.vendor.portfolio,
//     icon: DiamondLight,
//     hr: true,
//   },
//   {
//     id: 8,
//     label: "Inbox",
//     path: ROUTES.vendor.inbox,
//     icon: MailLight,
//   },
//   {
//     id: 9,
//     label: "Reviews",
//     icon: StarIcon,
//     hr: true,
//     path: ROUTES.vendor.reviews,
//     // dropdown: [
//     //   { id: 18, label: "Our Reviews", path: ROUTES.vendor.reviews },
//     //   {
//     //     id: 19,
//     //     label: "Review Link",
//     //     path: "#",
//     //     copy: `${process.env.NEXT_PUBLIC_FRONTEND_URL}${ROUTES.vendor.reviews}`,
//     //   },
//     // ],
//   },
//   {
//     id: 10,
//     label: "Upgrade Membership",
//     path: `${ROUTES.vendor.profile}?page=2`,
//     icon: MemberShip,
//     activeClassName: {
//       backgroundColor: "#8E59FF",
//       color: "white",
//     },
//     inActiveClassName: {
//       color: "#8E59FF",
//     },
//     hr: true,
//   },
// ];

export const vendorSideBarData = [
  {
    id: 0,
    label: "Home",
    path: ROUTES.vendor.dashboard,
    icon: Home,
  },

  {
    id: 1,
    label: "Lookup Card",
    path: ROUTES.vendor.lookupCard,
    icon: PrivacyLight,
  },
  {
    id: 2,
    label: "Company Storefront",
    icon: CustomersIcon,
    hr: true,

    dropdown: [
      { id: 11, label: "Cover Image", path: ROUTES.vendor.coverImage },
      { id: 12, label: "Brochure upload", path: ROUTES.vendor.brochure },
      {
        id: 13,
        label: "Portfolio",
        path: ROUTES.vendor.portfolio,
      },
      {
        id: 14,
        label: "Trend Gallery",
        path: ROUTES.vendor.trendGallery,
      },
      { id: 15, label: "About us", path: ROUTES.vendor.aboutUs },
      { id: 16, label: "Keywords", path: ROUTES.vendor.keywords },
      { id: 17, label: "FAQ's & Payment Policy", path: ROUTES.vendor.faqs },
      { id: 18, label: "Venues", path: ROUTES.vendor.venues },
    ],
  },
  {
    id: 3,
    label: "Leads",
    path: ROUTES.vendor.leads,
    icon: Leads,
  },
  {
    id: 4,
    label: "EB Community",
    path: ROUTES.vendor.ebCommunity,
    icon: Message,
    badge: FillLockIcon,
  },
  {
    id: 5,
    label: "Analytics",
    path: ROUTES.vendor.analytics,
    icon: Inspiration,
    badge: FillLockIcon,
  },

  {
    id: 6,
    label: "Reviews",
    icon: StarIcon,
    hr: true,
    path: ROUTES.vendor.reviews,
  },
  {
    id: 7,
    label: "Manage Subscriptions",
    path: `${ROUTES.vendor.subscriptions}`,
    icon: MemberShip,
    activeClassName: {
      backgroundColor: "#8E59FF",
      color: "white",
    },
    inActiveClassName: {
      color: "#8E59FF",
    },
    hr: true,
  },
];

export const adminSideBarData = [
  {
    id: 0,
    label: "Home",
    path: ROUTES.admin.dashboard,
    icon: Home,
  },
  {
    id: 1,
    label: "Top Artist",
    path: ROUTES.admin.artist,
    value_code: "ARTIST",
  },
  {
    id: 2,
    label: "Artist Quotes",
    path: ROUTES.admin.artistQuotes,
    value_code: "ARTIST_QUOTES",
  },
  {
    id: 3,
    label: "Bazaar Buddy Plan",
    path: ROUTES.admin.bazaarBuddyPlan,
    value_code: "BAZAAR_BUDDY_PLAN",
  },
  {
    id: 4,
    label: "Bazaar Buddy Consultant",
    path: ROUTES.admin.bazaarBuddyConsultant,
    value_code: "BAZAAR_BUDDY_CONSULTANT",
  },
  {
    id: 5,
    label: "Bazaar Buddy Subscription",
    path: ROUTES.admin.bazaarBuddySubscrition,
    value_code: "BAZAAR_BUDDY_SUBSCRIPTION",
  },
  {
    id: 6,
    label: "Business Category",
    path: ROUTES.admin.businessCategory,
    value_code: "BUSINESS_CATEGORIES",
  },
  {
    id: 7,
    label: "Business Sub Category",
    path: ROUTES.admin.businessSubCategory,
    value_code: "BUSINESS_SUB_CATEGORIES",
  },
  {
    id: 8,
    label: "City",
    path: ROUTES.admin.city,
    value_code: "CITY",
  },
  {
    id: 9,
    label: "Coupon",
    path: ROUTES.admin.coupon,
    value_code: "COUPONS",
  },
  {
    id: 10,
    label: "Customer",
    path: ROUTES.admin.customer,
    value_code: "CUSTOMER",
  },
  {
    id: 11,
    label: "Deleted Vendors",
    path: ROUTES.admin.deleteVendor,
    value_code: "DELETED_VENDORS",
  },
  {
    id: 12,
    label: "Educational Video",
    path: ROUTES.admin.educationalVideo,
    value_code: "EDUCATIONAL_VIDEO",
  },
  {
    id: 13,
    label: "Enterprise Enquiry",
    path: ROUTES.admin.enterpriseEnquiry,
    value_code: "ENTERPRISE_ENQUIRIES",
  },
  {
    id: 14,
    label: "Event Log",
    path: ROUTES.admin.eventLog,
  },
  {
    id: 15,
    label: "Event Type",
    path: ROUTES.admin.eventType,
    value_code: "EVENT_TYPE",
  },
  {
    id: 16,
    label: "Event Vertical",
    path: ROUTES.admin.eventVertical,
    value_code: "EVENT_VERTICAL",
  },
  {
    id: 17,
    label: "Lookup Category",
    path: ROUTES.admin.lookupCategory,
    value_code: "LOOKUP_CATEGORIES",
  },
  {
    id: 18,
    label: "Lead",
    path: ROUTES.admin.lead,
    value_code: "LEAD",
  },
  {
    id: 19,
    label: "Lookup Value",
    path: ROUTES.admin.lookupValue,
    value_code: "LOOKUP_VALUE",
  },
  {
    id: 20,
    label: "Plan",
    path: ROUTES.admin.plan,
    value_code: "PLAN",
  },
  {
    id: 21,
    label: "Plan Rule",
    path: ROUTES.admin.planRule,
    value_code: "PLAN_RULE",
  },
  {
    id: 22,
    label: "Popular Search",
    path: ROUTES.admin.popularSearch,
    value_code: "POPULAR_SEARCH",
  },
  {
    id: 23,
    label: "Subscription",
    path: ROUTES.admin.subscription,
    value_code: "SUBSCRIBER",
  },
  {
    id: 24,
    label: "Users",
    path: ROUTES.admin.user,
    value_code: "USER",
  },
  {
    id: 25,
    label: "Vendor",
    path: ROUTES.admin.vendor,
    value_code: "VENDOR",
  },
  {
    id: 26,
    label: "Venue Quotes",
    path: ROUTES.admin.venueQuotes,
    value_code: "VENUE_QUOTES",
  },
];

export const customerSideBarData = [];

export const SideBarBottomData = [
  {
    id: 111,
    label: "+91 74360 44777",
    path: "tel:+917436044777",
    icon: CallIcon,
  },
  {
    id: 222,
    label: MAILS.VENDORS_MAIL,
    path: `mailto:${MAILS.VENDORS_MAIL}`,
    icon: MailLight,
    // badge: 8,
  },
];

export const ClientTabsData = [
  {
    id: "event_type",
    label: "Event Type",
    path: "#",
    // path: ROUTES.client.verticals,
  },
  {
    id: "vendors",
    label: "Vendors",
    path: "#",
    // path: ROUTES.home,
  },
  {
    id: "venues",
    label: "Venues",
    path: "#",
    // path: ROUTES.home,
  },
  {
    id: "explore_city",
    label: "Explore city",
    path: "#",
    // path: ROUTES.client.city,
  },
  {
    id: "inspiration_gallery",
    label: "Trend Gallery",
    path: "#",
    // path: ROUTES.client.inspirationGallery,
  },
];
