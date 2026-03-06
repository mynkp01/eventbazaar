import { ButtonHTMLAttributes, forwardRef, LegacyRef } from "react";
import { Loader } from "./Loader";

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  disabled?: boolean;
  text: string;
  className?: string;
}

const CustomButton = forwardRef(
  (
    {
      loading = false,
      disabled = false,
      text,
      className,
      ...props
    }: CustomButtonProps,
    ref: LegacyRef<HTMLButtonElement>,
  ) => {
    return (
      <button
        {...props}
        ref={ref}
        disabled={loading || disabled}
        onClick={props.onClick}
        className={`text-15-700 h-fit w-fit overflow-hidden rounded-xl border-2 ${className}`}
      >
        {loading ? <Loader /> : text}
      </button>
    );
  },
);

export default CustomButton;

CustomButton.displayName = "CustomButton";
