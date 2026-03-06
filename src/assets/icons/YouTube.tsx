const YouTube = (props) => (
  <svg
    width={props.width || "25"}
    height={props.height || "24"}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x={2}
      y={3}
      width={20}
      height={18}
      rx={4}
      stroke="#6F767E"
      strokeWidth={1.6}
    />
    <path
      d="M10.4472 8.72361L15.2111 11.1056C15.9482 11.4741 15.9482 12.5259 15.2111 12.8944L10.4472 15.2764C9.78231 15.6088 9 15.1253 9 14.382V9.61803C9 8.87465 9.78231 8.39116 10.4472 8.72361Z"
      stroke="#6F767E"
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </svg>
);
export default YouTube;
