import React from "react";

const SortByIcon: React.FC<{
  className?: string;
  fillUpperArrow?: string;
  fillLowerArrow?: string;
}> = ({
  className,
  fillUpperArrow = "#CBD5E0",
  fillLowerArrow = "#CBD5E0",
}) => {
  return (
    <svg
      width="8"
      height="10"
      viewBox="0 0 8 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3.46055 0.320327C3.75848 0.026688 4.24152 0.026688 4.53945 0.320327L7.27503 3.01651C7.75562 3.49019 7.41524 4.3001 6.73558 4.3001H1.26442C0.584758 4.3001 0.244379 3.49019 0.724976 3.01651L3.46055 0.320327Z"
        fill={fillUpperArrow}
      />
      <path
        d="M3.46055 9.67987C3.75848 9.97351 4.24152 9.97351 4.53945 9.67987L7.27503 6.98369C7.75562 6.51001 7.41524 5.7001 6.73558 5.7001H1.26442C0.584758 5.7001 0.244379 6.51001 0.724976 6.98369L3.46055 9.67987Z"
        fill={fillLowerArrow}
      />
    </svg>
  );
};

export default SortByIcon;
