"use client";
import { apiHandler } from "@api/apiHandler";
import { UploadSimpleIcon } from "@assets/index";
import { selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { showToast } from "src/utils/helper";

const BrochureUpload = ({ func }) => {
  const userData = useSelector(selectUser);
  const dispatch = useAppDispatch();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const selectFile = (e) => {
    e.preventDefault();
    setError(null);
    if (e.target.files[0]) {
      if (!e.target.files[0].type.includes("pdf")) {
        showToast("error", "Supported format (PDF)");
        return;
      }
      if (e.target.files[0].size <= 1024 * 1024 * 250) {
        setFile(e.target.files[0]);
      } else {
        showToast("error", "File size can not exceed 250 MB");
      }
    }
  };

  const uploadBrochures = async () => {
    try {
      if (!file?.name) {
        setError("Please select a file");
        return;
      }

      setError(null);
      dispatch(setIsLoading(true));
      const formData = new FormData();
      formData.append("data", JSON.stringify({ vendor_id: userData.user_id }));

      formData.append(file.name, file);

      const res = await apiHandler.brochure.post(formData);

      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data.message);
        setFile(null);
        func();
      } else {
        showToast("error", res?.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  return (
    <>
      <div className="mt-1 flex w-full flex-col gap-2 sm:mt-3">
        <div className="grid w-full gap-2 sm:grid-cols-12 sm:gap-4">
          <div className="relative col-span-3 !w-full gap-3 sm:col-span-5 sm:mt-2">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="document-upload"
                className="text-14-600 mb-1 text-primary-600"
              >
                Select File
              </label>
              <div
                className={`flex w-full gap-2.5 rounded-xl bg-primary-200 p-2.5 text-[14px] font-semibold text-primary-500 placeholder:text-[14px] placeholder:font-medium placeholder:leading-[24px] sm:p-4`}
              >
                <input
                  className="w-full bg-inherit placeholder:text-[14px]"
                  placeholder="Select File"
                  value={file?.name || ""}
                  readOnly
                />
                <UploadSimpleIcon className="h-4 w-4" />
              </div>
              <div>
                <input
                  type="file"
                  name="file"
                  className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                  accept=".pdf"
                  onChange={selectFile}
                  title={file?.name || ""}
                />
              </div>
              {error ? <p className="error-text">{error}</p> : null}
            </div>
          </div>
          <div className="col-span-2 sm:mt-3.5">
            <button
              className="text-15-700 h-fit rounded-xl border-2 border-blue-100 bg-blue-100 p-2 text-primary-100 transition-all duration-300 hover:!bg-primary-100 hover:!text-blue-100 sm:mt-7 sm:px-8 sm:py-3"
              onClick={uploadBrochures}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(BrochureUpload);
