"use client";
import { Autocomplete, SxProps, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { isEmpty } from "src/utils/helper";

const customStyles: SxProps = {
  width: "100%",
  fontSize: "14px !important",
  fontWeight: "500 !important",
  border: "none",
  "& .MuiInputBase-root": {
    padding: "0.75rem 1rem",
    fontWeight: "600 !important",
    borderRadius: "12px",
    fontSize: "14px !important",
    color: "#1A1D1F !important",
    background: "#F4F4F4",
    fontFamily: '"Inter","sans-serif"',
    "&::before, &::after, &:hover::before, &:hover::after": {
      borderBottom: "none !important",
    },
    "& input::placeholder": {
      color: "#9a9Fa5 !important",
      opacity: 1,
    },
  },
  "& .MuiInputBase-root.Mui-error": {
    border: "1px solid red !important",
  },
  "& .MuiInputLabel-root": {
    color: "red !important",
  },
  "& .MuiAutocomplete-listbox": {
    zIndex: 999999999,
  },
  "& .MuiAutocomplete-option": {
    '&[aria-selected="true"], &[data-focus="true"]': {
      padding: 0,
      backgroundColor: "#F4F4F4",
    },
  },
  "& .MuiAutocomplete-endAdornment": {
    right: "0.75rem",
  },
  "@media (max-width: 600px)": {
    "& .MuiInputBase-root": {
      padding: "0.35rem 1rem",
    },
  },
  "@media (max-width: 768px)": {
    "& .MuiInputBase-root": {
      fontSize: "12px !important",
    },
  },
};

interface FetchStyledDropdownProps {
  label?: string;
  disablePortal?: boolean;
  value: any;
  func: (label: string, value: any, index: number) => void;
  objKey?: string;
  idKey?: string;
  display?: string;
  required?: true | false;
  multiple?: true | false;
  rootClassName?: string;
  className?: string;
  textMenuSx?: (customStyles: SxProps) => SxProps;
  isComponentDisabled?: true | false;
  disabledOptions?: any;
  index?: any;
  getOpenState?: (state: boolean) => void;
  isClearable?: boolean;
  placeholder?: string;
  arr: any;
  sx?: SxProps;
  disableClearable?: boolean;
}

const FetchStyledDropdown: React.FC<FetchStyledDropdownProps> = ({
  label,
  disablePortal = true,
  value,
  func,
  objKey,
  index,
  idKey = "_id",
  getOpenState,
  display,
  disabledOptions = [],
  isComponentDisabled,
  required,
  multiple = false,
  rootClassName,
  className,
  textMenuSx = () => {},
  placeholder,
  arr,
  sx,
  disableClearable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [defaultProps, setDefaultProps] = useState<{
    options: any[];
    getOptionLabel: (option: any) => string;
  }>({ options: [], getOptionLabel: () => "" });

  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!isEmpty(arr)) {
      setOptions(arr);
      setDefaultProps({
        options: arr,
        getOptionLabel: (option) => {
          let displayArr = display.split(",");
          let arr = displayArr.map((v, i) => {
            let obj = { ...option },
              keyArr = v.split(".");
            keyArr.map((v) => (obj = obj[v]));
            if (i + 1 === displayArr.length && displayArr.length !== 1) {
              return ` (${obj})`;
            } else {
              return `${obj}`;
            }
          });
          return arr.join("");
        },
      });
    } else {
      setDefaultProps({ options: [], getOptionLabel: () => "" });
      setOptions([]);
    }
  }, [arr]);

  useEffect(() => {
    if (getOpenState) {
      getOpenState(isOpen);
    }
  }, [isOpen]);

  useEffect(() => {
    if (multiple && value && Array.isArray(value) && value.length > 0) {
      let optionsArr: any = [];
      options.filter((v) => {
        let findIndex = value.findIndex(
          (n) => n?.[idKey]?.toString() === v?.[idKey]?.toString(),
        );
        if (findIndex === -1) optionsArr.push(v);
      });
      setDefaultProps({
        options: optionsArr,
        getOptionLabel: (option) => option[display],
      });
    }
  }, [value]);

  return (
    <div
      className={`relative mt-2 flex w-full flex-col items-start ${rootClassName}`}
    >
      {label && (
        <label
          htmlFor={index}
          className="text-14-600 mb-1.5 block text-primary-600"
        >
          {label}
          {required && <span className="text-[20px] text-red-500"> *</span>}
        </label>
      )}
      {defaultProps && (
        <Autocomplete
          {...defaultProps}
          disablePortal={disablePortal}
          open={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
          getOptionKey={(options) => options[idKey]}
          classes={{ option: "!text-body-xs !font-normal text-netral-80" }}
          multiple={multiple || false}
          className={`w-full rounded-xl font-medium ${className} ${
            multiple &&
            value &&
            Array.isArray(value) &&
            value.length > 0 &&
            "overflow-y-auto overflow-x-hidden"
          }`}
          sx={Object.assign(
            {
              "& .MuiSvgIcon-root": {
                height: 12,
                width: 12,
                "@media (min-width: 768px)": {
                  height: 16,
                  width: 16,
                },
              },
            },
            sx,
          )}
          disableClearable={disableClearable}
          id={index}
          onChange={(e, newValue) => func(objKey, newValue, index)}
          // value={
          //   value && defaultProps.options.length > 0
          //     ? defaultProps.options.find(
          //         (v) => v??.[idKey]??.toString() === value?.toString(),
          //       )
          //     : null
          // }
          value={
            multiple
              ? value &&
                Array.isArray(value) &&
                value.length > 0 &&
                defaultProps.options.length > 0 &&
                options.length > 0
                ? options.filter(
                    (v) =>
                      v?.[idKey]?.toString() ===
                      value.find(
                        (n) => n.toString() === v?.[idKey]?.toString(),
                      ),
                  )
                : []
              : value && defaultProps.options.length > 0
                ? defaultProps.options.find(
                    (v) => v?.[idKey]?.toString() === value.toString(),
                  )
                : null
          }
          disabled={isComponentDisabled}
          getOptionDisabled={(option) => {
            let arr = disabledOptions.filter(
              (v: any) => option?.[idKey]?.toString() === v.toString(),
            );
            return arr.length > 0;
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              sx={Object.assign(customStyles, textMenuSx(customStyles))}
              placeholder={
                isEmpty(value) ? (placeholder ?? "Select " + (label || "")) : ""
              }
            />
          )}
        />
      )}
    </div>
  );
};
export default React.memo(FetchStyledDropdown);
