import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import { Card, Typography, Button } from "antd";
import { PlusOutlined, TableOutlined } from "@ant-design/icons";
import { SECTION, ROW, COLUMN, COMPONENT, FORM_ITEM } from "./constants/formConstants";
import FormDropZone from "./FormDropZone";
import FormRow from "./FormRow";

const { Title } = Typography;

const SectionContainer = styled(Card)`
  margin-bottom: 16px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  &.drag-over {
    border-color: #1890ff;
    background-color: #f0f8ff;
  }
  
  &.dragging {
    opacity: 0.5;
  }
`;

const SectionHeader = styled.div`
  padding: 12px 16px;
  background-color: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  cursor: move;
`;

const SectionTitle = styled(Title)`
  margin: 0 !important;
  font-size: 16px !important;
  color: #333;
`;

const SectionContent = styled.div`
  padding: 16px;
  min-height: 100px;
`;

const SectionActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  background-color: #fafafa;
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  height: 28px;
  padding: 0 12px;
`;

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

  return (
    <SectionContainer ref={ref} className={sectionClasses}>
      <SectionHeader>
        <SectionTitle level={4}>{data.title || 'Untitled Section'}</SectionTitle>
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
          size="small"
        >
          Add section
        </ActionButton>
        <ActionButton 
          type="text" 
          icon={<TableOutlined />} 
          onClick={handleAddTable}
          size="small"
        >
          Add table
        </ActionButton>
      </SectionActions>
    </SectionContainer>
  );
};

export default FormSection;