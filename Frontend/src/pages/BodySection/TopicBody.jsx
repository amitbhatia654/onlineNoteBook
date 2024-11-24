import React from "react";
import { useParams } from "react-router-dom";

export default function TopicBody() {
  const { id } = useParams();
  return <div>Topic body section under id -{id}</div>;
}
