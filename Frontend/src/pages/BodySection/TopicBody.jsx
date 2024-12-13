import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@mui/material";
import axiosInstance from "../../ApiManager";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";

export default function TopicBody({
  currentTopic,
  setCurrentTopic,
  writeData,
  setWriteData,
  selectedFolder,
  setSelectedFolder,
  allFolders,
}) {
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
        <h2 className="text-danger"}>${selectedFolder?.title}: ${
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
    setData(currentTopic?.description ?? "Empty Topic !");
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
    const currentIndex = selectedFolder.topics?.findIndex(
      (topic) => topic?._id == currentTopic?._id
    );

    function clickNext() {
      setCurrentTopic(selectedFolder.topics[currentIndex + 1]);
    }

    function clickPrev() {
      setCurrentTopic(selectedFolder.topics[currentIndex - 1]);
    }

    function checkPrev() {
      if (currentIndex < 1) return true;
      return false;
    }

    function checkNext() {
      if (currentIndex == selectedFolder.topics?.length - 1) return true;
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

    localStorage.removeItem("folderId");
    localStorage.removeItem("topicId");

    setSelectedFolder({});
  };

  const handleSubmit = async () => {
    setloading(true);
    const res = await axiosInstance.put(`/api/topicData1`, {
      description: data,
      topicId: currentTopic._id,
      folderId: selectedFolder._id,
    });
    setWriteData(false);

    allFolders.map((folder) => {
      const topic = folder.topics.find((t) => t._id == currentTopic._id);
      if (topic) {
        topic.description = res.data.updatedTopic.description;
      }
      return folder;
    });

    setloading(false);
    if (res.status == 200) {
      toast.success(res.data.message);
    }
  };
  return (
    <>
      {currentTopic?._id ? (
        <>
          <div className="d-flex justify-content-between ">
            <div>
              <button
                style={{
                  color: "white",
                  backgroundColor: "blue",
                  // height: "30px",
                  border: "0px",
                }}
                onClick={() => {
                  goToHomePage();
                }}
              >
                <HomeIcon  />
              </button>
              <span className="text-primary fs-5 fw-bold   heading">
                {selectedFolder?.subjectName.trim().charAt(0).toUpperCase() +
                  selectedFolder?.subjectName.trim().slice(1)}
              </span>
            </div>
            <h4
              className="heading "
              style={
                {
                  // textDecoration: "underline",
                }
              }
            >
              {currentTopic?.title?.charAt(0)?.toUpperCase() +
                currentTopic?.title?.slice(1) ?? "--"}
            </h4>
            {!writeData ? (
              <div>
                <button
                  style={{
                    color: "#47478c",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    border: "0px solid blue",
                    boxShadow: "1px 3px 4px grey",
                    fontSize: "19px",
                    marginRight: "3px",
                    marginTop: "2px",
                  }}
                  onClick={() => setWriteData(true)}
                >
                  Edit <EditNoteIcon sx={{ fontSize: "25px" }}></EditNoteIcon>
                </button>

                <button
                  style={{
                    color: "white",
                    backgroundColor: "blue",
                    borderRadius: "8px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    boxShadow: "1px 3px 4px grey",

                    marginTop: "2px",
                    border: "0px",
                    fontSize: "19px",
                    marginRight: "8px",
                  }}
                  onClick={() => handlePrint()}
                >
                  <LocalPrintshopIcon sx={{ fontSize: "25px" }} />
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
                    setWriteData(false);
                    setData(currentTopic?.description ?? "Empty Topic !");
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
                  boxShadow: "1px 1px 1px grey",

                  userSelect: "none",
                }}
                className="scrollable-container p-2 mt-1  data-div"
              >
                <div
                  ref={printRef}
                  dangerouslySetInnerHTML={{ __html: data }}
                />
              </div>
              <div className="d-flex justify-content-between  px-1  mt-1">
                <Button
                  sx={{
                    color: "white",
                    backgroundColor: `${
                      handlePrevNext().checkPrev() ? "grey" : "blue"
                    }`,
                    fontSize: "12px",
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
                    fontSize: "12px",
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
          <div className="d-flex justify-content-between ">
            <div>
              <button
                style={{
                  color: "white",
                  backgroundColor: "blue",
                  height: "30px",
                  border: "0px",
                }}
                onClick={() => {
                  goToHomePage();
                }}
              >
                <HomeIcon />
              </button>
              <span className="text-primary fs-5 fw-bold mx-1 ">
                {selectedFolder?.subjectName.trim().charAt(0).toUpperCase() +
                  selectedFolder?.subjectName.trim().slice(1)}
              </span>
            </div>
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
