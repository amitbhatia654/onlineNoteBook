import React, { useEffect, useState } from "react";
import Modal from "../HelperPages/Modal";
import { Button, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { ErrorMessage, Form, Formik } from "formik";
import axiosInstance from "../../ApiManager";
import { useLocation, useNavigate } from "react-router-dom";
import { addEmployee } from "../../assets/FormSchema";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState({});
  const [loading, setloading] = useState(false);
  const [allSubject, setAllSubject] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const user = useSelector((state) => state.cart);

  const fetchData = async () => {
    setloading(true);
    const res = await axiosInstance.get("/api/subjects", {
      params: { userId: user.id },
    });
    if (res.status == 200) {
      setAllSubject(res.data.response);
    } else {
      setAllSubject([]);
    }
    setloading(false);
  };

  useEffect(() => {
    fetchData();
  }, [showModal]);

  const handleDelete = async (id) => {
    const res = await axiosInstance.delete(`/api/subjects/${id}`);
    if (res.status == 200) {
      toast.success(res.data.message);
      setAllSubject(allSubject.filter((data) => data._id != id));
    }
  };

  const handleSubmit = async (values) => {
    // return console.log(values, "values");
    setloading(true);
    const res = edit._id
      ? await axiosInstance.put(`/api/subjects/${edit._id}`, {
          ...values,
        })
      : await axiosInstance.post(`/api/subjects`, {
          ...values,
          userId: user.id,
        });

    setloading(false);
    if (res.status == 200) {
      toast.success(res.data);
      setEdit({});
      setShowModal(false);
    }
  };
  return (
    <div className="homepage">
      <div className="">
        <h2 className="text-center  fw-bold folder-heading">
          Notebook Folders
        </h2>

        <div className="d-flex  flex-wrap mt-3 folder-container scrollable-container">
          <div className="m-2" onClick={() => setShowModal(true)}>
            <div className="upper-side-create"></div>
            <div className="create-box">
              <div className="inner-box ">
                {" "}
                New <AddToPhotosIcon />{" "}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="mx-5 mt-5">Fething Data Please Wait ...</div>
          ) : (
            allSubject.map((subject) => {
              return (
                <>
                  <div className="m-2">
                    <div className="upper-side"></div>
                    <div className="boxes">
                      <div
                        className="inner-box "
                        onClick={() =>
                          navigate(`/topic/${subject.subjectName}`, {
                            state: { subject },
                          })
                        }
                      >
                        {" "}
                        {subject.subjectName}
                      </div>
                      <div className="d-flex justify-content-end">
                        <div className="dropdown">
                          <button
                            className="btn "
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <h6 className="actionBtn">:</h6>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  setShowModal(true), setEdit(subject);
                                }}
                              >
                                <BorderColorIcon></BorderColorIcon> Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleDelete(subject._id)}
                              >
                                <DeleteIcon></DeleteIcon> Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })
          )}
        </div>
        {/* <hr /> */}

        <div className=" mt-3 mx-4 d-flex justify-content-end  border-primary">
          <div className="">
            <h5 className="text-danger">Instructions: How to Use the App</h5>
            <li>
              Organize your notes by creating folders for different categories.
            </li>
            <li>
              Select a folder and create topics to further structure your notes.
            </li>
            <li>
              Click on a topic to add or edit details, descriptions, or notes.
            </li>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          title={`${edit._id ? "Edit Folder" : "Create Folder"}`}
          handleSubmit={handleSubmit}
          otherFunc={setEdit}
        >
          <Formik
            initialValues={
              edit?._id
                ? edit
                : {
                    subjectName: "",
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
                        <label htmlFor="">Folder Name</label>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          size="small"
                          sx={{ my: 1 }}
                        >
                          <OutlinedInput
                            id="subjectName"
                            name="subjectName"
                            value={props.values.subjectName}
                            onChange={props.handleChange}
                          />
                        </FormControl>
                        <ErrorMessage
                          name="subjectName"
                          component={"div"}
                          className="text-danger"
                        ></ErrorMessage>
                      </div>

                      {/* <div className="">
                        <label htmlFor="">Box Color</label>
                        <div className="w-100">
                          <input
                            type="color"
                            name="boxColor"
                            style={{ width: "40%" }}
                            onChange={props.handleChange}
                          />
                        </div>

                        <ErrorMessage
                          name="subjectName"
                          component={"div"}
                          className="text-danger"
                        ></ErrorMessage>
                      </div> */}

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
    </div>
  );
}
