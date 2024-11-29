import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@mui/material";
import axiosInstance from "../../ApiManager";

export default function TopicBody({ currentTopic, fetchData }) {
  const location = useLocation();
  const id = null;
  const { subject } = location?.state;
  const navigate = useNavigate();
  const [writeData, setWriteData] = useState(false);
  const [loading, setloading] = useState(false);
  const [data, setData] = useState(currentTopic?.description);

  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current; // Access the div content
    // console.log(printContent, "print con");
    const newWindow = window.open("", "_blank"); // Open a new window
    newWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
        </head>
        <body>
        <h2 className="text-danger"}>${subject.subjectName}: ${
      currentTopic?.topicName ?? "--"
    }</h2>
          ${printContent.innerHTML} <!-- Insert the div content -->
        </body>
      </html>
    `);
    newWindow.document.close();

    // Close the new window after printing is complete
    newWindow.onafterprint = () => {
      newWindow.close();
    };

    newWindow.print();
  };

  useEffect(() => {
    setData(currentTopic?.description);
  }, [currentTopic]);

  const module = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // Header dropdown
      ["bold", "italic", "underline", "strike"], // Formatting buttons
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      ["link", "image"], // Link and image options
      ["clean"], // Clear formatting
    ],
  };

  const handleSubmit = async () => {
    setloading(true);
    const res = id
      ? await axiosInstance.put(`/api/employee/${id}`, {
          ...data,
          // _id: user.id,
        })
      : await axiosInstance.put(`/api/topicData`, {
          description: data,
          topicId: currentTopic._id,
        });
    setWriteData(false);
    fetchData();
    setloading(false);
    if (res.status == 200) {
      toast.success(res.data);
      // navigate("/employees");
      // setShowModal(false);
    }
  };
  return (
    <>
      <div className="d-flex justify-content-between">
        <Button
          variant="outlined"
          type="submit"
          sx={{
            my: 1,
            // mx: 1,
            color: "#47478c",
            backgroundColor: "white",
            fontSize: "16px",
          }}
          onClick={() => navigate("/")}
        >
          Home
        </Button>{" "}
        <h2 className="text-danger" style={{ textDecoration: "underline" }}>
          {" "}
          {subject.subjectName}- {currentTopic?.topicName ?? "--"}
        </h2>
        {!writeData && (
          <div>
            <Button
              variant="outlined"
              type="submit"
              sx={{
                my: 1,
                // mx: 1,
                color: "#47478c",
                backgroundColor: "white",
                fontSize: "16px",
              }}
              onClick={() => setWriteData(true)}
            >
              Write / Edit
            </Button>

            <Button
              variant="outlined"
              type="submit"
              sx={{
                my: 1,
                mx: 1,
                color: "white",
                backgroundColor: "blue",
                fontSize: "16px",
              }}
              onClick={() => handlePrint()}
            >
              Print
            </Button>
          </div>
        )}
      </div>

      {writeData ? (
        <>
          <ReactQuill
            theme="snow"
            value={data}
            onChange={setData}
            modules={module}
            className="ql-style"
          />

          <div className="d-flex justify-content-center my-2">
            <Button
              variant="outlined"
              type="submit"
              sx={{
                my: 1,
                mx: 1,
                color: "#47478c",
                backgroundColor: "white",
                fontSize: "16px",
              }}
              disabled={loading}
              onClick={() => {
                setWriteData(false), fetchData();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              type="submit"
              sx={{
                my: 1,
                color: "#47478c",
                backgroundColor: "white",
                fontSize: "16px",
              }}
              disabled={loading}
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
          </div>
        </>
      ) : (
        <div
          style={{
            minHeight: "75vh",
            maxHeight: "70vh",
            // borderTop: "1px solid",
            // borderBottom: "1px solid",
            boxShadow: "3px 4px 7px grey",
          }}
          className="scrollable-container p-2 mt-2 data-div"
        >
          <div ref={printRef} dangerouslySetInnerHTML={{ __html: data }} />
        </div>
      )}
    </>
  );
}
