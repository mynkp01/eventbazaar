"use client";
import Upgrade from "@components/Upgrade";
import { selectUser } from "@redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES } from "src/utils/Constant";

const UpgradeMemberShip = () => {
  const router = useRouter();
  const userData = useSelector(selectUser);

  const [isVertical, setVertical] = useState(null);

  useEffect(() => {
    const setOrientation = () => {
      setVertical(window.innerWidth >= 768);
    };

    if (isVertical === null) {
      setOrientation();
    }
    window.addEventListener("resize", setOrientation);

    return () => window.removeEventListener("resize", setOrientation);
  }, [isVertical]);

  return (
    <div className="flex flex-col gap-4">
      <Upgrade
        buttonText="Upgrade Now"
        buttonClass="!flex !h-12 !w-full !items-center !text-white transition-all duration-300 !justify-center !rounded-xl hover:!bg-primary-100 hover:!text-blue-100 border hover:!border-blue-100 !bg-blue-100"
        onClick={() => router.push(`${ROUTES.vendor.profile}`)}
        fromModal={true}
      />
    </div>
  );
};

export default UpgradeMemberShip;
