import {
  ChangeEvent,
  ClipboardEvent,
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  KeyboardEventHandler,
  LegacyRef,
  TextareaHTMLAttributes,
  WheelEventHandler,
} from "react";
import LabelField from "./LabelField";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  toolTipText?: string;
  containerClass?: string;
  labelClass?: string;
  isTextArea?: boolean;
  prefix?: string;
  postfix?: string;
}

const CustomInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  CustomInputProps
>(
  (
    {
      id,
      label = "",
      type = "text",
      placeholder,
      value,
      onKeyDown,
      onChange,
      onBlur,
      disabled = false,
      required = false,
      toolTipText,
      name,
      className = "",
      containerClass = "",
      labelClass = "",
      maxLength = 50,
      isTextArea = false,
      prefix,
      postfix,
      inputMode,
      pattern,
      ...restProps
    },
    ref,
  ) => {
    const handleWheel: WheelEventHandler<HTMLInputElement> = (e) => {
      if (type === "number") {
        e.currentTarget.blur();
      }
    };

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
      const numberDisallowedKeys = ["ArrowUp", "ArrowDown", "-", "+", "e", "E"];

      if (type === "number" && numberDisallowedKeys.includes(e.key)) {
        e.preventDefault();
        return;
      }

      if ((type === "number" || type === "text") && e.key === "Enter") {
        e.preventDefault();
        onKeyDown?.(e);
      }
    };

    const handleChange = (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      if (!onChange) return;

      const { value } = event.target;

      if (!value) {
        onChange(event as unknown as ChangeEvent<HTMLInputElement>);
        return;
      }

      if (type === "number") {
        if (!/^\d+$/.test(value) || value.length > maxLength) return;
      }

      onChange(event as unknown as ChangeEvent<HTMLInputElement>);
    };

    const handlePaste = (
      e: ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const pastedText = e.clipboardData.getData("text/plain");
      const pastedValue = `${value}${pastedText}`.slice(0, maxLength);

      if (type === "number" && !/^\d+$/.test(pastedValue)) {
        e.preventDefault();
        return;
      }

      // onChange?.({
      //   ...e,
      //   target: {
      //     id,
      //     value: pastedValue,
      //     name: name ?? label,
      //   },
      // } as unknown as React.ChangeEvent<HTMLInputElement>);
    };

    const inputProps:
      | DetailedHTMLProps<
          InputHTMLAttributes<HTMLInputElement>,
          HTMLInputElement
        >
      | DetailedHTMLProps<
          TextareaHTMLAttributes<HTMLTextAreaElement>,
          HTMLTextAreaElement
        > = {
      id,
      inputMode,
      name: name ?? label,
      placeholder: placeholder ?? `Enter ${label}`,
      value,
      maxLength,
      onBlur,
      disabled,
      required,
      ...restProps,
    };

    const inputClassName = `${className} ${
      isTextArea
        ? "mt-3 w-full gap-2.5 rounded-xl bg-primary-200 p-4"
        : "h-5 w-full rounded-xl bg-inherit px-4 py-6"
    } md:text-sm text-xs font-semibold text-primary-800 outline-none md:placeholder:text-sm placeholder:text-xs placeholder:font-medium placeholder:leading-6 disabled:font-medium disabled:text-grey-900`;

    return (
      <div className="w-full">
        <LabelField
          labelText={label}
          toolTipText={toolTipText}
          required={required}
          className={labelClass}
        />
        {isTextArea ? (
          <textarea
            {...(inputProps as unknown as DetailedHTMLProps<
              TextareaHTMLAttributes<HTMLTextAreaElement>,
              HTMLTextAreaElement
            >)}
            maxLength={undefined}
            ref={ref as LegacyRef<HTMLTextAreaElement>}
            className={inputClassName}
            onChange={handleChange}
            onPaste={handlePaste}
          />
        ) : (
          <div
            className={`mt-2 flex w-full items-center overflow-hidden rounded-xl bg-primary-200 text-sm font-semibold ${containerClass}`}
          >
            {prefix && (
              <span className="text-nowrap border-r px-4 text-sm font-medium text-grey-100">
                {prefix}
              </span>
            )}
            <input
              {...(inputProps as DetailedHTMLProps<
                InputHTMLAttributes<HTMLInputElement>,
                HTMLInputElement
              >)}
              ref={ref as LegacyRef<HTMLInputElement>}
              className={inputClassName}
              type={type}
              pattern={pattern || (type === "number" ? "[0-9]*" : undefined)}
              onWheel={type === "number" ? handleWheel : undefined}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              onPaste={handlePaste}
            />
            {postfix && (
              <span className="text-nowrap border-l px-4 text-sm font-medium text-grey-100">
                {postfix}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
