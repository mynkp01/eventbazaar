import { EBLoader } from "@assets/index";
import { DotLottieWorkerReact } from "@lottiefiles/dotlottie-react";

const Loader = (props) => {
  return (
    <div
      className="inset-0 z-50 flex items-center justify-center"
      style={{
        left: "0px",
        top: "0px",
        width: "100%",
        height: "100%",
        zIndex: "9995",
      }}
    >
      <DotLottieWorkerReact
        data={EBLoader}
        loop
        autoplay
        width={"100%"}
        height={"100%"}
        className={`z-50 h-10 w-10 ${props.className}`}
      />
    </div>
  );
};

const ScreenLoader = () => {
  return (
    <div className="fixed inset-0 left-0 top-0 z-[9999999999999999999] flex size-0 h-full w-full items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <DotLottieWorkerReact
        data={EBLoader}
        loop
        autoplay
        width={"100%"}
        height={"100%"}
        className="aspect-auto h-14 md:h-16"
      />
    </div>
  );
};

export { Loader, ScreenLoader };
