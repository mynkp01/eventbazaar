import { Rate } from "antd";

interface RatingProps {
  value?: number;
  allowHalf?: boolean;
  disabled?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const Rating = ({
  value = 0,
  allowHalf = false,
  disabled = false,
  onChange,
  className = "",
}: RatingProps) => {
  return (
    <Rate
      value={value}
      allowHalf={allowHalf}
      disabled={disabled}
      onChange={onChange}
      className={className}
    />
  );
};

export default Rating;
