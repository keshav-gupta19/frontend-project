import { useState } from "react";
import "./App.css";
import JsonEditor from "./JsonEditor/jsonEditor";
import FormPreview from "./FormPreview/FormPreview";
function App() {
  const [uiSchema, setUiSchema] = useState([]);
  const handleJsonChange = (newJson) => {
    setUiSchema(newJson);
  };
  return (
    <>
      <div className="App">
      <JsonEditor onJsonChange={handleJsonChange} />
        <FormPreview uiSchema={uiSchema}/>
      </div>
    </>
  );
}

export default App;
