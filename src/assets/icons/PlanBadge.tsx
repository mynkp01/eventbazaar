const PlanBadge = (props) => (
  <svg
    width={38}
    height={57}
    viewBox="0 0 38 57"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    fill="none"
  >
    <g filter="url(#filter0_di_158_83)">
      <path d="M3 2H33V51L18 40.8302L3 51V2Z" fill={props.fill} />
    </g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23.9218 21.679C23.4229 21.2133 22.7345 21 21.8981 21H18.1855V30H22.0507C22.9327 30 23.6607 29.7836 24.1975 29.3146L24.1986 29.3137L24.1996 29.3128C24.7389 28.8325 25 28.1816 25 27.3939C25 26.8495 24.8508 26.3656 24.5443 25.9561C24.3442 25.6836 24.0876 25.4637 23.7804 25.2936C23.9924 25.1344 24.1695 24.9478 24.3083 24.7326C24.5467 24.363 24.6595 23.9278 24.6595 23.4404C24.6595 22.7292 24.4165 22.1329 23.9218 21.679ZM19.4458 25.9873V28.7887H22.0272C22.6205 28.7887 23.0351 28.6522 23.311 28.4191C23.5823 28.1822 23.728 27.8528 23.728 27.3939C23.728 26.9055 23.5789 26.5779 23.3154 26.3606L23.3139 26.3594L23.3124 26.3581C23.0371 26.1247 22.6186 25.9873 22.0155 25.9873H19.4458ZM19.4458 24.7878H21.8511C22.4137 24.7878 22.7927 24.655 23.0352 24.4351C23.2772 24.2156 23.4109 23.9048 23.4109 23.464C23.4109 23.0612 23.2814 22.7693 23.0381 22.5548C22.7957 22.3409 22.4155 22.2113 21.8511 22.2113H19.4458V24.7878ZM16.9696 21.001H11V22.2112H16.9696V21.001ZM16.9696 28.7898H11V30H16.9696V28.7898ZM16.9696 24.7854H11V25.9955H16.9696V24.7854Z"
      fill="white"
      fillOpacity={0.5}
    />
    <circle cx={17.5} cy={25.5} r={10} stroke="white" strokeOpacity={0.5} />
    <defs>
      <filter
        id="filter0_di_158_83"
        x={0}
        y={0}
        width={38}
        height={57}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx={1} dy={2} />
        <feGaussianBlur stdDeviation={2} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_158_83"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_158_83"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx={-1} />
        <feGaussianBlur stdDeviation={2.5} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.416667 0 0 0 0 0.416667 0 0 0 0 0.416667 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect2_innerShadow_158_83"
        />
      </filter>
    </defs>
  </svg>
);

export default PlanBadge;
