import { Jost } from "next/font/google";
import { MAILS, PORTFOLIO } from "src/utils/Constant";

export const projectTypeTabList = [
  { key: "Albums", value: PORTFOLIO?.PROJECT_ALBUMS },
  { key: "Company Video", value: PORTFOLIO?.PROJECT_SHOW_REEL },
];

export const InboxTabList = [
  { key: "Customers", value: "customer" },
  { key: "Vendors", value: "vendor" },
];
export const imgExtList = [
  "apng",
  "gif",
  "ico",
  "cur",
  "jpg",
  "jpeg",
  "jfif",
  "pjpeg",
  "pjp",
  "png",
  "svg",
];
export const videoExtList = [
  "mkv",
  "mp4",
  "ogv",
  "webm",
  "mov",
  "wmv",
  "avi",
  "avchd",
  "flv",
  "f4v",
  "swf",
  "mpeg-2",
];

export const FAQs = [
  {
    _id: 0,
    question: "What is EventBazaar.com, And how does it work for vendors?",
    answer:
      "EventBazaar.com is a platform that brings entire event industry community together. The platform boosts vendor visibility, generates leads, and boosts business through a personalized company webpage and B2B Community.",
  },
  {
    _id: 1,
    question: "Is my business too niche for this platform?",
    answer:
      "Our platform accommodates a wide range of event services, ensuring niche businesses reach their ideal audience effectively.",
  },
  {
    _id: 2,
    question: "How can I sign up as a vendor?",
    answer:
      'To sign up as a vendor on EventBazaar.com, simply visit our website, click on the "Become A Vendor" button, and fill out your business details. Once registered, you can start showcasing your services and connecting with potential customers right away!',
  },
  {
    _id: 3,
    question: "Is registration free?",
    answer:
      "Registration For EventBazaar.com is absolutely Free. Though the vendor can upgrade plan for more visibility, more business and more growth through the platform.",
  },
  {
    _id: 4,
    question: "Who can I contact for more information?",
    answer: `For more information, you can reach out to your dedicated account manager. Or You can also write us on ${MAILS.VENDORS_MAIL} or call us at 74360 44777. We're here to help!`,
  },
  {
    _id: 5,
    question: "What kind of community can I expect to join?",
    answer:
      "You will have access to a dynamic community with insights, networking, and collaboration among event professionals.",
  },
  {
    _id: 6,
    question: "How will I benefit from joining the vendor community?",
    answer:
      "You will gain insights, collaborate, and grow through a vibrant community of like minded professionals in the event industry.",
  },
  {
    _id: 7,
    question: "Is the Pro or Premium upgrade worth the extra cost?",
    answer:
      "Upgrading to Pro or Premium will significantly boost visibility, providing more client leads, and exclusive industry opportunities.",
  },
  {
    _id: 8,
    question: "How can the platform help improve my brand visibility?",
    answer:
      "You can customize your profile for focused presence, increasing brand visibility in a well trafficked marketplace.",
  },
  {
    _id: 9,
    question: "How can I be sure EventBazaar.com will Boost My Business?",
    answer:
      "Our targeted marketing ensures increased visibility and client leads tailored for your services.",
  },
  {
    _id: 10,
    question: "Will I receive enough support using this platform?",
    answer:
      "Our dedicated support team and community forums ensure all inquiries are promptly addressed and smooth operations for your business.",
  },
  {
    _id: 11,
    question: "Will I have to invest a lot of time to manage my profile?",
    answer:
      "Our user friendly interface allows quick profile customization, freeing up valuable time for other priorities.",
  },
  {
    _id: 12,
    question: "What if I'm not familiar with current event trends?",
    answer:
      "Stay informed through our network, with updates on the latest event trends and customer demand adjustments.",
  },
  {
    _id: 13,
    question: "Is EventBazaar.com a cost-effective marketing solution?",
    answer:
      "You can significantly reduce marketing expenses while efficiently reaching your target audience with our tailored solutions.",
  },
  {
    _id: 14,
    question: "Why should I invest in EventBazaar.com over other platforms?",
    answer:
      "EventBazaar.com boosts leads, provides networking, and enhances reputation, giving you a competitive edge.",
  },
];

export const accordionHelpQuestions = [
  {
    _id: 0,
    title: "How to upgrade to Plus account?",
    description:
      "Enjoy instant access to our vast library of 5,121 premium products and all upcoming new releases with super-fast download speeds powered by Amazon S3. Yes, you read that right. Getting $127,035 in value means you're saving more than 99% on all products making it the sweetest deal for premium design assets around.",
  },
  {
    _id: 1,
    title: "I forgot my password",
    description:
      "Enjoy instant access to our vast library of 5,121 premium products and all upcoming new releases with super-fast download speeds powered by Amazon S3. Yes, you read that right. Getting $127,035 in value means you're saving more than 99% on all products making it the sweetest deal for premium design assets around.",
  },
  {
    _id: 2,
    title: "I can’t reset my password",
    description:
      "Enjoy instant access to our vast library of 5,121 premium products and all upcoming new releases with super-fast download speeds powered by Amazon S3. Yes, you read that right. Getting $127,035 in value means you're saving more than 99% on all products making it the sweetest deal for premium design assets around.",
  },
  {
    _id: 3,
    title: "How to upgrade to Plus account?",
    description:
      "Enjoy instant access to our vast library of 5,121 premium products and all upcoming new releases with super-fast download speeds powered by Amazon S3. Yes, you read that right. Getting $127,035 in value means you're saving more than 99% on all products making it the sweetest deal for premium design assets around.",
  },
  {
    _id: 4,
    title: "How do I change and reset my password",
    description:
      "Enjoy instant access to our vast library of 5,121 premium products and all upcoming new releases with super-fast download speeds powered by Amazon S3. Yes, you read that right. Getting $127,035 in value means you're saving more than 99% on all products making it the sweetest deal for premium design assets around.",
  },
];

export const jost = Jost({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});
