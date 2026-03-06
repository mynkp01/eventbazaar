const Twitter = ({ ...props }) => {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m0.692 17.308 6.969 -6.967m0 0L0.692 0.692h4.614l5.035 6.969L17.308 0.692M7.662 10.341l5.031 6.967h4.615L10.339 7.659"
        stroke="#6F767E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Twitter;
