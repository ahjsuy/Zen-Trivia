import { useState } from "react";

interface Props {
  category: string;
  displayName: string;
  isChecked: boolean;
  handleCheckboxChange: (item: string) => void;
}

const Checkbox = ({ handleCheckboxChange, category, displayName, isChecked }: Props) => {
  const handleChange = () => {
    handleCheckboxChange(category);
  };
  return (
    <div className="form-check">

      <input
        className="form-check-input"
        type="checkbox"
        value=""
        id="flexCheckDefault"
        onChange={handleChange}
        checked={isChecked}
      />
      <label className="form-check-label" htmlFor="flexCheckDefault">
        {displayName}
      </label>
    </div>
  );
};

export default Checkbox;
