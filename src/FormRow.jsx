import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { ROW } from "./constants/formConstants";
import FormDropZone from "./FormDropZone";
import FormColumn from "./FormColumn";
import { DeleteOutlined } from "@ant-design/icons";
import { Row } from "antd";

const RowContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  padding: 8px;
  background-color: #fafafa;
  transition: all 0.3s;

  @media (max-width: 768px) {
    padding: 6px;
  }

  &:hover {
    border-color: #1890ff;
  }
`;

// Add className for CSS targeting
const StyledRowContainer = styled(RowContainer)`
  &.row-container {
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

  ${RowContainer}:hover & {
    opacity: 1;
  }
`;

const ColumnsContainer = styled(Row)`
  display: flex;
  padding: 8px 0;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormRow = ({ data, components, handleDrop, path }) => {
  console.log(data);
  const ref = useRef(null);

  // Fix: Move 'type' outside of the 'item' object
  const [{ isDragging }, drag] = useDrag({
    type: ROW, // Type moved to top level
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

  const renderColumn = (column, currentPath) => {
    return (
      <FormColumn
        key={column.id}
        data={column}
        components={components}
        handleDrop={handleDrop}
        path={currentPath}
      />
    );
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (handleDrop) {
      handleDrop({ path: "trash" }, { type: ROW, id: data.id, path });
    }
  };

  return (
    <StyledRowContainer ref={ref} style={{ opacity }} className="row-container">
      <DeleteButton onClick={handleDelete} className="delete-button">
        <DeleteOutlined />
      </DeleteButton>
      <ColumnsContainer gutter={[8, 8]}>
        {data.children.map((column, index) => {
          const currentPath = `${path}-${index}`;

          return (
            <React.Fragment key={column.id}>
              <FormDropZone
                data={{
                  path: currentPath,
                  childrenCount: data.children.length,
                }}
                onDrop={handleDrop}
                className="horizontalDrag"
              />
              {renderColumn(column, currentPath)}
            </React.Fragment>
          );
        })}
        <FormDropZone
          data={{
            path: `${path}-${data.children.length}`,
            childrenCount: data.children.length,
          }}
          onDrop={handleDrop}
          className="horizontalDrag"
          isLast
        />
      </ColumnsContainer>
    </StyledRowContainer>
  );
};

export default FormRow;
