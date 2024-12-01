import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@mui/material";
import axiosInstance from "../../ApiManager";

export default function TopicBody({
  currentTopic,
  fetchData,
  allTopics,
  setCurrentTopic,
}) {
  const location = useLocation();
  const id = null;
  const subject = location?.state?.subject;
  const navigate = useNavigate();
  const [writeData, setWriteData] = useState(false);
  const [loading, setloading] = useState(false);
  const [data, setData] = useState(currentTopic?.description);

  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current; // Access the div content
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
    setData(currentTopic?.description ?? "Empty Topic 🤷‍♂️");
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

  const handlePrevNext = () => {
    const currentIndex = allTopics?.findIndex(
      (topic) => topic?._id == currentTopic?._id
    );

    // console.log(currentIndex, "cureent index");

    function clickNext() {
      setCurrentTopic(allTopics[currentIndex + 1]);
    }

    function clickPrev() {
      setCurrentTopic(allTopics[currentIndex - 1]);
    }

    function checkPrev() {
      if (currentIndex < 1) return true;
      return false;
    }

    function checkNext() {
      if (currentIndex == allTopics?.length - 1) return true;
      return false;
    }

    return { clickNext, clickPrev, checkNext, checkPrev };
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
      {currentTopic?._id ? (
        <>
          <div className="d-flex justify-content-between">
            <Button
              sx={{
                my: 1,
                // mx: 1,
                color: "#47478c",
                backgroundColor: "white",
                fontSize: "16px",
              }}
              onClick={() => {
                navigate("/"), localStorage.removeItem("topicId");
              }}
            >
              Home
            </Button>{" "}
            <h2 className="text-danger" style={{ textDecoration: "underline" }}>
              {" "}
              {subject?.subjectName.charAt(0).toUpperCase() +
                subject?.subjectName.slice(1)}
              -{" "}
              {currentTopic?.topicName?.charAt(0)?.toUpperCase() +
                currentTopic?.topicName?.slice(1) ?? "--"}
            </h2>
            {!writeData ? (
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
            ) : (
              <div></div>
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
                    color: "white",
                    backgroundColor: "blue",
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
            <>
              <div
                style={{
                  minHeight: "75vh",
                  maxHeight: "70vh",
                  boxShadow: "3px 4px 7px grey",
                  userSelect: "none",
                }}
                className="scrollable-container p-2 mt-1 data-div"
              >
                <div
                  ref={printRef}
                  dangerouslySetInnerHTML={{ __html: data }}
                />
              </div>
              <div className="d-flex justify-content-between  px-1 mt-2">
                <Button
                  sx={{
                    color: "white",
                    backgroundColor: `${
                      handlePrevNext().checkPrev() ? "grey" : "blue"
                    }`,
                    fontSize: "14px",
                  }}
                  disabled={handlePrevNext().checkPrev()}
                  onClick={() => handlePrevNext().clickPrev()}
                >
                  Prev
                </Button>
                <Button
                  sx={{
                    color: "white",
                    backgroundColor: `${
                      handlePrevNext().checkNext() ? "grey" : "blue"
                    }`,
                    fontSize: "14px",
                  }}
                  disabled={handlePrevNext().checkNext()}
                  onClick={() => handlePrevNext().clickNext()}
                >
                  Next
                </Button>
              </div>{" "}
            </>
          )}
        </>
      ) : (
        <div
          style={{ height: "90vh" }}
          className="d-flex justify-content-center align-items-center"
        >
          <h4> Topics will appear here once created! 😊</h4>
        </div>
      )}
    </>
  );
}
