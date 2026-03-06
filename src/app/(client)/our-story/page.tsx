"use client";
import { Aboutus, Mission } from "@assets/index";
import Breadcrumb from "@components/Breadcrumb";
import { setVisibleLoginModal } from "@redux/slices/authSlice";
import { useAppDispatch } from "@redux/store/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "src/utils/Constant";
import "swiper/css";
import "swiper/css/pagination";

const AboutUs = () => {
  const OurMission = [
    {
      id: 0,
      number: "01",
      content: "Eliminate fraud and inefficiencies in the events industry.",
    },
    {
      id: 1,
      number: "02",
      content:
        "Create a reliable, transparent digital footprint that benefits you and your prospects.",
    },
    {
      id: 2,
      number: "03",
      content:
        "Simplify processes, making event planning resources accessible to all.",
    },
    {
      id: 3,
      number: "04",
      content:
        "Empower small businesses and local vendors by connecting them with a digital platform that boosts their productivity and visibility.",
    },
    {
      id: 4,
      number: "05",
      content: "Generate employment by connecting vendors with growing demand.",
    },
  ];

  const dispatch = useAppDispatch();

  const routes = useRouter();

  return (
    <>
      <div className="px-6 py-6 sm:px-12 md:px-24">
        <Breadcrumb />
        <div className="text-[38px] font-medium capitalize">About Us</div>
      </div>
      <div className="grid gap-y-20 px-6 py-6 sm:px-12 md:px-24">
        <div className="grid items-center gap-10 xl:grid-cols-9">
          <div className="xl:col-span-4">
            <Image loading="lazy" alt="about us" src={Aboutus} />
          </div>
          <div className="flex flex-col gap-y-5 xl:col-span-5">
            <p className="font-medium uppercase">Our Story</p>
            <h3 className="text-4xl font-semibold">
              Our Story of Building EventBazaar.com for Vendors and Users
            </h3>
            <p className="text-gray-700">
              Discover the story of EventBazaar.com, India’s first comprehensive
              event planning platform, bridging the gap between ideas and
              trusted vendors effortlessly.
            </p>
            <p className="text-gray-700">
              Welcome to EventBazaar.com - India’s first comprehensive event
              industry platform. It helps you bridge the gap between your ideas
              and the finest and most trusted vendors in the market.Our mission
              is to connect clients with a diverse range of trusted vendors.
              From Event planners, caterers, decorators, photographers to many
              niche services like event entertainers, Designers, Stylist,
              Exhibition services, intelligent lights and many more - our
              platform ensures that every aspect of your event is covered..
              Whether you’re planning a grand wedding, an intimate gathering, a
              corporate seminar, or a religious event,{" "}
              <Link href={ROUTES.home} className="text-green-400">
                EventBazaar.com
              </Link>{" "}
              makes event planning effortless, efficient, and enjoyable.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-16">
          <div className="mx-auto flex max-w-5xl flex-col gap-y-3 text-center">
            <h2 className="text-4xl font-semibold">What We Do?</h2>
            <p className="text-gray-700">
              EventBazaar.com is a comprehensive event planning platform
              designed to serve both vendors and end-users. Here’s how we
              simplify and enhance the event planning process:
            </p>
          </div>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-y-4 rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900">
                For Vendors
              </h3>
              <p className="text-gray-700">
                In a competitive industry like eventing, standing out can be
                challenging. That’s why EventBazaar.com is designed to:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>Generate Leads:</strong> We connect you with genuine
                  clients seeking your event services.
                </li>
                <li>
                  <strong>Enhance Visibility:</strong> Our platform amplifies
                  your presence, making it easier for clients to discover and
                  trust you.
                </li>
                <li>
                  <strong>Provide a Digital Shopfront:</strong> Showcase your
                  services and portfolio to attract the right audience.
                </li>
                <li>
                  <strong>A Bridge to Collaboration:</strong> Network, grow your
                  business, and reach new clients effortlessly.
                </li>
              </ul>
              <button
                onClick={() => routes.push(ROUTES.landingPage)}
                className="mt-auto flex h-12 w-full items-center justify-center rounded-md border bg-green-400 text-white transition-all duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400"
              >
                Register Your Business
              </button>
            </div>
            <div className="flex flex-col gap-y-4 rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900">
                For End-Users
              </h3>
              <p className="text-gray-700">
                Event planning can often feel overwhelming and stressful. At
                EventBazaar.com, we simplify the process with tools, resources,
                and features that include:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>Education Through Inspirational Content:</strong>{" "}
                  Learn about trends, ideas, and solutions.
                </li>
                <li>
                  <strong>Vendor Comparisons:</strong> Access curated
                  selections, reviews, and competitive pricing.
                </li>
                <li>
                  <strong>Effortless Planning:</strong> Connect with trusted
                  vendors quickly and confidently.
                </li>
                <li>
                  <strong>Bazaar-Buddy:</strong> Get expert assistance in
                  selecting the right vendors for your event.
                </li>
              </ul>
              <button
                onClick={() => dispatch(setVisibleLoginModal(true))}
                className="mt-auto flex h-12 w-full items-center justify-center rounded-md border bg-green-400 text-white transition-all duration-300 hover:!border-green-400 hover:!bg-primary-100 hover:!text-green-400"
              >
                Find A Vendor
              </button>
            </div>
          </div>
          <p className="text-center text-gray-700">
            We don’t just set the stage; we entrust you to craft unforgettable
            moments by connecting you with the right people, tools, and
            inspiration to bring your vision to life.
          </p>
        </div>
        <div className="grid items-center gap-10 xl:grid-cols-9">
          <div className="flex flex-col gap-y-6 xl:col-span-5">
            <p className="font-medium uppercase">OUR MISSION</p>
            <div className="flex flex-col gap-3">
              <h3 className="text-4xl font-semibold">
                Transforming the Events Industry
              </h3>
              <p className="font-light">
                We believe in creating a world where planning events is as
                enjoyable as the events themselves. EventBazaar.com is more than
                a platform; it’s a movement to organise the unorganised. Our
                mission is to: -
              </p>
            </div>
            <div className="flex flex-col gap-y-3">
              {OurMission.map((item) => (
                <div key={item.id} className="flex items-center gap-x-5">
                  <p className="h-fit rounded-full bg-gradient-to-br from-blue-300 to-green-300 px-3 py-2 font-semibold text-white">
                    {item.number}
                  </p>
                  <div className="flex flex-col gap-y-2">
                    <p className="font-semibold">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="xl:col-span-4">
            <Image loading="lazy" alt="about us" src={Mission} />
          </div>
        </div>
        <div className="grid items-center gap-10 xl:grid-cols-9">
          <div className="order-2 xl:order-1 xl:col-span-4">
            <Image loading="lazy" alt="about us" src={Mission} />
          </div>
          <div className="order-1 flex flex-col gap-y-6 xl:order-2 xl:col-span-5">
            <h3 className="text-4xl font-semibold">
              Why Choose EventBazaar.com?
            </h3>
            <div className="flex flex-col gap-3">
              <p>
                <strong>Personalised Experience: </strong> From inspiration to
                execution, EventBazaar.com is designed to support you at every
                step of your event planning journey.
              </p>
              <p>
                <strong>Trusted Network: </strong> Our curated vendor pool
                ensures you connect with reliable professionals who deliver
                exceptional results.
              </p>
              <p>
                <strong>Built by Experts: </strong> With the experience of
                organising thousands of events, our team understands what it
                takes to make your event a success and we’ve designed our
                platform with that knowledge in mind.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="my-10 flex h-fit w-full flex-col items-center justify-between gap-10 bg-green-400 p-10 text-white sm:px-12 sm:py-10 md:flex-row md:px-24 md:py-16 lg:gap-20 xl:gap-40">
        <div className="flex w-full flex-col gap-5 md:w-2/3">
          <h3 className="text-4xl font-semibold">
            Join the EventBazaar.com Community
          </h3>
          <div>
            <p>
              Whether you’re planning a grand celebration, a corporate event, or
              a small gathering, EventBazaar.com is dedicated to making every
              step of your event planning journey — from inspiration to
              execution.
            </p>
            <p>
              Discover the joy of stress-free event planning with a platform
              that puts your needs first. Let’s make your next event
              unforgettable — start planning with EventBazaar.com today!
            </p>
          </div>
        </div>
        <button
          onClick={() => routes.push(ROUTES.landingPage)}
          className="flex h-fit w-full items-center justify-center rounded-md border bg-white px-4 py-3 text-green-400 transition-all duration-300 hover:!border-white hover:bg-green-400 hover:!text-white md:w-1/3"
        >
          Join As A Vendor
        </button>
      </div>
    </>
  );
};
export default AboutUs;
