"use client";
import { ChevronRight } from "@assets/index";
import { selectVendorsMenu } from "@redux/slices/lookupSlice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES } from "src/utils/Constant";
import { convertMediaUrl, isEmpty } from "src/utils/helper";
import { customEncodeURIComponent } from "src/utils/helper.server";
import CustomImage from "./CustomImage";

function VendorCategories() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const vendorsMenus = useSelector(selectVendorsMenu);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".vendors-menus")) {
        setActiveMenu(null);
        setActiveSubMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="hidden grid-cols-2 gap-4 bg-white py-4 sm:grid-cols-3 md:grid-cols-4 md:px-5 lg:grid xl:grid-cols-7">
      {vendorsMenus?.map((item, index) => (
        <div
          key={index}
          className="vendors-menus group relative flex justify-center pb-2"
          onClick={() => {
            if (isEmpty(activeMenu) || activeMenu?.key_1 !== item?.key_1) {
              setActiveMenu(item);
              setActiveSubMenu(item?.category_1?.[0]);
            } else {
              setActiveMenu(null);
              setActiveSubMenu(null);
            }
          }}
          onMouseEnter={() => {
            if (!isEmpty(activeMenu) && activeMenu?.key_1 !== item?.key_1) {
              setActiveMenu(item);
              setActiveSubMenu(item?.category_1?.[0]);
            }
          }}
        >
          <button className="flex flex-col items-center gap-y-3 text-center text-gray-700 group-hover:text-green-400">
            <div className="rounded-lg border border-gray-50 bg-gray-50 p-5 group-hover:border-green-400 group-hover:bg-green-400/10">
              <CustomImage
                src={
                  item?.doc_path ? convertMediaUrl(item?.doc_path) : item?.icon
                }
                height={40}
                width={40}
                className="rounded-full"
              />
            </div>
            <span className="flex items-center text-base font-semibold">
              {item?.key_1}
              <ChevronRight
                className={
                  activeMenu?.key_1 === item?.key_1
                    ? "group-hover:rotate-90"
                    : ""
                }
              />
            </span>
          </button>

          {/* Dropdown Menu */}
          {activeMenu?.key_1 === item?.key_1 ? (
            <div className="absolute -left-[100px] top-full z-50 w-44 rounded-lg bg-white shadow-lg">
              {item?.category_1?.map((subItem, subIndex) => (
                <div key={subIndex} className="group/item">
                  <button
                    className={`flex w-full items-center justify-between px-3 py-3 text-left text-sm text-gray-800 ${activeSubMenu?.key_2 === subItem?.key_2 ? "bg-gray-100 text-green-400" : ""}`}
                    onMouseEnter={() => setActiveSubMenu(subItem)}
                  >
                    {subItem?.key_2}
                    {isEmpty(subItem?.category_2) ? null : (
                      <ChevronRight size={16} />
                    )}
                  </button>

                  {/* Sub-dropdown Menu */}
                  {activeSubMenu?.key_2 === subItem?.key_2 ? (
                    <div className="absolute left-full top-0 w-[170px] rounded-lg bg-white shadow-lg">
                      {subItem?.category_2?.map((nestedItem, nestedIndex) => (
                        <Link
                          key={nestedIndex}
                          href={`${ROUTES.client.category}/${customEncodeURIComponent(nestedItem?.business_sub_category_name)}`}
                          className="block px-3 py-3 text-sm text-gray-800 hover:bg-gray-100 hover:text-green-400"
                        >
                          {nestedItem?.business_sub_category_name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default VendorCategories;
