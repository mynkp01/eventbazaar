"use client";
import { apiHandler } from "@api/apiHandler";
import {
  CloseLight,
  CustomCheckBox,
  DeleteIcon,
  EBLogoRoundedSvg,
  PlanBadge,
  PlusIcon,
  TickIcon,
} from "@assets/index";
import { setDeep } from "@components/SetDeep";
import { Card, CardContent, Modal, Tooltip } from "@mui/material";
import { selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import moment from "moment";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { PLAN_CODE } from "src/utils/Constant";
import {
  convertMediaUrl,
  isEmpty,
  showPopup,
  showToast,
  StyledCheckbox,
  StyledFormControlLabel,
  validateGSTNumberRegex,
  validatePANNumberRegex,
  validateWebsiteRegex,
} from "src/utils/helper";
import { theme } from "tailwind.config";
import BusinessInfo from "./BusinessInfo";
import CustomButton from "./CustomButton";
import CustomImage from "./CustomImage";
import CustomInput from "./CustomInput";
import CustomSwitch from "./CustomSwitch";
import LabelField from "./LabelField";
import PageAction from "./PageAction";
import Upgrade from "./Upgrade";

const VendorDocumentUpload = dynamic(
  () => import("@components/VendorDocumentUpload"),
  { ssr: true },
);

const DeleteModal = dynamic(() => import("@components/DeleteModal"), {
  ssr: true,
});

const CustomDatePicker = dynamic(() => import("@components/CustomDatePicker"), {
  ssr: true,
});

const FetchDropdown = dynamic(() => import("@components/FetchDropdown"), {
  ssr: true,
});

const ComparePlanPopup = ({ visible, setVisible }) => {
  return (
    <Modal
      open={visible}
      onClose={setVisible}
      className="z-50 flex h-full w-full items-center justify-center !p-6"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="relative flex h-full w-full flex-col rounded-xl shadow-lg 2xl:max-w-[80vw]">
        <button onClick={setVisible} className="absolute right-3 top-3">
          <CloseLight className="h-3 w-3" fill="#1A1D1F" />
        </button>
        <Upgrade className="!px-4 !py-7" />
      </div>
    </Modal>
  );
};

const PlanCard = ({ plan, selected, onClick }) => {
  const getPlansColorCode = (colorCodeKey, opacity = 1) => {
    return theme.extend.colors["plans"][colorCodeKey](opacity) || "";
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        transition: "all 0.5s ease",
        boxShadow: `inset 0px 0px 0px 2px ${
          selected
            ? getPlansColorCode(plan?.plan_id?.color_code, 0.3)
            : "#EFEFEF"
        }`,
        backgroundColor: selected
          ? getPlansColorCode(plan?.plan_id?.color_code, 0.1)
          : "white",
        borderRadius: "8px",
      }}
    >
      <CardContent className="!p-0">
        <div className="flex h-full w-full">
          <div className="z-50 -mt-1 ml-3.5">
            <PlanBadge fill={getPlansColorCode(plan?.plan_id?.color_code)} />
          </div>

          <div className="flex h-full w-full flex-col justify-between gap-3.5 p-5 pl-2.5">
            <div className="flex w-full items-center justify-between">
              <p className="text-base font-semibold text-primary-600 md:text-lg">
                {plan?.plan_id?.plan_name}
              </p>

              {!isEmpty(plan?.price) ? (
                <p
                  className={`text-[10px] font-medium text-primary-500 md:text-xs ${plan.price !== 0 ? "line-through" : ""}`}
                >
                  ₹ {plan?.price}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1 text-[10px] font-medium text-blue-100 md:text-xs">
              {!isEmpty(plan?.price) ? (
                <p>
                  <span>Introductory Price</span>
                  <span className={""}> ₹ {plan?.discounted_price}</span>
                </p>
              ) : (
                <p>Contact Us</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ViewAddedLocationsModal = ({
  visible,
  userData,
  setVisible,
  vendorDetails,
  upgradePlanData,
  setUpgradePlanData,
  isViewOnly = false,
  fetchVendorDetails,
  setShowPlans,
}) => {
  const dispatch = useAppDispatch();

  const [planOptions, setPlanOptions] = useState([]);
  const [newLocationsData, setNewLocationsData] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [GSTNumber, setGSTNumber] = useState({ value: "", error: "" });
  const [couponCode, setCouponCode] = useState({
    code: "",
    applied: false,
    amount: 0,
    couponCodeId: "",
  });

  const isAlreadySubscribedPlan = useMemo(
    () => vendorDetails?.plan_id === newLocationsData?.plan_id?._id,
    [newLocationsData?.plan_id],
  );

  useEffect(() => {
    if (!isEmpty(upgradePlanData)) {
      setNewLocationsData(upgradePlanData);
    }
  }, [upgradePlanData]);

  useEffect(() => {
    if (!isEmpty(upgradePlanData)) {
      loadPlans(upgradePlanData?.location_id?._id);
    }
  }, [upgradePlanData]);

  useEffect(() => {
    if (isEmpty(newLocationsData)) {
      setTotalAmount(0);
    } else {
      let amountWithoutGST = newLocationsData?.plan?.discounted_price;

      if (couponCode.applied) {
        amountWithoutGST = couponCode.amount;
      }

      setTotalAmount(amountWithoutGST);
    }
  }, [newLocationsData, couponCode.applied]);

  const loadPlans = async (id) => {
    try {
      const res = await apiHandler.planRule.getPrice(
        `location_id=${id}&grade_id=${userData?.grade_id}`,
      );
      if (res.status === 200 || res.status === 201) {
        setPlanOptions(res.data?.data);
        setNewLocationsData((prevData) => {
          let updatedData = { ...prevData };
          if (isEmpty(upgradePlanData)) {
            let planData = res?.data?.data?.find(
              (i) => i?.plan_id?._id === updatedData?.plan_id?._id,
            );
            updatedData = {
              ...updatedData,
              plan: planData,
              amount: planData?.discounted_price,
              plan_id: planData?.plan_id,
            };
          } else {
            const dataByFind = res?.data?.data?.find(
              (i) => i?.plan_id?._id === upgradePlanData?.plan_id?._id,
            );

            updatedData = {
              ...updatedData,
              plan: {
                ...upgradePlanData,
                discounted_price: dataByFind?.discounted_price,
                price_rule: dataByFind?.price_rule,
              },
              amount: dataByFind?.discounted_price,
            };
          }

          return updatedData;
        });
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
  };

  const onSelectPlanCheck = (selectedPlanId: string) => {
    const selectedPlan = planOptions?.find(
      (i) => i?.plan_id?._id === selectedPlanId,
    );

    setNewLocationsData((prevData) => {
      let updatedData = { ...prevData };
      updatedData = {
        ...updatedData,
        verticals: updatedData?.verticals,
      };
      return updatedData;
    });
    changePlan(selectedPlan);
  };

  const changePlan = (selectedPlan) => {
    setNewLocationsData((prevData) => {
      let updatedData = { ...prevData };
      updatedData = {
        ...updatedData,
        applied: false,
        plan_id: selectedPlan?.plan_id,
        amount: selectedPlan?.discounted_price,
        coupon: "",
        plan: selectedPlan,
      };
      return updatedData;
    });
  };

  const changeVerticalAndType = (data) => {
    setNewLocationsData((prev) => ({ ...prev, verticals: data }));
  };

  const resetState = () => {
    setNewLocationsData(null);
    setCouponCode({
      code: "",
      applied: false,
      amount: 0,
      couponCodeId: "",
    });
    setUpgradePlanData(null);
    setVisible(false);
  };

  const createOrderId = async (amount) => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.razorpay.createOrderID({
        vendor_verticals: newLocationsData?.verticals,
        plan_id: newLocationsData?.plan_id?._id,
        couponCodeId: couponCode.couponCodeId,
        amount,
      });
      if (res.status === 200 || res.status === 201) {
        return res.data.data;
      } else {
        showToast("error", res?.data?.message);
        return null;
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
      return null;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  async function verifyPayment(data = {}) {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.razorpay.verifyPayment({
        ...data,
        vendor_verticals: [
          { ...newLocationsData, vendor_id: userData?.user_id },
        ],
        old_vendor_verticals: vendorDetails?.vendor_verticals,
        gst_number: GSTNumber.value,
        plan_id: newLocationsData?.plan_id?._id,
        coupon_code: couponCode.applied ? couponCode.code : "",
      });

      if (res.status === 200 || res.status === 201) {
        fetchVendorDetails();
        showToast("success", res?.data?.message);
        resetState();
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  async function saveAndPay() {
    if (isEmpty(newLocationsData?.verticals)) {
      showToast("error", "Please select events first");
      return;
    }

    if (
      !isEmpty(GSTNumber.value) &&
      !validateGSTNumberRegex.test(GSTNumber.value)
    ) {
      setGSTNumber((prevVal) => ({
        ...prevVal,
        error: "Invalid GST number",
      }));
      return;
    }

    if (isEmpty(GSTNumber.error)) {
      const amountWithGST = Math.round(
        Number((totalAmount + (totalAmount * 18) / 100).toFixed(2)),
      );

      try {
        if (amountWithGST <= 0) {
          await verifyPayment();
        } else {
          const order = await createOrderId(amountWithGST);
          if (isEmpty(order)) return;
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: amountWithGST * 100,
            currency: "INR",
            image: EBLogoRoundedSvg.src,
            name: userData?.full_name,
            description: `${userData?.full_name} buying plan ${newLocationsData?.plan_id?.plan_name}`,
            order_id: order?.id,
            handler: async function (response: any) {
              await verifyPayment({
                order: order,
                orderCreationId: order?.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });
            },
            prefill: {
              name: userData?.full_name,
              email: userData?.primary_email,
            },
            theme: {
              color: "#27A376",
            },
          };
          const paymentObject = new window.Razorpay(options);
          paymentObject.on("payment.failed", function (response: any) {
            showToast("error", response?.error?.description);
          });
          paymentObject.open();
        }
      } catch (error) {
        showToast("error", error?.response?.data?.message || error.message);
      }
    }
  }

  async function saveAndProceed() {
    if (isEmpty(newLocationsData?.verticals)) {
      showToast("error", "Please select events first");
      return;
    }

    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.vendorVertical.patch(
        isEmpty(upgradePlanData) ? newLocationsData?._id : upgradePlanData?._id,
        { verticals: newLocationsData?.verticals },
      );

      if (res.status === 200 || res.status === 201) {
        fetchVendorDetails();
        showToast("success", res?.data?.message);
        resetState();
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  const handleApplyCode = async () => {
    try {
      const { data, status } = await apiHandler.couponCode.checkCoupon(
        `coupon_code=${couponCode.code}`,
      );

      if (status === 200 || status === 201) {
        let discountedAmount = 0;
        let newlyAddedData = { ...newLocationsData };

        if (data?.data?.amount) {
          discountedAmount = totalAmount - data?.data?.amount;

          let amountAfterDiscount =
            newlyAddedData?.plan?.discounted_price - data?.data?.amount;
          amountAfterDiscount =
            amountAfterDiscount < 0
              ? 0
              : Math.round(
                  Number(
                    (
                      amountAfterDiscount +
                      (amountAfterDiscount * 18) / 100
                    ).toFixed(2),
                  ),
                );

          newlyAddedData.amount = amountAfterDiscount;
          newlyAddedData.coupon = couponCode.code;
        } else if (data?.data?.percent) {
          let discount = (data?.data?.percent * totalAmount) / 100;

          discountedAmount = totalAmount - discount;

          discount =
            (data?.data?.percent * newlyAddedData?.plan?.discounted_price) /
            100;
          let amountAfterDiscount =
            newlyAddedData?.plan?.discounted_price - discount;
          amountAfterDiscount =
            amountAfterDiscount < 0
              ? 0
              : Math.round(
                  Number(
                    (
                      amountAfterDiscount +
                      (amountAfterDiscount * 18) / 100
                    ).toFixed(2),
                  ),
                );

          newlyAddedData.amount = amountAfterDiscount;
          newlyAddedData.coupon = couponCode.code;
        }

        if (discountedAmount < 0) {
          discountedAmount = 0;
        }

        setNewLocationsData(newlyAddedData);
        setCouponCode((prev) => ({
          ...prev,
          applied: true,
          amount: discountedAmount,
          couponCodeId: data?.data?._id,
        }));
        showToast("success", data?.message);
      } else {
        showToast("error", data?.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
  };

  const onClickGetInTouch = async () => {
    try {
      dispatch(setIsLoading(true));
      if (
        !isEmpty(upgradePlanData) &&
        !isEmpty(upgradePlanData?.verticals) &&
        !isEmpty(newLocationsData?.verticals)
      ) {
        await saveAndProceed();
      }

      const { data, status } = await apiHandler.enterprise.post();

      if (status === 200 || status === 201) {
        resetState();
        showToast("success", data?.message);
      } else {
        showToast("error", data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <Modal
      open={visible}
      onClose={resetState}
      className="z-50 flex h-full w-full items-center justify-center !p-6"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="relative z-50 flex h-full w-full flex-col overflow-hidden rounded-xl bg-white shadow-lg sm:max-w-[70vw]">
        <div className="sticky top-0 z-50 flex w-auto items-center justify-between bg-white p-4 sm:p-6">
          <h3 className="text-3xl font-semibold md:text-4xl">
            Manage Subscription for {newLocationsData?.location_id?.name}
          </h3>
          <button onClick={resetState}>
            <CloseLight className="h-3 w-3" fill={"#1A1D1F"} />
          </button>
        </div>
        <div className="flex w-full flex-1 flex-col gap-4 overflow-y-auto px-5">
          <div className="flex flex-col items-center gap-5 rounded-xl border-2 border-primary-50 px-3 py-5 text-primary-500 md:flex-row">
            <CustomButton
              className="whitespace-nowrap rounded-xl border border-blue-100 px-3 py-1.5 text-blue-100"
              text="Compare Plan"
              onClick={() => setShowPlans(true)}
            />
            <p>
              Know more about plans and the benefits you get in each of
              them!!!{" "}
            </p>
          </div>

          {!isEmpty(newLocationsData?.location_id?._id) && (
            <>
              <div className="flex flex-col gap-5">
                <LabelField
                  labelText="Select Plan"
                  toolTipText={
                    newLocationsData?.location_id?._id
                      ? "Select Plan"
                      : "Select Location For Plans"
                  }
                  required
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {planOptions
                    ?.filter((plan) =>
                      userData?.plan_code === PLAN_CODE.enterprise
                        ? plan?.plan_id?.plan_code === PLAN_CODE.enterprise
                        : userData?.plan_code === PLAN_CODE.premium
                          ? plan?.plan_id?.plan_code !== PLAN_CODE.lite
                          : true,
                    )
                    ?.map((plan) => {
                      return (
                        <PlanCard
                          key={plan.plan_id._id}
                          plan={plan}
                          selected={
                            plan?.plan_id?._id ===
                            newLocationsData?.plan_id?._id
                          }
                          onClick={() => {
                            if (
                              plan?.plan_id?.plan_code === PLAN_CODE.enterprise
                            ) {
                              showPopup(
                                "info",
                                "Maximize your business opportunities with the Enterprise Plan today!",
                                {
                                  text: "Drive More Visibility, Generate More Leads, and Gain More Business. Ideal for vendors looking to expand with multi-city subscriptions. Fully customized Subscription Plan with utmost flexibility",
                                  confirmButtonText: "Lets Start Conversation",
                                  customClass: {
                                    title: "!text-base md:!text-lg",
                                    popup: "!text-xs md:!text-sm",
                                    confirmButton:
                                      "bg-blue-300 rounded-lg mx-12",
                                  },
                                  showClass: {
                                    popup: "!text-sm md:!text-base",
                                  },
                                  onClickConfirm: onClickGetInTouch,
                                },
                              );
                              return;
                            }
                            if (
                              plan?.plan_id?._id !==
                              newLocationsData?.plan_id?._id
                            ) {
                              let locationExists =
                                vendorDetails?.vendor_verticals?.find(
                                  (i) =>
                                    i?.location_id?._id ===
                                    newLocationsData?.location_id?._id,
                                );

                              if (
                                isEmpty(locationExists) ||
                                isEmpty(newLocationsData?.subscription)
                              ) {
                                onSelectPlanCheck(plan?.plan_id?._id);
                              } else {
                                if (
                                  locationExists?.plan_id?.plan_code ===
                                    PLAN_CODE.enterprise &&
                                  plan?.plan_id?.plan_code !==
                                    PLAN_CODE.enterprise
                                ) {
                                  showPopup(
                                    "info",
                                    `You Are Fully Upgraded. Enjoy Your Benefits Till <strong>${moment(locationExists?.subscription?.expire_at).format("DD-MM-YYYY")}</strong>`,
                                  );
                                  return;
                                }

                                if (
                                  locationExists?.plan_id?.plan_code ===
                                    PLAN_CODE.premium &&
                                  plan?.plan_id?.plan_code === PLAN_CODE.lite
                                ) {
                                  showPopup(
                                    "info",
                                    `You Have A ${locationExists?.plan_id?.plan_name} Subscription. Enjoy Your Benefits Till <strong>${moment(locationExists?.subscription?.expire_at).format("DD-MM-YYYY")}</strong>`,
                                  );
                                  return;
                                }

                                onSelectPlanCheck(plan?.plan_id?._id);
                              }
                            }
                          }}
                        />
                      );
                    })}
                </div>
              </div>

              <BusinessInfo
                func={changeVerticalAndType}
                event_type_id={(() => {
                  let obj = {};

                  if (isEmpty(upgradePlanData)) {
                    vendorDetails?.vendor_verticals?.[0]?.verticals?.forEach(
                      (i) =>
                        (obj = {
                          ...obj,
                          [i?.vertical_id]: i?.event_type_id,
                        }),
                    );
                  } else {
                    upgradePlanData?.verticals?.forEach(
                      (i) =>
                        (obj = {
                          ...obj,
                          [i?.vertical_id]: i?.event_type_id,
                        }),
                    );
                  }

                  return obj;
                })()}
              />
            </>
          )}
        </div>

        <div className="z-50 flex flex-col gap-4 bg-white p-4 shadow-[0px_0px_15px_-3px_#e0e0e0]">
          {!isAlreadySubscribedPlan ? (
            !isEmpty(newLocationsData?.verticals) ? (
              <div className="flex flex-col gap-4">
                {!isEmpty(newLocationsData?.verticals) && totalAmount !== 0 && (
                  <div className="relative flex flex-col gap-4">
                    <div>
                      <CustomInput
                        disabled={isViewOnly}
                        className="!mt-0"
                        value={GSTNumber.value}
                        maxLength={15}
                        onChange={(e) => {
                          setGSTNumber({
                            error: "",
                            value: e.target.value.toUpperCase(),
                          });
                        }}
                        placeholder="Enter Your GST Number"
                      />
                      {!isEmpty(GSTNumber.error) ? (
                        <p className="error-text">{GSTNumber.error}</p>
                      ) : null}
                    </div>
                    <CustomInput
                      value={couponCode.code}
                      className="!mt-0"
                      placeholder="Enter Your Coupon Code"
                      onChange={(e) =>
                        setCouponCode({
                          code: e.target.value.toUpperCase(),
                          applied: false,
                          amount: 0,
                          couponCodeId: "",
                        })
                      }
                    />
                    <div className="absolute bottom-2 right-1 flex items-center gap-1 sm:right-2 sm:gap-2">
                      {couponCode.applied ? (
                        <button
                          onClick={() =>
                            setCouponCode((prev) => ({
                              ...prev,
                              applied: false,
                              amount: 0,
                              couponCodeId: "",
                            }))
                          }
                          className="mb-1.5 flex items-center gap-2 text-green-100"
                        >
                          <TickIcon /> Applied
                        </button>
                      ) : (
                        <PageAction
                          className="!mt-3.5"
                          btnSecondaryClassName="!py-1 !bg-transparent"
                          btnSecondaryLabel="Apply"
                          btnSecondaryFun={handleApplyCode}
                        />
                      )}
                    </div>
                  </div>
                )}

                <hr className="border-t-[2.5px] border-gray-300" />

                <div className="text-14-500 flex w-full flex-col justify-end gap-4 !font-normal text-gray-400">
                  <div className="flex w-full justify-between">
                    <div>Total</div>
                    <div>
                      {Math.ceil(totalAmount) !==
                      Math.ceil(newLocationsData?.plan?.discounted_price) ? (
                        <span className="px-3 line-through">
                          ₹ {newLocationsData?.plan?.discounted_price}
                        </span>
                      ) : null}
                      ₹ {Math.ceil(totalAmount)}
                    </div>
                  </div>

                  <hr className="border-gray-300" />

                  <div className="flex w-full justify-between">
                    <div>Total + (GST: 18%)</div>
                    <div>
                      {`₹ ${Math.round(Number(totalAmount?.toFixed(2)))} + ₹ ${Math.round(Number(((totalAmount * 18) / 100).toFixed(2)))} = ₹ ${Math.round(Number((totalAmount + (totalAmount * 18) / 100)?.toFixed(2)))}`}
                    </div>
                  </div>
                </div>
              </div>
            ) : null
          ) : null}

          <PageAction
            className={`!mt-0 w-full !gap-4`}
            btnPrimaryClassName="w-full"
            btnSecondaryClassName="w-full"
            btnSecondaryLabel={
              isAlreadySubscribedPlan ? "Save & Proceed" : "Save & Pay"
            }
            btnPrimaryLabel={!isViewOnly ? "Cancel" : null}
            btnSecondaryFun={
              !isViewOnly
                ? isAlreadySubscribedPlan
                  ? saveAndProceed
                  : saveAndPay
                : null
            }
            btnPrimaryFun={resetState}
          />
        </div>
      </div>
    </Modal>
  );
};

const RenderLocations = ({
  item,
  index,
  verticalOptions,
  vendorDetails,
  setVendorDetails,
  setAddedLocationModal,
  verticalsData,
  setVerticalsData,
  fetchVendorDetails,
  setUpgradePlanData,
  isViewOnly = false,
  isFromNewlyAdded = false,
}) => {
  const handleDeleteLocation = async () => {
    const msg = "Location Deleted Successfully";

    if (isFromNewlyAdded) {
      setVerticalsData((prev) => {
        let locationsData = [...prev];

        let prevLocationIndex = vendorDetails?.vendor_verticals?.findIndex(
          (i) =>
            i?.location_id?._id === locationsData?.[index]?.location_id?._id,
        );

        if (prevLocationIndex !== -1) {
          setVendorDetails((prevData) => {
            if (
              locationsData?.[index]?.location_id?._id ===
              vendorDetails?.vendor_verticals?.[prevLocationIndex]?.location_id
                ?._id
            ) {
              let data = [...prevData?.vendor_verticals];

              data[prevLocationIndex] = {
                ...data?.[prevLocationIndex],
                disabled: false,
              };

              return { ...prevData, vendor_verticals: data };
            } else {
              return prevData;
            }
          });
        }

        locationsData?.splice(index, 1);

        return locationsData;
      });

      showToast("success", msg);
    } else {
      if (isEmpty(item?._id)) {
        let locationsArr = [...verticalsData];
        locationsArr.splice(index, 1);

        setVerticalsData((prev) => ({
          ...prev,
          vendor_verticals: locationsArr,
        }));

        showToast("success", msg);
      } else {
        try {
          const res = await apiHandler.vendorVertical.delete(item?._id);
          if (res.status === 200 || res.status === 201) {
            showToast("success", msg);
            fetchVendorDetails();
          } else {
            showToast("error", res.data.message);
          }
        } catch (error) {
          showToast("error", error.response?.data?.message || error.message);
        }
      }
    }
  };

  const onClickUpgrade = () => {
    setAddedLocationModal({ visible: true, isUpdate: true });
    setUpgradePlanData(item);
  };

  const getPlansColorCode = (colorCodeKey, opacity = 1) => {
    return theme.extend.colors["plans"][colorCodeKey](opacity) || "";
  };

  return (
    <div
      className="flex flex-col gap-1 md:gap-2"
      style={{ opacity: item?.disabled ? 0.5 : 1 }}
    >
      <div
        key={item?._id}
        style={{
          borderColor: getPlansColorCode(item?.plan_id?.color_code, 0.3),
        }}
        onClick={!item?.disabled && !isViewOnly ? onClickUpgrade : null}
        className="relative flex cursor-pointer flex-col gap-4 rounded-xl border-2 p-4"
      >
        <p className="text-sm font-semibold text-primary-800 md:text-base">{`${item?.location_id?.name || "City Name"}`}</p>
        <div className="absolute -top-1 right-2">
          <PlanBadge fill={getPlansColorCode(item?.plan_id?.color_code)} />
        </div>
        <div className="flex flex-col items-center">
          <CustomImage
            src={convertMediaUrl(item?.location_id?.vector_path)}
            width={"100%"}
            height={"auto"}
            className="!aspect-square !w-full"
            loaderClasses={{ loader: "!h-10" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-1">
          {verticalOptions?.map((vertical) => (
            <div
              key={vertical?._id}
              style={{
                opacity: isEmpty(
                  item?.verticals?.find(
                    (i) => i?.vertical_id === vertical?._id,
                  ),
                )
                  ? 0.5
                  : 1,

                backgroundColor: isEmpty(
                  item?.verticals?.find(
                    (i) => i?.vertical_id === vertical?._id,
                  ),
                )
                  ? getPlansColorCode("verticalDisabled")
                  : getPlansColorCode(item?.plan_id?.color_code, 0.3),
              }}
              className={`h-fit rounded-md bg-opacity-30 px-2 py-1.5 text-[10px] font-medium text-primary-800 md:text-xs lg:text-[10px] xl:text-xs`}
            >
              {vertical?.event_vertical_name}
            </div>
          ))}
        </div>
        {!isFromNewlyAdded && item?.subscription?.createdAt ? (
          <p className="text-center text-xs font-medium text-primary-400 md:text-sm">
            <strong>Subscribed From:</strong>
            <br />
            {moment(item?.subscription?.createdAt).format("DD-MM-YYYY")}
          </p>
        ) : null}
      </div>

      {!item?.disabled &&
      !isViewOnly &&
      !isFromNewlyAdded &&
      item?.plan_id?.plan_code !== PLAN_CODE?.enterprise ? (
        <button
          onClick={onClickUpgrade}
          className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-blue-500 py-2 text-blue-500 transition-all duration-300 hover:bg-blue-500 hover:text-white"
        >
          <p>Upgrade Now</p>
        </button>
      ) : null}

      {!item?.disabled &&
      !isViewOnly &&
      !isFromNewlyAdded &&
      item?.plan_id?.plan_code === PLAN_CODE?.enterprise ? (
        <button
          disabled
          className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-green-300 py-2 text-green-300 transition-all duration-300"
        >
          <p>Fully Upgraded</p>
        </button>
      ) : null}

      {!item?.disabled && isFromNewlyAdded ? (
        <button
          onClick={() =>
            showPopup("question", "Are you sure want to delete this?", {
              showCancelButton: true,
              onClickConfirm: handleDeleteLocation,
            })
          }
          className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-red-500 py-2 text-red-500 transition-all duration-300 hover:bg-red-500 hover:text-white"
        >
          <DeleteIcon />
          <p>Delete</p>
        </button>
      ) : null}
    </div>
  );
};

const EventTypeAndVertical = ({
  vendorDetails,
  setVendorDetails,
  fetchVendorDetails,
  isViewOnly = false,
}) => {
  const userData = useSelector(selectUser);

  const [showPlans, setShowPlans] = useState(false);
  const [addedLocationModal, setAddedLocationModal] = useState(false);
  const [newlyAddedLocationsData, setNewlyAddedLocationsData] = useState([]);
  const [upgradePlanData, setUpgradePlanData] = useState(null);
  const [verticalOptions, setVerticalOptions] = useState([]);

  useEffect(() => {
    loadVerticals();
  }, []);

  const loadVerticals = async () => {
    try {
      const res = await apiHandler.eventVertical.lookup();
      if (res.status === 200 || res.status === 201) {
        setVerticalOptions(res.data?.data);
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="relative flex flex-1 flex-col gap-5">
      <div className="flex h-full flex-col gap-5 overflow-y-auto">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-2 items-center rounded-md bg-green-50 sm:h-8 sm:w-4" />
            <p className="text-20-600 text-primary-800">My Subscriptions</p>
          </div>
          <div className="flex flex-col items-center gap-5 rounded-xl border-2 border-primary-50 px-3 py-5 text-primary-500 md:flex-row">
            <CustomButton
              className="!min-w-fit whitespace-nowrap rounded-xl border border-blue-100 px-3 py-1.5 text-blue-100"
              text="Compare Plan"
              onClick={() => setShowPlans(true)}
            />
            <p className="w-full">
              Know more about plans and the benefits you get in each of
              them!!!{" "}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-2 items-center rounded-md bg-green-50 sm:h-8 sm:w-4" />
          <p className="text-20-600 text-primary-800">Location</p>
        </div>

        <div className="flex flex-col gap-3">
          {isEmpty(vendorDetails?.vendor_verticals) &&
          isEmpty(newlyAddedLocationsData) ? (
            <h1 className="text-20-600 text-center text-gray-400">
              No Locations
            </h1>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {vendorDetails?.vendor_verticals?.map((v, i) => (
                  <RenderLocations
                    key={i}
                    item={v}
                    index={i}
                    verticalOptions={verticalOptions}
                    vendorDetails={vendorDetails}
                    setVendorDetails={setVendorDetails}
                    setAddedLocationModal={setAddedLocationModal}
                    verticalsData={vendorDetails?.vendor_verticals}
                    setVerticalsData={setVendorDetails}
                    fetchVendorDetails={fetchVendorDetails}
                    setUpgradePlanData={setUpgradePlanData}
                    isViewOnly={isViewOnly}
                  />
                ))}
              </div>
              {!isEmpty(newlyAddedLocationsData) ? (
                <div className="flex flex-col gap-3">
                  <p className="text-16-600 text-primary-800">
                    Upgraded Locations
                  </p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {newlyAddedLocationsData?.map((v, i) => (
                      <RenderLocations
                        key={i}
                        item={v}
                        index={i}
                        verticalOptions={verticalOptions}
                        vendorDetails={vendorDetails}
                        setVendorDetails={setVendorDetails}
                        setAddedLocationModal={setAddedLocationModal}
                        verticalsData={newlyAddedLocationsData}
                        setVerticalsData={setNewlyAddedLocationsData}
                        fetchVendorDetails={fetchVendorDetails}
                        setUpgradePlanData={setUpgradePlanData}
                        isFromNewlyAdded
                        isViewOnly={isViewOnly}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>

        <ViewAddedLocationsModal
          userData={userData}
          visible={addedLocationModal}
          setVisible={setAddedLocationModal}
          upgradePlanData={upgradePlanData}
          setUpgradePlanData={setUpgradePlanData}
          fetchVendorDetails={fetchVendorDetails}
          vendorDetails={vendorDetails}
          setShowPlans={setShowPlans}
        />
      </div>

      <ComparePlanPopup
        visible={showPlans}
        setVisible={() => setShowPlans(false)}
      />
    </div>
  );
};

const AccountInformation = ({
  step,
  setStep,
  vendorDetails,
  setVendorDetails,
  vendorLogo,
  fetchVendorDetails,
  handleInputChange,
  isViewOnly = false,
}) => {
  const dispatch = useAppDispatch();
  const userData = useSelector(selectUser);

  const router = useRouter();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [state, setState] = useState("");
  const [businessSubCategoryOptions, setBusinessSubCategoryOptions] = useState(
    [],
  );
  const [primaryContact, setPrimaryContact] = useState<{
    contact?: string;
    verified?: boolean;
    otpSend?: boolean;
    otp?: string;
  }>({});
  const [contacts, setContacts] = useState([]);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let intervalId;

    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      if (intervalId) clearInterval(intervalId);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timer]);

  const loadSubCategory = async () => {
    try {
      const res = await apiHandler.businessSubCategory.lookup(
        `business_category_id=${vendorDetails.business_category_id}`,
      );
      if (res.status === 200 || res.status === 201) {
        setBusinessSubCategoryOptions(res.data.data);
        setLoadedOnce(true);
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (vendorDetails.business_category_id) {
      let obj = { ...vendorDetails };

      if (loadedOnce) {
        obj.business_sub_category_id = [];
      }
      setVendorDetails(obj);
      loadSubCategory();
    }
  }, [vendorDetails?.business_category_id]);

  const handleChangeContacts = (index, value) => {
    const updatedData = { ...vendorDetails };
    updatedData.contacts[index] = value;
    setVendorDetails(updatedData);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024 * 5) {
        showToast("error", "File size can not exceed 5 MB");
        return;
      }

      if (!file.type.includes("image")) {
        showToast("error", `Supported format (IMAGE)`);
        return;
      }

      dispatch(setIsLoading(true));
      try {
        const formData = new FormData();
        formData.append("VENDOR_LOGO", file);
        const res = await apiHandler.vendorDoc.vendorDocument(formData);

        if (res.status === 200 || res.status === 201) {
          showToast("success", res?.data.message);
          fetchVendorDetails();
        } else {
          showToast("error", res?.data.message);
        }
      } catch (error) {
        showToast("error", error.response?.data?.message || error.message);
      }
      dispatch(setIsLoading(false));
    }
  };

  const handleDropdownChange = (category: any, value: any) => {
    const updatedData = { ...vendorDetails };
    updatedData[category] = value?._id;
    if (category === "business_category_id") {
      updatedData.business_category_code = value.value_code;
    }
    if (category === "state") {
      updatedData.city = "";
      setState(value?.state);
    }
    setVendorDetails(updatedData);
    validateFields(category, value);
  };

  const handleCheck = (e, obj) => {
    let idArr = [...vendorDetails.business_sub_category_id];

    if (e.target.checked === true) {
      idArr.push(obj._id);
    } else {
      let findIndex = idArr.findIndex((item) => item === obj._id);
      if (findIndex !== -1) {
        idArr.splice(findIndex, 1);
      }
    }
    setErrors((prevState) => {
      const newState = { ...prevState };
      setDeep(newState, "business_sub_category_id", "");
      return newState;
    });
    setVendorDetails({ ...vendorDetails, business_sub_category_id: idArr });
  };

  const handleSendOtp = async (v, primary) => {
    try {
      dispatch(setIsLoading(true));

      const res = await apiHandler.vendor.vendorSendOtp({
        _id: vendorDetails._id,
        full_name: vendorDetails.full_name,
        email: vendorDetails.primary_email,
        contact: v.contact,
        primary: primary,
      });

      if (res.status === 200 || res.status === 201) {
        showToast("success", res.data.message);
        primary
          ? setPrimaryContact((prev) => ({
              ...prev,
              otpSend: true,
            }))
          : handleContactChange("otpSend", true);
        setTimer(60);
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  const handleVerifyOtp = async (v, primary) => {
    if (v.otpSend && v.otp && !v.verified) {
      dispatch(setIsLoading(true));
      try {
        const res = await apiHandler.vendor.vendorVerifyOtp({
          _id: vendorDetails._id,
          full_name: vendorDetails.full_name,
          email: vendorDetails.primary_email,
          contact: v.contact,
          otp: v.otp,
          primary: primary,
        });
        if (res.status === 200 || res.status === 201) {
          showToast("success", res.data.message);
          fetchVendorDetails();
          setPrimaryContact({});
          setContacts([]);
        } else {
          showToast("error", res.data.message);
        }
      } catch (error) {
        showToast("error", error.response?.data?.message || error.message);
      }
      dispatch(setIsLoading(false));
    }
  };

  const handleResendOtp = async (v, primary) => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.vendor.vendorReSendOtp({
        _id: vendorDetails._id,
        full_name: vendorDetails.full_name,
        email: vendorDetails.primary_email,
        contact: v.contact,
        primary: primary,
      });
      if (res.status === 200 || res.status === 201) {
        showToast("success", res.data.message);
        primary
          ? setPrimaryContact((prev) => ({
              ...prev,
              otpSend: true,
            }))
          : handleContactChange("otpSend", true);
        setTimer(60);
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  const handleRemoveContacts = (index) => {
    const updatedData = { ...vendorDetails };
    updatedData.contacts.splice(index, 1);
    setVendorDetails(updatedData);
  };

  const handleContactChange = (path: string, value: any) => {
    const updatedData = [...contacts];
    updatedData[0][path] = value;
    setContacts(updatedData);
  };

  const removeImage = async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.vendorDoc.vendorDocumentDelete(
        vendorLogo._id,
      );

      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data.message);
        fetchVendorDetails();
        setOpenDeleteModal(false);
      } else {
        showToast("error", res?.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  const handleSubmit = async (data) => {
    try {
      setContacts([]);
      data.contacts = data.contacts.filter((v) => v !== "");
      dispatch(setIsLoading(true));
      const res = await apiHandler.vendor.vendorProfileUpdate(
        userData?.user_id,
        { ...data, updateSection: "account" },
      );

      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data.message);
        fetchVendorDetails();
        if (step < 2) {
          setStep(step + 1);
        }
      } else {
        showToast("error", res?.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  const validateFields = (label: string, value: string) => {
    let error = "";

    switch (label) {
      case "company_name":
        if (isEmpty(value)) error = "Please enter company name";
        break;
      case "business_category_id":
        if (isEmpty(value)) error = "Please select business category";
        break;
      case "business_sub_category_id":
        if (isEmpty(value)) error = "Please select business sub category";
        break;
      case "full_name":
        if (isEmpty(value)) error = "Please enter your full name";
        break;
      case "primary_email":
        if (isEmpty(value)) error = "Please enter your email address";
        else if (!/^\S+@\S+\.\S+$/.test(value)) error = "Invalid email format";
        break;
      case "primary_contact":
        if (isEmpty(value)) error = "Please enter your phone number";
        else if (!/^\d{10}$/.test(value)) error = "Invalid phone number";
        break;
      case "location_id":
        if (isEmpty(value)) error = "Please select city you provide service";
        break;
      case "city":
        if (isEmpty(value)) error = "Please enter your city";
        break;
      case "state":
        if (isEmpty(value)) error = "Please enter your state";
        break;
      case "service_location_id":
        if (isEmpty(value)) error = "Please select service location";
        break;
      default:
        break;
    }

    const errObj = { ...errors, [label]: error };
    setErrors(errObj);
    return errObj;
  };

  const handleContinue = async () => {
    let newErrors = {},
      requiredFields = [];

    requiredFields = [
      "company_name",
      "business_category_id",
      "business_sub_category_id",
      "full_name",
      "primary_email",
      "primary_contact",
      "location_id",
      "city",
      "state",
    ];

    requiredFields.forEach((field) => {
      const err = validateFields(field, vendorDetails[field]);
      if (err[field]) {
        newErrors[field] = err[field];
      }
    });
    if (
      Object.keys(vendorDetails?.social_presence).every((key) =>
        isEmpty(vendorDetails?.social_presence?.[key]),
      )
    ) {
      newErrors["social_presence"] =
        "Please enter any of the one link to above";
    } else {
      newErrors["social_presence"] = {};
      Object.keys(vendorDetails?.social_presence).forEach((key) => {
        if (
          vendorDetails?.social_presence?.[key] &&
          !validateWebsiteRegex.test(vendorDetails?.social_presence?.[key])
        ) {
          newErrors["social_presence"][key] = "Please enter valid link";
        } else {
          newErrors["social_presence"][key] = "";
        }
      });
      if (Object.values(newErrors["social_presence"]).every((v) => v === "")) {
        delete newErrors?.social_presence;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      handleSubmit(vendorDetails);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="h-6 w-2 rounded-md bg-green-50 sm:h-8 sm:w-4"></div>
        <h4 className="text-20-600 text-primary-800">Account Information</h4>
      </div>

      <div className="flex flex-col">
        <div className="mb-3 flex flex-col items-start gap-2 sm:mb-0 sm:flex-row sm:items-center sm:gap-3">
          <div className="my-3 flex max-h-20 min-h-20 w-fit min-w-20 max-w-20 items-center justify-center overflow-hidden rounded-full border-4 border-orange-100 sm:my-6 sm:max-h-24 sm:min-h-24 sm:min-w-24 sm:max-w-24">
            {isEmpty(vendorLogo?.doc_path) ? (
              <PlusIcon className="max-h-14 min-h-12 min-w-12 max-w-14" />
            ) : (
              <CustomImage
                src={convertMediaUrl(vendorLogo.doc_path)}
                alt="vendor logo"
                className="max-h-20 min-h-20 min-w-20 max-w-20 rounded-full object-cover sm:max-h-24 sm:min-h-24 sm:min-w-24 sm:max-w-24"
              />
            )}
          </div>
          <div className="flex gap-4">
            <label htmlFor="file-upload" className="relative cursor-pointer">
              {!isViewOnly ? (
                <button className="btn-fill-hover h-auto w-auto cursor-pointer rounded-xl border-2 border-blue-100 bg-blue-100 px-2 py-1 text-sm font-semibold text-primary-100 sm:px-3 sm:py-2 md:px-4 md:py-2.5">
                  <div className="flex items-end justify-end gap-1 sm:gap-2">
                    <PlusIcon className="h-4 w-4 md:h-5 md:w-5" />
                    <p className="text-xs md:text-sm">Upload Logo</p>
                  </div>
                </button>
              ) : null}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="file-upload"
                disabled={isViewOnly}
                className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>
            <div>
              {!isViewOnly && !isEmpty(vendorLogo?.doc_path) ? (
                <CustomButton
                  text="Remove"
                  className="btn-outline-hover border-primary-50 px-4 py-1.5 text-primary-800 sm:px-5 sm:py-2"
                  onClick={() => setOpenDeleteModal(true)}
                />
              ) : null}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-y-6">
          <div className="col-span-2">
            <CustomInput
              toolTipText="Full Name"
              label="Full Name"
              disabled={isViewOnly}
              value={vendorDetails.full_name}
              onChange={(e) =>
                handleInputChange("full_name", e.target.value, setErrors)
              }
            />
            {errors?.full_name ? (
              <p className="error-text">{errors?.full_name}</p>
            ) : null}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              toolTipText="Company Name"
              label="Company Name"
              value={vendorDetails.company_name}
              disabled={isViewOnly}
              onChange={(e) =>
                handleInputChange("company_name", e.target.value, setErrors)
              }
            />
            {errors?.company_name ? (
              <p className="error-text">{errors?.company_name}</p>
            ) : null}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <LabelField
              labelText="Business Category"
              toolTipText="Business Category"
              className="mb-1.5"
            />
            <FetchDropdown
              placeholder="Select Business Category"
              value={vendorDetails.business_category_id}
              endPoints={apiHandler.businessCategory.lookup}
              filterStr="NA"
              func={handleDropdownChange}
              display="business_category_name"
              objKey="business_category_id"
              required
              isComponentDisabled={true}
            />
            {errors?.business_category_id ? (
              <p className="error-text">{errors?.business_category_id}</p>
            ) : null}
          </div>
          {isViewOnly &&
          isEmpty(vendorDetails?.business_sub_category_id) ? null : (
            <div className="col-span-2">
              <LabelField
                labelText="Business Sub Category"
                toolTipText="Select Business Sub Category"
              />
              <div>
                {isViewOnly ? (
                  <div className="flex gap-4">
                    {businessSubCategoryOptions
                      ?.filter((i) =>
                        vendorDetails?.business_sub_category_id?.includes(
                          i?._id,
                        ),
                      )
                      ?.map((i) => (
                        <p key={i?._id}>{i?.business_sub_category_name}</p>
                      ))}
                  </div>
                ) : (
                  businessSubCategoryOptions?.map((option) => (
                    <StyledFormControlLabel
                      key={option._id}
                      className="pl-1"
                      control={
                        <StyledCheckbox
                          icon={<CustomCheckBox className="h-5 w-5" />}
                          checkedIcon={
                            <CustomCheckBox checked className="h-5 w-5" />
                          }
                          checked={vendorDetails?.business_sub_category_id?.includes(
                            option?._id,
                          )}
                          onChange={(e) => handleCheck(e, option)}
                        />
                      }
                      label={option.business_sub_category_name}
                    />
                  ))
                )}
                {errors?.business_sub_category_id ? (
                  <p className="error-text">
                    {errors?.business_sub_category_id}
                  </p>
                ) : null}
              </div>
            </div>
          )}
          <div className="col-span-2">
            <CustomInput
              toolTipText="Email"
              label="Email"
              disabled={isViewOnly || true}
              value={vendorDetails.primary_email}
              onChange={(e) =>
                handleInputChange("primary_email", e.target.value, setErrors)
              }
            />
            {errors?.primary_email ? (
              <p className="error-text">{errors?.primary_email}</p>
            ) : null}
          </div>

          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              toolTipText="Website link"
              disabled={isViewOnly}
              label="Website link"
              onChange={(e) =>
                handleInputChange(
                  "social_presence.website",
                  e.target.value,
                  setErrors,
                )
              }
              value={vendorDetails?.social_presence?.website}
            />
            {errors?.social_presence?.website ? (
              <p className="error-text">{errors?.social_presence?.website}</p>
            ) : null}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              toolTipText="Instagram link"
              disabled={isViewOnly}
              label="Instagram link"
              onChange={(e) =>
                handleInputChange(
                  "social_presence.instagram",
                  e.target.value,
                  setErrors,
                )
              }
              value={vendorDetails?.social_presence?.instagram}
            />
            {errors?.social_presence?.instagram ? (
              <p className="error-text">{errors?.social_presence?.instagram}</p>
            ) : null}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              toolTipText="Facebook link"
              disabled={isViewOnly}
              label="Facebook link"
              onChange={(e) =>
                handleInputChange(
                  "social_presence.facebook",
                  e.target.value,
                  setErrors,
                )
              }
              value={vendorDetails?.social_presence?.facebook}
            />
            {errors?.social_presence?.facebook ? (
              <p className="error-text">{errors?.social_presence?.facebook}</p>
            ) : null}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <CustomInput
              toolTipText="YouTube link"
              disabled={isViewOnly}
              label="YouTube link"
              onChange={(e) =>
                handleInputChange(
                  "social_presence.youtube",
                  e.target.value,
                  setErrors,
                )
              }
              value={vendorDetails?.social_presence?.youtube}
            />
            {errors?.social_presence?.youtube ? (
              <p className="error-text">{errors?.social_presence?.youtube}</p>
            ) : null}
          </div>
          {typeof errors?.social_presence === "string" ? (
            <p className="error-text">{errors?.social_presence}</p>
          ) : null}
          <div className="col-span-2 flex flex-col gap-3">
            <div className="relative h-auto w-full">
              <CustomInput
                toolTipText="Primary mobile number will not update until user verify by providing valid otp"
                label="Primary Mobile Number"
                disabled={isViewOnly || true}
                type="number"
                value={
                  isEmpty(primaryContact)
                    ? vendorDetails.primary_contact
                    : primaryContact?.contact
                }
                maxLength={10}
                onChange={(e) => {
                  if (isEmpty(primaryContact)) {
                    setPrimaryContact({
                      contact: e?.target?.value,
                      otp: "",
                      otpSend: false,
                      verified: false,
                    });
                  } else {
                    setPrimaryContact((prev) => ({
                      ...prev,
                      contact: e?.target?.value,
                    }));
                  }
                }}
              />
              {isEmpty(primaryContact) ? (
                <div className="absolute bottom-1.5 right-1 flex items-center rounded-lg p-1 text-white sm:right-2 sm:p-2">
                  <Tooltip title="Verified" placement="top">
                    <div>
                      <TickIcon className="!h-5 !w-5" stroke={"#23C55E"} />
                    </div>
                  </Tooltip>
                </div>
              ) : (
                <div className="absolute bottom-[9px] right-1.5 mt-2 sm:bottom-1.5">
                  {!primaryContact?.verified && !primaryContact?.otpSend && (
                    <CustomButton
                      text="Verify"
                      disabled={
                        !primaryContact?.contact ||
                        primaryContact?.contact?.length < 10
                      }
                      className={`w-fit !rounded-md !border !px-2 !py-1.5 sm:min-w-14 sm:bg-primary-200 ${primaryContact?.contact && primaryContact?.contact?.length >= 10 ? "!border-blue-100 !text-blue-100" : "!border-primary-400 !text-primary-400"}`}
                      onClick={() => handleSendOtp(primaryContact, true)}
                    />
                  )}
                </div>
              )}
            </div>

            {!isEmpty(primaryContact) &&
              !primaryContact?.verified &&
              primaryContact?.otpSend && (
                <div>
                  <div className="relative">
                    <CustomInput
                      className="!mt-0"
                      label=""
                      name="OTP"
                      type="number"
                      value={primaryContact?.otp}
                      maxLength={6}
                      onChange={(e) => {
                        setPrimaryContact((prev) => ({
                          ...prev,
                          otp: e?.target?.value,
                        }));
                      }}
                      placeholder="Enter 6 digit OTP"
                    />
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                      {!primaryContact?.verified && (
                        <CustomButton
                          text="Verify"
                          disabled={
                            !primaryContact?.otp ||
                            primaryContact?.otp?.length < 6
                          }
                          className={`w-full min-w-20 !rounded-md !border bg-primary-200 !px-2 !py-1.5 ${primaryContact?.otp && primaryContact?.otp.length >= 6 ? "!border-blue-100 !text-blue-100" : "!border-primary-400 !text-primary-400"}`}
                          onClick={() => handleVerifyOtp(primaryContact, true)}
                        />
                      )}
                    </div>
                  </div>
                  {timer > 0 ? (
                    <span className="text-xs text-blue-500 sm:text-sm">
                      Resend OTP in {timer}s
                    </span>
                  ) : (
                    <button
                      className="text-xs text-blue-500 sm:text-sm"
                      onClick={() => handleResendOtp(primaryContact, true)}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}
          </div>

          <div className="col-span-2">
            <LabelField
              labelText="Location"
              toolTipText="Location"
              className="mb-1.5"
            />
            <FetchDropdown
              placeholder="Please select location here"
              value={vendorDetails.location_id}
              endPoints={apiHandler.values.cities}
              filterStr="NA"
              func={handleDropdownChange}
              display="name"
              objKey="location_id"
              required
              isComponentDisabled={isViewOnly}
            />
            {errors?.location_id ? (
              <p className="error-text">{errors?.location_id}</p>
            ) : null}
          </div>
          {isViewOnly && isEmpty(vendorDetails?.contacts) ? null : (
            <div className="col-span-2">
              <LabelField
                labelText="Secondary Mobile Number"
                toolTipText="Secondary mobile number will not update until user verify by providing valid otp"
              />
              {vendorDetails.contacts.map((number, index) => (
                <div
                  key={index}
                  className="mt-3 flex items-center gap-1 sm:gap-3"
                >
                  <div className="relative h-auto w-full">
                    <CustomInput
                      type="number"
                      value={number}
                      maxLength={10}
                      onChange={(e) =>
                        handleChangeContacts(index, e.target.value)
                      }
                      className="!my-0 block w-full rounded-lg border-gray-300 px-3 py-2"
                      placeholder={`${index + 1}.`}
                      disabled
                    />
                    <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center rounded-lg p-1 text-white sm:right-2 sm:p-2">
                      <Tooltip title="Verified" placement="top">
                        <div>
                          <TickIcon className="!h-5 !w-5" stroke={"#23C55E"} />
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                  {!isViewOnly ? (
                    <Tooltip title="Delete" placement="top">
                      <button
                        className="z-10 rounded-lg text-red-300"
                        onClick={() => handleRemoveContacts(index)}
                      >
                        <DeleteIcon className="h-5 w-5" />
                      </button>
                    </Tooltip>
                  ) : null}
                </div>
              ))}

              {contacts.map((v, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="relative">
                    <CustomInput
                      type="number"
                      value={v.contact}
                      maxLength={10}
                      onChange={(e) => {
                        handleContactChange("contact", e?.target?.value);
                        if (v.otpSend) {
                          handleContactChange("otpSend", false);
                        }
                      }}
                      placeholder={`${[...vendorDetails.contacts, ...contacts].length}.`}
                    />

                    <div className="absolute bottom-[9px] right-1.5 mt-2 sm:bottom-1.5">
                      {!v.verified && !v.otpSend && (
                        <CustomButton
                          text="Verify"
                          disabled={!v.contact || v.contact.length < 10}
                          className={`w-fit !rounded-md !border !px-2 !py-1.5 sm:min-w-14 sm:bg-primary-200 ${v.contact && v.contact.length >= 10 ? "!border-blue-100 !text-blue-100" : "!border-primary-400 !text-primary-400"}`}
                          onClick={() => handleSendOtp(v, false)}
                        />
                      )}
                    </div>
                  </div>

                  {!v.verified && v.otpSend && (
                    <div>
                      <div className="relative">
                        <CustomInput
                          className="!mt-0"
                          label=""
                          name="OTP"
                          type="number"
                          value={v.otp}
                          maxLength={6}
                          onChange={(e) =>
                            handleContactChange("otp", e?.target?.value)
                          }
                          placeholder="Enter 6 digit OTP"
                        />
                        <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                          {!v.verified && (
                            <CustomButton
                              text="Verify"
                              disabled={!v.otp || v.otp.length < 6}
                              className={`w-full min-w-20 !rounded-md !border bg-primary-200 !px-2 !py-1.5 ${v.otp && v.otp.length >= 6 ? "!border-blue-100 !text-blue-100" : "!border-primary-400 !text-primary-400"}`}
                              onClick={() => handleVerifyOtp(v, false)}
                            />
                          )}
                        </div>
                      </div>
                      {timer > 0 ? (
                        <span className="text-xs text-blue-500 sm:text-sm">
                          Resend OTP in {timer}s
                        </span>
                      ) : (
                        <button
                          className="text-xs text-blue-500 sm:text-sm"
                          onClick={() => handleResendOtp(v, false)}
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {!isViewOnly
                ? vendorDetails.contacts.length < 4 && (
                    <CustomButton
                      disabled={contacts.length}
                      text="Add"
                      onClick={() =>
                        setContacts([
                          {
                            contact: "",
                            otp: "",
                            otpSend: false,
                            verified: false,
                          },
                        ])
                      }
                      className="text-15-700 btn-fill-hover mt-3 h-fit w-fit !rounded-xl border-2 border-blue-100 bg-blue-100 px-2 py-1.5 text-primary-100 hover:!border-blue-600 hover:!bg-blue-600 sm:px-3 sm:py-1.5"
                    />
                  )
                : null}
            </div>
          )}
          <div className="col-span-2 flex flex-col gap-y-1 md:gap-y-3">
            <div>
              <CustomInput
                toolTipText="Address"
                label="Address"
                multiple
                disabled={isViewOnly}
                className="!py-4 !pb-20"
                isTextArea
                value={vendorDetails?.address}
                onChange={(e) =>
                  handleInputChange("address", e.target.value, setErrors)
                }
              />
              {errors?.address ? (
                <p className="error-text">{errors?.address}</p>
              ) : null}
            </div>
            <div className="flex w-full flex-col gap-x-4 gap-y-2 md:flex-row">
              <div className="w-full">
                <FetchDropdown
                  required
                  placeholder={
                    !isViewOnly
                      ? "Enter Your State (Required)"
                      : "No State Selected"
                  }
                  value={vendorDetails?.state}
                  endPoints={apiHandler.values.stateList}
                  filterStr={`value=${vendorDetails?.business_category_code}`}
                  isComponentDisabled={isViewOnly}
                  func={handleDropdownChange}
                  objKey="state"
                  display="state"
                />
                {errors?.state ? (
                  <p className="error-text">{errors?.state}</p>
                ) : null}
              </div>
              <div className="w-full">
                <FetchDropdown
                  required
                  placeholder={
                    !isViewOnly
                      ? "Enter Your City (Required)"
                      : "No City Selected"
                  }
                  value={vendorDetails?.city}
                  isComponentDisabled={
                    isEmpty(vendorDetails?.state) || isViewOnly
                  }
                  endPoints={apiHandler.values.cityList}
                  filterStr={`state=${state}&value=${vendorDetails?.business_category_code}`}
                  func={handleDropdownChange}
                  objKey="city"
                  display="city"
                />
                {errors?.city ? (
                  <p className="error-text">{errors?.city}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <PageAction
        className="!mt-2 w-full sm:!mt-8 sm:py-0"
        btnPrimaryLabel="Cancel"
        btnPrimaryClassName="hover:!bg-primary-100 hover:!text-blue-100"
        btnSecondaryLabel={!isViewOnly ? "Save & Continue" : null}
        btnSecondaryClassName="border-2 hover:!bg-blue-100 hover:!text-primary-100"
        btnPrimaryFun={() => router.back()}
        btnSecondaryFun={!isViewOnly ? handleContinue : null}
      />
      <DeleteModal
        func={removeImage}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
      />
    </>
  );
};

const SocialPresence = ({
  vendorDetails,
  step,
  setStep,
  handleInputChange,
  fetchVendorDetails,
  isViewOnly = false,
}) => {
  const dispatch = useAppDispatch();
  const userData = useSelector(selectUser);

  const [errors, setErrors] = useState({});

  const handleSubmit = async (data) => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.vendor.vendorProfileUpdate(
        userData?.user_id,
        { ...data, updateSection: "social_presence" },
      );

      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data.message);
        fetchVendorDetails();
        if (step < 2) {
          setStep(step + 1);
        }
      } else {
        showToast("error", res?.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  const handleContinue = async () => {
    let newErrors = {};

    if (
      Object.keys(vendorDetails?.social_presence).every((key) =>
        isEmpty(vendorDetails?.social_presence?.[key]),
      )
    ) {
      newErrors["social_presence"] =
        "Please enter any of the one link to above";
    } else {
      newErrors["social_presence"] = {};
      Object.keys(vendorDetails?.social_presence).forEach((key) => {
        if (
          vendorDetails?.social_presence?.[key] &&
          !validateWebsiteRegex.test(vendorDetails?.social_presence?.[key])
        ) {
          newErrors["social_presence"][key] = "Please enter valid link";
        } else {
          newErrors["social_presence"][key] = "";
        }
      });
      if (Object.values(newErrors["social_presence"]).every((v) => v === "")) {
        delete newErrors?.social_presence;
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      handleSubmit(vendorDetails);
    }
  };

  return (
    <>
      <div className="mb-5 flex items-center gap-3 sm:mb-10">
        <div className="h-6 w-2 rounded-md bg-green-50 sm:h-8 sm:w-4"></div>
        <h4 className="text-20-600 text-primary-800">Social Presence</h4>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <CustomInput
            toolTipText="Website link"
            disabled={isViewOnly}
            label="Website link"
            onChange={(e) =>
              handleInputChange(
                "social_presence.website",
                e.target.value,
                setErrors,
              )
            }
            value={vendorDetails?.social_presence?.website}
          />
          {errors?.social_presence?.website ? (
            <p className="error-text">{errors?.social_presence?.website}</p>
          ) : null}
        </div>
        <div>
          <CustomInput
            toolTipText="Instagram link"
            disabled={isViewOnly}
            label="Instagram link"
            onChange={(e) =>
              handleInputChange(
                "social_presence.instagram",
                e.target.value,
                setErrors,
              )
            }
            value={vendorDetails?.social_presence?.instagram}
          />
          {errors?.social_presence?.instagram ? (
            <p className="error-text">{errors?.social_presence?.instagram}</p>
          ) : null}
        </div>
        <div>
          <CustomInput
            toolTipText="Twitter link"
            disabled={isViewOnly}
            label="Twitter link"
            onChange={(e) =>
              handleInputChange(
                "social_presence.twitter",
                e.target.value,
                setErrors,
              )
            }
            value={vendorDetails?.social_presence?.twitter}
          />
          {errors?.social_presence?.twitter ? (
            <p className="error-text">{errors?.social_presence?.twitter}</p>
          ) : null}
        </div>
        <div>
          <CustomInput
            toolTipText="Facebook link"
            disabled={isViewOnly}
            label="Facebook link"
            onChange={(e) =>
              handleInputChange(
                "social_presence.facebook",
                e.target.value,
                setErrors,
              )
            }
            value={vendorDetails?.social_presence?.facebook}
          />
          {errors?.social_presence?.facebook ? (
            <p className="error-text">{errors?.social_presence?.facebook}</p>
          ) : null}
        </div>
        <div>
          <CustomInput
            toolTipText="YouTube link"
            disabled={isViewOnly}
            label="YouTube link"
            onChange={(e) =>
              handleInputChange(
                "social_presence.youtube",
                e.target.value,
                setErrors,
              )
            }
            value={vendorDetails?.social_presence?.youtube}
          />
          {errors?.social_presence?.youtube ? (
            <p className="error-text">{errors?.social_presence?.youtube}</p>
          ) : null}
        </div>
        <div>
          <CustomInput
            toolTipText="Pinterest link"
            disabled={isViewOnly}
            label="Pinterest link"
            onChange={(e) =>
              handleInputChange(
                "social_presence.pinterest",
                e.target.value,
                setErrors,
              )
            }
            value={vendorDetails?.social_presence?.pinterest}
          />
          {errors?.social_presence?.pinterest ? (
            <p className="error-text">{errors?.social_presence?.pinterest}</p>
          ) : null}
        </div>
        <div>
          <CustomInput
            toolTipText="Linkedin link"
            disabled={isViewOnly}
            label="Linkedin link"
            value={vendorDetails?.social_presence?.linkedin}
            onChange={(e) =>
              handleInputChange(
                "social_presence.linkedin",
                e.target.value,
                setErrors,
              )
            }
          />
          {errors?.social_presence?.linkedin ? (
            <p className="error-text">{errors?.social_presence?.linkedin}</p>
          ) : null}
        </div>
        <div>
          <CustomInput
            toolTipText="Behance link"
            disabled={isViewOnly}
            label="Behance link"
            value={vendorDetails?.social_presence?.behance}
            onChange={(e) =>
              handleInputChange(
                "social_presence.behance",
                e.target.value,
                setErrors,
              )
            }
          />
          {errors?.social_presence?.behance ? (
            <p className="error-text">{errors?.social_presence?.behance}</p>
          ) : null}
        </div>
        {typeof errors?.social_presence === "string" ? (
          <p className="error-text">{errors?.social_presence}</p>
        ) : null}
      </div>

      <PageAction
        className="!mt-2 w-full sm:!mt-8 sm:py-0"
        btnPrimaryLabel="Cancel"
        btnSecondaryLabel={!isViewOnly ? "Save & Continue" : null}
        btnPrimaryFun={() => setStep(step - 1)}
        btnSecondaryFun={!isViewOnly ? handleContinue : null}
      />
    </>
  );
};

const CompanyInfo = ({
  vendorDetails,
  handleInputChange,
  step,
  setStep,
  fetchVendorDetails,
  isGstNumber,
  setIsGstNumber,
  isViewOnly = false,
}) => {
  const dispatch = useAppDispatch();
  const userData = useSelector(selectUser);

  const router = useRouter();

  const [errors, setErrors] = useState({});

  const validateFields = (label: string, value: string) => {
    let error = "";

    switch (label) {
      case "no_of_employees":
        if (!value) error = "Please enter number of employees";
        break;
      case "budget":
        if (!value) error = "Please enter budget";
        break;
      case "establishment_year":
        if (!value) error = "Please select establishment year";
        break;
      case "gst_number":
        if (!value.trim()) {
          error = "Please enter GST number";
        } else if (!validateGSTNumberRegex.test(value)) {
          error = "Invalid GST number";
        }
        break;
      case "pan_number":
        if (!value.trim()) {
          error = "Please enter PAN number";
        } else if (!validatePANNumberRegex.test(value)) {
          error = "Invalid PAN number";
        }
        break;
      default:
        break;
    }

    const errObj = { ...errors, [label]: error };
    setErrors(errObj);
    return errObj;
  };

  const handleSubmit = async (data) => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.vendor.vendorProfileUpdate(
        userData?.user_id,
        { ...data, updateSection: "additional_info" },
      );

      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data.message);
        fetchVendorDetails();
        if (step < 2) {
          setStep(step + 1);
        }
      } else {
        showToast("error", res?.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  const handleContinue = async () => {
    let newErrors = {},
      requiredFields = [];
    requiredFields = ["establishment_year", "no_of_employees", "budget"];
    if (isGstNumber) {
      requiredFields.push("gst_number");
    } else {
      requiredFields.push("pan_number");
    }

    requiredFields.forEach((field) => {
      const err = validateFields(field, vendorDetails[field]);
      if (err[field]) {
        newErrors[field] = err[field];
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      handleSubmit(vendorDetails);
    }
  };

  return (
    <>
      <div className="mb-5 flex items-center gap-3 sm:mb-10">
        <div className="h-6 w-2 rounded-md bg-green-50 sm:h-8 sm:w-4"></div>
        <h4 className="text-20-600 text-primary-800">Company Info</h4>
      </div>
      <div className="space-y-2 sm:space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            {!isViewOnly ? (
              <CustomDatePicker
                value={vendorDetails.establishment_year}
                onChange={(newValue) =>
                  handleInputChange("establishment_year", newValue, setErrors)
                }
                picker="year"
                placeholder="Click to change or add establishment year"
                label="Establishment Year"
                toolTipText="Establishment Year"
                maxDate={new Date()}
                disabled={isViewOnly}
              />
            ) : (
              <CustomInput
                placeholder="Click to change or add establishment year"
                label="Establishment Year"
                disabled={isViewOnly}
                value={
                  vendorDetails?.establishment_year
                    ? moment(vendorDetails.createdAt).format("YYYY")
                    : ""
                }
              />
            )}
            {errors?.establishment_year ? (
              <p className="error-text">{errors.establishment_year}</p>
            ) : null}
          </div>
          <div>
            <CustomInput
              toolTipText="Number of employee"
              placeholder="Click to change or add number of employees"
              label="Number of employee"
              disabled={isViewOnly}
              type="number"
              value={vendorDetails?.no_of_employees}
              onChange={(e) =>
                handleInputChange("no_of_employees", e.target.value, setErrors)
              }
            />
            {errors?.no_of_employees ? (
              <p className="error-text">{errors?.no_of_employees}</p>
            ) : null}
          </div>
        </div>
        <div>
          <CustomInput
            toolTipText="Budget"
            placeholder="Your Event Services Start From (₹)"
            disabled={isViewOnly}
            label="Budget"
            type="number"
            value={vendorDetails?.budget}
            onChange={(e) =>
              handleInputChange("budget", e.target.value, setErrors)
            }
          />
          {errors?.budget ? (
            <p className="error-text">{errors?.budget}</p>
          ) : null}
        </div>
        <div>
          <LabelField
            labelText="Top 3 Client Names"
            toolTipText="Top 3 Client Names"
          />
          <div className="grid gap-x-4 lg:grid-cols-3">
            {[0, 1, 2].map((clientName, index) => (
              <CustomInput
                key={index}
                disabled={isViewOnly}
                placeholder={`${index + 1}.`}
                value={vendorDetails?.top3_client_name[clientName]}
                onChange={(e) =>
                  handleInputChange(
                    `top3_client_name.${index}`,
                    e.target.value,
                    setErrors,
                  )
                }
              />
            ))}
          </div>
        </div>
        <div className="flex w-full flex-col lg:flex-row">
          {!isViewOnly ? (
            <div className="lg:w-2/5">
              <LabelField
                labelText="Do you have a GST Number?"
                toolTipText="if you have a GST Number select 'Yes'"
              />
              <CustomSwitch
                selected={isGstNumber}
                setSelected={setIsGstNumber}
              />
            </div>
          ) : null}
          <div className="lg:w-3/5">
            <CustomInput
              disabled={isViewOnly}
              label={
                isGstNumber
                  ? "Enter your GST Number here"
                  : "Enter your PAN Number here"
              }
              name={
                isGstNumber
                  ? "Enter your GST Number here"
                  : "Enter your PAN Number here"
              }
              toolTipText={isGstNumber ? "GST Number" : "PAN Number"}
              value={
                isGstNumber
                  ? vendorDetails.gst_number
                  : vendorDetails.pan_number
              }
              onChange={(e) => {
                if (isGstNumber && e.target.value.length <= 15) {
                  handleInputChange(
                    "gst_number",
                    e.target.value.toUpperCase(),
                    setErrors,
                  );
                } else if (!isGstNumber && e.target.value.length <= 10) {
                  handleInputChange(
                    "pan_number",
                    e.target.value.toUpperCase(),
                    setErrors,
                  );
                }
              }}
              placeholder={isGstNumber ? "GST Number" : "PAN Number"}
            />

            {isGstNumber ? (
              errors?.gst_number ? (
                <p className="error-text">{errors?.gst_number}</p>
              ) : null
            ) : errors?.pan_number ? (
              <p className="error-text">{errors?.pan_number}</p>
            ) : null}
          </div>
        </div>
        {!isViewOnly ? (
          <div>
            <LabelField
              labelText="Company registration details"
              toolTipText="Company registration details"
            />
            <VendorDocumentUpload />
          </div>
        ) : null}
      </div>

      <PageAction
        className="!mt-2 w-full sm:!mt-8 sm:py-0"
        btnPrimaryLabel="Cancel"
        btnPrimaryClassName="hover:!bg-primary-100 hover:!text-blue-100"
        btnSecondaryLabel={!isViewOnly ? "Save & Continue" : null}
        btnSecondaryClassName="border-2 hover:!bg-blue-100 hover:!text-primary-100"
        btnPrimaryFun={() => router.back()}
        btnSecondaryFun={!isViewOnly ? handleContinue : null}
      />
    </>
  );
};

export {
  AccountInformation,
  CompanyInfo,
  EventTypeAndVertical,
  SocialPresence,
};
