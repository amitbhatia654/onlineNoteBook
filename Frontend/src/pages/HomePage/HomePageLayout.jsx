import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";

export default function HomePageLayout() {
  return (
    <div
      className="border border-primary "
      style={{ minHeight: "86vh", maxHeight: "86vh" }}
    >
      <div className="scrollable-container">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
