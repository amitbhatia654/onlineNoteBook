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
  const subjectDetails = location?.state?.subject;

  const id = null;

  const handleSubmit = async (values) => {
    setloading(true);
    const res = id
      ? await axiosInstance.put(`/api/employee/${id}`, {
          ...values,
          // _id: user.id,
        })
      : await axiosInstance.post(`/api/topics`, {
          ...values,
          subjectId: subjectDetails._id,
        });

    setloading(false);
    if (res.status == 200) {
      toast.success(res.data);
      // navigate("/employees");
      setShowModal(false);
    }
  };

  const fetchData = async () => {
    setloading(true);
    const res = await axiosInstance.get("/api/topics", {
      params: { subjectId: subjectDetails?._id },
    });

    if (res.status == 200) {
      setAllTopics(res.data.response);
      if (!localStorage.getItem("topicId")) {
        if (res.data.response.length > 0) setCurrentTopic(res.data.response[0]);
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
  }, [showModal]);
  return (
    <>
      <div className="d-flex ">
        <div
          className={!isOpen ? "sidenav-full" : "sidenav-small"}
          style={{
            // borderTop: "2px solid grey",
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

          <div className={`${isOpen && "d-none"} `}>
            <h2 className="">ALL Topics</h2>

            <div>
              <TextField
                type="text"
                size="small"
                onChange={(e) => {
                  // setSearch(e.target.value);
                  // setCurrentPage(1);
                }}
                placeholder="search"
              ></TextField>
            </div>

            {/* <button
              className="btn btn-primary mt-1 mx-1"
              onClick={() => setShowModal(true)}
            >
              {" "}
              New Topic
            </button> */}
            {allTopics.map((topic, id) => {
              return (
                <div
                  className="topicNames"
                  onClick={() => {
                    setCurrentTopic(topic),
                      localStorage.setItem("topicId", topic._id);
                  }}
                  key={id}
                >
                  {id + 1}. {topic.topicName}
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            width: "100%",
          }}
        >
          <div
            style={{
              padding: "5px",
              // paddingLeft: "5px",
            }}
          >
            <TopicBody
              currentTopic={currentTopic}
              fetchData={fetchData}
            ></TopicBody>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          title={"Create Topic "}
          handleSubmit={handleSubmit}
        >
          <Formik
            initialValues={
              id
                ? data
                : {
                    topicName: "",
                  }
            }
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
