const SpeakerOff = (props) => (
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
    <path
      d="M12 15.8416V19.8416C12 21.8416 13 22.8416 15 22.8416H16.43C16.8 22.8416 17.17 22.9516 17.49 23.1416L20.41 24.9716C22.93 26.5516 25 25.4016 25 22.4316V13.2516C25 10.2716 22.93 9.13159 20.41 10.7116L17.49 12.5416C17.17 12.7316 16.8 12.8416 16.43 12.8416H15C13 12.8416 12 13.8416 12 15.8416Z"
      stroke="white"
      strokeWidth={1.5}
    />
    <line
      x1={9.70711}
      y1={9}
      x2={27}
      y2={26.2929}
      stroke="white"
      strokeLinecap="round"
    />
  </svg>
);

export default SpeakerOff;
