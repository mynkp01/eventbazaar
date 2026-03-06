const VideoPlayerIcon = (props) => (
  <div className={`${props.className} relative rounded-full`}>
    <div
      style={{
        borderRadius: "100%",
        backdropFilter: "blur(10px)",
        height: "100%",
        width: "100%",
        position: "absolute",
        zIndex: -1,
      }}
    />

    <svg
      width={68}
      height={68}
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={34} cy={34} r={34} fill="white" fillOpacity={0.3} />
      <path
        d="M28 25L42 34L28 43V25Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export default VideoPlayerIcon;
