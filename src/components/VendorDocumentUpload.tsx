"use client";
import { apiHandler } from "@api/apiHandler";
import {
  DeleteIcon,
  DownloadIcon,
  EyeIcon,
  UploadSimpleIcon,
} from "@assets/index";
import { Tooltip } from "@mui/material";
import { selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useDownloader from "react-use-downloader";
import { LOOKUP_VALUES } from "src/utils/Constant";
import { convertMediaUrl, showToast } from "src/utils/helper";
import LabelField from "./LabelField";
import { setDeep } from "./SetDeep";
const DeleteModal = dynamic(() => import("@components/DeleteModal"), {
  ssr: true,
});
const FetchDropdown = dynamic(() => import("@components/FetchDropdown"), {
  ssr: true,
});

const VendorDocumentUplaod = () => {
  const userData = useSelector(selectUser);
  const dispatch = useAppDispatch();
  const { download } = useDownloader();
  const vendorDocRef = useRef(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [array, setArray] = useState([]);
  const [disabledOptions, setDisabledOptions] = useState([]);
  const [obj, setObj] = useState({ doc_type: "", doc_type_id: "", file: "" });
  const [errors, setErrors] = useState({});

  const validateFields = (label: string, value: string) => {
    let error = "";

    switch (label) {
      case "file":
        if (!value) error = "Please select file";
        break;
      case "doc_type_id":
        if (!value) error = "Please select document type";
        break;
      default:
        break;
    }

    const errObj = { ...errors, [label]: error };
    setErrors(errObj);
    return errObj;
  };

  const fetchVendorDocuments = async () => {
    try {
      setObj({ doc_type_id: "", file: "", doc_type: "" });

      dispatch(setIsLoading(true));
      const res = await apiHandler.vendorDoc.vendorDocumentList(
        userData?.user_id,
      );
      if (res.status === 200 || res.status === 201) {
        let arr = [...res.data.data];
        let disabled = arr.map((v) => v.doc_type_id);
        setArray(res.data.data);
        setDisabledOptions(disabled);
      } else {
        showToast("error", res?.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    fetchVendorDocuments();
  }, []);

  const handeDropdownChange = (category, value) => {
    setObj({ ...obj, doc_type: value, doc_type_id: value._id });
    setErrors((prevState) => {
      const newState = { ...prevState };
      setDeep(newState, "doc_type_id", "");
      return newState;
    });
  };

  const updaloadDocument = async () => {
    try {
      let newErrors = {},
        requiredFields = ["file", "doc_type_id"];

      requiredFields.forEach((field) => {
        const err = validateFields(field, obj[field]);
        if (err[field]) {
          newErrors[field] = err[field];
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      dispatch(setIsLoading(true));
      try {
        const formData = new FormData();
        formData.append(obj.doc_type?.value_code, obj.file);

        const res = await apiHandler.vendorDoc.vendorDocument(formData);

        if (res.status === 200 || res.status === 201) {
          showToast("success", res?.data.message);
          fetchVendorDocuments();
        } else {
          showToast("error", res?.data.message);
        }
      } catch (error) {
        showToast("error", error.response?.data?.message || error.message);
      }
      dispatch(setIsLoading(false));
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
  };

  const deleteDocument = async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.vendorDoc.vendorDocumentDelete(
        vendorDocRef?.current?._id,
      );

      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data.message);
        setOpenDeleteModal(false);
        fetchVendorDocuments();
      } else {
        showToast("error", res?.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
  };

  const selectFile = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      if (
        !e.target.files[0].type.includes("image") &&
        !e.target.files[0].type.includes("pdf")
      ) {
        showToast("error", `Supported format (IMAGE or PDF)`);
        return;
      }

      if (e.target.files[0].size <= 1024 * 1024 * 5) {
        setObj({ ...obj, file: e.target.files[0] });
        setErrors((prevState) => {
          const newState = { ...prevState };
          setDeep(newState, "file", "");
          return newState;
        });
      } else {
        showToast("error", "File size can not exceed 5 MB");
      }
    }
  };

  return (
    <>
      <div className="mt-1 flex w-full flex-col gap-2 sm:mt-3">
        <div className="grid w-full gap-2 sm:grid-cols-12 sm:gap-4">
          <div className="col-span-3 gap-1.5 sm:col-span-5">
            <FetchDropdown
              value={obj.doc_type_id}
              endPoints={apiHandler.values.lookup}
              disabledOptions={disabledOptions}
              filterStr={`value=${LOOKUP_VALUES.VENDOR_DOC}`}
              func={handeDropdownChange}
              label="Document Type"
              placeholder="Select Document Type"
              display="name"
            />
            {errors.doc_type_id ? (
              <p className="error-text">{errors.doc_type_id}</p>
            ) : null}
          </div>
          <div className="relative col-span-3 !w-full gap-3 sm:col-span-5 sm:mt-2">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="document-upload"
                className="text-14-600 text-primary-600"
              >
                Select File
              </label>
              <div
                className={`flex w-full gap-2.5 rounded-xl bg-primary-200 p-2.5 text-[14px] font-semibold text-primary-500 placeholder:text-[14px] placeholder:font-medium placeholder:leading-[24px] sm:p-4`}
              >
                <input
                  disabled={!obj.doc_type_id}
                  className="w-full bg-inherit placeholder:text-[14px]"
                  placeholder="Select File"
                  value={obj.file?.name || ""}
                />
                <UploadSimpleIcon className="h-4 w-4" />
              </div>
              <div>
                <input
                  type="file"
                  name="file"
                  disabled={!obj.doc_type_id}
                  className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                  accept="image/*, .pdf"
                  onChange={selectFile}
                />
                {errors.file ? (
                  <p className="error-text">{errors.file}</p>
                ) : null}
              </div>
            </div>
          </div>
          <div className="col-span-2 sm:mt-2.5">
            <button
              className="text-15-700 h-fit w-full rounded-xl border-2 border-blue-100 bg-blue-100 p-2 text-primary-100 sm:mt-7 sm:px-7 sm:py-3"
              onClick={updaloadDocument}
            >
              <div className="flex items-center justify-center gap-2">
                Upload
              </div>
            </button>
          </div>
        </div>
        {array.length > 0 && (
          <div className="overflow-x-auto">
            <LabelField
              labelText="Document Uploaded"
              toolTipText="Document Uploaded"
            />
            <div className="max-h-[350px] w-full overflow-y-auto md:max-h-[500px]">
              <table
                className="w-full table-auto text-[14px] text-black-100"
                id="booking-table"
              >
                <tbody className="divide-netral-20 divide-y pt-4 text-sm">
                  {array?.map((item) => (
                    <tr key={item._id}>
                      <td className="whitespace-nowrap py-4">
                        <span className="text-14-600 w-full text-wrap text-primary-500">
                          {item?.doc_type?.name}
                        </span>
                      </td>
                      <td className="mt-4 flex items-center justify-end gap-1.5 whitespace-nowrap sm:mt-2.5">
                        <Tooltip title="View" placement="top">
                          <Link
                            href={convertMediaUrl(item?.doc_path)}
                            target="_blank"
                            className="!flex rounded-lg p-1 text-green-300 sm:p-2"
                          >
                            <button className="rounded-lg">
                              <EyeIcon className="h-5 w-5" />
                            </button>
                          </Link>
                        </Tooltip>
                        <Tooltip title="Download" placement="top">
                          <button
                            className="rounded-lg p-1 text-blue-300 sm:p-2"
                            onClick={async () => {
                              dispatch(setIsLoading(true));
                              await download(
                                convertMediaUrl(item?.doc_path),
                                item?.doc_path?.split("/")[
                                  item?.doc_path?.split("/")?.length - 1
                                ],
                              );
                              dispatch(setIsLoading(false));
                            }}
                          >
                            <DownloadIcon className="h-5 w-5" />
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete" placement="top">
                          <button
                            className="rounded-lg p-1 text-red-300 sm:p-2"
                            onClick={() => {
                              vendorDocRef.current = item;
                              setOpenDeleteModal(true);
                            }}
                          >
                            <DeleteIcon className="h-5 w-5" />
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        func={deleteDocument}
      />
    </>
  );
};

export default React.memo(VendorDocumentUplaod);
