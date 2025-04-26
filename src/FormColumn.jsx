import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { COLUMN } from "./constants/formConstants";
import FormDropZone from "./FormDropZone";
import FormComponent from "./FormComponent";
import { DeleteOutlined } from "@ant-design/icons";
import { Col } from "antd";

const ColumnContainer = styled(Col)`
  position: relative;
  padding: 8px;
  background-color: white;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    border-color: #1890ff;
  }

  @media (max-width: 768px) {
    flex: 0 0 100%;
    max-width: 100%;
    padding: 6px;
    margin-bottom: 8px;
  }
`;

// Add className for CSS targeting
const StyledColumnContainer = styled(ColumnContainer)`
  &.column-container {
    width: 100%;
  }
`;

const DeleteButton = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  color: #ff4d4f;
  font-size: 16px;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s;

  ${ColumnContainer}:hover & {
    opacity: 1;
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

  const handleDelete = (e) => {
    e.stopPropagation();
    if (handleDrop) {
      handleDrop({ path: "trash" }, { type: COLUMN, id: data.id, path });
    }
  };

  return (
    <StyledColumnContainer
      ref={ref}
      style={{ opacity }}
      span={24 / (data.children?.length || 1)}
      className="column-container"
    >
      <DeleteButton onClick={handleDelete} className="delete-button">
        <DeleteOutlined />
      </DeleteButton>
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
    </StyledColumnContainer>
  );
};

export default FormColumn;
