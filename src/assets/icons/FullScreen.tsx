const FullScreen = (props) => {
  const { isFullScreen = false, ...restProps } = props;

  return (
    <svg
      width={36}
      height={36}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <rect
        x={0.5}
        y={0.5}
        width={35}
        height={35}
        rx={4.5}
        fill="black"
        fillOpacity={0.3}
      />
      <rect x={0.5} y={0.5} width={35} height={35} rx={4.5} stroke="white" />
      <g clipPath="url(#clip0_455_1605)">
        <path
          d={isFullScreen ? "M19.5 10.5V16.5H25.5" : "M9 21V27H15"}
          stroke="white"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={isFullScreen ? "M19.5 16.5L27 9" : "M27 15V9H21"}
          stroke="white"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={isFullScreen ? "M16.5 25.5V19.5H10.5" : "M27 9L19.5 16.5"}
          stroke="white"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={isFullScreen ? "M9 27L16.5 19.5" : "M16.5 19.5L9 27"}
          stroke="white"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_455_1605">
          <rect
            width={24}
            height={24}
            fill="white"
            transform="translate(6 6)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default FullScreen;
