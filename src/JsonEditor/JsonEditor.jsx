/* eslint-disable react/prop-types */
import { useState } from "react";
import "./JsonEditor.css";
const JsonEditor = ({ onJsonChange }) => {
  const [jsonString, setJsonString] = useState(null);
  const handleTextAreaChange = (e) => {
    setJsonString(e.target.value);
  };

  const handleButton = () => {
    try {
      const parsedJson = JSON.parse(jsonString);
      onJsonChange(parsedJson);
      console.log("Valid JSON:", parsedJson);
    } catch (error) {
      console.log("Invalid JsonString: " + error.message);
    }
  };
  return (
    <div className="json-editor-container">
      <textarea
        value={jsonString || ""}
        onChange={handleTextAreaChange}
        placeholder="Paste Json Code here..."
        rows={50}
        cols={50}
      ></textarea>
      <button className="btn-check" onClick={handleButton}>
        Check
      </button>
    </div>
  );
};

export default JsonEditor;
