import React from "react";
import styled from "styled-components";
import { Card } from "antd";
import FormDropZone from "./FormDropZone";
import FormRow from "./FormRow";

const CanvasContainer = styled(Card)`
  min-height: 600px;
  margin-bottom: 24px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: auto;
  padding: 16px;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    min-height: 400px;
    margin-bottom: 16px;
    padding: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
`;

const CanvasTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 12px;
  }
`;

const FormCanvas = ({
  layout,
  components,
  handleDrop,
  title = "Form Builder Canvas",
}) => {
  const renderRow = (row, currentPath) => {
    return (
      <FormRow
        key={row.id}
        data={row}
        components={components}
        handleDrop={handleDrop}
        path={currentPath}
      />
    );
  };

  return (
    <CanvasContainer>
      <CanvasTitle>{title}</CanvasTitle>
      <div className="canvas-content">
        {layout.map((row, index) => {
          const currentPath = `${index}`;

          return (
            <React.Fragment key={row.id}>
              <FormDropZone
                data={{
                  path: currentPath,
                  childrenCount: layout.length,
                }}
                onDrop={handleDrop}
              />
              {renderRow(row, currentPath)}
            </React.Fragment>
          );
        })}
        <FormDropZone
          data={{
            path: `${layout.length}`,
            childrenCount: layout.length,
          }}
          onDrop={handleDrop}
          isLast
        />
      </div>
    </CanvasContainer>
  );
};

export default FormCanvas;
