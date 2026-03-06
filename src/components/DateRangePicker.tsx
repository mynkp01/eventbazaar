import { DatePicker as ANTDDatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment";
import { SharedTimeProps } from "rc-picker";
import type { PickerMode } from "rc-picker/lib/interface";
import type { RangeValueType } from "rc-picker/lib/PickerInput/RangePicker";
import { isEmpty } from "src/utils/helper";

interface DatePickerProps {
  id?: string;
  format?: string;
  value?: RangeValueType<dayjs.Dayjs>;
  onChange?: (
    dates: dayjs.Dayjs[] | null,
    // dateStrings: [string, string],
  ) => void;
  minDate?: string;
  maxDate?: string;
  className?: string;
  showTime?: boolean | SharedTimeProps;
  disabled?: boolean;
  picker?: PickerMode;
  placeholder?: string | [string, string];
}

const { RangePicker } = ANTDDatePicker;

const DateRangePicker = (props: DatePickerProps) => {
  return (
    <>
      <style>
        {`
          .ant-picker-outlined{
            border: none !important;
            background-color: inherit !important;
          }
          .ant-picker-outlined:hover{
            background-color: inherit !important;
          }
          .ant-picker-outlined:active{
            background-color: inherit !important;
          }
          .ant-picker-outlined:focus-within, .ant-picker-outlined:focus{
            background-color: inherit !important;
            border: none !important;
            box-shadow: none !important;
          }
          .ant-picker-input > input {
            border: none !important;
            font-size: 0.75rem !important;
            font-family: Inter !important;
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
      <RangePicker
        id={props.id}
        picker={props.picker}
        value={
          props.value?.length > 0
            ? (props.value?.map((d) => dayjs(d)) as RangeValueType<Dayjs>)
            : props.value
        }
        onChange={props.onChange}
        format={props.format}
        disabled={props.disabled}
        showTime={props.showTime}
        minDate={
          props.minDate
            ? dayjs(moment(props.minDate).format(props.format), props.format)
            : undefined
        }
        maxDate={
          props.maxDate
            ? dayjs(moment(props?.maxDate).format(props.format), props.format)
            : undefined
        }
        placeholder={
          isEmpty(props.placeholder)
            ? [
                `(${props.format?.toUpperCase()})`,
                `(${props.format?.toUpperCase()})`,
              ]
            : Array.isArray(props.placeholder)
              ? props.placeholder
              : null
        }
        className={`h-5 w-full gap-2.5 rounded-xl bg-primary-200 px-4 py-5 text-sm font-semibold text-primary-800 placeholder:text-sm placeholder:font-medium sm:px-4 sm:py-6 ${props.className}`}
      />
    </>
  );
};

export default DateRangePicker;
