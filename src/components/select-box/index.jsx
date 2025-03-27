import RightIcon from "../icons/right";

const SelectBox = ({
  label = "Tanlang",
  options = [],
  value,
  onChange,
  className = "",
}) => {
  return (
    <div
      className={`relative border border-gray-300 rounded-xl px-4 py-2 cursor-pointer ${className}`}
    >
      <select
        className="bg-transparent outline-none w-full appearance-none text-black cursor-pointer"
        value={value}
        onChange={onChange}
      >
        <option value="" disabled className="px-[4px]">
          {label}
        </option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value} className="px-[4px]">
            {opt.label}
          </option>
        ))}
        <RightIcon
          classname={`rotate-90 absolute right-0 top-0 transition-all z-50 duration-200`}
          color="#BCBFC2"
        />
      </select>
    </div>
  );
};

export default SelectBox;
