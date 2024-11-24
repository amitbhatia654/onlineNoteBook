import React, { useEffect, useState } from "react";
import Modal from "../HelperPages/Modal";
import { Button, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { ErrorMessage, Form, Formik } from "formik";
import axiosInstance from "../../ApiManager";
import { useLocation, useNavigate } from "react-router-dom";
import { addEmployee } from "../../assets/FormSchema";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
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
      console.log(res.data);
    } else {
      setAllSubject([]);
    }
    setloading(false);
  };

  useEffect(() => {
    fetchData();
  }, [showModal]);

  const handleSubmit = async (values) => {
    // return console.log(values, "values");
    setloading(true);
    const res = id
      ? await axiosInstance.put(`/api/employee/${id}`, {
          ...values,
          // _id: user.id,
        })
      : await axiosInstance.post(`/api/subjects`, {
          ...values,
          userId: user.id,
        });

    setloading(false);
    if (res.status == 200) {
      toast.success(res.data);
      // navigate("/employees");
      setShowModal(false);
    }
  };
  return (
    <>
      <div className="">
        <h4 className="text-center mt-1">Select Subject Name </h4>

        <div className="container mt-5">
          <div className="row">
            <div className="col-md-2 ">
              <div className="boxes" onClick={() => setShowModal(true)}>
                {" "}
                <h5>Add Subject +</h5>
              </div>
            </div>

            {allSubject.map((subject) => {
              return (
                <>
                  <div className="col-md-2 ">
                    <div className="boxes">{subject.subjectName}</div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          title={"Create Subject "}
          handleSubmit={handleSubmit}
        >
          <Formik
            initialValues={
              id
                ? data
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
                        <FormControl
                          fullWidth
                          variant="outlined"
                          size="small"
                          sx={{ m: 1 }}
                        >
                          <InputLabel
                            shrink={Boolean(props.values.subjectName)}
                            htmlFor="subjectName"
                          >
                            Name
                          </InputLabel>
                          <OutlinedInput
                            id="subjectName"
                            name="subjectName"
                            placeholder="enter name"
                            value={props.values.subjectName}
                            onChange={props.handleChange}
                            label="Name"
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
