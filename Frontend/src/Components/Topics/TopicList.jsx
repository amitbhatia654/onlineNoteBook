import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Modal from "../../pages/HelperPages/Modal";
import { ErrorMessage, Form, Formik } from "formik";
import axiosInstance from "../../ApiManager";
import toast from "react-hot-toast";
import TopicBody from "../../pages/BodySection/TopicBody";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShowToast from "../CommonFunctions";
import ReorderIcon from "@mui/icons-material/Reorder";
import { useSelector } from "react-redux";
import RearrangeTopicOrder from "../RearrangeTopicOrder";

export default function TopicList({ allFolders, setAllFolders }) {
  const [showModal, setShowModal] = useState(false);
  const [allTopics, setAllTopics] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [loading, setloading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [editTopic, setEditTopic] = useState({});
  const [search, setSearch] = useState("");
  const [reArrangeOrder, setReArrangeOrder] = useState(false);
  const [writeData, setWriteData] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState({});

  const currentFolder = useSelector((store) => store.currentFolder);

  useEffect(() => {
    getAllTopics();
  }, []);
  const getAllTopics = async () => {
    setFetching(true);
    const res = await axiosInstance.get("/api/all-topics", {
      params: { folderId: currentFolder._id },
    });

    if (res.status == 200) {
      setAllTopics(res.data.topics);
    } else {
      setAllTopics;
    }
    setFetching(false);
  };

  useEffect(() => {
    if (!localStorage.getItem("topicId")) {
      if (getTopics()?.length > 0) {
        setCurrentTopic(getTopics()[0]);
      }
    } else {
      setCurrentTopic(
        getTopics().filter(
          (data) => data._id == localStorage.getItem("topicId")
        )[0]
      );
    }
  }, [search, allTopics, fetching]);

  function getTopics() {
    if (search) {
      return allTopics.filter((topic) =>
        topic.title.toLowerCase().includes(search.toLowerCase())
      );
    } else return allTopics;
  }

  const handleSubmit = async (values) => {
    setSearch("");
    setloading(true);

    try {
      const res = editTopic._id
        ? await axiosInstance.put(`/api/topic`, {
            ...values,
            folderId: currentFolder._id,
            topicId: editTopic._id,
          })
        : await axiosInstance.post(`/api/topic`, {
            ...values,
            currentFolder,
          });

      setloading(false);

      if (res?.status === 200) {
        if (editTopic?._id) {
          allTopics.map((topic) => {
            if (topic._id === res.data.topic._id) {
              topic.title = res.data.topic.title;
            }
            return topic;
          });
        } else {
          allTopics.push(res.data.topic);
        }

        toast.success(res.data.message);
        setEditTopic({});
        setShowModal(false);
      }
    } catch (error) {
      setloading(false);
      console.error("API error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while processing your request."
      );
    }
  };

  const deleteTopic = async (topicId) => {
    try {
      setSearch("");
      const res = await axiosInstance.delete(`/api/topic`, {
        data: {
          folderId: currentFolder._id,
          topicId: topicId,
        },
      });

      if (res.status == 200) {
        setAllTopics(allTopics.filter((topic) => topic._id != topicId));

        toast.success(res.data.message);
        const currentIndex = getTopics()?.findIndex(
          (topic) => topic?._id == topicId
        );

        if (getTopics().length <= 1) {
          setCurrentTopic({});
          localStorage.removeItem("topicId");
        } else {
          if (currentIndex == 0) {
            setCurrentTopic(getTopics()[currentIndex + 1]);
            localStorage.setItem("topicId", getTopics()[currentIndex + 1]._id);
          } else {
            setCurrentTopic(getTopics()[currentIndex - 1]);
            localStorage.setItem("topicId", getTopics()[currentIndex - 1]._id);
          }
        }
      } else toast.error(res.data.message);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleChangeTopic = (topic) => {
    if (writeData) {
      ShowToast();
      return;
    }
    setCurrentTopic(topic);
    localStorage.setItem("topicId", topic._id);
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
          <div className="d-flex justify-content-between">
            <div className={`${isOpen && "d-none"}   `}>
              <span className="topic-heading">TOPICS</span>
              {/* <span className="dropdown">
                <button
                  className="btn "
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <h6>
                    <MoreVertIcon sx={{ fontSize: "19px" }} />
                  </h6>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setReArrangeOrder(true);
                      }}
                    >
                      Rearrange Order
                    </button>
                  </li>
                </ul>
              </span> */}
            </div>

            <div>
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
          </div>

          <div className={`${isOpen && "d-none"} px-2  `}>
            <div>
              <TextField
                type="text"
                sx={{ mb: 1 }}
                size="small"
                value={search}
                onChange={(e) => {
                  if (writeData) {
                    ShowToast();
                    return;
                  }
                  setSearch(e.target.value);
                  localStorage.removeItem("topicId");
                  setCurrentTopic({});
                }}
                placeholder="search"
              ></TextField>
            </div>

            <div className="new-topic mb-2" onClick={() => setShowModal(true)}>
              Create Topic +{" "}
            </div>

            {fetching ? (
              <div className="d-flex justify-content-center mt-5">
                <div className="loader">fetching</div>
              </div>
            ) : getTopics()?.length < 1 ? (
              <h5 className="text-center text-primary my-4">
                No Topic Found !
              </h5>
            ) : (
              <div
                className="scrollable-container"
                style={{ minHeight: "69vh", maxHeight: "69vh" }}
              >
                <div>
                  {getTopics()?.map((topic, index) => {
                    return (
                      <div
                        style={{ userSelect: "none" }}
                        className="d-flex justify-content-between topicNames "
                        key={index}
                      >
                        <div
                          className={`d-flex names  border-primary ${
                            currentTopic?._id == topic?._id && "currentTopic"
                          }`}
                          onClick={() => {
                            handleChangeTopic(topic);
                          }}
                        >
                          <div>{index + 1}. </div>{" "}
                          <span className="mx-1">
                            {topic?.title?.charAt(0)?.toUpperCase() +
                              topic?.title?.slice(1)}
                          </span>
                        </div>

                        <div>
                          <div className="dropdown">
                            <button
                              className="btn "
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <h6>
                                <MoreVertIcon sx={{ fontSize: "19px" }} />
                              </h6>
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    if (writeData) {
                                      ShowToast();
                                      return;
                                    }
                                    setEditTopic(topic), setShowModal(true);
                                  }}
                                >
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    if (writeData) {
                                      ShowToast();
                                      return;
                                    }
                                    deleteTopic(topic._id);
                                  }}
                                >
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
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
            {reArrangeOrder ? (
              // <RearrangeTopicOrder
              //   selectedFolder={selectedFolder}
              //   setSelectedFolder={setSelectedFolder}
              //   setReArrangeOrder={setReArrangeOrder}
              //   reArrangeOrder={reArrangeOrder}
              // />
              <></>
            ) : (
              <TopicBody
                currentTopic={currentTopic}
                setCurrentTopic={setCurrentTopic}
                currentFolder={currentFolder}
                writeData={writeData}
                setWriteData={setWriteData}
                allTopics={allTopics}
                fetching={fetching}
              ></TopicBody>
            )}
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
                        <label htmlFor="">Topic Name</label>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          size="small"
                          sx={{ m: 1 }}
                        >
                          <OutlinedInput
                            id="title"
                            name="title"
                            placeholder="Enter Topic Name"
                            value={props.values.title}
                            onChange={props.handleChange}
                            // label="Name"
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
