import {
  caterer1,
  caterer2,
  caterer3,
  decorator1,
  decorator2,
  decorator3,
  eventManagement1,
  eventManagement2,
  eventManagement3,
  heroBannerImageHome1,
  heroBannerImageHome3,
  landingBackgroundGradient,
  LandingPageFeature1,
  LandingPageFeature2,
  LandingPageFeature3,
  LandingPageFeature4,
  LandingPageFeature5,
  LandingPageFeature6,
  LandingPageFeature7,
  LandingPageFeature8,
} from "@assets/index";
import CustomImage from "@components/CustomImage";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FAQs } from "src/app/global";
import { ROUTES } from "src/utils/Constant";

const ContactFormSection = dynamic(
  () => import("./components/ContactFormSection"),
  { ssr: true },
);
const TimelineSection = dynamic(() => import("./components/TimelineSection"), {
  ssr: true,
});
const FAQSection = dynamic(() => import("./components/FAQSection"), {
  ssr: true,
});
const FeaturesSection = dynamic(() => import("./components/FeaturesSection"), {
  ssr: true,
});
const HeroSection = dynamic(() => import("./components/HeroSection"), {
  ssr: true,
});
const PricingSection = dynamic(() => import("./components/PricingSection"), {
  ssr: true,
});
const TestimonialSection = dynamic(
  () => import("./components/TestimonialSection"),
  { ssr: true },
);

const ExploreVendorsByCategories = dynamic(
  () => import("@components/ExploreVendorsByCategories"),
  { ssr: true },
);

export const metadata: Metadata = {
  title: "Vendor Registration | EventBazaar",
  description: "Join EventBazaar as a vendor and grow your business",
};

// Server-side helper function to check if a value is empty
function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === "string") {
    return value.trim() === "";
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === "object") {
    return Object.keys(value as object).length === 0;
  }
  return false;
}

// Static data that can be server-rendered
const TrustedByData = [
  {
    _id: 0,
    section:
      "Congratulations on this milestone! EventBazaar.com is set to redefine the future of event planning and management.",
    fullName: "MR. Amit Doshi",
    designation: "COO",
    companyName: "Cadila Pharmaceuticals",
  },
  {
    _id: 1,
    section:
      "Wishing EventBazaar.com's portal a red-carpet success story, making events unforgettable for all!",
    fullName: "Mr. Bhavesh Patel",
    designation: "Director",
    companyName: "Shyam Group",
  },
  {
    _id: 2,
    section:
      "An artistic step forward in event management! Wishing EventBazaar.com boundless creativity and success with this launch.",
    fullName: "Mr. Parthiv Gohil",
    designation: "Playback Singer",
    companyName: "",
  },
  {
    _id: 3,
    section:
      "Congratulations on launching a platform that bridges gaps and strengthens the event industry. Best wishes for its success!",
    fullName: "Mr. Arjunsinh Chauhan",
    designation: "Cabinet Minister",
    companyName: "Rural Development & Housing Department",
  },
  {
    _id: 4,
    section:
      "EventBazaar.com's portal will surely enhance the way events are booked and managed. Wishing you all the best in this exciting journey!",
    fullName: "Mr. Vikas Sood",
    designation: "Director",
    companyName: "Leela Group",
  },
  {
    _id: 5,
    section:
      "Excited to see EventBazaar.com simplify event planning for suppliers and planners alike. Best wishes for a successful launch!",
    fullName: "Mr. Yash Vasant",
    designation: " Executive Director",
    companyName: "BNI & Corporate Connection",
  },
];

const features = [
  {
    _id: 0,
    title: "B2B Community",
    description:
      "It is a long established fact that a reader will be distracted by the readable content ",
    icon: LandingPageFeature1,
  },
  {
    _id: 1,
    title: "Personalized Web Page",
    description:
      "It is a long established fact that a reader will be distracted by the readable content ",
    icon: LandingPageFeature2,
  },
  {
    _id: 2,
    title: "Portfolio Showcase",
    description:
      "It is a long established fact that a reader will be distracted by the readable content ",
    icon: LandingPageFeature3,
  },
  {
    _id: 3,
    title: "Qualified Leads",
    description:
      "It is a long established fact that a reader will be distracted by the readable content ",
    icon: LandingPageFeature4,
  },
  {
    _id: 4,
    title: "Trend Gallery",
    description:
      "It is a long established fact that a reader will be distracted by the readable content ",
    icon: LandingPageFeature5,
  },
  {
    _id: 5,
    title: "Ad Banners",
    description:
      "It is a long established fact that a reader will be distracted by the readable content ",
    icon: LandingPageFeature6,
  },
  {
    _id: 6,
    title: "Educational Videos",
    description:
      "It is a long established fact that a reader will be distracted by the readable content ",
    icon: LandingPageFeature7,
  },
  {
    _id: 7,
    title: "Business Analytics ",
    description:
      "It is a long established fact that a reader will be distracted by the readable content ",
    icon: LandingPageFeature8,
  },
];

