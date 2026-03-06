"use client";
import { InfoFilled } from "@assets/index";
import { Tooltip } from "@mui/material";

const LabelField = ({
  labelText,
  toolTipText = "",
  className = "",
  required = false,
}) => {
  return (
    <div className={`label-field text-primary-600 ${className}`}>
      {labelText}
      {required && <span className="ml-0.5 text-[20px] text-red-500">*</span>}
      {toolTipText && (
        <Tooltip title={toolTipText} placement="top">
          <div className="ml-1">
            <InfoFilled />
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default LabelField;
