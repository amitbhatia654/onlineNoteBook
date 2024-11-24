import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";

export default function HomePageLayout() {
  return (
    <div className="border border-primary" style={{ minHeight: "80vh" }}>
      <Outlet></Outlet>
    </div>
  );
}
