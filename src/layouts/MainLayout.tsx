import React from "react";

import { Navbar } from "@/components/Navbar";
import { MobileNavbar } from "@/components/MobileNavbar";

import { useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";

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
  const match768 = useMediaQuery("(max-width: 768px)");

  const router = useRouter();

  return (
    <div
      className={`${
        fullWidth ? "fullWidthLayoutContainer" : "layoutContainer"
      }`}
    >
      {!(
        match992 &&
        router.asPath.includes("conversations") &&
        router.query.id
      ) &&
        !hidden &&
        (match992 ? <MobileNavbar /> : <Navbar />)}
      <div
        className="layoutContent"
        style={{
          paddingTop: !(
            match992 &&
            router.asPath.includes("conversations") &&
            router.query.id
          )
            ? 25
            : 10,
        }}
      >
        {children}
      </div>
    </div>
  );
};
