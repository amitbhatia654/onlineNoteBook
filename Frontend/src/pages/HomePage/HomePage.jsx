import React, { useEffect, useState } from "react";
import Modal from "../HelperPages/Modal";
import { Button, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { ErrorMessage, Form, Formik } from "formik";
import axiosInstance from "../../ApiManager";
import { useLocation, useNavigate } from "react-router-dom";
import { addEmployee } from "../../assets/FormSchema";
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
    <div className="homepage">
      <div className="">
        <h2
          className="text-center mt-1"
          style={{
            textShadow: "1px 1px 1px blue",
            color: "blue",
            // fontWeight: "bold",
          }}
        >
          SELECT SUBJECT{" "}
        </h2>
        <hr />

        <div className="container mt-5">
          <div className="row">
            <div className="col-md-2 ">
              <div
                className="boxes create-box"
                onClick={() => setShowModal(true)}
              >
                {" "}
                <h4>Add Subject +</h4>
              </div>
            </div>

            {allSubject.map((subject) => {
              return (
                <>
                  <div
                    className="col-md-2 "
                    onClick={() =>
                      navigate(`/topic/${subject.subjectName}`, {
                        state: { subject },
                      })
                    }
                  >
                    <div className="boxes">{subject.subjectName} </div>
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
                        <label htmlFor="">Subject Name</label>
                        <FormControl
                          fullWidth
                          variant="outlined"
                          size="small"
                          sx={{ my: 1 }}
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
