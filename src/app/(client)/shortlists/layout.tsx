import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Shortlisted Vendors Saved in One Place",
  description:
    "EventBazaar.com helps you manage your vendor list with ease. Compare top vendors, make informed decisions, and create unforgettable events effortlessly.",
};

export default function ShortlistsLayout({ children }) {
  return children;
}
