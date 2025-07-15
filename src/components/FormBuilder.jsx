import React, { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Layout } from "antd";

import FormSidebar from "./FormSidebar";
import FormCanvas from "./FormCanvas";
import FormTrashZone from "./FormTrashZone";
import { COMPONENT, FORM_ITEMS } from "../constants/formConstants";
import initialFormData from "../constants/initialFormData";
import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout,
} from "../utils/helpers";
import {
  StyledLayout,
  StyledHeader,
  HeaderLeft,
  HeaderCenter,
  StyledTitle,
  StyledTabs,
  HeaderRight,
  ActionButton,
  SavedIndicator,
  StyledContent,
} from "../styles/FormBuilder.styles";

const { Sider } = Layout;

const FormBuilder = () => {
  const initialLayout = initialFormData.layout;
  const initialComponents = initialFormData.components;
  const [layout, setLayout] = useState(initialLayout);
  const [components, setComponents] = useState(initialComponents);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [activeTab, setActiveTab] = useState('form');

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

  const tabItems = [
    {
      key: 'form',
      label: 'Form',
    },
    {
      key: 'permission',
      label: 'Permission',
    },
    {
      key: 'preview',
      label: 'Preview',
    },
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'form':
        return (
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
        );
      case 'permission':
        return (
          <StyledContent>
            <div style={{ padding: '40px', textAlign: 'center', color: '#8c8c8c' }}>
              <h3>Permission Settings</h3>
              <p>Configure user permissions and access controls here.</p>
            </div>
          </StyledContent>
        );
      case 'preview':
        return (
          <StyledContent>
            <div style={{ padding: '40px', textAlign: 'center', color: '#8c8c8c' }}>
              <h3>Form Preview</h3>
              <p>Preview your form as end users will see it.</p>
            </div>
          </StyledContent>
        );
      default:
        return null;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <StyledLayout>
        <StyledHeader>
          <HeaderLeft>
            <StyledTitle level={3}>360_degree_feedback</StyledTitle>
          </HeaderLeft>
          <HeaderCenter>
            <StyledTabs
              activeKey={activeTab}
              onChange={handleTabChange}
              items={tabItems}
              size="small"
            />
          </HeaderCenter>
          <HeaderRight>
            <SavedIndicator>Saved</SavedIndicator>
            <ActionButton className="preview-btn">Preview</ActionButton>
            <ActionButton className="save-btn">Save</ActionButton>
            <ActionButton className="go-live-btn">Go Live</ActionButton>
          </HeaderRight>
        </StyledHeader>
        {renderTabContent()}
      </StyledLayout>
    </DndProvider>
  );
};

export default FormBuilder;