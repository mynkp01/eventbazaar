const DownArrow = ({ ...props }: any) => {
  return (
    <svg
      width={props.width || "14"}
      height={props.height || "8"}
      className={props.className}
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1L7 7L13 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DownArrow;
