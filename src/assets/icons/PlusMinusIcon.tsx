import tailwindConfig from "tailwind.config";

const PlusMinusIcon = ({
  isFocused = false,
  className = "",
  size = 12,
  animated = true,
  color = tailwindConfig.theme.extend.colors["black"][500],
}) => (
  <div
    className={`relative aspect-square ${className}`}
    style={{ width: size }}
  >
    <div
      style={{ backgroundColor: color }}
      className={`absolute h-[1px] w-full rounded-full`}
    />
    <div
      style={{ backgroundColor: color }}
      className={`absolute h-[1px] w-full ${animated ? `transition-all duration-300 ${isFocused ? "-rotate-180" : "-rotate-90"}` : ""} rounded-full`}
    />
  </div>
);

export default PlusMinusIcon;
