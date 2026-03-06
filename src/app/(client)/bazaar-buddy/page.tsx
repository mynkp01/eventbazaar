import { BazaarBuddyContact, BazaarBuddyImage } from "@assets/index";
import Breadcrumb from "@components/Breadcrumb";
import CustomImage from "@components/CustomImage";
import { BazaarBuddyForm, FAQ, PlanData } from "./BazaarBuddyClient";

const FAQs = [
  {
    _id: 0,
    question: "What is Bazaar Buddy?",
    answer:
      "Bazaar Buddy is a personalized service where our relationship managers help you find the best vendors based on your event needs.",
  },
  {
    _id: 1,
    question: "How does Bazaar Buddy work?",
    answer:
      "Just fill out a simple form with your event details, and a relationship manager will match you with the most suitable vendors.",
  },
  {
    _id: 2,
    question: "Do I need to search for vendors myself?",
    answer:
      "No, your relationship manager will do the research, after having a consultation call with you and once they know your requirement, they will shortlist the best vendors for you.",
  },
  {
    _id: 3,
    question: "What types of events does Bazaar Buddy assist with?",
    answer:
      "Our relationship managers help with weddings, corporate events, parties, social gatherings, and more.",
  },
  {
    _id: 4,
    question: "Can I discuss my preferences with the relationship manager?",
    answer:
      "Absolutely! Your relationship manager will understand your needs and customize vendor recommendations accordingly.",
  },
  {
    _id: 5,
    question: "How will I receive vendor recommendations?",
    answer:
      "Your relationship manager will share a curated list of vendors via call, email, or WhatsApp for your convenience.",
  },
  {
    _id: 6,
    question: "Can I choose vendors outside of the recommendations?",
    answer:
      "Yes, while our relationship manager suggests the best options, you are free to explore other vendors on EventBazaar.com.",
  },
  {
    _id: 7,
    question:
      "Will the relationship manager stay in touch throughout the process?",
    answer:
      "Yes, your relationship manager will assist you until you finalize your vendors.",
  },
  {
    _id: 8,
    question: "What details do I need to provide for vendor recommendations?",
    answer:
      "Just share your event type, location, preferences, and estimated budget, and our relationship manager will take care of the rest.",
  },
  {
    _id: 9,
    question: "Can I book multiple vendors through Bazaar Buddy?",
    answer:
      "Yes, you can get recommendations for multiple services, and your relationship manager will help coordinate the process.",
  },
  {
    _id: 10,
    question: "How do I connect with my relationship manager?",
    answer:
      "Once you fill out the Bazaar Buddy form, your dedicated relationship manager will reach out to you.",
  },
  {
    _id: 11,
    question: "Do I need to contact each vendor individually?",
    answer:
      "No, your relationship manager will coordinate and provide you with the best options, saving you time and effort.",
  },
  {
    _id: 12,
    question: "Can Bazaar Buddy assist with last-minute vendor bookings?",
    answer:
      "Yes! Our relationship managers will do their best to find trusted vendors even on short notice.",
  },
];

// Server-side data fetching
async function fetchBazaarBuddyPlan() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_LOCAL}/bazaar-buddy-plan-lookup`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch bazaar buddy plan");
    }

    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching bazaar buddy plan:", error);
    return [];
  }
}

async function BazaarBuddy() {
  const Plan = await fetchBazaarBuddyPlan();

  return (
    <div className="grid gap-2 px-6 py-6 sm:px-12 md:gap-4 md:px-24 md:pb-0 lg:gap-6 xl:gap-8">
      <div className="flex flex-col gap-2">
        <Breadcrumb />
        <p className="heading-40 text-black-50">Bazaar Buddy</p>
      </div>

      <div className="relative h-full w-full overflow-hidden !rounded-2xl md:!rounded-[20px]">
        <CustomImage
          src={BazaarBuddyImage.src}
          width="100%"
          height="100%"
          className="!h-full !min-h-40 !object-cover md:!h-96"
        />
        <div className="absolute bottom-0 left-0 top-0 flex h-full max-w-[80%] flex-col justify-center gap-1 bg-[linear-gradient(270deg,transparent_0%,black_100%)] pl-[20px] font-normal text-white sm:pl-[40px] md:gap-1.5 md:pl-[60px] lg:max-w-[936px] lg:gap-2 xl:gap-2.5 xl:pl-[100px]">
          <p className="text-lg sm:text-xl md:text-3xl lg:text-5xl xl:text-7xl">
            Bazaar Buddy
          </p>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
            One form, one call, and our relationship manager finds the best
            vendors for your event!
          </p>
          <ul className="flex flex-col gap-1 text-xs sm:text-sm md:gap-1.5 md:text-base lg:gap-2 lg:text-lg xl:gap-2.5 xl:text-xl">
            <li className="list-inside list-disc">Share event details</li>
            <li className="list-inside list-disc">Get vendor matches</li>
            <li className="list-inside list-disc">Save time & effort</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 md:gap-2">
          <p className="heading-40 text-black-50">Select Package</p>
          <p className="text-sm text-gray-500 md:text-base">
            Perfect for all your destination wedding venue and vendor needs.
          </p>
        </div>
        <PlanData Plan={Plan} />
      </div>
      <div className="grid gap-10 rounded-xl bg-gray-100 p-6 lg:grid-cols-2">
        <BazaarBuddyForm />
        <div className="relative flex items-center justify-center overflow-hidden">
          <CustomImage
            src={BazaarBuddyContact.src}
            alt="BazaarBuddyContact"
            height={"100%"}
            width={"100%"}
            className="rounded-2xl !object-cover !object-center lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:top-0"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-8 pb-10">
        <div className="flex flex-col gap-2">
          <p className="text-3xl font-medium text-black-50 sm:text-5xl">
            Frequently Asked Questions
          </p>
          <p className="text-gray-500">
            Perfect for all your destination wedding venue and vendor needs.
          </p>
        </div>
        <FAQ FAQs={FAQs} />
      </div>
    </div>
  );
}

export default BazaarBuddy;
export const revalidate = 604800;
