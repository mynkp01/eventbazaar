import { Metadata, Viewport } from "next";
import RootLayout from "./RootLayout";

export const metadata: Metadata = {
  title: "EventBazaar.com | Expert Planners for Every Occasion",
  description:
    "EventBazaar.com makes event planning easy with expert help for weddings, parties & corporate events. Discover top planners near you and create unforgettable moments.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function Layout({ children }) {
  return <RootLayout>{children}</RootLayout>;
}
