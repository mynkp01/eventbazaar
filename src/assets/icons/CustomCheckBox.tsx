const CustomCheckBox = ({ ...props }) => {
  return (
    <svg
      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1umw9bq-MuiSvgIcon-root"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      height="24"
      width="24"
      data-testid="CheckBoxOutlineBlankIcon"
      {...props}
    >
      {props.checked ? (
        <path
          d="M16 2.5H8C4.5 2.5 2.5 4.5 2.5 8V16C2.5 19.5 4.61111 21.5 8 21.5H16C19.3889 21.5 21.5 19.5 21.5 16V8C21.5 4.61111 19.3889 2.5 16 2.5ZM10 16.4L5.61 12L7.1 10.5117L10 13.5L16.9 7.28L18.39 8.78L10 16.4Z"
          fill="currentColor"
        />
      ) : (
        <rect
          x={3.5}
          y={3.5}
          fill="none"
          width={17}
          height={17}
          rx={4}
          stroke="#6F767E"
          strokeOpacity={0.4}
          strokeWidth={2}
        />
      )}
    </svg>
  );
};

export default CustomCheckBox;
