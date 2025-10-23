import React from "react";
import logo from "../assets/graodireto.webp";


type LogoProps = {
  size?: number;
};

export const LogoPrimary: React.FC<LogoProps> = ({ size }) => {
  return <img src={logo} alt="Logo Primary" style={{ width: size }} />;
};

export const LogoSecondary: React.FC<LogoProps> = ({ size }) => {
  return <img src={logo} alt="Logo Secondary" style={{ width: size }} />;
};

export const LogoTertiary: React.FC<LogoProps> = ({ size }) => {
  return <img src={logo} alt="Logo Tertiary" style={{ width: size }} />;
};