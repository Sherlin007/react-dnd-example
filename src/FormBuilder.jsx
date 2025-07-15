import React, { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { Layout, Typography } from "antd";

import FormSidebar from "./FormSidebar";
import FormCanvas from "./FormCanvas";
import FormTrashZone from "./FormTrashZone";
import { COMPONENT, FORM_ITEMS } from "./constants/formConstants";
import initialFormData from "./constants/initialFormData";
import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout,
} from "./constants/helpers";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background-color: #001529;
  padding: 0 24px;
  display: flex;
  align-items: center;
`;

const StyledTitle = styled(Title)`
  color: white !important;
  margin: 0 !important;
`;

const StyledContent = styled(Content)`
  padding: 24px;
  background-color: #f0f2f5;
`;

const FormBuilder = () => {
  const initialLayout = initialFormData.layout;
  const initialComponents = initialFormData.components;
  const [layout, setLayout] = useState(initialLayout);
  const [components, setComponents] = useState(initialComponents);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleSelectComponent = useCallback((componentId) => {
    setSelectedComponent(componentId);
  }, []);

  const handleAddSection = useCallback((newSection, afterPath) => {
    setLayout((prevLayout) => {
      const newLayout = [...prevLayout];
      const pathIndex = parseInt(afterPath);
      // Insert after the current section
      newLayout.splice(pathIndex + 1, 0, newSection);
      return newLayout;
    });
  }, []);

  const handleAddTable = useCallback((newTable, afterPath) => {
    setLayout((prevLayout) => {
      const pathParts = afterPath.split('-');
      const sectionIndex = parseInt(pathParts[0]);
      const newLayout = [...prevLayout];
      
      if (newLayout[sectionIndex] && newLayout[sectionIndex].children) {
        newLayout[sectionIndex] = {
          ...newLayout[sectionIndex],
          children: [...newLayout[sectionIndex].children, newTable]
        };
      }
      
      return newLayout;
    });
  }, []);

  const handleDropToTrash = useCallback(
    (dropZone, item) => {
      const splitItemPath = item.path.split("-");
      setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
    },
    [layout]
  );

  const handleDrop = useCallback(
    (dropZone, item) => {
      // Add a special case for trash path
      if (dropZone.path === "trash") {
        handleDropToTrash(dropZone, item);
        return;
      }

      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      // Handle sidebar items differently
      if (item.type === "formItem") {
        const newComponent = {
          ...item.component,
          id: item.id,
        };

        const newItem = {
          id: item.id,
          type: COMPONENT,
        };

        // Update components state first
        setComponents((prevComponents) => ({
          ...prevComponents,
          [newComponent.id]: newComponent,
        }));

        // Then update layout
        setLayout((prevLayout) =>
          handleMoveSidebarComponentIntoParent(
            prevLayout,
            splitDropZonePath,
            newItem
          )
        );
        return;
      }

      // Rest of the code remains the same
      // Handle moving existing items
      const splitItemPath = item?.path?.split("-");
      const pathToItem = splitItemPath?.slice(0, -1).join("-");

      // Move within the same parent
      if (splitItemPath?.length === splitDropZonePath.length) {
        if (pathToItem === pathToDropZone) {
          setLayout(
            handleMoveWithinParent(layout, splitDropZonePath, splitItemPath)
          );
          return;
        }

        // Move to a different parent
        const newItem = { id: item.id, type: item.type };
        if (item.type === "column") {
          newItem.children = item.children;
        }

        setLayout(
          handleMoveToDifferentParent(
            layout,
            splitDropZonePath,
            splitItemPath,
            newItem
          )
        );
        return;
      }

      // Move and create
      const newItem = { id: item.id, type: item.type };
      if (item.type === "column") {
        newItem.children = item.children;
      }

      setLayout(
        handleMoveToDifferentParent(
          layout,
          splitDropZonePath,
          splitItemPath,
          newItem
        )
      );
    },
    [layout, components, handleDropToTrash]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <StyledLayout>
        <StyledHeader>
          <StyledTitle level={3}>High Point Form Builder</StyledTitle>
        </StyledHeader>
        <Layout>
          <Sider width={350} theme="light">
            <FormSidebar items={FORM_ITEMS} />
          </Sider>
          <StyledContent>
            <FormCanvas
              layout={layout}
              components={components}
              handleDrop={handleDrop}
              onSelectComponent={handleSelectComponent}
              onAddSection={handleAddSection}
              onAddTable={handleAddTable}
            />
            <FormTrashZone onDrop={handleDropToTrash} />
          </StyledContent>
        </Layout>
      </StyledLayout>
    </DndProvider>
  );
};

export default FormBuilder;
