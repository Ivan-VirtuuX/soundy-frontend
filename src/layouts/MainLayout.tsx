import React from "react";
import { Navbar } from "@/components/Navbar";

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
  return (
    <div
      className={`${
        fullWidth ? "fullWidthLayoutContainer" : "layoutContainer"
      }`}
    >
      {!hidden && (
        <div className="leftSide">
          <Navbar />
        </div>
      )}
      <div className="layoutContent">{children}</div>
    </div>
  );
};
