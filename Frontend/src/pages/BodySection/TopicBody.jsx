import React, { useEffect, useState } from "react";
import AddTopicData from "./AddTopicData";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@mui/material";
import axiosInstance from "../../ApiManager";

export default function TopicBody({ currentTopic, fetchData }) {
  const location = useLocation();
  const id = null;
  const { subject } = location?.state;
  const navigate = useNavigate();
  const [writeData, setWriteData] = useState(false);
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
      // setShowModal(false);
    }
  };
  return (
    <>
      <div className="d-flex justify-content-between">
        <h3 className="text-danger">
          {" "}
          {subject.subjectName}/{currentTopic?.topicName ?? "--"}
        </h3>

        <div>
          <button
            className="btn btn-primary mt-1"
            onClick={() => setWriteData(true)}
          >
            Write/Edit
          </button>
        </div>
      </div>

      <hr />

      {writeData ? (
        <>
          <ReactQuill
            theme="snow"
            value={data}
            onChange={setData}
            modules={module}
            className="ql-style"
          />

          <div className="d-flex justify-content-center my-5">
            <Button
              variant="outlined"
              type="submit"
              sx={{
                my: 1,
                mx: 1,
                color: "#47478c",
                backgroundColor: "white",
                fontSize: "16px",
              }}
              disabled={loading}
              onClick={() => {
                setWriteData(false), fetchData();
              }}
            >
              Cancel
            </Button>
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
      ) : (
        <div dangerouslySetInnerHTML={{ __html: data }} />
      )}
    </>
  );
}
