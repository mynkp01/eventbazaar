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

interface FormData {
  full_name: string;
  doc_path: string | File;
  previewImg: string;
}

interface FormErrors {
  full_name?: string;
  doc_path?: string;
}

const Page = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();
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

  const searchParams = useSearchParams();
  const artistId = searchParams.get("id");
  const isViewOnly = searchParams.get("view") === "1";

  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    doc_path: "",
    previewImg: "",
  });

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
  }, [pagePermissions]);

  useEffect(() => {
    if (artistId) {
      fetchArtistDetails();
    }
  }, [artistId]);

  const fetchArtistDetails = async () => {
    try {
      dispatch(setIsLoading(true));
      const { data, status } = await apiHandler.artist.get(artistId);
      if (status === 200) {
        const { full_name, doc_path, previewImg = "" } = data.data;
        setFormData({
          full_name,
          doc_path,
          previewImg,
        });
      } else {
        showToast("error", data?.message || "Error fetching artist details");
      }
    } catch (err: any) {
      showToast("error", err?.message || "Something went wrong");
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const validateFields = (name: string, value: any): string => {
    switch (name) {
      case "full_name":
        if (!/^[a-zA-Z0-9\s]+$/.test(value.trim())) {
          return "Please enter only letters and numbers";
        }
        break;
      case "doc_path":
        if (!value) {
          return "Please select an image";
        }
        break;
    }
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateFields(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        doc_path: file,
        previewImg: URL.createObjectURL(file),
      }));

      const error = validateFields("doc_path", file);
      if (error) {
        setErrors((prev) => ({ ...prev, doc_path: error }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.doc_path;
          return newErrors;
        });
      }
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, doc_path: "", previewImg: "" }));
    setErrors((prev) => ({ ...prev, doc_path: "Please select an image" }));
  };

  const handleSubmit = async () => {
    if (isViewOnly) return;

    const newErrors: FormErrors = {};
    const requiredFields = ["full_name", "doc_path"] as const;

    requiredFields.forEach((field) => {
      const error = validateFields(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const fd = new FormData();

    fd.append("full_name", formData.full_name);
    fd.append("doc_path", formData.doc_path);

    try {
      dispatch(setIsLoading(true));
      const { data, status } = artistId
        ? await apiHandler.artist.patch(artistId, fd)
        : await apiHandler.artist.post(fd);

      if (status === 200 || status === 201) {
        showToast("success", data?.message || "Operation successful");
        // router.push(ROUTES.admin.artist);
        window.close();
      } else {
        showToast("error", data?.message || "Operation failed");
      }
    } catch (err: any) {
      showToast("error", err?.message || "Something went wrong");
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return pagePermissions?.[PERMISSIONS.CREATE] ||
    pagePermissions?.[PERMISSIONS.UPDATE] ? (
    <div className="border-wh-300 flex flex-col items-center gap-4 rounded-2xl border bg-white">
      <div className="flex w-full flex-col gap-4 p-4 md:p-6">
        <h1 className="text-xl font-bold">
          {isViewOnly ? "View Artist" : "Edit Artist"}
        </h1>
        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <CustomInput
              label="Artist Name"
              name="full_name"
              placeholder="Enter artist name"
              value={formData.full_name}
              onChange={handleInputChange}
              disabled={isViewOnly}
              required
            />
            {errors.full_name && (
              <p className="error-text mt-1 text-sm text-red-500">
                {errors.full_name}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-[10px] md:flex-row">
          <div className="flex-1">
            <InputImage
              required
              labelText="Image"
              placeholderText="Upload Image"
              doc_path={formData.doc_path}
              previewImg={formData.previewImg}
              removeImage={removeImage}
              handleFiles={handleFiles}
              isViewOnly={isViewOnly}
            />
          </div>
        </div>
        {errors.doc_path && (
          <p className="error-text mt-1 text-sm text-red-500">
            {errors.doc_path}
          </p>
        )}
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
              {artistId ? "Update" : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Page;
