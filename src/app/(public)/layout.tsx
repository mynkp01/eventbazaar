import { Metadata } from "next";
import RootLayout from "./RootLayout";

export const metadata: Metadata = {
  title: "Register as a Vendor | Join EventBazaar.com's Trusted Network",
  description:
    "Register as a vendor on trusted network. Showcase your services, connect with clients, and grow your business in India's leading event marketplace.",
};

export default function VendorRegistrationLayout({ children }) {
  return <RootLayout>{children}</RootLayout>;
}
