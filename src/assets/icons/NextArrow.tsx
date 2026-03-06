const NextArrow = (props) => (
  <svg
    width={36}
    height={36}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
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
    <g clipPath="url(#clip0_455_1622)">
      <path
        d="M24.07 20.4302L18 26.5002L11.93 20.4302"
        stroke="white"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 9.5V26.33"
        stroke="white"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_455_1622">
        <rect width={24} height={24} fill="white" transform="translate(6 6)" />
      </clipPath>
    </defs>
  </svg>
);

export default NextArrow;
