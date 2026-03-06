const DynamicLogo = () => {
  return (
    <svg
      width="35"
      height="38"
      viewBox="0 0 35 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_ii_6_15)">
        <path
          d="M13.9872 0.893163C16.0498 -0.297721 18.5912 -0.297721 20.6538 0.893163L31.3077 7.04416C33.3703 8.23508 34.641 10.4359 34.641 12.8177V25.1197C34.641 27.5014 33.3703 29.7022 31.3077 30.8932L20.6538 37.0442C18.5912 38.2351 16.0498 38.2351 13.9872 37.0442L3.33333 30.8932C1.27066 29.7022 0 27.5014 0 25.1197V12.8177C0 10.4359 1.27066 8.23508 3.33333 7.04416L13.9872 0.893163Z"
          fill="#272B30"
        />
      </g>
      <path
        d="M18.9872 15.6353C18.9872 14.7149 18.241 13.9687 17.3205 13.9687C16.4 13.9687 15.6538 14.7149 15.6538 15.6353V22.302C15.6538 23.2225 16.4 23.9687 17.3205 23.9687C18.241 23.9687 18.9872 23.2225 18.9872 22.302V15.6353Z"
        fill="white"
      />
      <path
        d="M12.3205 20.6353C13.241 20.6353 13.9872 19.8891 13.9872 18.9687C13.9872 18.0482 13.241 17.302 12.3205 17.302H8.98718C8.06671 17.302 7.32052 18.0482 7.32052 18.9687C7.32052 19.8891 8.06671 20.6353 8.98718 20.6353H12.3205Z"
        fill="url(#paint0_linear_6_15)"
      />
      <path
        d="M23.9872 22.302C25.8281 22.302 27.3205 20.8096 27.3205 18.9687C27.3205 17.1277 25.8281 15.6353 23.9872 15.6353C22.1462 15.6353 20.6538 17.1277 20.6538 18.9687C20.6538 20.8096 22.1462 22.302 23.9872 22.302Z"
        fill="url(#paint1_linear_6_15)"
      />
      <defs>
        <filter
          id="filter0_ii_6_15"
          x="0"
          y="-0.833333"
          width="34.641"
          height="39.604"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-0.833333" />
          <feGaussianBlur stdDeviation="0.833333" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.53 0"
          />
          <feBlend
            mode="multiply"
            in2="shape"
            result="effect1_innerShadow_6_15"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.833333" />
          <feGaussianBlur stdDeviation="0.416667" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.838444 0 0 0 0 0.838444 0 0 0 0 0.838444 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_innerShadow_6_15"
            result="effect2_innerShadow_6_15"
          />
        </filter>
        <linearGradient
          id="paint0_linear_6_15"
          x1="13.9872"
          y1="18.9687"
          x2="7.32052"
          y2="18.9687"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#D0D0D0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_6_15"
          x1="27.3205"
          y1="18.9687"
          x2="20.6538"
          y2="18.9687"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#D0D0D0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default DynamicLogo;
