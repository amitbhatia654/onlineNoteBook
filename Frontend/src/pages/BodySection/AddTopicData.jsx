import { Button, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { ErrorMessage, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../ApiManager";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function AddTopicData({
  currentTopic,
  setWriteData,
  fetchData,
}) {
  const id = null;
  const [loading, setloading] = useState(false);
  const [data, setData] = useState(currentTopic.description);

  

  useEffect(() => {
    setData(currentTopic.description);
  }, [currentTopic]);

  const module = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // Header dropdown
      ["bold", "italic", "underline", "strike"], // Formatting buttons
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      ["link", "image"], // Link and image options
      ["clean"], // Clear formatting
    ],
  };

  const handleSubmit = async () => {
    console.log(data, "datas");
    setloading(true);
    const res = id
      ? await axiosInstance.put(`/api/employee/${id}`, {
          ...data,
          // _id: user.id,
        })
      : await axiosInstance.put(`/api/topicData`, {
          description: data,
          topicId: currentTopic._id,
        });
    setWriteData(false);
    fetchData();
    setloading(false);
    if (res.status == 200) {
      toast.success(res.data);
      // navigate("/employees");
      setShowModal(false);
    }
  };

  return (
    <>
      {console.log(data, "dataa")}
      <ReactQuill
        theme="snow"
        value={data}
        onChange={setData}
        modules={module}
        //   style={{ minHeight: "400px" }}
        className="ql-style"
      />

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
          onClick={() => handleSubmit()}
        >
          Submit
        </Button>
      </div>
    </>
  );
}
