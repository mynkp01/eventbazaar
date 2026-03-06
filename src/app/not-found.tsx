"use client";
import { NotFoundImage } from "@assets/index";
import { selectAdminUser, selectUser } from "@redux/slices/authSlice";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES, USER_TYPES } from "src/utils/Constant";
import { isAdminRoute } from "src/utils/helper";
import "./global.css";

const NotFound = () => {
  const userData = useSelector(selectUser);
  const adminData = useSelector(selectAdminUser);

  const [first, setFirst] = useState(false);

  let homeRoute =
    !userData?.token || !userData?.user_type || !adminData?.user_type
      ? ROUTES.home
      : adminData?.user_type === USER_TYPES.ADMIN && isAdminRoute()
        ? ROUTES.admin.dashboard
        : userData?.user_type === USER_TYPES.VENDOR
          ? ROUTES.vendor.dashboard
          : ROUTES.home;

  useEffect(() => {
    setFirst(true);
  }, []);

  if (!first) return <></>;

  return (
    <>
      <style>
        {`
          .body-container {
            font-family: "Arvo", serif;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            transition: 1s;
          }
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 40px;
            animation: fadein 1.2s ease-in;
          }
          .error {
            color: #004050;
            // box-shadow: 0 5px 0px -2px #004050;
            text-align: center;
          }
          .error > .code {
            font-size: 10.5em;
            text-shadow:
              0 6px 1px rgba(9, 83, 125, 0.0980392),
              0 0 5px rgba(9, 83, 125, 0.0980392),
              0 1px 3px rgba(9, 83, 125, 0.298039),
              0 3px 5px rgba(9, 83, 125, 0.2),
              0 5px 10px rgba(9, 83, 125, 0.247059),
              0 10px 10px rgba(9, 83, 125, 0.2),
              0 20px 20px rgba(9, 83, 125, 0.14902);
            margin: 0;
          }
          .error > .desc {
            text-shadow:
              0px 3px 5px rgba(9, 83, 125, 0.5),
              0px 6px 20px rgba(9, 83, 125, 0.3);
            font-weight: 400;
          }
          .back-home {
            display: inline-block;
            align-self: center;
            color: white;
            font-weight: 500;
            padding: 0.75rem 1.5rem;
            transition: all 0.2s linear;
            box-shadow: 0 15px 15px -11px rgba(0, 0, 0, 0.4);
            background: #3A807E;
            border-radius: 6px;
            text-decoration: none;
          }
          .back-home:hover {
            background: #222;
            color: #ddd;
          }
          @keyframes fadein {
            0% {
              margin-top: -50px;
              opacity: 0;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>

      <div className="body-container">
        <div className="container">
          <div className="error">
            <Image
              loading="lazy"
              alt="not found image"
              width={500}
              height={500}
              src={NotFoundImage?.src}
            />
          </div>
          <a className="back-home" href={homeRoute}>
            Back to home
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
