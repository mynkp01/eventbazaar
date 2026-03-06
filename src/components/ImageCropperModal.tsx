import { Modal } from "@mui/material";
import "cropperjs/dist/cropper.css";
import { useState } from "react";
import { Cropper } from "react-cropper";

const ImageCropperModal = ({
  cropModal,
  setCropModal,
  cropImage,
  onCropComplete,
  ratio,
}) => {
  const [cropper, setCropper] = useState(null);

  const handleCrop = () => {
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      croppedCanvas.toBlob((blob) => {
        const croppedFile = new File([blob], "cropped-image.png", {
          type: "image/png",
        });
        onCropComplete(croppedFile);
        setCropModal(false);
      }, "image/png");
    }
  };
  return (
    <Modal
      open={cropModal}
      onClose={() => setCropModal(false)}
      className="flex h-full w-full items-center justify-center p-4 sm:p-6"
    >
      <div className="relative z-50 flex h-[90vh] w-[95%] max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-lg sm:h-[85vh] md:w-[90%] lg:h-[80vh]">
        <div className="flex h-full w-full flex-col p-4">
          <div className="flex-1 overflow-hidden">
            <Cropper
              src={cropImage}
              style={{ height: "100%", width: "100%" }}
              initialAspectRatio={ratio?.initialAspectRatio || 1}
              aspectRatio={ratio?.aspectRatio || 1.77777778}
              guides={true}
              // crop={(e) => console.log(e.detail)}
              onInitialized={(instance) => setCropper(instance)}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setCropModal(false)}
              className="mr-2 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleCrop}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Crop Image
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ImageCropperModal;
