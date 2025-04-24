import React from "react";
import { createRoot } from "react-dom/client";
import Example from "./example";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App: React.FC = () => {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <Example />
      </DndProvider>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');
const root = createRoot(rootElement);
root.render(<App />);