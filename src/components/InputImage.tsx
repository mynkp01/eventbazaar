import { CloseLight } from "@assets/index";
import { useCallback, useState } from "react";
import { convertMediaUrl, isEmpty } from "src/utils/helper";
import CustomImage from "./CustomImage";
import LabelField from "./LabelField";

const InputImage = ({
  doc_path,
  previewImg,
  removeImage,
  handleFiles,
  isViewOnly,
  labelText,
  required = false,
  placeholderText = "",
}) => {
  const [imageKey, setImageKey] = useState(Date.now());

  const getImageUrl = useCallback(() => {
    if (!isEmpty(previewImg)) return previewImg;
    if (isEmpty(doc_path)) return "";

    const baseUrl = convertMediaUrl(doc_path);

    return `${baseUrl}?v=${imageKey}`;
  }, [doc_path, previewImg, imageKey]);

  const onImageChange = (e) => {
    setImageKey(Date.now());
    handleFiles(e);
  };

  return (
    <div className="flex flex-1 flex-col gap-2">
      <LabelField labelText={labelText} required={required} />

      {doc_path ? (
        <div className="relative h-fit w-fit">
          <CustomImage
            src={getImageUrl()}
            height={"200px"}
            width={"200px"}
            className="!rounded-xl !object-cover"
            key={imageKey}
          />
          {isViewOnly ? null : (
            <button
              onClick={removeImage}
              className="absolute right-1 top-1 z-10 cursor-pointer rounded-lg bg-primary-100 p-1.5"
            >
              <CloseLight />
            </button>
          )}
        </div>
      ) : (
        <>
          <label className="flex h-[200px] max-w-52 cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl bg-primary-200 text-[14px] font-semibold text-primary-800 outline-none">
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm md:text-base">{placeholderText}</p>
            </div>
            {!isViewOnly ? (
              <div className="text-xs text-gray-500 md:text-sm">
                <span className="text-blue-500">Click To Browse</span>
              </div>
            ) : null}
            <input
              type="file"
              name="doc_path"
              className="hidden"
              accept="image/*"
              onChange={onImageChange}
              disabled={isViewOnly}
            />
          </label>
        </>
      )}
    </div>
  );
};

export default InputImage;
