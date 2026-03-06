"use client";
import { EBLoader, NoImage } from "@assets/index";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Image } from "antd";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { isEmpty } from "src/utils/helper";

interface CustomImageInterface {
  src: string;
  alt?: string;
  preview?: boolean;
  className?: string;
  loading?: "lazy" | "eager";
  height?: number | string;
  width?: number | string;
  loaderClasses?: { container?: string; loader?: string };
}

const CustomImage = ({
  src,
  alt = "image",
  loading = "lazy",
  preview = false,
  className = "",
  height,
  width,
  loaderClasses,
}: CustomImageInterface) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const loadImage = useCallback(() => {
    setIsLoading(true);
    setHasError(false);

    const img = document.createElement("img");
    img.src = src;

    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
    };

    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };
  }, [src]);

  useEffect(() => {
    loadImage();
  }, [loadImage, retryCount]);

  const handleRetry = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setRetryCount((prev) => prev + 1);
  };

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setHasError(true);
      }
    }, 60000);

    return () => clearTimeout(timeout);
  }, [retryCount, isLoading]);

  if (isEmpty(src) || (retryCount > -1 && !isLoading && hasError)) {
    return (
      <div
        className={`flex min-w-full flex-col items-center justify-center bg-gray-300 text-gray-500 ${className}`}
        style={{ width: width || "100%", height: height || "100%" }}
      >
        <Image
          preview={false}
          src={NoImage.src}
          alt="No Image"
          height="100%"
          width="100%"
          loading="lazy"
          className="h-full w-full !object-contain"
        />
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <div
          className={`flex min-w-full flex-col items-center justify-center bg-gray-300 text-gray-500 ${className} ${loaderClasses?.container || ""}`}
          style={{ width: width || "100%", height: height || "100%" }}
        >
          <DotLottieReact
            data={EBLoader}
            loop
            autoplay
            className={`h-10 min-h-8 w-10 min-w-8 ${loaderClasses?.loader || ""}`}
          />
        </div>
      ) : hasError ? (
        <div
          className={`flex flex-col items-center justify-center bg-gray-300 text-gray-500 ${className} ${loaderClasses?.container || ""}`}
          style={{ width: width || "100%", height: height || "100%" }}
        >
          <button
            onClick={handleRetry}
            className={`flex flex-col items-center justify-center ${loaderClasses?.loader || ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M11.646 18a.5.5 0 0 1-.5.5C7.486 18.5 4.5 15.601 4.5 12s2.987-6.5 6.646-6.5c3.205 0 5.895 2.225 6.513 5.198l.91-1.54a.5.5 0 0 1 .861.508l-1.63 2.756a.5.5 0 0 1-.675.181l-2.823-1.59a.5.5 0 0 1 .491-.872l1.945 1.096c-.38-2.668-2.73-4.737-5.592-4.737C8.016 6.5 5.5 8.974 5.5 12s2.516 5.5 5.646 5.5a.5.5 0 0 1 .5.5"
              />
            </svg>
            <p>Retry</p>
          </button>
        </div>
      ) : (
        <Image
          preview={preview}
          src={src}
          loading={loading}
          height={height}
          width={width}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
          alt={alt}
          className={className}
        />
      )}
    </>
  );
};

export default CustomImage;
