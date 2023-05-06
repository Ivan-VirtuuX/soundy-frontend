import React from "react";

import { useRouter } from "next/router";

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
            : 0,
          alignItems:
            match992 &&
            router.asPath.includes("conversations") &&
            router.query.id &&
            "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};
