const UpArrows = ({ ...props }: any) => {
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
        d="M1 7L7 1L13 7"
        stroke="#6F767E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default UpArrows;
