"use client";
import { apiHandler } from "@api/apiHandler";
import LabelField from "@components/LabelField";
import PageAction from "@components/PageAction";
import { selectUser } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { showToast } from "src/utils/helper";

const CKEditorComp = dynamic(() => import("@components/CKEditorComp"), {
  ssr: false,
});

const AboutUs = () => {
  const [aboutUsContent, setAboutUsContent] = useState("");
  const [bio, setBio] = useState("");
  const dispatch = useAppDispatch();
  const userData = useSelector(selectUser);

  async function loadData() {
    try {
      const res = await apiHandler.aboutUs.get(userData?.user_id);
      if (res.status === 200 || res.status === 201) {
        setAboutUsContent(
          res.data.data?.about_us ? res.data.data.about_us : "",
        );
        setBio(res.data.data?.bio ? res.data.data.bio : "");
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

  const createAboutUs = async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await apiHandler.aboutUs.post({
        about_us: aboutUsContent,
        vendor_id: userData?.user_id,
        bio: bio,
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

  return (
    <div className="flex flex-col gap-4">
      <style>
        {`
          .ck-editor__editable {
            height: 200px !important;
          }
        `}
      </style>
      <h3 className="heading-40">About Us</h3>
      <div className="rounded-xl bg-primary-100">
        <div className="flex flex-col space-y-6 p-2 sm:m-0 sm:p-12">
          <LabelField labelText="Small Bio" toolTipText="Small Bio" />
          <CKEditorComp
            value={bio}
            onChange={(data) => {
              setBio(data);
            }}
            maxChars={500}
          />
          <LabelField
            labelText="Describe your business (Max 2000 characters)"
            toolTipText="Describe your business"
          />
          <CKEditorComp
            value={aboutUsContent}
            onChange={(data) => {
              setAboutUsContent(data);
            }}
            maxChars={2000}
          />
          <div className="!mb-2 flex gap-5 sm:!mb-0">
            <PageAction
              className="!mt-2 w-full sm:!mt-8 sm:py-0"
              btnSecondaryLabel="Submit"
              btnSecondaryClassName="!py-2 sm:!w-fit !w-full !px-6 sm:!px-16 !border-blue-100 !bg-blue-100 !text-primary-100 hover:!bg-primary-100 hover:!text-blue-100"
              btnSecondaryFun={createAboutUs}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
