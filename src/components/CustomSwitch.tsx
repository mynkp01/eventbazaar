import { motion } from "framer-motion";

const CustomSwitch = ({
  selected,
  setSelected,
  onClick = null,
  disabled = false,
}) => {
  return (
    <div className="my-3 inline-flex items-center rounded-full bg-gray-200 p-0.5">
      {[
        { key: "Yes", value: true },
        { key: "No", value: false },
      ].map((item) => (
        <button
          key={item.key}
          onClick={(e) => {
            if (disabled) {
              return;
            }

            if (onClick) {
              onClick(e);
            }
            setSelected(item.value);
          }}
          className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ease-in-out ${
            disabled
              ? "text-gray-500"
              : selected === item.value
                ? "text-gray-900"
                : "text-gray-500"
          }`}
          style={{ minWidth: "80px" }}
        >
          {selected === item.value && (
            <motion.div
              layoutId="bubble"
              className="absolute inset-0 rounded-full bg-white"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative flex items-center justify-center font-semibold">
            {item.key}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CustomSwitch;
