import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../HelperPages/Modal";
import { ErrorMessage, Form, Formik } from "formik";
import axiosInstance from "../../ApiManager";
import toast from "react-hot-toast";
import TopicBody from "./TopicBody";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";

export default function TopicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [allTopics, setAllTopics] = useState([]);
  const [loading, setloading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [editTopic, setEditTopic] = useState({});
  const subjectDetails = location?.state?.subject;
  const [search, setSearch] = useState("");
  const [writeData, setWriteData] = useState(false);

  const id = null;

  const handleSubmit = async (values) => {
    setloading(true);
    const res = editTopic._id
      ? await axiosInstance.put(`/api/topics/${editTopic._id}`, {
          ...values,
        })
      : await axiosInstance.post(`/api/topics`, {
          ...values,
          subjectId: subjectDetails._id,
        });

    setloading(false);
    if (res.status == 200) {
      toast.success(res.data);
      setEditTopic({});
      fetchData();
      setShowModal(false);
    }
  };

  const deleteTopic = async (topicId) => {
    // return console.log(topicId, "topicId");
    const res = await axiosInstance.delete(`/api/topics/${topicId}`);
    if (res.status == 200) {
      toast.success(res.data.message);
      setAllTopics(allTopics.filter((topic) => topic._id != res.data.data._id));

      const currentIndex = allTopics?.findIndex(
        (topic) => topic?._id == topicId
      );

      if (allTopics.length <= 1) {
        setCurrentTopic({});
        localStorage.removeItem("topicId");
      } else {
        if (currentIndex == 0) {
          setCurrentTopic(allTopics[currentIndex + 1]);
          localStorage.setItem("topicId", allTopics[currentIndex + 1]._id);
        } else {
          setCurrentTopic(allTopics[currentIndex - 1]);
          localStorage.setItem("topicId", allTopics[currentIndex - 1]._id);
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

  const fetchData = async () => {
    setloading(true);
    const res = await axiosInstance.get("/api/topics", {
      params: { subjectId: subjectDetails?._id, search },
    });

    if (res.status == 200) {
      if (res.data.response.length == 0) setCurrentTopic({});
      setAllTopics(res.data.response);
      if (!localStorage.getItem("topicId")) {
        if (res.data.response.length > 0) {
          setCurrentTopic(res.data.response[0]);
        }
      } else {
        setCurrentTopic(
          res.data.response.filter(
            (data) => data._id == localStorage.getItem("topicId")
          )[0]
        );
      }
    } else {
      setAllTopics([]);
    }
    setloading(false);
  };

  useEffect(() => {
    fetchData();
  }, [search]);
  return (
    <>
      <div className="d-flex main-body">
        <div
          className={!isOpen ? "sidenav-full" : "sidenav-small"}
          style={{
            borderRight: "2px solid grey",
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

            {allTopics.length < 1 ? (
              <h5 className="text-center text-primary my-4">
                No Topic Found! 😴
              </h5>
            ) : (
              allTopics.map((topic, id) => {
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
                      {topic.topicName.charAt(0)?.toUpperCase() +
                        topic.topicName.slice(1)}
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
              fetchData={fetchData}
              allTopics={allTopics}
              setCurrentTopic={setCurrentTopic}
              writeData={writeData}
              setWriteData={setWriteData}
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
            initialValues={{ topicName: editTopic ? editTopic.topicName : "" }}
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
                            shrink={Boolean(props.values.topicName)}
                            htmlFor="topicName"
                          >
                            Name
                          </InputLabel>
                          <OutlinedInput
                            id="topicName"
                            name="topicName"
                            placeholder="enter name"
                            value={props.values.topicName}
                            onChange={props.handleChange}
                            label="Name"
                          />
                        </FormControl>
                        <ErrorMessage
                          name="topicName"
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
