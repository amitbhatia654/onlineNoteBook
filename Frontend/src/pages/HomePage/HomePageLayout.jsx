import React from "react";
import { Outlet } from "react-router-dom";

export default function HomePageLayout() {
  return (
    <div style={{ minHeight: "92vh", maxHeight: "92vh" }}>
      <div className="scrollable-container">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
