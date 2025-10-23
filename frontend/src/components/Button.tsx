import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset"
};

const ButtonPrimary: React.FC<ButtonProps> = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 bg-primary text-white font-semibold rounded-md cursor-pointer transition hover:bg-secondary
        text-sm py-1 px-3 sm:py-1.5 sm:px-4
        ${className}`}
    >
      {children}
    </button>
  );
};

const ButtonSecondary: React.FC<ButtonProps> = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 bg-black text-textYellow font-semibold rounded-md cursor-pointer transition hover:bg-secondary
        text-sm py-1 px-3 sm:py-1.5 sm:px-4
        ${className}`}
    >
      {children}
    </button>
  );
};

export { ButtonPrimary, ButtonSecondary };
