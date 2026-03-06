import { BannerFour, Bannerone, Bannertwo, BuddyBazaar } from "@assets/index";
import CustomImage from "@components/CustomImage";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ROUTES, clientTestimonialsData } from "src/utils/Constant";
import { customEncodeURIComponent } from "src/utils/helper.server";

const PopularSearchesSection = dynamic(
  () => import("./components/PopularSearchesSection"),
  { ssr: true },
);
const ArtistSection = dynamic(() => import("./components/ArtistSection"), {
  ssr: true,
});
const HeroSection = dynamic(() => import("./components/HeroSection"), {
  ssr: true,
});
const BlogsList = dynamic(() => import("@components/BlogsList"), {
  ssr: true,
});
const HappyClient = dynamic(() => import("@components/HappyClient"), {
  ssr: true,
});
const VendorCategories = dynamic(() => import("@components/VendorCategories"), {
  ssr: true,
});
const Features = dynamic(() => import("@components/Features"), {
  ssr: true,
});
const ExploreVendorsByEventType = dynamic(
  () => import("@components/ExploreVendorsByEventType"),
  { ssr: true },
);

// Static data
const heroSectionImages = [
  {
    _id: 0,
    image: Bannerone,
  },
  {
    _id: 1,
    image: Bannertwo,
  },
  // {
  //   _id: 2,
  //   image: Bannerthree,
  // },
  {
    _id: 3,
    image: BannerFour,
  },
  {
    _id: 4,
    image: Bannerone,
  },
  {
    _id: 5,
    image: Bannertwo,
  },
  // {
  //   _id: 6,
  //   image: Bannerthree,
  // },
  {
    _id: 7,
    image: BannerFour,
  },
];

const popularCategories = [
  { _id: 0, link: "Corporate Event Planner", title: "Corporate" },
  { _id: 1, link: "Sound System", title: "Sound system" },
  { _id: 2, link: "LED", title: "LED" },
  { _id: 3, link: "Photographers", title: "Photographers" },
];

// Server-side data fetching
async function getPopularSearches() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_LOCAL}/popular-search-lookup`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch popular searches");
    }

    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching popular searches:", error);
    return [];
  }
}

async function getArtistData() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_LOCAL}/artist`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch artist data");
    }

    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching artist data:", error);
    return [];
  }
}

