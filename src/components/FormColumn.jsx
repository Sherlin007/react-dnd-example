import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { COLUMN } from "../constants/formConstants";
import FormDropZone from "./FormDropZone";
import FormComponent from "./FormComponent";
import { ColumnContainer } from "../styles/FormColumn.styles";

const FormColumn = ({ data, components, handleDrop, path, onSelectComponent }) => {
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
        handleDrop={handleDrop}
        onSelectComponent={onSelectComponent}
      />
    );
  };

  return (
    <ColumnContainer ref={ref} style={{ opacity }}>
      {data.children && data.children.map((component, index) => {
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
          path: `${path}-${data.children ? data.children.length : 0}`,
          childrenCount: data.children ? data.children.length : 0,
        }}
        onDrop={handleDrop}
        isLast
      />
    </ColumnContainer>
  );
};

export default FormColumn;