import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { COLUMN } from "./constants/formConstants";
import FormDropZone from "./FormDropZone";
import FormComponent from "./FormComponent";

const ColumnContainer = styled.div`
  flex: 1 1 100%;
  padding: 8px;
  background-color: white;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    border-color: #1890ff;
  }
`;

const FormColumn = ({ data, components, handleDrop, path }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: COLUMN, // Moved type to top level
    item: {
      id: data.id,
      children: data.children,
      path,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderComponent = (component, currentPath) => {
    return (
      <FormComponent
        key={component.id}
        data={component}
        component={components[component.id]}
        path={currentPath}
        handleDrop={handleDrop} // Make sure this is being passed
      />
    );
  };

  return (
    <ColumnContainer ref={ref} style={{ opacity }}>
      {data.children.map((component, index) => {
        const currentPath = `${path}-${index}`;

        return (
          <React.Fragment key={component.id}>
            <FormDropZone
              data={{
                path: currentPath,
                childrenCount: data.children.length,
              }}
              onDrop={handleDrop}
            />
            {renderComponent(component, currentPath)}
          </React.Fragment>
        );
      })}
      <FormDropZone
        data={{
          path: `${path}-${data.children.length}`,
          childrenCount: data.children.length,
        }}
        onDrop={handleDrop}
        isLast
      />
    </ColumnContainer>
  );
};

export default FormColumn;
