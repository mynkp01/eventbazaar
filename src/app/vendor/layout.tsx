import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EventBazaar.com",
  description:
    "Sign up as a vendor on EventBazaar.com to connect with customers for weddings, corporate events, & more. Choose from flexible plans & grow your business.",
};

export default function VendorLayout({ children }) {
  return children;
}
