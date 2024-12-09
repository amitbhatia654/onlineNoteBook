import React from "react";
import { Outlet } from "react-router-dom";

export default function HomePageLayout() {
  return (
    <div
      style={{
        minHeight: "90vh",
        maxHeight: "90vh",
        // borderTop: "1px solid lightgrey",
        // border:"1px solid black"
      }}
    >
      <div className="scrollable-container">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
