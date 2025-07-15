import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { PlusOutlined, TableOutlined, DeleteOutlined } from "@ant-design/icons";
import { SECTION, ROW, COLUMN, COMPONENT, FORM_ITEM } from "../constants/formConstants";
import FormDropZone from "./FormDropZone";
import FormRow from "./FormRow";
import {
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  SectionContent,
  EmptyState,
  SectionActions,
  ActionButton,
  DeleteButton,
} from "../styles/FormSection.styles";

const ACCEPTS = [SECTION, ROW, COLUMN, COMPONENT, FORM_ITEM];

const FormSection = ({ data, components, handleDrop, path, onSelectComponent, onAddSection, onAddTable }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: SECTION,
    item: {
      id: data.id,
      type: SECTION,
      children: data.children,
      title: data.title,
      path,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ACCEPTS,
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        // Handle drop into section
        const dropData = {
          path: `${path}-${data.children ? data.children.length : 0}`,
          childrenCount: data.children ? data.children.length : 0,
          sectionId: data.id,
          sectionPath: path,
        };
        handleDrop(dropData, item);
      }
    },
    canDrop: (item, monitor) => {
      // Prevent dropping section into itself
      if (item.type === SECTION && item.path === path) {
        return false;
      }
      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  // Combine drag and drop refs
  drag(drop(ref));

  const renderRow = (row, currentPath) => {
    return (
      <FormRow
        key={row.id}
        data={row}
        components={components}
        handleDrop={handleDrop}
        path={currentPath}
        onSelectComponent={onSelectComponent}
      />
    );
  };

  const sectionClasses = [
    isDragging && 'dragging',
    isOver && canDrop && 'drag-over'
  ].filter(Boolean).join(' ');

  const handleAddSection = () => {
    if (onAddSection) {
      onAddSection(path);
    }
  };

  const handleAddTable = () => {
    if (onAddTable) {
      onAddTable(path);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (handleDrop) {
      handleDrop({ path: "trash" }, { type: SECTION, id: data.id, path });
    }
  };

  return (
    <SectionContainer ref={ref} className={sectionClasses}>
      <SectionHeader>
        <div>
          <SectionTitle>{data.title || 'Section title'}</SectionTitle>
          <SectionSubtitle>Start typing and select text or enter '/' for commands</SectionSubtitle>
        </div>
        <DeleteButton onClick={handleDelete}>
          <DeleteOutlined />
        </DeleteButton>
      </SectionHeader>
      <SectionContent>
        {data.children && data.children.length > 0 ? (
          data.children.map((row, index) => {
            const currentPath = `${path}-${index}`;
            return (
              <React.Fragment key={row.id}>
                <FormDropZone
                  data={{
                    path: currentPath,
                    childrenCount: data.children.length,
                    sectionId: data.id,
                    sectionPath: path,
                  }}
                  onDrop={handleDrop}
                />
                {renderRow(row, currentPath)}
              </React.Fragment>
            );
          })
        ) : (
          <FormDropZone
            data={{
              path: `${path}-0`,
              childrenCount: 0,
              sectionId: data.id,
              sectionPath: path,
            }}
            onDrop={handleDrop}
            isEmpty
          />
        )}
        {data.children && data.children.length > 0 && (
          <FormDropZone
            data={{
              path: `${path}-${data.children.length}`,
              childrenCount: data.children.length,
              sectionId: data.id,
              sectionPath: path,
            }}
            onDrop={handleDrop}
            isLast
          />
        )}
      </SectionContent>
      <SectionActions>
        <ActionButton 
          type="text" 
          icon={<PlusOutlined />} 
          onClick={handleAddSection}
        >
          Add section
        </ActionButton>
        <ActionButton 
          type="text" 
          icon={<TableOutlined />} 
          onClick={handleAddTable}
        >
          Add table
        </ActionButton>
      </SectionActions>
    </SectionContainer>
  );
};

export default FormSection;