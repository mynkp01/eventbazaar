"use client";
import { HTMLAttributes, memo, MouseEvent } from "react";

interface PageActionInterface extends HTMLAttributes<HTMLDivElement> {
  btnPrimaryLabel?: string;
  btnPrimaryFun?: (e: MouseEvent) => void;
  btnPrimaryDisabled?: boolean;
  btnSecondaryLabel?: string;
  btnSecondaryFun?: (e: MouseEvent) => void;
  btnSecondaryDisabled?: boolean;
  btnPrimaryClassName?: string;
  btnSecondaryClassName?: string;
}

const PageAction = (props: PageActionInterface) => {
  return (
    <div className={`${props.className} mt-8 flex items-center gap-3 sm:gap-5`}>
      {props.btnPrimaryLabel && (
        <button
          disabled={props.btnPrimaryDisabled || false}
          onClick={props.btnPrimaryFun}
          className={`${props.btnPrimaryClassName} text-15-700 btn-fill-hover h-fit w-fit rounded-xl border-2 border-blue-100 bg-blue-100 p-1.5 text-primary-100 sm:px-3 sm:py-2.5`}
        >
          {props.btnPrimaryLabel}
        </button>
      )}
      {props.btnSecondaryLabel && (
        <button
          disabled={props.btnSecondaryDisabled || false}
          onClick={props.btnSecondaryFun}
          className={`${props.btnSecondaryClassName} btn-outline-hover text-15-700 shadow-outer h-fit w-fit rounded-xl border border-blue-100 bg-primary-100 p-1.5 text-blue-100 sm:px-3 sm:py-2.5`}
        >
          {props.btnSecondaryLabel}
        </button>
      )}
    </div>
  );
};

export default memo(PageAction);
