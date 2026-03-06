const SpeakerOn = (props) => (
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
    <g clipPath="url(#clip0_455_1597)">
      <path
        d="M8 15.9998V19.9998C8 21.9998 9 22.9998 11 22.9998H12.43C12.8 22.9998 13.17 23.1098 13.49 23.2998L16.41 25.1298C18.93 26.7098 21 25.5598 21 22.5898V13.4098C21 10.4298 18.93 9.28979 16.41 10.8698L13.49 12.6998C13.17 12.8898 12.8 12.9998 12.43 12.9998H11C9 12.9998 8 13.9998 8 15.9998Z"
        stroke="white"
        strokeWidth={1.5}
      />
      <path
        d="M24 14C25.78 16.37 25.78 19.63 24 22"
        stroke="white"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25.83 11.5C28.72 15.35 28.72 20.65 25.83 24.5"
        stroke="white"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_455_1597">
        <rect width={24} height={24} fill="white" transform="translate(6 6)" />
      </clipPath>
    </defs>
  </svg>
);

export default SpeakerOn;
