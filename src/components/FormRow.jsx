import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { ROW } from "../constants/formConstants";
import FormDropZone from "./FormDropZone";
import FormColumn from "./FormColumn";
import { RowContainer, ColumnsContainer } from "../styles/FormRow.styles";

const FormRow = ({ data, components, handleDrop, path, onSelectComponent }) => {
  console.log(data);
  const ref = useRef(null);

  // Check if row has any actual content (components)
  const hasContent = () => {
    if (!data.children || data.children.length === 0) return false;
    
    return data.children.some(column => {
      if (!column.children || column.children.length === 0) return false;
      return column.children.some(component => components[component.id]);
    });
  };

  // Don't render empty rows
  if (!hasContent()) {
    return null;
  }

  const [{ isDragging }, drag] = useDrag({
    type: ROW,
    item: {
      id: data.id,
      type: ROW,
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
        onSelectComponent={onSelectComponent}
      />
    );
  };

  return (
    <RowContainer ref={ref} style={{ opacity }}>
      <ColumnsContainer>
        {data.children && data.children.map((column, index) => {
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
            path: `${path}-${data.children ? data.children.length : 0}`,
            childrenCount: data.children ? data.children.length : 0,
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