export default async function MainPage() {
  const popularSearchData = await getPopularSearches();
  const artistData = await getArtistData();

  return (
    <div className="flex flex-col gap-10 md:gap-16">
      {/* Hero Section - Client Component */}
      <div className="px-6 pt-6 lg:px-24">
        <HeroSection
          heroImages={heroSectionImages}
          popularCategories={popularCategories}
        />
      </div>

      <div className="flex flex-col gap-10 px-6 lg:px-24">
        {/* Explore Vendors - Server Components */}
        <div className="heading-48 hidden font-medium capitalize !leading-none text-black-100 md:text-3xl lg:block lg:text-4xl">
          Explore Vendors By Categories
        </div>

        <VendorCategories />

        {/* Event Verticals - Server Component */}
        <div className="flex flex-col gap-y-8">
          {/* Event Verticals */}
          <h1 className="heading-48 w-full font-medium capitalize !leading-none text-black-100 md:text-3xl lg:text-4xl">
            Explore Vendors By Event Type
          </h1>
          <ExploreVendorsByEventType />
        </div>
      </div>

      {/* Popular Searches - Client Component with Server Data */}
      {popularSearchData.length > 0 && (
        <div className="relative grid h-fit gap-6 px-6 lg:gap-6 lg:px-24 xl:flex">
          <div className="flex h-auto flex-col gap-6 rounded-xl bg-green-400/20 xl:max-h-[492px] xl:w-1/2">
            <h3 className="p-6 pb-0 text-2xl font-semibold md:text-3xl lg:text-4xl">
              Popular Searches
            </h3>
            <div className="flex flex-wrap gap-3 overflow-y-auto p-6 pt-0">
              {popularSearchData?.map((search, index) => (
                <Link
                  href={`${ROUTES.client.category}/${customEncodeURIComponent(search?.business_category_name)}`}
                  key={index}
                  className="rounded-full bg-green-400 px-4 py-2 text-sm text-white md:px-5 md:py-3"
                >
                  {search?.business_category_name}
                </Link>
              ))}
            </div>
          </div>
          <PopularSearchesSection popularSearchData={popularSearchData} />
        </div>
      )}

      {/* Artist Section - Client Component with Server Data */}
      {artistData.length > 0 && <ArtistSection artistData={artistData} />}

      {/* Static Sections - Server Rendered */}
      <div className="flex flex-col gap-6 px-6 lg:px-24">
        <div>
          <p className="heading-40 font-medium">
            Elevate Your Event Experience With Our Exclusive Offerings
          </p>
          <p className="text-base text-gray-500">
            We offer a range of in-house services to streamline your event
            planning process.
          </p>
        </div>
        <div className="grid items-center justify-between gap-6 xl:grid-cols-2">
          <div>
            <CustomImage
              src={BuddyBazaar.src}
              alt="EducationalBanner"
              className="h-full w-full min-w-[250px] !rounded-lg object-cover"
            />
          </div>
          <div className="flex flex-col gap-6 xl:max-w-[70%]">
            <h3 className="heading-48 font-medium capitalize !leading-none text-black-200 md:text-3xl lg:text-4xl">
              Bazaar Buddy - Your Personal Event-Planning Assistant!
            </h3>
            <div className="text-grey-50">
              <p>
                Planning an event but don't have the time to sort through
                vendors? Bazaar Buddy is here to help! Just fill out a quick
                form with your budget and requirements, and our team will take
                care of the rest.
              </p>
              <p>
                A Bazaar Buddy relationship manager will connect with you,
                understand what you need, and handpick the right vendors so you
                don't have to stress about the details. Whether it's a wedding,
                corporate event, or any special occasion, we'll make sure you
                get the best options without the endless searching.
              </p>
            </div>
            <Link
              href={ROUTES.client.bazaarBuddy}
              className="w-full rounded-xl border bg-green-400 px-14 py-3 text-center text-white transition-all duration-300 hover:border-green-400 hover:bg-transparent hover:text-green-400 xl:w-fit"
            >
              Know More
            </Link>
          </div>
        </div>
        {/*
        <div className="grid items-center justify-between gap-6 xl:grid-cols-2">
          <div className="order-2 flex flex-col gap-6 xl:order-1 xl:max-w-[70%]">
            <h3 className="heading-48 font-medium capitalize !leading-none text-black-200 md:text-3xl lg:text-4xl">
              Educational Video
            </h3>
            <p className="text-grey-50">
              Our educational videos provide expert insights on event planning,
              industry trends, eco-friendly practices, successful event
              showcases, leading to enhanced knowledge, innovative ideas, and
              practical strategies to create memorable and sustainable events.
            </p>
            <Link
              href={ROUTES.client.educationalVideo}
              className="w-full rounded-xl border bg-green-400 px-14 py-3 text-center text-white transition-all duration-300 hover:border-green-400 hover:bg-transparent hover:text-green-400 xl:w-fit"
            >
              Know More
            </Link>
          </div>
          <div className="order-1 xl:order-2">
            <CustomImage
              src={EducationalBanner.src}
              alt="EducationalBanner"
              className="h-full w-full min-w-[250px] !rounded-lg object-cover"
            />
          </div>
        </div>
        */}
      </div>

      {/* Features - Server Component */}
      <Features />

      {/* Happy Client - Server Component */}
      <HappyClient testimonialsData={clientTestimonialsData} />

      {/* Blogs List - Server Component */}
      <BlogsList />
    </div>
  );
}
export const revalidate = 604800;
