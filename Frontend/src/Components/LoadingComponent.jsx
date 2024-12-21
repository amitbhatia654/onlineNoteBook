import React from "react";

export default function LoadingComponent() {
  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center "
        style={{ minHeight: "90vh" }}
      >
        <div>
          <div class="spinner-grow text-primary mx-1" role="status"></div>
          <div class="spinner-grow text-secondary mx-1" role="status"></div>
          <div class="spinner-grow text-success mx-1" role="status"></div>
          <div class="spinner-grow text-danger mx-1" role="status"></div>
          <div class="spinner-grow text-warning mx-1" role="status"></div>
          <div class="spinner-grow text-info mx-1" role="status"></div>
        </div>
      </div>
    </>
  );
}
