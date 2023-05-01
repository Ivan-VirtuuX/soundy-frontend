import React from "react";

import { Navbar } from "@/components/Navbar";
import { MobileNavbar } from "@/components/MobileNavbar";

import { useMediaQuery } from "@mui/material";

interface MainLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  hidden?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  fullWidth,
  hidden,
}) => {
  const match992 = useMediaQuery("(max-width: 992px)");

  return (
    <div
      className={`${
        fullWidth ? "fullWidthLayoutContainer" : "layoutContainer"
      }`}
    >
      {!hidden && (match992 ? <MobileNavbar /> : <Navbar />)}
      <div className="layoutContent">{children}</div>
    </div>
  );
};
