"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { customDecodeURIComponent } from "src/utils/helper.server";

interface BreadcrumbProps {
  homeElement?: string;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  separator?: string;
}

const Breadcrumb = ({
  homeElement = "Home",
  containerClasses,
  listClasses,
  activeClasses,
  separator = ">",
}: BreadcrumbProps) => {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  const ignorePaths = ["events", "city", "category"];

  const cleanSlug = (slug: string) => {
    return slug.replace(/-[0-9a-fA-F]{24}$/, "");
  };

  return pathNames.length > 0 ? (
    <div>
      <ul
        className={`text-14-700 flex flex-wrap !font-normal ${containerClasses}`}
      >
        <li className={`mx-1 text-black-50 hover:underline ${listClasses}`}>
          <Link href={"/"}>{homeElement}</Link>
        </li>
        {pathNames.length > 0 && <span className="mx-1">{separator}</span>}

        {pathNames?.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join("/")}`;
          const itemLink = link[0].toUpperCase() + link.slice(1, link.length);

          const displayText =
            index === pathNames.length - 1 ? cleanSlug(itemLink) : itemLink;

          return ignorePaths.includes(link) ? null : (
            <React.Fragment key={index}>
              <li
                className={`mx-1 text-nowrap text-black-50 hover:underline ${listClasses} ${
                  paths === href ? activeClasses : ""
                }`}
              >
                <Link href={href} className="capitalize">
                  {customDecodeURIComponent(displayText)}
                </Link>
              </li>
              {pathNames?.length !== index + 1 && (
                <span className="mx-1">{separator}</span>
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  ) : null;
};

export default Breadcrumb;
