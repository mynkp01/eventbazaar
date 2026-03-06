"use client";

import Upgrade from "@components/Upgrade";
import { useRouter } from "next/navigation";
import { PLAN_CODE, ROUTES } from "src/utils/Constant";
import { showPopup } from "src/utils/helper";

export default function PricingSection() {
  const router = useRouter();

  const onClickLetsStartConversation = () => {
    showPopup(
      "warning",
      "Please fill this form for start conversation with us",
    );
    // Scroll to contact form
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
      // Focus on first input if available
      const firstInput = contactForm.querySelector("input");
      if (firstInput) {
        firstInput.focus();
      }
    }
  };

  return (
    <div className="flex justify-center">
      <Upgrade
        className="!bg-white px-10 lg:max-w-[1200px]"
        showPrice={false}
        buttonClass={
          "!flex !h-12 !w-full !items-center !text-white transition-all !rounded-xl duration-300 !justify-center hover:!bg-primary-100 hover:!text-green-400 border hover:!border-green-400 !bg-green-400"
        }
        buttonText={{
          [PLAN_CODE.lite]: "Select Plan",
          [PLAN_CODE.premium]: "Select Plan",
          [PLAN_CODE.enterprise]: "Contact Sales",
        }}
        onClick={{
          [PLAN_CODE.lite]: () => route.push(ROUTES.vendor.signUp),
          [PLAN_CODE.premium]: () => route.push(ROUTES.vendor.signUp),
          [PLAN_CODE.enterprise]: () =>
            showPopup(
              "info",
              "Maximize your business opportunities with the Enterprise Plan today!",
              {
                text: "Drive More Visibility, Generate More Leads, and Gain More Business. Ideal for vendors looking to expand with multi-city subscriptions. Fully customized Subscription Plan with utmost flexibility",
                confirmButtonText: "Lets Start Conversation",
                customClass: {
                  title: "!text-base md:!text-lg",
                  popup: "!text-xs md:!text-sm",
                  confirmButton: "bg-green-400 rounded-lg mx-12",
                },
                showClass: { popup: "!text-sm md:!text-base" },
                onClickConfirm: onClickLetsStartConversation,
              },
            ),
        }}
      />
    </div>
  );
}
