import { InfoFilled } from "@assets/index";

const InfoBox = ({ text }) => {
  return (
    <div className="mb-4 flex gap-2 rounded-xl border border-yellow-500 border-opacity-50 bg-yellow-500 bg-opacity-5 p-3 font-semibold text-primary-500">
      <div>
        <InfoFilled className="size-4" fill={"#CA8A04"} />
      </div>
      <div className="text-xs text-yellow-600">{text}</div>
    </div>
  );
};

export default InfoBox;