const TimelineData = [
  {
    left: {
      title: "Boost Brand Exposure",
      description:
        "Build your brand with your very own customized web page. Showcase your portfolio, pricing, and customer reviews to attract and convert clients effortlessly.",
    },
    right: {
      title: "Join The Largest Event B2B Community",
      description:
        "Collaborate with fellow vendors and tap into a vast network of professionals. Our B2B ecosystem encourages partnerships that drive mutual growth and innovative collaborations.",
    },
  },
  {
    left: {
      title: "Consistent Lead Generation",
      description:
        "No more struggling for visibility or hunting for clients. With EventBazaar.com, you gain access to a steady flow of high-quality leads, ensuring your calendar is always filled with opportunities.",
    },
    right: {
      title: "Stay Ahead With Industry Insights",
      description:
        "Be a part of our community, where we share the latest event trends, ideas, and inspirations, helping you stand out in a competitive market.",
    },
  },
  {
    left: {
      title: "Increased Credibility",
      description:
        "Build credibility among potential clients by offering your services on the trusted EventBazaar.com platform.",
    },
    right: {
      title: "Customer Reach",
      description:
        "Focus on what you do best—delivering exceptional services. Our platform takes care of marketing, showcasing your work, and connecting you to clients in need.",
    },
  },
  {
    left: {
      title: "Data Protection",
      description:
        "Trust in EventBazaar.com's robust data protection measures to ensure the security of your business information.",
    },
    right: {
      title: "Business Support",
      description:
        "From onboarding assistance to ongoing promotion, we're here to make your journey with EventBazaar.com seamless and rewarding.",
    },
  },
];

const Categories = {
  "event-management": [
    {
      _id: 1,
      title: (
        <p>
          Stop Dreaming Small,
          <br className="hidden md:flex" />
          Scale Effortlessly With
          <br className="hidden md:flex" />
          EventBazaar.com!
        </p>
      ),
      image: eventManagement1.src,
      button: "Become A Vendor",
    },
    {
      _id: 1,
      title: (
        <p>
          Don't Plan Alone,
          <br className="hidden md:flex" />
          Win Every Event With
          <br className="hidden md:flex" />
          EventBazaar.com
        </p>
      ),
      image: eventManagement2.src,
      button: "Become A Vendor",
    },
    {
      _id: 1,
      title: (
        <p>
          Stop Hustling Solo,
          <br className="hidden md:flex" />
          Network Effortlessly With
          <br className="hidden md:flex" />
          Industry Leaders Here!
        </p>
      ),
      image: eventManagement3.src,
      button: "Become A Vendor",
    },
  ],
  decorator: [
    {
      _id: 1,
      title: (
        <p>
          Crafting Success Stories –<br className="hidden md:flex" />
          Connect With EventBazaar.com Clientele
        </p>
      ),
      image: decorator1.src,
      button: "Become A Vendor",
    },
    {
      _id: 1,
      title: (
        <p>
          Perfect Platform -<br className="hidden md:flex" />
          Decorators Shine On
          <br className="hidden md:flex" />
          EventBazaar.com!
        </p>
      ),
      image: decorator2.src,
      button: "Become A Vendor",
    },
    {
      _id: 1,
      title: (
        <p>
          Craft Unforgettable
          <br className="hidden md:flex" />
          Events – Join EventBazaar.com
          <br className="hidden md:flex" />
          Decorators Today!
        </p>
      ),
      image: decorator3.src,
      button: "Become A Vendor",
    },
  ],
  caterer: [
    {
      _id: 1,
      title: (
        <p>
          Become A Top Caterer
          <br className="hidden md:flex" />
          With EventBazaar.com!
        </p>
      ),
      image: caterer1.src,
      button: "Become A Vendor",
    },
    {
      _id: 1,
      title: (
        <p>
          Become The Go -<br className="hidden md:flex" />
          To Caterer For
          <br className="hidden md:flex" />
          Every Client
        </p>
      ),
      image: caterer2.src,
      button: "Become A Vendor",
    },
    {
      _id: 1,
      title: (
        <p>
          Align With Excellence -<br className="hidden md:flex" />
          EventBazaar.com Elevates Caterers!
        </p>
      ),
      image: caterer3.src,
      button: "Become A Vendor",
    },
  ],
};

