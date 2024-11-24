import React from "react";
import { Outlet } from "react-router-dom";

export default function TopicLayout() {
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2 border border-dark">sidebar</div>

          <div className="col-md-10 border border-primary ">
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </div>
  );
}
