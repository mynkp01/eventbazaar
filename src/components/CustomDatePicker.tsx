import {
  DatePicker as ANTDDatePicker,
  TimePicker as ANTDTimePicker,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import type { PickerMode } from "rc-picker/lib/interface";
import React, { useEffect, useState } from "react";
import LabelField from "./LabelField";

interface DatePickerProps {
  id?: string;
  label?: string;
  name?: string;
  labelFor?: string;
  format?: { date?: string; time?: string };
  value?: string | null;
  onChange?: (dateTime: string | null) => void;
  minDate?: string | Date;
  maxDate?: string | Date;
  className?: string;
  labelClassName?: string;
  showTime?: boolean;
  disabled?: boolean;
  picker?: PickerMode;
  required?: boolean;
  toolTipText?: string;
  placeholder?: string;
}

const CustomDatePicker: React.FC<DatePickerProps> = (props) => {
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);
  const [timeValue, setTimeValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (props.value) {
      const dateTime = dayjs(props.value);
      setDateValue(dateTime);
      setTimeValue(props.showTime ? dateTime : null);
    }
  }, [props.value, props.showTime]);

  const handleDateChange = (date: Dayjs | null) => {
    setDateValue(date);
    updateDateTime(date, timeValue);
  };

  const handleTimeChange = (time: Dayjs | null) => {
    setTimeValue(time);
    updateDateTime(dateValue, time);
  };

  const updateDateTime = (date: Dayjs | null, time: Dayjs | null) => {
    if (date) {
      const dateTime =
        props.showTime && time
          ? date.hour(time.hour()).minute(time.minute()).second(time.second())
          : new Date(date);
      props.onChange?.(dateTime);
    } else {
      props.onChange?.(null);
    }
  };

  return (
    <>
      <style>
        {`
          .ant-picker-outlined{
            border: none !important;
          }
          .ant-picker-outlined:hover{
            background-color: white !important;
          }
          .ant-picker-outlined:focus{
            background-color: white !important;
          }
          @media (max-width: 400px) {
            .ant-picker-dropdown {
              position: fixed !important;
              left: 50% !important;
              transform: translate(-50%) !important;
            }
            .ant-picker-panel-container {
              max-width: 90vw !important;
              overflow: auto !important;
            }
          }
        `}
      </style>
      {props.label && (
        <LabelField
          labelText={props.label}
          toolTipText={props.toolTipText}
          required={props.required}
          className={`mb-3 ${props.labelClassName}`}
        />
      )}
      <div className="flex flex-col sm:flex-row">
        <ANTDDatePicker
          name={props.name}
          getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
          allowClear={!props.required}
          id={props.id}
          picker={props.picker}
          value={dateValue}
          onChange={handleDateChange}
          format={props.format?.date}
          disabled={props.disabled}
          disabledDate={(current) =>
            props.maxDate ? current && current > dayjs(props.maxDate) : false
          }
          minDate={props.minDate ? dayjs(props.minDate) : undefined}
          maxDate={props.maxDate ? dayjs(props.maxDate) : undefined}
          placeholder={`${props.placeholder || props.format?.date?.toUpperCase()}`}
          className={`h-5 w-full rounded-xl !bg-primary-200 bg-inherit px-4 py-6 text-sm font-medium leading-6 text-primary-800 outline-none focus:shadow-none disabled:font-medium disabled:text-grey-900 ${props.className}`}
          popupClassName="text-xs md:text-sm"
        />
        {props.showTime && (
          <ANTDTimePicker
            name={props.name}
            getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
            allowClear={!props.required}
            needConfirm={false}
            id={props.id}
            value={timeValue}
            onChange={handleTimeChange}
            format={props.format?.time}
            disabled={props.disabled}
            placeholder={`(${props.format?.time?.toUpperCase()})`}
            className={`h-5 w-full rounded-xl bg-inherit px-4 py-6 text-sm font-medium leading-6 text-primary-800 outline-none focus-within:shadow-none focus:shadow-none disabled:font-medium disabled:text-grey-900 ${props.className}`}
            popupClassName="text-xs md:text-sm"
          />
        )}
      </div>
    </>
  );
};

export default CustomDatePicker;
