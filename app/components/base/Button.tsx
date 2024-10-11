import React from "react";
import { ClipLoader } from "react-spinners";

interface ButtonProps {
  label: string;
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, isLoading, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`bg-white text-black border-2 border-gray-300 rounded-lg px-5 py-2 text-base font-medium shadow-md transition-all duration-300 ${
        disabled || isLoading
          ? "opacity-75 cursor-not-allowed"
          : "hover:bg-gray-100"
      }`}
    >
      {isLoading ? (
        <ClipLoader
          color={"#ffffff"}
          loading={true}
          size={20}
        />
      ) : (
        label
      )}
    </button>
  );
};

export default Button;
