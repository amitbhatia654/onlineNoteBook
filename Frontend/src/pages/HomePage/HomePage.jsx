import React, { useEffect, useState } from "react";
import Modal from "../HelperPages/Modal";
import { Button, FormControl, OutlinedInput } from "@mui/material";
import { ErrorMessage, Form, Formik } from "formik";
import axiosInstance from "../../ApiManager";
import { AddFolder } from "../../assets/FormSchema";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch } from "react-redux";
import { addAllFolders, addFolder } from "../../reduxStore/UserSlice";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storedFolders = useSelector((state) => state.FolderStore);
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState({});
  const [loading, setloading] = useState(false);
  const [loading1, setloading1] = useState(false);
  const [allFolders, setAllFolders] = useState(storedFolders);
  const user = useSelector((state) => state.loginUser);

  const fetchData = async () => {
    setloading(true);
    const res = await axiosInstance.get("/api/folders", {
      params: { userId: user.id },
    });
    if (res.status == 200) {
      setAllFolders(res.data.response);
      localStorage.setItem("allFolders", JSON.stringify(res.data.response));
      dispatch(addAllFolders(res.data.response));
    } else {
      setAllFolders([]);
    }
    setloading(false);
  };

  useEffect(() => {
    {
      storedFolders?.length < 1 && fetchData();
    }
  }, []);

  const handleDelete = async (id) => {
    const res = await axiosInstance.delete(`/api/folders/${id}`);
    if (res.status == 200) {
      toast.success(res.data.message);
      setAllFolders(allFolders.filter((data) => data._id != id));
      dispatch(addAllFolders(allFolders.filter((data) => data._id != id)));
      localStorage.setItem(
        "allFolders",
        JSON.stringify(allFolders.filter((data) => data._id != id))
      );
    }
  };

  const handleSubmit = async (values) => {
    try {
      setloading1(true);
      const res = edit._id
        ? await axiosInstance.put(`/api/folders/${edit._id}`, {
            ...values,
          })
        : await axiosInstance.post(`/api/folders`, {
            ...values,
            userId: user.id,
          });

      if (res.status == 200) {
        toast.success(res.data.message);
        if (!edit?._id) {
          localStorage.setItem(
            "allFolders",
            JSON.stringify([...storedFolders, res.data.folder])
          );
          setAllFolders([...storedFolders, res.data.folder]);
          dispatch(addAllFolders([...storedFolders, res.data.folder]));
        } else {
          allFolders.map((folder) => {
            if (folder._id == values._id)
              folder.subjectName = values.subjectName;

            return folder;
          });
        }
        setEdit({});
        setShowModal(false);
      }
      setloading1(false);
    } catch (error) {
      console.log(error, "error in add or Update folders");
    }
  };

  return (
    <>
      <div className="homepage">
        <div className="">
          <div className="folder-container scrollable-container">
            <h2 className="text-center fw-bold folder-heading">Folders</h2>
            <div className="d-flex flex-wrap">
              <div className="mx-2 my-3" onClick={() => setShowModal(true)}>
                <div className="upper-side-create"></div>
                <div className="create-box">
                  <div className="inner-box p-4 fs-3 ">
                    {" "}
                    New <AddToPhotosIcon />{" "}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="mx-5 mt-5">Fething Data Please Wait ...</div>
              ) : (
                allFolders.map((subject, key) => {
                  return (
                    <div key={key}>
                      <div className="mx-2 my-3 boxes-outer">
                        <div className="upper-side "></div>
                        <div className="boxes">
                          <div
                            className="inner-box pt-4 px-3"
                            onClick={() => {
                              dispatch(addFolder(subject));
                              localStorage.setItem(
                                "current_folder",
                                JSON.stringify(subject)
                              );
                              navigate("/topics");
                            }}
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
                                <h6 className="actionBtn">
                                  <MoreVertIcon fontSize="8px" />
                                </h6>
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
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div
          className=" mt-2 mx-4  border-primary"
          style={{ backgroundColor: "#e6ebf1" }}
        >
          <div className="">
            <h5 className="text-primary">Instructions: How to Use the App</h5>
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
              validationSchema={AddFolder}
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
                              placeholder="Enter Folder Name"
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
                            disabled={loading1}
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
    </>
  );
}
