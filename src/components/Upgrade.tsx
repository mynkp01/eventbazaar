"use client";
import { apiHandler } from "@api/apiHandler";
import { PlanBadge } from "@assets/index";
import { selectUser } from "@redux/slices/authSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PLAN_CODE } from "src/utils/Constant";
import { isEmpty, showToast } from "src/utils/helper";
import { theme } from "tailwind.config";

type PlanViseDetails<T> = { [key in PLAN_CODE]: T };

interface UpgradeInterface {
  className?: string;
  buttonClass?: PlanViseDetails<string> | string;
  buttonText?: PlanViseDetails<string>;
  showPrice?: boolean;
  onClick?: PlanViseDetails<(plan_name?: string) => void>;
}

const Upgrade = ({
  className = "",
  showPrice = true,
  buttonClass,
  buttonText,
  onClick,
}: UpgradeInterface) => {
  const [plansData, setPlansData] = useState([]);
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);

  const userData = useSelector(selectUser);

  useEffect(() => {
    loadPlansData();
  }, []);

  const loadPlansData = async () => {
    try {
      const { data, status } = await apiHandler.planFeatures.list(
        userData?.grade_id ? `grade_id=${userData?.grade_id}` : "",
      );

      if (status === 200 || status === 201) {
        if (isEmpty(data?.data)) {
          showToast("error", data?.message);
        } else {
          setPlansData(data?.data);
        }
      }
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const getPlansColorCode = (colorCodeKey, opacity = 1) => {
    return theme?.extend?.colors?.["plans"]?.[colorCodeKey]?.(opacity) || "";
  };

  const togglePlanExpand = (index: number) => {
    setExpandedPlan(expandedPlan === index ? null : index);
  };

  return (
    <div
      className={`flex w-full flex-col overflow-x-auto bg-primary-100 ${className}`}
    >
      <table className="hidden w-full min-w-max table-auto border-separate border-spacing-x-2.5 border-spacing-y-0 font-medium md:table">
        <thead>
          <tr>
            {plansData.map((plan, index) => (
              <th key={index} className="w-1/2 min-w-52 !p-0">
                <div className="flex h-full flex-col">
                  {/* Plan header with title and badge */}
                  <div className="flex items-center justify-between gap-4 rounded-t-xl border-[1px] border-b-0 border-primary-500/20 px-4 md:px-7">
                    <h2
                      style={{ color: getPlansColorCode(plan?.color_code) }}
                      className="text-center text-2xl font-semibold md:text-3xl"
                    >
                      {plan?.plan_name}
                    </h2>
                    <PlanBadge
                      className={"-mt-1 h-auto w-14 lg:w-16"}
                      fill={getPlansColorCode(plan?.color_code)}
                    />
                  </div>

                  {/* Pricing */}
                  {showPrice ? (
                    <p
                      className="text-md py-5 text-center text-2xl font-semibold tracking-wide text-white md:text-3xl"
                      style={{
                        backgroundColor: getPlansColorCode(plan?.color_code),
                      }}
                    >
                      {plan?.discounted_price === plan?.price ? (
                        plan?.discounted_price
                      ) : (
                        <span>
                          {plan?.discounted_price}{" "}
                          <span className="text-xs line-through md:text-sm lg:text-base">
                            {plan?.price}
                          </span>
                        </span>
                      )}
                    </p>
                  ) : null}

                  {/* Visibility */}
                  <p
                    style={{
                      backgroundColor: getPlansColorCode(plan?.color_code, 0.1),
                      color: getPlansColorCode(plan?.color_code),
                      borderColor: getPlansColorCode(plan?.color_code, 0.01),
                    }}
                    className="text-md !border-[1px] px-4 py-7 text-center text-2xl font-semibold md:text-3xl"
                  >
                    {plan?.visibility} Visibility
                  </p>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            {plansData.map((plan, index) => (
              <td key={index} className="!p-0">
                <div
                  className={`flex w-full flex-col gap-5 border-[1px] border-t-0 border-primary-500/20 p-4 md:p-7 ${!isEmpty(buttonText) ? "border-y-0" : "rounded-b-xl"}`}
                >
                  {Object.keys(plan?.features).map((featureName, index) => (
                    <div
                      key={index}
                      className="flex w-full flex-col gap-2.5 md:gap-3.5"
                    >
                      {/* Feature title */}
                      <div className="flex gap-2.5">
                        <div
                          className="w-2.5 rounded-[3px]"
                          style={{
                            backgroundColor: getPlansColorCode(
                              plan?.color_code,
                            ),
                          }}
                        />
                        <p className="text-lg font-semibold text-primary-800 md:text-xl">
                          {featureName}
                        </p>
                      </div>

                      {/* Features list by title */}
                      <div className="flex flex-col gap-2.5 md:gap-3.5">
                        {plan?.features?.[featureName]?.map(
                          (feature, featureIdx) => (
                            <p
                              key={featureIdx}
                              className="min-h-[1.5rem] text-xs font-semibold text-grey-50 sm:text-sm md:text-base"
                            >
                              {feature}
                            </p>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </td>
            ))}
          </tr>

          {!isEmpty(buttonText) ? (
            <tr>
              {plansData.map((plan, index) => (
                <td key={index} className="!p-0">
                  <div className="w-full items-center rounded-b-xl border-[1px] border-t-0 border-primary-500/20 p-4 !pt-0 text-center md:p-7">
                    <button
                      onClick={() =>
                        !isEmpty(onClick?.[plan?.plan_code])
                          ? onClick?.[plan?.plan_code]?.()
                          : null
                      }
                      className={
                        typeof buttonClass === "string"
                          ? buttonClass
                          : buttonClass?.[plan?.plan_code]
                      }
                    >
                      {!isEmpty(buttonText?.[plan?.plan_code])
                        ? buttonText?.[plan?.plan_code]
                        : plan?.button_text}
                    </button>
                  </div>
                </td>
              ))}
            </tr>
          ) : null}
        </tbody>
      </table>

      {/* Mobile View */}
      <div className="flex flex-col gap-4 md:hidden">
        {plansData.map((plan, index) => (
          <div key={index}>
            <div className="flex items-center justify-between gap-4 rounded-t-xl border-[1px] border-b-0 border-primary-500/20 px-4">
              <h2
                style={{ color: getPlansColorCode(plan?.color_code) }}
                className="text-xl font-semibold"
              >
                {plan?.plan_name}
              </h2>
              <PlanBadge
                className="-mt-1 h-auto w-10 lg:w-12"
                fill={getPlansColorCode(plan?.color_code)}
              />
            </div>

            {showPrice ? (
              <p
                className="py-4 text-center text-xl font-semibold tracking-wide text-white"
                style={{
                  backgroundColor: getPlansColorCode(plan?.color_code),
                }}
              >
                {plan?.discounted_price === plan?.price ? (
                  plan?.discounted_price
                ) : (
                  <span>
                    {plan?.discounted_price}{" "}
                    <span className="text-xs line-through">{plan?.price}</span>
                  </span>
                )}
              </p>
            ) : null}

            <p
              // style={{
              //   backgroundColor: getPlansColorCode(plan?.color_code, 0.1),
              //   color: getPlansColorCode(plan?.color_code),
              // }}
              // className="py-4 text-center text-xl font-semibold"
              style={{
                backgroundColor: getPlansColorCode(plan?.color_code, 0.1),
                color: getPlansColorCode(plan?.color_code),
                borderColor: getPlansColorCode(plan?.color_code, 0.01),
              }}
              className="text-md !border-[1px] p-4 text-center text-lg font-semibold md:text-xl"
            >
              {plan?.visibility} Visibility
            </p>

            {!isEmpty(buttonText) ? (
              <div className="border-x-[1px] border-primary-500/20 p-4 text-center">
                <button
                  onClick={() =>
                    !isEmpty(onClick?.[plan?.plan_code])
                      ? onClick?.[plan?.plan_code]?.()
                      : null
                  }
                  className={
                    typeof buttonClass === "string"
                      ? buttonClass
                      : buttonClass?.[plan?.plan_code]
                  }
                >
                  {!isEmpty(buttonText?.[plan?.plan_code])
                    ? buttonText?.[plan?.plan_code]
                    : plan?.button_text}
                </button>
              </div>
            ) : null}

            <button
              className={`flex w-full items-center justify-center gap-2 border-[1px] border-primary-500/20 p-4 ${expandedPlan === index ? "" : "rounded-b-xl"}`}
              onClick={() => togglePlanExpand(index)}
            >
              <span className="text-sm font-medium">View Features</span>
              <svg
                className={`h-4 w-4 transform transition-transform ${
                  expandedPlan === index ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {expandedPlan === index && (
              <div className="flex flex-col gap-4 rounded-b-xl border-[1px] border-t-0 border-primary-500/20 p-4">
                {Object.keys(plan?.features).map(
                  (featureName, featureIndex) => (
                    <div key={featureIndex} className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-2.5 rounded-[3px]"
                          style={{
                            backgroundColor: getPlansColorCode(
                              plan?.color_code,
                            ),
                          }}
                        />
                        <p className="text-lg font-semibold text-primary-800">
                          {featureName}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {plan?.features?.[featureName]?.map((feature, idx) => (
                          <p
                            key={idx}
                            className="text-sm font-semibold text-grey-50"
                          >
                            {feature}
                          </p>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Upgrade;
