"use client";
import { apiHandler } from "@api/apiHandler";
import {
  FaceBook,
  Instagram,
  Linkedin,
  Pinterest,
  ProTips1,
  ProTips2,
  ProTips3,
  ProTips4,
  ProTips5,
  ProTips6,
  user1,
  YouTube,
} from "@assets/index";
import CustomButton from "@components/CustomButton";
import { selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ROUTES } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

const proTips = [
  {
    icon: <ProTips1 />,
    title: "Complete Your Profile",
    badgeText: "New",
    badgeIcon: user1,
    badgeTime: "3 mins read",
  },
  {
    icon: <ProTips2 />,
    title: "Build Your Portfolio With The High Quality Images",
    badgeText: "Popular",
    badgeIcon: user1,
    badgeTime: "3 mins read",
  },
  {
    icon: <ProTips3 />,
    title: "Always Include FAQ's In Your Profile",
    badgeText: "",
    badgeIcon: user1,
    badgeTime: "2 mins read",
  },
  {
    icon: <ProTips4 />,
    title: "Include Payment Policy & Cancellation Policy - It Builds Trust",
    badgeText: "Hot",
    badgeIcon: user1,
    badgeTime: "3 mins read",
  },
  {
    icon: <ProTips5 />,
    title:
      "Upgrade Your Profile - Pro Gets 3X More Visibility & Premium Gets 7X More Visibility",
    badgeText: "Popular",
    badgeIcon: user1,
    badgeTime: "3 mins read",
  },
  {
    icon: <ProTips6 />,
    title: "Promote On EventBazaar.com",
    badgeText: "",
    badgeIcon: user1,
    badgeTime: "3 mins read",
  },
];

// --------------------- Charts ---------------------
const mixChartFormat: any = {
  series: [{ type: "column" }],
  options: {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: {
        enabled: false,
        type: "x",
        mouseWheel: {
          enabled: false,
        },
      },
    },
    stroke: {
      width: [0, 4],
      colors: ["#024288"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    colors: ["#B5E4CA", "#FFBC99"],
    plotOptions: {
      bar: {
        borderRadius: 2,
        colors: {
          ranges: [
            {
              from: 0,
              to: 499,
              color: "#B5E4CA",
            },
            {
              from: 500,
              to: 1000,
              color: "#FFBC99",
            },
          ],
        },
      },
    },
    xaxis: {
      axisTicks: {
        show: false,
      },
    },
    yaxis: [
      {}, // left-y-axis
      {
        opposite: true, // right-y-axis
      },
    ],
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 350,
          },
        },
      },
      {
        breakpoint: 425,
        options: {
          chart: {
            height: 200,
          },
        },
      },
    ],
  },
};

const mixChartOptions = {
  ...mixChartFormat,
  labels: ["22", "23", "24", "24", "24", "24", "24", "24", "24", "24"],
  series: [
    {
      name: "Website Blog",
      type: "column",
      data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320],
    },
    {
      name: "Social Media",
      type: "line",
      data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22],
    },
  ],
};

// --------------------- Date Function --------------------------------------------
const formatDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  return `${day} ${month}`;
};