// Server-side data fetching with direct API call to avoid client-side helper functions
async function getExploreVendorsData() {
  try {
    // Use fetch directly instead of apiHandler to avoid client-side dependencies
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_LOCAL}/customer-business-sub-category-list?limit=16&sort_type=sort_order&sort=-1`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch  top 16 categories");
    }

    const data = await response.json();
    return data?.data?.records || [];
  } catch (err) {
    console.error("Error fetching  top 16 categories:", err);
    return [];
  }
}

export default async function VendorRegistrationPage({ params }) {
  const { category, slug } = params;
  const exploreVendorsData = await getExploreVendorsData();

  // Determine hero data based on category and slug
  let heroData = {
    _id: 1,
    title: (
      <p>
        Don't Get Overlooked; <br className="hidden md:flex" />
        Be A Top Vendor <br className="hidden md:flex" />
        At EventBazaar.com
      </p>
    ),
    image: heroBannerImageHome1.src,
    button: "Become A Vendor",
  };

  if (!isEmptyValue(category) && Categories[category]) {
    const categoryData = Categories[category];
    if (
      Array.isArray(categoryData) &&
      !isNaN(Number(slug)) &&
      categoryData.length >= Number(slug)
    ) {
      heroData = categoryData[Number(slug) - 1];
    } else if (Array.isArray(categoryData)) {
      heroData = categoryData[0];
    }
  }

  return (
    <div className="flex flex-col gap-6 py-6 md:gap-12 md:py-12">
      {/* Hero Section - Server Rendered */}
      <HeroSection heroData={heroData} />

      {/* Trusted By Section - Client Component with Server Data */}
      <div className="flex flex-col gap-10">
        <div className="flex items-center px-8 md:px-20">
          <h1 className="text-5xl font-medium text-black">Trusted by</h1>
        </div>

        <div id="event-section-for-credibility">
          <TestimonialSection testimonials={TrustedByData} />
        </div>
      </div>

      {/* Benefits to Becoming a EB Vendor - Server Rendered */}
      <div className="flex w-full flex-col items-center bg-white-300 p-8 md:px-20 md:py-16 xl:px-64">
        <h1 className="pb-12 text-3xl font-medium text-black-50 md:text-5xl">
          Benefits Of Becoming EB Vendor
        </h1>
        <TimelineSection data={TimelineData} />
      </div>

      {/* Explore Vendors - Server Rendered */}
      {!isEmptyValue(exploreVendorsData) ? (
        <div className="flex flex-col gap-10 px-6 lg:px-24">
          <div className="text-center text-3xl font-semibold text-black-100 md:text-left md:text-5xl">
            Explore Vendors
          </div>
          <ExploreVendorsByCategories
            data={exploreVendorsData}
            isInteractive={false}
          />
        </div>
      ) : null}

      {/* Be Among the First to Join! - Server Rendered */}
      <div className="grid w-full items-center gap-6 px-5 sm:px-12 md:gap-8 md:px-16 lg:grid-cols-2 lg:px-24">
        <div className="flex w-full flex-col gap-4 text-lg text-black-600 md:gap-8 md:text-xl">
          <h1 className="heading-40 font-medium text-black-50">
            Be Among The First To Join!
          </h1>

          <p>Limited Slots Available.</p>
          <p>Don't Wait — Opportunities Like This Don't Last!</p>

          <Link
            href={ROUTES.vendor.signUp}
            className="flex h-12 w-full items-center justify-center rounded-md border bg-green-400 text-white transition-all duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400"
          >
            Become A Vendor
          </Link>
        </div>
        <div className="flex w-full justify-end">
          <CustomImage
            src={heroBannerImageHome3.src}
            className="!max-w-[500px] rounded-lg"
          />
        </div>
      </div>

      {/* Don't Wait! Join EventBazaar.com Now !! - Server Rendered */}
      <div className="flex h-fit flex-col items-center justify-between gap-10 bg-green-400 px-12 py-10 text-white sm:px-24 sm:py-16">
        <h1 className="flex w-full items-center justify-center text-center text-2xl font-medium text-white sm:text-[3vw]">
          Don&apos;t Wait !! Join EventBazaar.com Now !!
        </h1>

        <Link
          href={ROUTES.vendor.signUp}
          className="flex items-center justify-center rounded-md border bg-white px-4 py-3 text-green-400 transition-all duration-300 hover:!border-white hover:bg-green-400 hover:!text-white"
        >
          Become A Vendor
        </Link>
      </div>

      {/* Features - Server Rendered */}
      <FeaturesSection features={features} />

      {/* Pricing - Client Component */}
      <PricingSection />

      {/* Contact Form - Client Component */}
      <div
        id="contact-form"
        className="flex h-auto w-full flex-col items-center justify-center gap-10 !bg-cover bg-[center_center] !bg-no-repeat px-5 py-10 sm:px-24 sm:py-16 lg:flex-row lg:gap-20"
        style={{
          background: `url(${landingBackgroundGradient.src})`,
        }}
      >
        <div className="flex flex-col items-center justify-center gap-8 text-center text-white sm:w-1/2">
          <p className="text-4xl font-semibold sm:pb-0">
            Grow Your Business,
            <br />
            Join EventBazaar.com Now !!!
          </p>

          <Link
            href={ROUTES.vendor.signUp}
            className="!items-center !justify-center whitespace-nowrap !rounded-full border !bg-white !px-10 !py-3 !text-black transition-all duration-300 hover:!border-green-400 hover:!bg-primary-100 sm:!px-28 sm:!py-5"
          >
            Become A Vendor
          </Link>
        </div>
        <ContactFormSection />
      </div>
      {/* FAQs - Client Component */}
      <div className="flex flex-col gap-8 px-10 sm:px-24">
        <p className="text-3xl font-medium text-black-50 sm:text-5xl">
          Frequently Asked Questions
        </p>
        <FAQSection faqs={FAQs} />
      </div>
    </div>
  );
}

export const revalidate = 604800;
