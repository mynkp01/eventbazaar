"use client";
import { apiHandler } from "@api/apiHandler";
import { DeleteIcon, DownloadIcon, EyeIcon } from "@assets/index";
import BrochureUpload from "@components/BrochureUpload";
import DeleteModal from "@components/DeleteModal";
import InfoBox from "@components/InfoBox";
import LabelField from "@components/LabelField";
import { selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { Tooltip } from "antd";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useDownloader from "react-use-downloader";
import { PLAN_RULE } from "src/utils/Constant";
import { convertMediaUrl, showToast } from "src/utils/helper";

const Brochure = () => {
  const dispatch = useAppDispatch();
  const userData = useSelector(selectUser);
  const docRef = useRef(null);
  const [array, setArray] = useState([]);
  const { download } = useDownloader();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const deleteDocument = async ({ item, index }) => {
    try {
      if (item?._id) {
        try {
          dispatch(setIsLoading(true));
          const res = await apiHandler.brochure.delete(item._id);

          if (res.status === 200 || res.status === 201) {
            showToast("success", res?.data.message);
            loadBrochures();
          } else {
            showToast("error", res?.data.message);
          }
        } catch (error) {
          showToast("error", error.response?.data?.message || error.message);
        }
        dispatch(setIsLoading(false));
      } else {
        setArray((prevFiles) => prevFiles.filter((_, i) => i !== index));
      }
    } catch (error) {}
    docRef.current = null;
    setOpenDeleteModal(false);
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    loadBrochures();
  }, []);

  const loadBrochures = async () => {
    const ruleValue = userData?.price_rule?.rules?.find(
      (i) => i?.rule_code === PLAN_RULE.BROCHURE,
    )?.value;

    if (ruleValue === null || array.length <= ruleValue) {
      try {
        dispatch(setIsLoading(true));
        const res = await apiHandler.brochure.get(userData?.user_id);

        if (res.status === 200 || res.status === 201) {
          setArray(res?.data?.data);
        } else {
          showToast("error", res?.data.message);
        }
      } catch (error) {
        showToast("error", error.response?.data?.message || error.message);
      }
      dispatch(setIsLoading(false));
    } else {
      showToast("error", "Please upgrade your plan for adding more brochure");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="heading-40">Brochure</h3>
      <div className="flex flex-col gap-6">
        <div className="rounded-lg bg-white p-3 sm:p-6">
          <InfoBox
            text={
              "Upload Your Company Brochure with Maximum Size of 250 MB in Pdf Format "
            }
          />
          <div className="flex items-center gap-3">
            <div className="h-6 w-2 rounded-md bg-orange-100 sm:h-8 sm:w-4"></div>
            <h4 className="text-15-600 text-primary-800">
              {"Upload Brochure here"}
            </h4>
          </div>
          <p className="text-14-600 my-6 text-primary-600">
            {
              "The brochure uploaded here will be reflected in your profile under the bio section."
            }
            <br />
            {"Supported Format: PDF"}
          </p>

          <BrochureUpload func={loadBrochures} />

          <div className="space-y-2 sm:space-y-6">
            <div className="mt-1 flex w-full flex-col gap-2 sm:mt-3">
              {array.length > 0 && (
                <div className="mt-6 overflow-x-auto">
                  <LabelField
                    labelText="Document Uploaded"
                    toolTipText="Document Uploaded"
                  />
                  <div className="max-h-[350px] w-full overflow-y-auto sm:w-3/4 md:max-h-[500px]">
                    <table
                      className="w-full table-auto text-[14px] text-black-100"
                      id="booking-table"
                    >
                      <tbody className="divide-netral-20 divide-y pt-4 text-sm">
                        {array?.map((item, index) => (
                          <tr key={index}>
                            <td className="whitespace-nowrap py-4">
                              <span className="text-14-600 w-full text-wrap text-primary-500">
                                {item?.doc_path
                                  ? item?.doc_path?.split("/")[
                                      item?.doc_path?.split("/")?.length - 1
                                    ]
                                  : "-"}
                              </span>
                            </td>
                            <td className="mt-4 flex items-center justify-end gap-1.5 whitespace-nowrap sm:mt-2.5">
                              <Tooltip title="View" placement="top">
                                {item?.doc_path ? (
                                  <Link
                                    href={convertMediaUrl(item?.doc_path)}
                                    target="_blank"
                                    className="!flex rounded-lg p-1 text-green-300 sm:p-2"
                                  >
                                    <button className="rounded-lg">
                                      <EyeIcon className="h-5 w-5" />
                                    </button>
                                  </Link>
                                ) : null}
                              </Tooltip>
                              <Tooltip title="Download" placement="top">
                                <button
                                  className="rounded-lg p-1 text-blue-300 sm:p-2"
                                  onClick={async () => {
                                    if (item.doc_path) {
                                      dispatch(setIsLoading(true));
                                      await download(
                                        convertMediaUrl(item.doc_path),
                                        item.doc_path.split("/")[
                                          item.doc_path.split("/").length - 1
                                        ],
                                      );
                                      dispatch(setIsLoading(false));
                                    }
                                  }}
                                >
                                  <DownloadIcon className="h-5 w-5" />
                                </button>
                              </Tooltip>
                              <Tooltip title="Delete" placement="top">
                                <button
                                  className="rounded-lg p-1 text-red-300 sm:p-2"
                                  onClick={() => {
                                    docRef.current = { item, index };
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
          </div>
          <DeleteModal
            open={openDeleteModal}
            setOpen={setOpenDeleteModal}
            func={() => deleteDocument(docRef.current)}
          />
        </div>
      </div>
    </div>
  );
};

export default Brochure;
