import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@mui/material";
import axiosInstance from "../../ApiManager";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import HomeIcon from "@mui/icons-material/Home";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import ShowToast, { handlePrint } from "../../Components/CommonFunctions";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useNavigate } from "react-router-dom";

export default function TopicBody({
  currentTopic,
  setCurrentTopic,
  writeData,
  setWriteData,
  currentFolder,
  allTopics,
  fetching,
}) {
  const [loading, setloading] = useState(false);
  const [data, setData] = useState(currentTopic?.description);

  const printRef = useRef();
  const quillRef = useRef(null);
  const navigate = useNavigate();

  const focusEditor = () => {
    setTimeout(() => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        const contentLength = editor.getLength();
        editor.setSelection(contentLength, 0);
        editor.focus();
      }
    }, [100]);
  };

  useEffect(() => {
    setData(currentTopic?.description ?? "Empty Topic !");
  }, [currentTopic]);

  const module = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      ["code-block"],
      [
        "bold",
        "italic",
        "underline",
        "strike",
        { color: [] },
        { background: [] },
      ],
      [{ align: [] }],

      [{ list: "ordered" }, { list: "bullet" }],

      ["image", "video"],

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
      ShowToast();
      return;
    }

    localStorage.removeItem("folderId");
    localStorage.removeItem("topicId");

    navigate("/");
  };

  const handleSubmit = async () => {
    setloading(true);
    const res = await axiosInstance.put(`/api/topicData`, {
      description: data,
      topicId: currentTopic._id,
      folderId: currentFolder._id,
    });

    if (res.status == 200) {
      toast.success(res.data.message);

      allTopics.map((topic) => {
        if (topic._id == currentTopic._id) {
          topic.description = res.data.updatedTopic.description;
        }
        return topic;
      });
      setWriteData(false);
      setloading(false);
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
                  border: "0px",
                  marginTop: "2px",
                }}
                onClick={() => {
                  goToHomePage();
                }}
              >
                <HomeIcon />
              </button>
            </div>
            <div>
              <span className="folder-name">
                {currentFolder?.subjectName?.trim().charAt(0).toUpperCase() +
                  currentFolder?.subjectName?.trim().slice(1)}
              </span>
              <span className="topic-name ">
                -{" "}
                {currentTopic?.title?.charAt(0)?.toUpperCase() +
                  currentTopic?.title?.slice(1) ?? "--"}
              </span>
            </div>
            {!writeData ? (
              <div>
                <Button
                  variant="outlined"
                  sx={{
                    color: "blue",
                    backgroundColor: "white",
                    fontSize: "15px",
                  }}
                  onClick={() => {
                    if (data == "Empty Topic !") setData("");
                    setWriteData(true);
                    focusEditor();
                  }}
                >
                  Write <DriveFileRenameOutlineIcon sx={{ fontSize: "19px" }} />
                </Button>

                <Button
                  variant="outlined"
                  sx={{
                    color: "white",
                    m: 1,
                    backgroundColor: "blue",
                    fontSize: "14px",
                  }}
                  onClick={() =>
                    handlePrint(
                      printRef,
                      currentFolder.subjectName,
                      currentTopic.title
                    )
                  }
                >
                  <LocalPrintshopIcon></LocalPrintshopIcon>
                </Button>
              </div>
            ) : (
              <div>
                <div className="d-flex justify-content-center my-2">
                  <Button
                    variant="outlined"
                    sx={{
                      my: 1,
                      color: "#47478c",
                      backgroundColor: "white",
                      fontSize: "14px",
                    }}
                    disabled={loading}
                    onClick={() => {
                      setWriteData(false);
                      setData(currentTopic?.description ?? "Empty Topic !");
                    }}
                  >
                    Cancel
                  </Button>

                  <LoadingButton
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    sx={{
                      m: 1,
                      color: "white",
                      backgroundColor: loading ? "white " : "blue",
                      fontSize: "14px",
                    }}
                    variant="outlined"
                    onClick={() => handleSubmit()}
                  >
                    Save
                  </LoadingButton>
                </div>
              </div>
            )}
          </div>

          {fetching ? (
            <div
              style={{ height: "82vh" }}
              className="d-flex justify-content-center align-items-center"
            >
              {/* <div className="loader">Loading</div> */}
              <h5 className="m-2">Fetching Data Please Wait...</h5>
            </div>
          ) : writeData ? (
            <>
              <ReactQuill
                theme="snow"
                value={data}
                onChange={setData}
                modules={module}
                className="ql-style"
                ref={quillRef}
              />
            </>
          ) : (
            <>
              <div
                style={{
                  minHeight: "75vh",
                  maxHeight: "75vh",
                  boxShadow: "1px 1px 1px grey",

                  userSelect: "none",
                }}
                className="scrollable-container p-2   data-div"
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
                  border: "0px",
                  marginTop: "2px",
                }}
                onClick={() => {
                  goToHomePage();
                }}
              >
                <HomeIcon />
              </button>
            </div>
            <div>
              <span className="folder-name">
                {currentFolder?.subjectName?.trim().charAt(0).toUpperCase() +
                  currentFolder?.subjectName?.trim().slice(1)}
              </span>
            </div>

            <div></div>
          </div>
          <div
            style={{ height: "82vh" }}
            className="d-flex justify-content-center align-items-center"
          >
            {fetching ? (
              <>
                {/* <div className="loader">Loading</div> */}
                <h5 className="m-2 text-primary">
                  Fetching Data Please Wait...
                </h5>
              </>
            ) : (
              <h2
                className="text-primary "
                style={{ textShadow: "2px 1px blue" }}
              >
                {" "}
                Create Topic and start writing about it !
              </h2>
            )}
          </div>
        </>
      )}
    </>
  );
}
