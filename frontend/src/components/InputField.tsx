import React from "react";

type InputProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  icon?: React.ReactNode;
};

const InputField: React.FC<InputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  className = "",
  required = false,
  icon,
}) => {
    return (
        <div className={`w-full ${className}`}>
          <label className="block text-textPrimary mb-1">{label}</label>
          <div className="relative flex items-center">
            {icon && <span className="absolute left-3 text-gray-500">{icon}</span>}
            <input
              type={type}
              value={value}
              onChange={onChange}
              required={required}
              className={`w-full px-4 py-3 border rounded-lg text-textSecondary focus:outline-none focus:ring-2 focus:ring-secondary ${
                icon ? "pl-10" : ""
              }`} 
            />
          </div>
        </div>
      );
};

export default InputField;
