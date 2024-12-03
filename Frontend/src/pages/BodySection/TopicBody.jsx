import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@mui/material";
import axiosInstance from "../../ApiManager";
import HomeIcon from "@mui/icons-material/Home";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import EditIcon from "@mui/icons-material/Edit";
import EditNoteIcon from "@mui/icons-material/EditNote";

export default function TopicBody({
  currentTopic,
  fetchData,
  allTopics,
  setCurrentTopic,
  writeData,
  setWriteData,
}) {
  const location = useLocation();
  const id = null;
  const subject = location?.state?.subject;
  const navigate = useNavigate();
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
      // Header dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["code-block", { blockquote: [] }],
      [
        "bold",
        "italic",
        "underline",
        "strike",
        { color: [] },
        { background: [] },
      ],

      [{ align: [] }],

      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],

      ["link", "image", "video"], // Link, image, and video insertion

      ["clean"],
    ],
  };

  const handlePrevNext = () => {
    const currentIndex = allTopics?.findIndex(
      (topic) => topic?._id == currentTopic?._id
    );

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

  const goToHomePage = () => {
    if (writeData) {
      toast(
        "You have unsaved changes. Please save or cancel before proceeding !",
        {
          duration: 3000,
          style: {
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
          },
        }
      );
      return;
    }

    navigate("/"), localStorage.removeItem("topicId");
  };

  const handleSubmit = async () => {
    setloading(true);
    const res = await axiosInstance.put(`/api/topicData`, {
      description: data,
      topicId: currentTopic._id,
    });
    setWriteData(false);
    fetchData();
    setloading(false);
    if (res.status == 200) {
      toast.success(res.data);
    }
  };
  return (
    <>
      {currentTopic?._id ? (
        <>
          <div className="d-flex justify-content-between">
            <button
              style={{
                color: "white",
                backgroundColor: "blue",
                height: "30px",
                marginTop: "7px",
                border: "0px",
              }}
              onClick={() => {
                goToHomePage();
              }}
            >
              <HomeIcon />
            </button>{" "}
            <h2
              className="text-primary heading"
              style={{
                textDecoration: "underline",
              }}
            >
              {" "}
              {subject?.subjectName.charAt(0).toUpperCase() +
                subject?.subjectName.slice(1)}
              -{" "}
              {currentTopic?.topicName?.charAt(0)?.toUpperCase() +
                currentTopic?.topicName?.slice(1) ?? "--"}
            </h2>
            {!writeData ? (
              <div>
                <button
                  style={{
                    color: "#47478c",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    marginTop: "7px",
                    border: "0px",
                    fontSize: "16px",
                    marginRight: "8px",
                  }}
                  onClick={() => setWriteData(true)}
                >
                  Modify <EditNoteIcon sx={{ fontSize: "30px" }}></EditNoteIcon>
                </button>

                <button
                  style={{
                    color: "white",
                    backgroundColor: "blue",
                    borderRadius: "8px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    marginTop: "7px",
                    border: "0px",
                    fontSize: "18px",
                    marginRight: "8px",
                  }}
                  onClick={() => handlePrint()}
                >
                  Print
                  <LocalPrintshopIcon sx={{ mx: 1, fontSize: "25px" }} />
                </button>
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
                className="ql-style "
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
                  Save
                </Button>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  minHeight: "77vh",
                  maxHeight: "77vh",
                  // boxShadow: "3px 4px 7px grey",
                  boxShadow: "1px 1px 1px grey",

                  userSelect: "none",
                }}
                className="scrollable-container p-3 mt-2  data-div"
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
                  <FirstPageIcon /> Prev
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
                  <LastPageIcon />
                </Button>
              </div>{" "}
            </>
          )}
        </>
      ) : (
        <>
          <div className="d-flex justify-content-between">
            <button
              style={{
                color: "white",
                backgroundColor: "blue",
                height: "30px",
                marginTop: "7px",
                border: "0px",
              }}
              onClick={() => {
                goToHomePage();
              }}
            >
              <HomeIcon />
            </button>

            <h2
              className="text-primary heading"
              style={{
                textDecoration: "underline",
              }}
            >
              {" "}
              {subject?.subjectName.charAt(0).toUpperCase() +
                subject?.subjectName.slice(1)}{" "}
            </h2>
            <div></div>
          </div>
          <div
            style={{ height: "82vh" }}
            className="d-flex justify-content-center align-items-center"
          >
            <h4>
              {" "}
              Topic information will show up here after you create a topic. 😊
            </h4>
          </div>
        </>
      )}
    </>
  );
}
