import React from "react";
import * as ReactDOM from "react-dom/client";
import FormBuilder from "./FormBuilder";

import "antd/dist/reset.css";

function App() {
  return (
    <div className="App">
      <FormBuilder />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
