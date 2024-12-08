import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Modal from "../HelperPages/Modal";
import { ErrorMessage, Form, Formik } from "formik";
import axiosInstance from "../../ApiManager";
import toast from "react-hot-toast";
import TopicBody from "./TopicBody";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";

export default function TopicLayout({
  selectedFolder,
  setSelectedFolder,
  refresh,
  setRefresh,
  allFolders,
  setAllFolders,
}) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setloading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [editTopic, setEditTopic] = useState({});
  const [search, setSearch] = useState("");
  const [writeData, setWriteData] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("topicId")) {
      if (selectedFolder.topics.length > 0) {
        setCurrentTopic(selectedFolder.topics[0]);
      }
    } else {
      setCurrentTopic(
        selectedFolder.topics.filter(
          (data) => data._id == localStorage.getItem("topicId")
        )[0]
      );
    }
  }, [selectedFolder]);

  const handleSubmit = async (values) => {
    setloading(true);
    const res = editTopic._id
      ? await axiosInstance.put(`/api/topic`, {
          ...values,
          folderId: selectedFolder._id,
          topicId: editTopic._id,
        })
      : await axiosInstance.post(`/api/topic`, {
          ...values,
          selectedFolder,
        });

    const updatedFolder = allFolders.map((folder) => {
      if (folder._id == selectedFolder._id) {
        return res.data.subject;
      }

      return folder;
    });

    setAllFolders(updatedFolder);
    setSelectedFolder(res.data.subject);

    setloading(false);
    if (res.status == 200) {
      toast.success(res.data.message);
      setEditTopic({});
      setShowModal(false);
    }
  };

  const deleteTopic = async (topicId) => {
    const res = await axiosInstance.delete(`/api/topic`, {
      data: {
        folderId: selectedFolder._id,
        topicId: topicId,
      },
    });

    if (res.status == 200) {
      toast.success(res.data.message);
      const updatedFolders = allFolders.map((folder) => {
        if (folder._id == selectedFolder._id) {
          return {
            ...folder,
            topics: folder.topics.filter((topic) => topic._id !== topicId),
          };
        }
        return folder;
      });

      setAllFolders(updatedFolders);
      setSelectedFolder(
        updatedFolders.filter((folder) => folder._id == selectedFolder._id)[0]
      );

      const currentIndex = selectedFolder.topics?.findIndex(
        (topic) => topic?._id == topicId
      );

      if (selectedFolder.topics.length <= 1) {
        setCurrentTopic({});
        localStorage.removeItem("topicId");
      } else {
        if (currentIndex == 0) {
          setCurrentTopic(selectedFolder.topics[currentIndex + 1]);
          localStorage.setItem(
            "topicId",
            selectedFolder.topics[currentIndex + 1]._id
          );
        } else {
          setCurrentTopic(selectedFolder.topics[currentIndex - 1]);
          localStorage.setItem(
            "topicId",
            selectedFolder.topics[currentIndex - 1]._id
          );
        }
      }
    } else toast.error(res.data.message);
  };

  const handleChangeTopic = (topic) => {
    if (writeData) {
      toast(
        "You have unsaved changes. Please save or cancel before proceeding !",
        {
          duration: 3000,
          style: {
            backgroundColor: "#f8d7da", // Example of background color
            color: "#721c24", // Example of text color
            border: "1px solid #f5c6cb", // Example of border
            padding: "10px", // Padding for the toast
            fontSize: "16px", // Font size
            borderRadius: "5px", // Rounded corners
          },
        }
      );
      return;
    }
    setCurrentTopic(topic), localStorage.setItem("topicId", topic._id);
  };

  return (
    <>
      <div className="d-flex main-body">
        <div
          className={!isOpen ? "sidenav-full" : "sidenav-small"}
          style={{
            borderRight: "1px solid grey",
          }}
        >
          <div className="d-flex justify-content-end">
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                color: "blue",
                border: "1px solid white",
                fontSize: "14x",
              }}
            >
              {isOpen ? (
                <MenuIcon fontSize="small" />
              ) : (
                <CloseIcon fontSize="small" />
              )}
            </button>
          </div>

          <div className={`${isOpen && "d-none"} px-2 `}>
            <h3
              className="fw-bold text-center"
              style={{ textDecoration: "underline" }}
            >
              {" "}
              Topics
            </h3>
            {/* <hr /> */}

            <div>
              <TextField
                type="text"
                sx={{ mb: 1 }}
                size="small"
                onChange={(e) => {
                  setSearch(e.target.value);
                  localStorage.removeItem("topicId");
                }}
                placeholder="search"
              ></TextField>
            </div>

            <div className="new-topic mb-2" onClick={() => setShowModal(true)}>
              Create New +{" "}
            </div>

            {selectedFolder?.topics?.length < 1 ? (
              <h5 className="text-center text-primary my-4">
                No Topic Found! 😴
              </h5>
            ) : (
              selectedFolder.topics.map((topic, id) => {
                return (
                  <div
                    className="d-flex justify-content-between topicNames"
                    key={id}
                  >
                    <div
                      className={`names ${
                        currentTopic?._id == topic?._id && "currentTopic"
                      }`}
                      onClick={() => {
                        handleChangeTopic(topic);
                      }}
                    >
                      {id + 1}.{" "}
                      {topic?.title?.charAt(0)?.toUpperCase() +
                        topic?.title?.slice(1)}
                    </div>

                    <div>
                      <div className="dropdown">
                        <button
                          className="btn "
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <h6>:</h6>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => {
                                setEditTopic(topic), setShowModal(true);
                              }}
                            >
                              Edit
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => deleteTopic(topic._id)}
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div
          style={{
            width: "100%",
          }}
        >
          <div
            style={{
              paddingLeft: "5px",
            }}
          >
            <TopicBody
              currentTopic={currentTopic}
              // fetchData={fetchData}
              // selectedFolder.topics={selectedFolder.topics}
              setCurrentTopic={setCurrentTopic}
              writeData={writeData}
              setWriteData={setWriteData}
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
              allFolders={allFolders}
              setAllFolders={setAllFolders}
              refresh={refresh}
              setRefresh={setRefresh}
            ></TopicBody>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          otherFunc={setEditTopic}
          title={`${editTopic._id ? "Edit" : "Create"} Topic `}
          handleSubmit={handleSubmit}
        >
          <Formik
            initialValues={{ title: editTopic ? editTopic.title : "" }}
            // validationSchema={addEmployee}
            enableReinitialize={true}
            onSubmit={(values) => handleSubmit(values)}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <div className=" ">
                  <div className="container-fluid ">
                    <div className="row">
                      <div className="">
                        <FormControl
                          fullWidth
                          variant="outlined"
                          size="small"
                          sx={{ m: 1 }}
                        >
                          <InputLabel
                            shrink={Boolean(props.values.title)}
                            htmlFor="title"
                          >
                            Name
                          </InputLabel>
                          <OutlinedInput
                            id="title"
                            name="title"
                            placeholder="enter name"
                            value={props.values.title}
                            onChange={props.handleChange}
                            label="Name"
                          />
                        </FormControl>
                        <ErrorMessage
                          name="title"
                          component={"div"}
                          className="text-danger"
                        ></ErrorMessage>
                      </div>

                      <div className="d-flex justify-content-center my-5">
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
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </>
  );
}
