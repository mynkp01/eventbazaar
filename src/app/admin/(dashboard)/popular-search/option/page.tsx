"use client";
import { apiHandler } from "@api/apiHandler";
import FetchDropdown from "@components/FetchDropdown";
import InputImage from "@components/InputImage";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PERMISSIONS } from "src/utils/Constant";
import { isEmpty, showToast } from "src/utils/helper";

const Page = () => {
  const dispatch = useAppDispatch();
  const permissions = useSelector(selectPermissions);
  const sidebar = useSelector(selectAdminSideBar);

  const router = useRouter();
  const searchParams = useSearchParams();
  const popularSearchId = searchParams.get("id");
  const isViewOnly = searchParams.get("view") === "1";

  const [pagePermissions, setPagePermissions] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    setPagePermissions(
      permissions?.find(
        (n) =>
          n?.module?.value_code ===
          sidebar?.find((v) => pathname.includes(v?.path))?.value_code,
      )?.permissions,
    );
  }, [permissions]);

  const [formData, setFormData] = useState({
    business_sub_category_id: null,
    doc_path: null,
    previewImg: "",
  });
  const [errors, setErrors] = useState(null);

  const fetchArtistDetails = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } =
        await apiHandler.popularSearch.get(popularSearchId);
      if (status === 200) {
        const popularSearch = data.data;
        setFormData((prevData) => ({
          ...prevData,
          business_sub_category_id: popularSearch.business_sub_category_id,
          doc_path: popularSearch.doc_path,
        }));
      } else {
        showToast("error", data?.message);
      }
    } catch (err) {
      showToast("error", err?.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };
  useEffect(() => {
    if (pagePermissions !== null) {
      if (
        !pagePermissions?.[PERMISSIONS.CREATE] ||
        !pagePermissions?.[PERMISSIONS.UPDATE]
      ) {
        // router.back();
        window.close();
      }
    }
  }, [permissions]);

  useEffect(() => {
    if (popularSearchId) {
      fetchArtistDetails();
    }
  }, [popularSearchId]);

  const validateFields = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "business_sub_category_id":
        if (isEmpty(value)) error = "Please select business sub categories";
        break;
      case "doc_path":
        if (isEmpty(value)) error = "Please select any image";
        break;
      default:
        break;
    }

    return { ...errors, [name]: error };
  };

  const handleFetchDropdownChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value ? value._id : "" }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleFiles = (e) => {
    const files = e.target.files;
    setFormData((prev) => ({
      ...prev,
      doc_path: files[0],
      previewImg: URL.createObjectURL(files[0]),
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      doc_path: "",
    }));
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, doc_path: "" }));
  };

  const handleSubmit = async () => {
    if (isViewOnly) return;

    let newErrors = {};
    let requiredFields = ["business_sub_category_id"];

    if (!isEmpty(formData?.doc_path)) {
      requiredFields.push("doc_path");
    }

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

    const fd = new FormData();
    fd.append("business_sub_category_id", formData.business_sub_category_id);
    fd.append("doc_path", formData.doc_path);

    try {
      dispatch(setIsLoading(true));
      const { data, status } = popularSearchId
        ? await apiHandler.popularSearch.patch(popularSearchId, fd)
        : await apiHandler.popularSearch.post(fd);
      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        // router.push(ROUTES.admin.popularSearch);
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

  return pagePermissions?.[PERMISSIONS.CREATE] ||
    pagePermissions?.[PERMISSIONS.UPDATE] ? (
    <div className="border-wh-300 flex flex-col items-center gap-4 rounded-2xl border bg-white">
      <div className="flex w-full flex-col gap-4 p-4 md:p-6">
        <h1 className="text-xl font-bold">
          {isViewOnly
            ? "View Popular Search"
            : popularSearchId
              ? "Edit Popular Search"
              : "Add Popular Search"}
        </h1>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <FetchDropdown
              label="Select Business Sub Category"
              placeholder="Select Category"
              value={formData?.business_sub_category_id}
              endPoints={apiHandler.businessSubCategory.lookup}
              filterStr="NA"
              multiple={false}
              labelClass="!mb-2"
              objKey="business_sub_category_id"
              display="business_sub_category_name"
              func={handleFetchDropdownChange}
              required
              isComponentDisabled={isViewOnly}
            />
            {errors?.business_sub_category_id ? (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors?.business_sub_category_id}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex-1">
          <InputImage
            labelText="Image"
            placeholderText="Upload Image"
            doc_path={formData.doc_path}
            previewImg={formData.previewImg}
            removeImage={removeImage}
            handleFiles={handleFiles}
            isViewOnly={isViewOnly}
          />
          {errors?.doc_path ? (
            <p className="error-text text-sm text-red-500">
              {errors?.doc_path}
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex flex-row gap-4">
          <button
            type="button"
            onClick={() => window.close()}
            className="text-15-700 btn-fill-hover h-fit w-fit rounded-xl border-2 border-blue-100 bg-blue-100 p-1.5 text-primary-100 sm:px-3 sm:py-2.5"
          >
            Cancel
          </button>
          {!isViewOnly ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="shadow-outer h-fit w-fit rounded-xl border border-blue-100 bg-primary-100 p-1.5 text-blue-100 sm:px-3 sm:py-2.5"
            >
              {popularSearchId ? "Update" : "Save"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  ) : null;
};

export default Page;
