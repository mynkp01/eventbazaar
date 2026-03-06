"use client";
import { Autocomplete, SxProps, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { isEmpty } from "src/utils/helper";

interface FetchDropdownProps {
  label?: string;
  value: any;
  endPoints: (query: string) => Promise<any>;
  filterStr: string;
  func: (label: string, value: any, index: number) => void;
  objKey?: string;
  idKey?: string;
  display?: string;
  data?: any[];
  required?: true | false;
  multiple?: true | false;
  className?: string;
  containerClass?: string;
  labelClass?: string;
  isComponentDisabled?: true | false;
  textMenuSx?: (customStyles: SxProps) => SxProps;
  disabledOptions?: any;
  index?: any;
  disableClearable?: boolean;
  disablePortal?: boolean;
  defaultValueIndex?: number;
  placeholder?: string;
  errorOutline?: string;
  filterSelectedOptions?: boolean;
}

const FetchDropdown: React.FC<FetchDropdownProps> = ({
  label,
  value,
  endPoints,
  filterStr,
  func,
  objKey,
  index,
  idKey = "_id",
  display,
  data,
  disabledOptions = [],
  isComponentDisabled,
  required,
  multiple = false,
  className,
  containerClass,
  labelClass,
  placeholder,
  textMenuSx = () => {},
  errorOutline,
  defaultValueIndex,
  disableClearable = true,
  disablePortal = true,
  filterSelectedOptions,
}) => {
  const [reLoaded, setReLoaded] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const [defaultProps, setDefaultProps] = useState<{
    options: any[];
    getOptionLabel: (option: any) => string;
  }>({ options: [], getOptionLabel: () => "" });
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!isEmpty(defaultValueIndex) && !value) {
      const defaultOption = defaultProps.options[defaultValueIndex];
      if (defaultOption) {
        func(objKey, defaultOption, index);
      }
    }
  }, [defaultProps.options, defaultValueIndex]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await endPoints(filterStr);
        if (
          (res.status === 200 || res.status === 201) &&
          res.data.data &&
          Array.isArray(res.data.data)
        ) {
          setDefaultProps({
            options: res?.data?.data,
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
          setOptions(res.data.data);
          setIsDisabled(false);
        }
      } catch (error: any) {
        console.error(error?.response?.data?.message || error.message);
      }
    }

    if (endPoints && filterStr) {
      setReLoaded(false);
      if (defaultProps?.options?.length === 0 || !value) fetchData();
    } else if (!isEmpty(data)) {
      setDefaultProps({
        options: data,
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
      setOptions(data);
      setIsDisabled(false);
    } else {
      setReLoaded(true);
      setIsDisabled(true);
      setDefaultProps({ options: [], getOptionLabel: () => "" });
    }
  }, [filterStr, data]);

  // useEffect(() => {
  //   if (multiple && value && Array.isArray(value) && value.length > 0) {
  //     let optionsArr: any = [];
  //     options.filter((v) => {
  //       let findIndex = value.findIndex(
  //         (n) => n.toString() === v?.[idKey]?.toString(),
  //       );
  //       if (findIndex === -1) optionsArr.push(v);
  //     });
  //     setDefaultProps({
  //       options: optionsArr,
  //       getOptionLabel: (option) => option[display],
  //     });
  //   }
  // }, [value]);

  return (
    <div
      className={`relative mt-2 flex w-full flex-col items-start ${containerClass || ""}`}
    >
      {label ? (
        <label
          htmlFor={index || filterStr}
          className={`text-14-600 mb-1.5 block text-primary-600 ${labelClass}`}
        >
          {label}
          {required && <span className="text-xl text-red-500">*</span>}
        </label>
      ) : null}
      {!isEmpty(defaultProps) ? (
        <Autocomplete
          {...defaultProps}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          getOptionKey={(options) => options[idKey]}
          filterSelectedOptions={filterSelectedOptions}
          classes={{ option: "text-sm md:text-base font-normal" }}
          multiple={multiple || false}
          className={`w-full rounded-xl font-medium ${className} ${
            multiple &&
            value &&
            Array.isArray(value) &&
            value.length > 0 &&
            `overflow-y-auto overflow-x-hidden`
          }`}
          disablePortal={disablePortal}
          disableClearable={disableClearable}
          sx={{
            "& .MuiSvgIcon-root": {
              height: 12,
              width: 12,
              "@media (min-width: 768px)": {
                height: 16,
                width: 16,
              },
            },
          }}
          id={filterStr || index}
          onChange={(e, newValue) => func(objKey, newValue, index)}
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
          disabled={isDisabled || reLoaded || isComponentDisabled}
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
      ) : null}
    </div>
  );
};
export default React.memo(FetchDropdown);

const customStyles: SxProps = {
  width: "100%",
  fontSize: "14px !important",
  fontWeight: "500 !important",
  border: "none",
  "& .MuiInputBase-root": {
    padding: "10px 16px !important",
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
    zIndex: 10,
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
