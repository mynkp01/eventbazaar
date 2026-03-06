"use client";
import { apiHandler } from "@api/apiHandler";
import LabelField from "@components/LabelField";
import PageAction from "@components/PageAction";
import Rating from "@components/Rating";
import { setDeep } from "@components/SetDeep";
import { selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty, showToast } from "src/utils/helper";

const CKEditorComp = dynamic(() => import("@components/CKEditorComp"), {
  ssr: false,
});

const AddReview = () => {
  const { vendor_id } = useParams();
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<any>({});
  const userData = useSelector(selectUser);
  const [reviewData, setReviewData] = useState({
    vendor_id: vendor_id,
    customer_id: userData?.user_id,
    review: "",
    rating: 0,
  });

  const handleInputChange = (path: string, value: any) => {
    setReviewData((prevState) => {
      const newState = { ...prevState };
      setDeep(newState, path, value);
      return newState;
    });

    setErrors((prevState) => {
      const newState = { ...prevState };
      setDeep(newState, path, "");
      return newState;
    });
  };

  const validateFields = (label: string, value: any) => {
    let error = "";

    switch (label) {
      case "review":
        if (isEmpty(value)) error = "Please provide review";
        break;
      case "rating":
        if (!value) error = "Please provide rating";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [label]: error }));
    return { ...errors, [label]: error };
  };

  async function createReview() {
    try {
      let newErrors = {};
      const updatedData = { ...reviewData },
        requiredFields = ["review", "rating"];

      requiredFields.forEach((field) => {
        const err = validateFields(field, updatedData[field]);
        if (err[field]) {
          newErrors[field] = err[field];
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      } else {
        try {
          dispatch(setIsLoading(true));
          const res = await apiHandler.review.post(updatedData);
          if (res.status === 200 || res.status === 201) {
            showToast("success", res?.data?.message);
            setReviewData({
              vendor_id: vendor_id,
              customer_id: userData?.user_id,
              review: "",
              rating: 0,
            });
          } else {
            showToast("error", res?.data?.message);
          }
        } catch (error) {
          showToast("error", error?.response?.data?.message || error.message);
        }
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="heading-40">Provide Review</h3>
      <div className="rounded-xl bg-primary-100 p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <LabelField
            labelText="Rating"
            toolTipText="Rate between 1 and 5 stars"
          />
          <Rating
            value={reviewData.rating}
            onChange={(e) => handleInputChange("rating", e)}
          />
          {errors.rating ? <p className="error-text">{errors.rating}</p> : null}
        </div>
        <div className="mb-6">
          <LabelField labelText="Review" toolTipText="Write your review here" />
          <div className="mt-3">
            <CKEditorComp
              value={reviewData.review}
              onChange={(data) => {
                handleInputChange("review", data);
              }}
            />
            {errors.review ? (
              <p className="error-text">{errors.review}</p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <PageAction
            className="!mt-2 w-full sm:!mt-8 sm:py-0"
            btnSecondaryLabel="Add"
            btnSecondaryClassName="!py-2 !px-6 sm:!px-16  !border-blue-100 !bg-blue-100 !text-primary-100"
            btnSecondaryFun={createReview}
          />
        </div>
      </div>
    </div>
  );
};

export default AddReview;
