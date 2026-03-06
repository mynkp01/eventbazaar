"use client";
import { apiHandler } from "@api/apiHandler";
import CustomInput from "@components/CustomInput";
import InputImage from "@components/InputImage";
import { selectAdminSideBar, selectPermissions } from "@redux/slices/authSlice";
import { setIsLoading } from "@redux/slices/utilSlice";
import { useAppDispatch } from "@redux/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PERMISSIONS } from "src/utils/Constant";
import { showToast } from "src/utils/helper";

const Page = () => {
  const router = useRouter();
  // const permission = checkCurrentSelectedTabPermission();
  const searchParams = useSearchParams();
  const cityId = searchParams.get("id");
  const isViewOnly = searchParams.get("view") === "1";
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pagePermissions, setPagePermissions] = useState(null);
  const permissions = useSelector(selectPermissions);
  const pathname = usePathname();
  const sidebar = useSelector(selectAdminSideBar);
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
    name: "",
    description: "",
    display: true,
    vertical_path: "",
    vector_path: "",
    horizontal_path: "",
    previewVerticalImg: "",
    previewVectorImg: "",
    previewHorizontalImg: "",
    metaDescription: "",
    metaTitle: "",
  });

  const fetchCityDetails = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.city.get(cityId);
      if (status === 200) {
        const city = data.data;
        setFormData({
          name: city.name || "",
          description: city.description || "",
          display: city.display || false,
          vertical_path: city.vertical_path || "",
          vector_path: city.vector_path || "",
          horizontal_path: city.horizontal_path || "",
          previewVerticalImg: city.previewVerticalImg || "",
          previewVectorImg: city.previewVectorImg || "",
          previewHorizontalImg: city.previewHorizontalImg || "",
          metaDescription: city.metaDescription || "",
          metaTitle: city.metaTitle || "",
        });
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
    if (cityId) {
      fetchCityDetails();
    }
  }, [cityId]);

  const validateFields = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Please enter city name";
        } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error = "Please enter only letters and numbers in city name";
        }
        break;
      case "description":
        if (!value.trim()) {
          error = "Please enter description";
        }
        break;
      default:
        break;
    }

    const errObj = { ...errors, [name]: error };
    setErrors(errObj);
    return errObj;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const newErrors = validateFields(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: newErrors[name],
    }));
  };

  // const handleStatusToggle = () => {
  //   setFormData((prev) => ({ ...prev, display: !prev.display }));
  // };

  const handleFiles = (e, field, previewField) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [field]: files[0],
        [previewField]: URL.createObjectURL(files[0]),
      }));
    }
  };

  const removeImage = (field, previewField) => {
    setFormData((prev) => ({ ...prev, [field]: "", [previewField]: "" }));
  };

  const handleSubmit = async () => {
    if (isViewOnly) return;

    let newErrors = {};
    const requiredFields = ["name", "description"];

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
    fd.append("name", formData.name);
    fd.append("description", formData.description);
    if (formData.vertical_path) {
      fd.append("vertical_path", formData.vertical_path);
    }
    if (formData.vector_path) {
      fd.append("vector_path", formData.vector_path);
    }
    if (formData.horizontal_path) {
      fd.append("horizontal_path", formData.horizontal_path);
    }
    fd.append("metaTitle", formData.metaTitle);
    fd.append("metaDescription", formData.metaDescription);

    try {
      dispatch(setIsLoading(true));
      const { data, status } = cityId
        ? await apiHandler.city.put(cityId, fd)
        : await apiHandler.city.post(fd);
      if (status === 200 || status === 201) {
        showToast("success", data?.message);
        // router.push(ROUTES.admin.city);
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
          {cityId ? (isViewOnly ? "View City" : "Edit City") : "Add New City"}
        </h1>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <CustomInput
              label="City Name"
              name="name"
              placeholder="Enter city name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required
            />
            {errors.name && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.name}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <CustomInput
              label="Description"
              name="description"
              placeholder="Enter Description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isViewOnly}
              isTextArea
              required
            />
            {errors.description && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex-1">
          <CustomInput
            label="Meta Title"
            name="metaTitle"
            placeholder="Enter meta title"
            value={formData.metaTitle}
            onChange={handleInputChange}
            disabled={isViewOnly}
          />
        </div>
        <div className="flex-1">
          <CustomInput
            label="Meta Description"
            name="metaDescription"
            isTextArea
            placeholder="Enter meta description"
            value={formData.metaDescription}
            onChange={handleInputChange}
            disabled={isViewOnly}
          />
        </div>

        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <InputImage
              labelText="Vector"
              placeholderText="Upload Vector"
              doc_path={formData.vector_path}
              previewImg={formData.previewVectorImg}
              removeImage={() => removeImage("vector_path", "previewVectorImg")}
              handleFiles={(e) =>
                handleFiles(e, "vector_path", "previewVectorImg")
              }
              isViewOnly={isViewOnly}
            />
          </div>
          <div className="flex-1">
            <InputImage
              labelText="Portrait Image"
              placeholderText="Upload Portrait Image"
              doc_path={formData.vertical_path}
              previewImg={formData.previewVerticalImg}
              removeImage={() =>
                removeImage("vertical_path", "previewVerticalImg")
              }
              handleFiles={(e) =>
                handleFiles(e, "vertical_path", "previewVerticalImg")
              }
              isViewOnly={isViewOnly}
            />
          </div>
          <div className="flex-1">
            <InputImage
              labelText="Landscape Image"
              placeholderText="Upload Landscape Image"
              doc_path={formData.horizontal_path}
              previewImg={formData.previewHorizontalImg}
              removeImage={() =>
                removeImage("horizontal_path", "previewHorizontalImg")
              }
              handleFiles={(e) =>
                handleFiles(e, "horizontal_path", "previewHorizontalImg")
              }
              isViewOnly={isViewOnly}
            />
          </div>
        </div>
        {/* <div className="flex flex-row gap-4">
          <div className="flex-1">
            <div className="switch-wrapper">
              <LabelField labelText="Display" />
              <Switch
                id="display"
                checked={formData.display}
                onChange={handleStatusToggle}
                disabled={isViewOnly}
              />
            </div>
          </div>
        </div> */}
        <div className="mt-4 flex flex-row gap-4">
          <button
            type="button"
            onClick={() => window.close()}
            className="text-15-700 btn-fill-hover h-fit w-fit rounded-xl border-2 border-blue-100 bg-blue-100 p-1.5 text-primary-100 sm:px-3 sm:py-2.5"
          >
            Cancel
          </button>
          {!isViewOnly && (
            <button
              type="button"
              onClick={handleSubmit}
              className="shadow-outer h-fit w-fit rounded-xl border border-blue-100 bg-primary-100 p-1.5 text-blue-100 sm:px-3 sm:py-2.5"
            >
              {cityId ? "Update" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Page;