const DashBoardPage = () => {
  const dispatch = useAppDispatch();
  const userId = useSelector(selectUser);
  const [profileCompletionState, setProfileCompletionState] = useState(0);

  useEffect(() => {
    getProfileCompletion();
  }, []);

  async function getProfileCompletion() {
    try {
      const res = await apiHandler.dashboard.profileCompletion();
      if (res.status === 200 || res.status === 201) {
        setProfileCompletionState(res.data.data);
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="heading-40">Dashboard</h3>
      {/* <div className="w-fit rounded-xl bg-primary-100 sm:p-5 lg:w-2/6">
        <ReactApexCharts
          options={mixChartOptions.options}
          series={mixChartOptions.series}
          type="line"
        />
      </div> */}
      {/* ----------------- Section 1 ----------------------------- */}
      <div className="flex w-full flex-col gap-2.5 xl:flex-row">
        {/* left side */}
        <div className="flex flex-col gap-3 rounded-xl bg-primary-100 p-3 sm:p-5 xl:w-full">
          <div className="flex items-center gap-3">
            <div className="h-6 w-2 rounded-md bg-orange-100 sm:h-8 sm:w-4"></div>
            <h4 className="text-20-600 text-primary-800">Profile Completion</h4>
          </div>
          <div className="rounded-xl bg-primary-200 p-2">
            <div className="rounded-xl bg-primary-100 p-3 shadow-bottom sm:p-2">
              <div className="relative overflow-hidden bg-primary-100 p-3 sm:p-0">
                <div
                  className="absolute bottom-0 left-0 top-0 rounded-md bg-blue-50 transition-all duration-300"
                  style={{ width: `${profileCompletionState}%` }}
                ></div>
                <p className="relative z-10 p-2 px-3 text-3xl font-semibold sm:text-lg">
                  {profileCompletionState}%
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-3">
            <p className="text-15-500 text-primary-500">
              How to complete your EB profile?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3">
              <p className="text-15-500 text-primary-500">
                Sign Up Process : 50%
              </p>
              <p className="text-15-500 text-primary-500">Cover Image : 15%</p>
              <p className="text-15-500 text-primary-500">Portfolio : 10%</p>
              <p className="text-15-500 text-primary-500">About Us : 5%</p>
              <p className="text-15-500 text-primary-500">Company Video : 5%</p>
              <p className="text-15-500 text-primary-500">Reviews : 5%</p>
              <p className="text-15-500 text-primary-500">Logo : 5%</p>
              <p className="text-15-500 text-primary-500">
                FAQ & Policies : 5%
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href={`${ROUTES.vendor.coverImage}`}>
              <CustomButton
                text="Complete your company storefront"
                className="btn-outline-hover border-primary-50 p-3 text-primary-800 sm:px-5 sm:py-2"
              />
            </Link>
            <Link href={`${ROUTES.vendor.profile}`}>
              <CustomButton
                text="Complete your business details"
                className="btn-outline-hover border-primary-50 p-3 text-primary-800 sm:px-5 sm:py-2"
              />
            </Link>
          </div>
        </div>
        {/* right side */}
        {/* <div className="space-y-4 rounded-xl bg-primary-100 p-3 sm:p-4 xl:w-3/12">
          <div className="flex items-center gap-3">
            <div className="h-6 w-2 rounded-md bg-blue-50 sm:h-8 sm:w-4"></div>
            <h4 className="text-20-600 text-primary-800">Popular searches</h4>
          </div>
          <p className="text-[13px] font-semibold leading-[16px] tracking-[0.13px] text-primary-500">
            Vendors
          </p>
          <div className="border border-primary-50"></div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  src={image1}
                  alt="popular search logo"
                  className="mr-2 size-12 rounded-xl"
                />
                <p className="text-15-600 text-primary-800">Bridal Wear</p>
              </div>
              <div className="flex">
                <Image src={UpArrow} alt="uparrow" className="mr-2" />
                <p className="text-12-600 text-green-200">37.8%</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  src={image1}
                  alt="popular search logo"
                  className="mr-2 size-12 rounded-xl"
                />
                <p className="text-15-600 text-primary-800">Bridal Makeup</p>
              </div>
              <div className="flex">
                <Image src={UpArrow} alt="uparrow" className="mr-2" />
                <p className="text-12-600 text-green-200">7.8%</p>
              </div>
            </div>
          </div>
          <CustomButton
            text="All Searches"
            className="btn-outline-hover w-full px-4 py-2"
          />
        </div> */}
      </div>
      <div className="flex w-full flex-col gap-2.5 xl:flex-row">
        <div className="flex flex-col gap-3 xl:w-full">
          {/* ----------------- Section 2 ----------------------------- */}
          <div className="flex w-full flex-col gap-4 rounded-xl bg-primary-100 p-3 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="h-6 w-2 rounded-md bg-green-50 sm:h-8 sm:w-4"></div>
              <h4 className="text-20-600 text-primary-800">Pro tips</h4>
            </div>
            <p className="text-15-500 text-primary-500">
              Tips To Maximize Benefits From EventBazaar.com
            </p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {proTips.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="rounded-full border-2 border-primary-50 p-2 sm:p-4">
                    {item.icon}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-15-600">{item.title}</p>
                    <div className={`flex items-center gap-1 sm:flex-grow`}>
                      {/* {item.badgeText && (
                        <p className="text-12-700 h-fit rounded-md bg-purple-100 px-1.5 py-1">
                          {item.badgeText}
                        </p>
                      )} */}
                      {/* {item.badgeIcon && (
                        <div
                          className={`flex items-center gap-1 rounded-md border border-primary-50 p-0.5`}
                        >
                          <div className="h-5 w-5 rounded-sm bg-orange-100">
                            <Image
                              src={item.badgeIcon.src}
                              alt="user image"
                              width={"20"}
                              height={"20"}
                            />
                          </div>
                          <p className="text-12-700 text-primary-500 sm:pr-2">
                            {item.badgeTime}
                          </p>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* ----------------- Section 3 ----------------------------- */}
          <div className="w-full space-y-4 rounded-xl bg-primary-100 p-3 sm:space-y-8 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="h-6 w-2 rounded-md bg-blue-50 sm:h-8 sm:w-4"></div>
              <h4 className="text-20-600 text-primary-800">
                Get more customers
              </h4>
            </div>
            <p className="text-15-500 text-primary-500 xl:w-1/2">
              50% of customer explore services and make decisions from work
              shared on social media 🔥
            </p>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-5">
              <Link href={ROUTES.instagram} target="_blank">
                <button className="text-15-700 btn-outline-hover flex h-fit w-fit items-center gap-2 rounded-xl border-2 border-primary-50 p-2 sm:px-10">
                  <Instagram />
                  Instagram
                </button>
              </Link>
              <Link href={ROUTES.facebook} target="_blank">
                <button className="text-15-700 btn-outline-hover flex h-fit w-fit items-center gap-2 rounded-xl border-2 border-primary-50 p-2 sm:px-10">
                  <FaceBook className="flex items-center justify-center" />
                  Facebook
                </button>
              </Link>
              <Link href={ROUTES.pinterest} target="_blank">
                <button className="text-15-700 btn-outline-hover flex h-fit w-fit items-center gap-2 rounded-xl border-2 border-primary-50 p-2 sm:px-10">
                  <Pinterest />
                  Pinterest
                </button>
              </Link>
              <Link href={ROUTES.linkedin} target="_blank">
                <button className="text-15-700 btn-outline-hover flex h-fit w-fit items-center gap-2 rounded-xl border-2 border-primary-50 p-2 sm:px-10">
                  <Linkedin />
                  Linkedin
                </button>
              </Link>
              <Link href={ROUTES.youtube} target="_blank">
                <button className="text-15-700 btn-outline-hover flex h-fit w-fit items-center gap-2 rounded-xl border-2 border-primary-50 p-2 sm:px-10">
                  <YouTube />
                  YouTube
                </button>
              </Link>
            </div>
          </div>
        </div>
        {/* <div className="rounded-xl bg-primary-100 p-3 sm:p-5 xl:w-3/12">
          <div className="flex items-center gap-3">
            <div className="h-6 w-2 rounded-md bg-orange-100 sm:h-8 sm:w-4"></div>
            <h4 className="text-20-600 text-primary-800">Comments</h4>
          </div>
          <div className="py-6">
            {userData.map((user, index) => (
              <div key={user.customer_id}>
                <div className="flex">
                  <div className="flex w-full">
                    <div
                      className={`mr-2 h-12 w-14 rounded-full ${divBackGroundColors[index % divBackGroundColors.length]}`}
                    >
                      <Image
                        src={user.profilePhoto}
                        alt="user image"
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <div className="flex w-full justify-between">
                      <div className="flex flex-col gap-2.5">
                        <div>
                          <h1 className="text-14-700 text-primary-800">
                            {user.name}
                          </h1>
                          <p className="text-12-500 text-primary-500">
                            {formatDate(user.date)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Message />
                          <p className="text-14-500 text-primary-800">
                            {user.comment}
                          </p>
                        </div>
                      </div>
                      <p className="text-12-600 text-primary-500">
                        {user.time}
                      </p>
                    </div>
                  </div>
                </div>
                {index < userData.length - 1 && (
                  <div className="my-5 border border-primary-50"></div>
                )}
              </div>
            ))}
          </div>
          <CustomButton
            text="View all"
            className="btn-outline-hover w-full px-4 py-2"
          />
        </div> */}
      </div>
    </div>
  );
};

export default DashBoardPage;
