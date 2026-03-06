"use client";
import { EBLoader, NoImage } from "@assets/index";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Image } from "antd";
import {
  DetailedHTMLProps,
  forwardRef,
  MouseEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
  VideoHTMLAttributes,
} from "react";
import { isEmpty } from "src/utils/helper";

interface CustomVideoInterface
  extends DetailedHTMLProps<
    VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  > {
  loaderClasses?: { container?: string; loader?: string };
}

const CustomVideo = forwardRef(
  (
    { loaderClasses, ...props }: CustomVideoInterface,
    ref: MutableRefObject<HTMLVideoElement>,
  ) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
    };

    const loadVideo = useCallback(() => {
      setIsLoading(true);
      setHasError(false);

      const video = document.createElement("video");
      video.src = props.src;

      video.addEventListener("loadeddata", () => {
        setIsLoading(false);
        setHasError(false);
      });

      video.addEventListener("error", () => {
        setIsLoading(false);
        setHasError(true);
      });

      video.load();
    }, [props.src]);

    useEffect(() => {
      loadVideo();
    }, [loadVideo, retryCount]);

    const handleRetry = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setRetryCount((prev) => prev + 1);
    };

    useEffect(() => {
      let timeoutId: NodeJS.Timeout;

      if (isLoading) {
        timeoutId = setTimeout(() => {
          setIsLoading(false);
          setHasError(true);
        }, 60000);
      }

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }, [isLoading]);

    if (isEmpty(props.src) || (retryCount > -1 && !isLoading && hasError)) {
      return (
        <div
          className={`flex min-w-full flex-col items-center justify-center bg-gray-300 text-gray-500 ${props.className}`}
          style={{
            width: props.width || "100%",
            height: props.height || "100%",
          }}
        >
          <Image
            loading="lazy"
            preview={false}
            src={NoImage.src}
            alt="No Image"
            height="100%"
            width="100%"
            className="!h-full !w-full !object-contain"
          />
        </div>
      );
    }

    return (
      <>
        {
          // isLoading ? (
          //   <div
          //     className={`flex min-w-full flex-col items-center justify-center bg-gray-300 text-gray-500 ${props.className} ${loaderClasses?.container || ""}`}
          //     style={{
          //       width: props.width || "100%",
          //       height: props.height || "100%",
          //     }}
          //   >
          //     <DotLottieReact
          //       data={EBLoader}
          //       loop
          //       autoplay
          //       className={`h-full max-h-14 min-h-8 ${loaderClasses?.loader || ""}`}
          //     />
          //   </div>
          // ) :
          hasError ? (
            <div
              className={`flex flex-col items-center justify-center bg-gray-300 text-gray-500 ${props.className} ${loaderClasses?.container || ""}`}
              style={{
                width: props.width || "100%",
                height: props.height || "100%",
              }}
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
            <div className="relative h-full w-full">
              {isLoading || isBuffering ? (
                <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black/50 transition duration-300 ease-in-out">
                  <DotLottieReact
                    data={EBLoader}
                    loop
                    autoplay
                    className={`h-full max-h-14 min-h-8 ${loaderClasses?.loader || ""}`}
                  />
                </div>
              ) : null}

              <video
                controlsList="nodownload"
                ref={ref}
                {...props}
                preload="auto"
                onLoadedData={() => setIsLoading(false)}
                onError={() => setHasError(true)}
                onWaiting={handleWaiting}
                onPlaying={handlePlaying}
                onProgress={() => setIsBuffering(false)}
              />
            </div>
          )
        }
      </>
    );
  },
);

CustomVideo.displayName = "CustomVideo";

export default CustomVideo;
