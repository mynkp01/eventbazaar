import { Metadata } from "next";
import RootLayout from "./RootLayout";

export const metadata: Metadata = {
  title: "EventBazaar.com -  For Event Planners and Vendors in India",
  description:
    "Plan events with ease or grow your vendor business. EventBazaar.com connects customers with trusted vendors & helps vendors get more leads.",
};

export default function ClientLayout({ children }) {
  return <RootLayout>{children}</RootLayout>;
}
