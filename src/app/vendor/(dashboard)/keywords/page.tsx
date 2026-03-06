"use client";
import { apiHandler } from "@api/apiHandler";
import FetchDropdown from "@components/FetchDropdown";
import LabelField from "@components/LabelField";
import PageAction from "@components/PageAction";
import { selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty, showToast } from "src/utils/helper";

const Keywords = () => {
  const dispatch = useAppDispatch();
  const userData = useSelector(selectUser);
  const [keywords, setKeywords] = useState([]);
  const [error, setError] = useState("");

  const resetStates = () => {
    setError("");
  };

  async function loadData() {
    resetStates();
    try {
      const res = await apiHandler.keyword.get(userData?.user_id);
      if (res.status === 200 || res.status === 201) {
        setKeywords(res.data.data?.keywords || []);
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleAddItems = async () => {
    if (isEmpty(keywords)) {
      setError("Please add keywords");
      return;
    }
    if (keywords.length > 10) {
      setError("You can add maximum 10 keywords");
      return;
    }

    dispatch(setIsLoading(true));
    try {
      const res = await apiHandler.keyword.post({
        keywords,
        vendor_id: userData?.user_id,
      });

      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data?.message);
        loadData();
      } else {
        showToast("error", res?.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  const handleDropdownChangeCategories = (category: any, value: any) => {
    setError("");
    if (value?.length <= 10) {
      let categoriesArr = [];
      value.filter((v) => {
        let findIndex = categoriesArr.findIndex(
          (n) => n.toString() === v._id.toString(),
        );
        if (findIndex === -1) categoriesArr.push(v._id);
      });
      setKeywords(categoriesArr);
    } else {
      setError("You can select maximum 10 keywords");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="heading-40">Keywords</h3>
      <div className="rounded-md border bg-primary-100 p-3">
        <div className="flex flex-col p-2 sm:m-0 sm:p-6">
          <LabelField
            labelText="Add keyword (Select the top 10 Event Services that you provide)"
            required
          />
          <div className="flex flex-col gap-4">
            <div>
              <FetchDropdown
                placeholder="Select Keywords"
                value={keywords}
                multiple
                filterSelectedOptions
                endPoints={apiHandler.keyword.lookup}
                filterStr={`NA`}
                func={handleDropdownChangeCategories}
                display="event_type_name"
                className="max-h-52"
                required
              />
              {error ? <p className="error-text">{error}</p> : null}
            </div>
            <PageAction
              className="!mt-0 w-full"
              btnSecondaryLabel={"Update"}
              btnSecondaryClassName="!py-2 sm:!w-fit !w-full !px-6 sm:!px-16 !border-blue-100 !bg-blue-100 !text-primary-100 hover:!bg-primary-100 hover:!text-blue-100"
              btnSecondaryFun={handleAddItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Keywords;
