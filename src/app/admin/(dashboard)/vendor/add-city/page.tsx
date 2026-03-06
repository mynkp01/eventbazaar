"use client";
import { apiHandler } from "@api/apiHandler";
import CustomInput from "@components/CustomInput";
import FetchDropdown from "@components/FetchDropdown";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { showToast, validateGSTNumberRegex } from "src/utils/helper";

const Page = () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const id = queryParams.get("id");
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    location_id: [],
    amount: 0,
    gst_number: "",
    city_names: [],
  });

  const fetchCityDetails = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.vendorVertical.cityGet(id);
      if (status === 200) {
        const city = data?.data;

        setFormData((prev) => ({
          ...prev,
          location_id: city.map((city) => city.location_id),
        }));
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      if (err?.error?.status === 406) {
        showToast("error", err.message);
        return router.back();
      }
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    if (id) {
      fetchCityDetails();
    } else {
      window.close();
      // router.back();
    }
  }, [id]);

  const validateFields = (label: string, value: any) => {
    let error = "";

    switch (label) {
      case "location_id":
        if (!String(value).trim()) error = "Please select a city.";
        break;
      case "amount":
        if (!Number(value)) error = "Please enter an amount.";
        break;
      default:
        break;
    }

    const errObj = { ...errors, [label]: error };
    setErrors(errObj);
    return errObj;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prevState) => {
      const newState = { ...prevState };
      newState[name] = "";
      return newState;
    });
  };

  const handleFetchDropdownChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: Array.isArray(value)
        ? value.map((item) => item._id)
        : value?._id || "",
      city_names: Array.isArray(value)
        ? value.map((item) => item.name)
        : value?.name || "",
    }));

    setErrors((prevState) => {
      const newState = { ...prevState };
      newState[name] = "";
      return newState;
    });
  };

  const handleSubmit = async () => {
    let newErrors = {};
    const requiredFields = ["location_id"];

    requiredFields.forEach((field) => {
      const err = validateFields(field, formData[field]);
      if (err[field]) {
        newErrors[field] = err[field];
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (
      formData?.gst_number &&
      !validateGSTNumberRegex.test(formData.gst_number)
    ) {
      setErrors((prev) => ({
        ...prev,
        gst_number: "Please enter valid GST number",
      }));
      return;
    }

    try {
      dispatch(setIsLoading(true));
      const { data, status } =
        await apiHandler.enterprise.enterpriseSubscription({
          ...formData,
          vendor_id: id,
        });

      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        // router.push(ROUTES.admin.vendor);
        window.close();
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className="border-wh-300 flex flex-col items-center gap-4 rounded-2xl border bg-white">
      <div className="flex w-full flex-col gap-4 p-4 md:p-6">
        <h1 className="text-xl font-bold">{"Provide Enterprise"}</h1>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <FetchDropdown
              label="City"
              placeholder="Select City"
              value={formData.location_id}
              endPoints={apiHandler.values.cities}
              filterStr="NA"
              multiple
              objKey="location_id"
              display="name"
              func={handleFetchDropdownChange}
              required
            />
            {errors.location_id && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.location_id}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <CustomInput
              label="Amount"
              name="amount"
              type="number"
              placeholder="Enter Amount"
              value={formData.amount}
              onChange={handleInputChange}
            />
            {errors.amount && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.amount}
              </p>
            )}
          </div>
          <div className="flex-1">
            <CustomInput
              label="GST Number"
              name="gst_number"
              type="text"
              placeholder="Enter GST number"
              value={formData.gst_number}
              onChange={handleInputChange}
            />
            {errors.gst_number && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.gst_number}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-row gap-4">
          <button
            type="button"
            onClick={() => window.close()}
            className="text-15-700 btn-fill-hover h-fit w-fit rounded-xl border-2 border-blue-100 bg-blue-100 p-1.5 text-primary-100 sm:px-3 sm:py-2.5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="shadow-outer h-fit w-fit rounded-xl border border-blue-100 bg-primary-100 p-1.5 text-blue-100 sm:px-3 sm:py-2.5"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
