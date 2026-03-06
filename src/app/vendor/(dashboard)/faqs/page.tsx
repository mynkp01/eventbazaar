"use client";
import { apiHandler } from "@api/apiHandler";
import { DeleteIcon, EditIcon } from "@assets/index";
import CustomInput from "@components/CustomInput";
import DeleteModal from "@components/DeleteModal";
import InfiniteScrollWrapper from "@components/InfiniteScrollWrapper";
import LabelField from "@components/LabelField";
import PageAction from "@components/PageAction";
import { Tooltip } from "@mui/material";
import { selectUser } from "@redux/slices/authSlice";
import { selectLimit, setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import parse from "html-react-parser";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { showToast } from "src/utils/helper";
import PaymentPolicies from "../payment-policies/page";

const CKEditorComp = dynamic(() => import("@components/CKEditorComp"), {
  ssr: false,
});

const FAQs = () => {
  const dispatch = useAppDispatch();
  const topRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const limit = useSelector(selectLimit);
  const userData = useSelector(selectUser);
  const latestRef = useRef(0);
  const [faq, setFaq] = useState({ question: "", answer: "" });

  const loadData = async (currentPage) => {
    const requestId = ++latestRef.current;
    try {
      const res = await apiHandler.faq.list(
        `page=${currentPage}&vendor_id=${userData?.user_id}`,
      );
      if (requestId === latestRef.current) {
        if (res.status === 200 || res.status === 201) {
          setItems(
            currentPage === 1
              ? res.data.data.records
              : [...items, ...res.data.data.records],
          );
          setHasMore(res.data.data.records.length >= limit);
        } else {
          showToast("error", res?.data?.message);
        }
      }
    } catch (error) {
      if (requestId === latestRef.current) {
        setHasMore(false);
        showToast("error", error?.response?.data?.message || error.message);
      }
    }
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    mainFunc();
  }, []);

  async function mainFunc() {
    setItems([]);
    setHasMore(true);
    setPage(1);
    loadData(1);
  }

  async function callNext() {
    const currentPage = page + 1;
    setPage(currentPage);
    loadData(currentPage);
  }

  const validateFields = (label: string, value: string) => {
    let error = "";
    if (label === "question" && !value.trim()) {
      error = "Please enter a question";
    } else if (label === "answer" && !value.trim()) {
      error = "Please provide an answer";
    }
    const updatedErrors = { ...errors, [label]: error };
    setErrors(updatedErrors);
    return updatedErrors;
  };

  const handleInputChange = (field: string, value: string) => {
    setFaq((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const createOrUpdateFAQ = async () => {
    try {
      let newErrors = {};
      const requiredFields = ["question", "answer"];

      requiredFields.forEach((field) => {
        const err = validateFields(field, faq[field] || "");
        if (err[field]) {
          newErrors[field] = err[field];
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      dispatch(setIsLoading(true));
      const res = faqRef.current
        ? await apiHandler.faq.patch(faq?._id, faq)
        : await apiHandler.faq.post({ ...faq, vendor_id: userData?.user_id });

      if (res.status === 200 || res.status === 201) {
        setFaq({ question: "", answer: "" });
        showToast("success", res?.data?.message);
        mainFunc();
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    }
    faqRef.current = null;
    dispatch(setIsLoading(false));
  };

  const handleDelete = async (id) => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.faq.delete(id);
      if (res.status === 200 || res.status === 201) {
        showToast("success", res?.data?.message);
      } else {
        showToast("error", res?.data?.message);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    }
    dispatch(setIsLoading(false));
    setOpenDeleteModal(false);
    faqRef.current = null;
    mainFunc();
  };

  return (
    <div className="flex flex-col gap-4">
      <style>
        {`
          .ck-editor__editable {
            height: 200px !important;
          }
        `}
      </style>
      <PaymentPolicies />
      <div className="flex flex-col gap-4">
        <h3 className="heading-40">Frequently Asked Questions</h3>
        <div className="rounded-xl bg-primary-100">
          <div className="flex w-full flex-col gap-4 p-4 sm:p-6">
            <div className="rounded-md bg-primary-100">
              <CustomInput
                toolTipText="Question"
                label="Question"
                value={faq.question}
                onChange={(e) => handleInputChange("question", e.target.value)}
              />
              {errors.question && (
                <p className="error-text">{errors.question}</p>
              )}
            </div>
            <div>
              <LabelField labelText="Answer" toolTipText="FAQ Answer" />
              <div>
                <CKEditorComp
                  value={faq.answer}
                  onChange={(data) => {
                    handleInputChange("answer", data);
                  }}
                />
              </div>
              {errors.answer && <p className="error-text">{errors.answer}</p>}
            </div>
            <div className="!mb-2 flex gap-5 sm:!mb-0">
              <PageAction
                className="!mt-2 w-full sm:!mt-8 sm:py-0"
                btnSecondaryLabel={`${faqRef.current ? "Update" : "Add"}`}
                btnSecondaryClassName="!py-2 sm:!w-fit !w-full !px-6 sm:!px-16 !border-blue-100 !bg-blue-100 !text-primary-100 hover:!bg-primary-100 hover:!text-blue-100"
                btnPrimaryFun={() => setFaq({ question: "", answer: "" })}
                btnSecondaryFun={createOrUpdateFAQ}
              />
            </div>
          </div>
        </div>

        {items.length > 0 && (
          <div className="flex flex-col gap-4 overflow-hidden">
            {/* <h3 className="heading-40">Frequently Asked Questions</h3> */}
            <div
              className="max-h-52 min-h-20 overflow-y-auto rounded-lg sm:max-h-[calc(100vh-450px)]"
              id="scrollable_faq"
            >
              <InfiniteScrollWrapper
                hasMore={hasMore}
                dataLength={items.length}
                callNext={callNext}
                parentDivId="scrollable_faq"
              >
                <div className="flex w-full flex-col">
                  <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2`}>
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className={`flex flex-col gap-2 rounded-lg bg-primary-100 p-4 shadow-sm last:pb-0 sm:px-6 sm:py-4`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-15-600 font-semibold text-primary-800">
                            Q. {item.question}
                          </h3>
                          <div className="flex gap-2">
                            <Tooltip title="Edit" placement="top">
                              <button
                                className="z-10 rounded-lg text-blue-300"
                                onClick={() => {
                                  faqRef.current = item._id;
                                  setFaq(item);
                                  topRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                  });
                                }}
                              >
                                <EditIcon className="h-4 w-4" />
                              </button>
                            </Tooltip>
                            <Tooltip title="Delete" placement="top">
                              <button
                                className="z-10 rounded-lg text-red-300"
                                onClick={() => {
                                  faqRef.current = item._id;
                                  setOpenDeleteModal(true);
                                }}
                              >
                                <DeleteIcon className="h-5 w-5" />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                        <div className="h-[1px] bg-primary-50" />
                        <div className="text-15-500 text-primary-500">
                          {parse(item.answer)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </InfiniteScrollWrapper>
            </div>
          </div>
        )}

        <DeleteModal
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          func={() => handleDelete(faqRef.current)}
        />
      </div>
    </div>
  );
};

export default FAQs;
