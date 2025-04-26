import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { ROW } from "./constants/formConstants";
import FormDropZone from "./FormDropZone";
import FormColumn from "./FormColumn";

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

  &:hover {
    border-color: #1890ff;
  }
`;

const ColumnsContainer = styled.div`
  display: flex;
  padding: 8px 0;
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

  return (
    <RowContainer ref={ref} style={{ opacity }}>
      <ColumnsContainer>
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
    </RowContainer>
  );
};

export default FormRow;
