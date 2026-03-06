import { PlusIcon } from "@assets/index";
import { useEffect, useRef, useState } from "react";
import { showToast } from "src/utils/helper";
import { theme } from "tailwind.config";

const DragAndDrop = ({
  onFilesSelected,
  accept,
  text,
  text2,
  multiple = false,
  id,
  ratio = "",
  className = "",
}: any) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e, selectedFiles) => {
    if (selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      for (let i = 0; i < newFiles.length; i++) {
        const element = newFiles[i];
        if (element.size > 1024 * 1024 * 5 && accept !== "video/*") {
          showToast("error", "File size can not exceed 5 MB");
          newFiles.splice(i, 1);
        }
        if (element.size > 1024 * 1024 * 250) {
          showToast("error", "File size can not exceed 250 MB");
          newFiles.splice(i, 1);
        }
        if (!element?.type.includes(accept.split("/")[0])) {
          newFiles.splice(i, 1);
          showToast(
            "error",
            `Supported format (${accept.split("/")[0].toUpperCase()})`,
          );
        }
      }

      if (newFiles.length > 0) {
        if (!multiple) {
          setFiles([newFiles[0]]);
        } else {
          setFiles(newFiles);
        }
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    files?.map((v) => {
      v.previewImg = URL.createObjectURL(v);
      return v;
    });
    onFilesSelected(files);
  }, [files]);

  return (
    <section
      className={`col-span-12 h-[20vh] cursor-pointer sm:col-span-6 sm:mt-0 md:h-[25vh] lg:h-[30vh] xl:col-span-4 xl:h-[25vh] 2xl:col-span-3 ${className}`}
    >
      <label htmlFor={id + "_id"} className="browse-btn">
        <div
          className="flex h-full w-full items-center justify-center rounded-md border-4 border-dashed border-primary-900 bg-primary-200 p-4"
          onDrop={(e) =>
            handleFileChange(
              e,
              e?.dataTransfer?.files ? e.dataTransfer.files : [],
            )
          }
          onDragOver={(e) => e.preventDefault()}
        >
          <div>
            <input
              type="file"
              hidden
              id={id + "_id"}
              onChange={(e) => {
                handleFileChange(e, e?.target?.files ? e.target.files : []);
              }}
              accept={accept}
              multiple={multiple}
              ref={fileInputRef}
            />
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                <PlusIcon color={theme.extend.colors["primary"][500]} />
                <p className="text-15-600 text-center text-primary-800">
                  {text}
                </p>
              </div>
              <p className="text-15-600 text-center text-primary-800">
                {text2}
              </p>
              {ratio ? (
                <p className="text-12-600 text-center text-primary-400">
                  {ratio}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </label>
    </section>
  );
};
export default DragAndDrop;
