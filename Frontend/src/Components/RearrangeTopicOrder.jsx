import LoadingButton from "@mui/lab/LoadingButton";
import React, { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { Button } from "@mui/material";
import axiosInstance from "../ApiManager";
import toast from "react-hot-toast";

export default function RearrangeTopicOrder({
  selectedFolder,
  setSelectedFolder,
  setReArrangeOrder,
}) {
  const [loading, setLoading] = useState();
  const handleDragStart = (e, index) => {
    // Save the index of the dragged item in the dataTransfer object
    e.dataTransfer.setData("draggedItem", index);
  };

  //   console.log(selectedFolderCopy, "selected copy");
  //   console.log(selectedFolder, "original");

  const handleDrop = (e, dropIndex) => {
    // Get the index of the dragged item from the dataTransfer object
    const dragIndex = e.dataTransfer.getData("draggedItem");

    // Create a copy of the current items array
    const topicsArrayCopy = selectedFolder?.topics;

    // Get the dragged item
    const draggedItem = topicsArrayCopy[dragIndex];
    var tempItem = topicsArrayCopy[dropIndex];
    topicsArrayCopy[dropIndex] = draggedItem;
    topicsArrayCopy[dragIndex] = tempItem;

    // console.log(topicsArrayCopy, "topics array");

    setSelectedFolder({ ...selectedFolder, topics: topicsArrayCopy });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await axiosInstance.put(`/api/topicsOrder`, selectedFolder);
    if (res.status == 200) {
      toast.success(res.data.message);
    } else {
      toast.error("Sequence Not Updated");
      // setSelectedFolder(selectedFolderCopy);
    }
    setLoading(false);
    setReArrangeOrder(false);
  };
  return (
    <>
      <div className="text-center">
        <span className="folder-name">
          {selectedFolder?.subjectName.trim().charAt(0).toUpperCase() +
            selectedFolder?.subjectName.trim().slice(1)}
        </span>
      </div>
      <h5 className="text-center mt-4">
        Change the order of topics by Drag n Drop
      </h5>
      <div className="d-flex justify-content-center mt-1  border-primary">
        <div>
          {selectedFolder.topics.map((topic, index) => {
            return (
              <div
                draggable={true}
                onDragStart={(e) => handleDragStart(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={(e) => e.preventDefault()}
                className="d-flex justify-content-between topic-name-order "
                key={index}
              >
                <div>
                  {index + 1}.{" "}
                  {topic?.title?.charAt(0)?.toUpperCase() +
                    topic?.title?.slice(1)}
                </div>
              </div>
            );
          })}

          <div className="d-flex justify-content-center my-2">
            <Button
              variant="outlined"
              sx={{
                my: 1,
                color: "#47478c",
                backgroundColor: "white",
                fontSize: "14px",
              }}
              disabled={loading}
              onClick={() => {
                // console.log(selectedFolderCopy, "copyy");
                // setSelectedFolder(selectedFolderCopy);
                setReArrangeOrder(false);
              }}
            >
              Cancel
            </Button>

            <LoadingButton
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              sx={{
                m: 1,
                color: "white",
                backgroundColor: loading ? "white " : "blue",
                fontSize: "14px",
              }}
              variant="outlined"
              onClick={() => handleSubmit()}
            >
              Save
            </LoadingButton>
          </div>
        </div>
      </div>
    </>
  );
}
