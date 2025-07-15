import React, { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Layout } from "antd";

import FormSidebar from "./FormSidebar";
import FormCanvas from "./FormCanvas";
import FormTrashZone from "./FormTrashZone";
import { COMPONENT, FORM_ITEMS, FIELD, ENHANCED_FORM_FIELDS } from "../constants/formConstants";
import initialFormData, { hybridFormData, enhancedInitialFormData } from "../constants/initialFormData";
import { FormSchemaManager } from "../utils/formSchemaUtils";
import { schemaMigration, MigrationUtils } from "../utils/schemaMigration";
import shortid from "shortid";
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
  // Enhanced schema support with backward compatibility
  const [schemaMode, setSchemaMode] = useState('hybrid'); // 'legacy', 'enhanced', 'hybrid'
  const [formSchema, setFormSchema] = useState(hybridFormData);
  const [schemaManager, setSchemaManager] = useState(() => 
    new FormSchemaManager(hybridFormData.form || enhancedInitialFormData)
  );
  
  // Legacy state for backward compatibility
  const [layout, setLayout] = useState(hybridFormData.layout || initialFormData.layout);
  const [components, setComponents] = useState(hybridFormData.components || initialFormData.components);
  
  // UI state
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [activeTab, setActiveTab] = useState('form');
  const [isEnhancedMode, setIsEnhancedMode] = useState(false);

  const handleSelectComponent = useCallback((componentId) => {
    setSelectedComponent(componentId);
  }, []);

  // Enhanced schema management functions
  const handleSchemaMode = useCallback((mode) => {
    try {
      let migrationResult;
      
      switch (mode) {
        case 'legacy':
          migrationResult = MigrationUtils.toLegacy(formSchema);
          if (migrationResult.success) {
            setLayout(migrationResult.data.layout);
            setComponents(migrationResult.data.components);
          }
          break;
          
        case 'enhanced':
          migrationResult = MigrationUtils.toEnhanced(formSchema);
          if (migrationResult.success) {
            setSchemaManager(new FormSchemaManager(migrationResult.data));
          }
          break;
          
        case 'hybrid':
          migrationResult = MigrationUtils.toHybrid(formSchema);
          if (migrationResult.success) {
            setLayout(migrationResult.data.layout);
            setComponents(migrationResult.data.components);
            setSchemaManager(new FormSchemaManager(migrationResult.data.form));
          }
          break;
      }
      
      if (migrationResult && migrationResult.success) {
        setFormSchema(migrationResult.data);
        setSchemaMode(mode);
        console.log('Schema migration successful:', migrationResult.migrationLog);
      } else {
        console.error('Schema migration failed:', migrationResult?.error);
      }
    } catch (error) {
      console.error('Error switching schema mode:', error);
    }
  }, [formSchema]);

  const handleAddEnhancedField = useCallback((sectionId, fieldType) => {
    if (schemaMode === 'enhanced' || schemaMode === 'hybrid') {
      const fieldData = ENHANCED_FORM_FIELDS[fieldType];
      if (fieldData) {
        const newField = schemaManager.addFieldToSection(sectionId, {
          ...fieldData,
          id: shortid.generate()
        });
        
        if (newField) {
          // Update the form schema state
          setFormSchema(prev => ({ ...prev, form: schemaManager.schema }));
          
          // If in hybrid mode, also update legacy components
          if (schemaMode === 'hybrid') {
            const legacyComponent = {
              id: newField.id,
              type: fieldType === 'text' ? 'input' : fieldType,
              label: newField.label,
              placeholder: newField.placeholder,
              required: newField.required
            };
            
            setComponents(prev => ({
              ...prev,
              [newField.id]: legacyComponent
            }));
          }
        }
      }
    }
  }, [schemaManager, schemaMode]);

  const handleUpdateField = useCallback((sectionId, fieldId, updates) => {
    if (schemaMode === 'enhanced' || schemaMode === 'hybrid') {
      const updatedField = schemaManager.updateField(sectionId, fieldId, updates);
      if (updatedField) {
        setFormSchema(prev => ({ ...prev, form: schemaManager.schema }));
        
        // Update legacy components if in hybrid mode
        if (schemaMode === 'hybrid') {
          setComponents(prev => ({
            ...prev,
            [fieldId]: {
              ...prev[fieldId],
              label: updates.label || prev[fieldId]?.label,
              placeholder: updates.placeholder || prev[fieldId]?.placeholder,
              required: updates.required !== undefined ? updates.required : prev[fieldId]?.required
            }
          }));
        }
      }
    }
  }, [schemaManager, schemaMode]);

  const handleValidateForm = useCallback(() => {
    if (schemaMode === 'enhanced' || schemaMode === 'hybrid') {
      const validation = schemaManager.validateForm();
      console.log('Form validation result:', validation);
      return validation;
    }
    return { isValid: true, errors: [], warnings: [] };
  }, [schemaManager, schemaMode]);

  const handleExportSchema = useCallback(() => {
    if (schemaMode === 'enhanced' || schemaMode === 'hybrid') {
      const exported = schemaManager.exportSchema();
      console.log('Exported schema:', exported);
      
      // Create download link
      const blob = new Blob([exported], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `form-schema-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [schemaManager, schemaMode]);

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
        if (item.type === "column" || item.type === "row") {
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
      if (item.type === "column" || item.type === "row") {
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
      key: 'schema',
      label: 'Schema',
    },
    {
      key: 'permission',
      label: 'Permission',
    },
    {
      key: 'validation',
      label: 'Validation',
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
              <FormSidebar 
                items={isEnhancedMode ? Object.values(ENHANCED_FORM_FIELDS) : FORM_ITEMS}
                schemaMode={schemaMode}
                onAddEnhancedField={handleAddEnhancedField}
              />
            </Sider>
            <StyledContent>
              <FormCanvas
                layout={layout}
                components={components}
                handleDrop={handleDrop}
                onSelectComponent={handleSelectComponent}
                onAddSection={handleAddSection}
                onAddTable={handleAddTable}
                schemaMode={schemaMode}
                formSchema={formSchema}
                onUpdateField={handleUpdateField}
              />
              <FormTrashZone onDrop={handleDropToTrash} />
            </StyledContent>
          </Layout>
        );
        
      case 'schema':
        return (
          <div style={{ padding: '24px' }}>
            <h2>Schema Management</h2>
            <div style={{ marginBottom: '16px' }}>
              <label>Schema Mode: </label>
              <select 
                value={schemaMode} 
                onChange={(e) => handleSchemaMode(e.target.value)}
                style={{ marginLeft: '8px', padding: '4px 8px' }}
              >
                <option value="legacy">Legacy</option>
                <option value="hybrid">Hybrid</option>
                <option value="enhanced">Enhanced</option>
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <button onClick={handleValidateForm} style={{ marginRight: '8px' }}>
                Validate Form
              </button>
              <button onClick={handleExportSchema}>
                Export Schema
              </button>
            </div>
            <div>
              <h3>Form Analytics</h3>
              <pre style={{ background: '#f5f5f5', padding: '16px', borderRadius: '4px' }}>
                {JSON.stringify(schemaManager.getFormAnalytics(), null, 2)}
              </pre>
            </div>
            <div style={{ marginTop: '16px' }}>
              <h3>Current Schema</h3>
              <pre style={{ background: '#f5f5f5', padding: '16px', borderRadius: '4px', maxHeight: '400px', overflow: 'auto' }}>
                {JSON.stringify(formSchema, null, 2)}
              </pre>
            </div>
          </div>
        );
        
      case 'validation':
        return (
          <div style={{ padding: '24px' }}>
            <h2>Form Validation</h2>
            <div>
              <h3>Validation Rules</h3>
              <p>Configure validation rules for your form fields.</p>
              {schemaMode === 'enhanced' || schemaMode === 'hybrid' ? (
                <div>
                  <h4>Available Validation Types:</h4>
                  <ul>
                    <li>Required Field</li>
                    <li>Minimum/Maximum Length</li>
                    <li>Minimum/Maximum Value</li>
                    <li>Pattern Matching</li>
                    <li>Email Format</li>
                    <li>Phone Format</li>
                    <li>URL Format</li>
                    <li>Custom Validation</li>
                  </ul>
                </div>
              ) : (
                <p>Switch to Enhanced or Hybrid mode to access advanced validation features.</p>
              )}
            </div>
          </div>
        );
        
      case 'permission':
        return (
          <div style={{ padding: '24px' }}>
            <h2>Form Permissions</h2>
            <div>
              <h3>Access Control</h3>
              <p>Configure who can view, edit, and submit this form.</p>
              {schemaMode === 'enhanced' || schemaMode === 'hybrid' ? (
                <div>
                  <h4>Permission Levels:</h4>
                  <ul>
                    <li>View: Who can see the form</li>
                    <li>Edit: Who can modify the form</li>
                    <li>Delete: Who can delete the form</li>
                    <li>Submit: Who can submit form responses</li>
                  </ul>
                  <div style={{ marginTop: '16px' }}>
                    <h4>Current Permissions:</h4>
                    <pre style={{ background: '#f5f5f5', padding: '16px', borderRadius: '4px' }}>
                      {JSON.stringify(formSchema.form?.permissions || formSchema.permissions, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <p>Switch to Enhanced or Hybrid mode to access permission management.</p>
              )}
            </div>
          </div>
        );
        
      case 'preview':
        return (
          <div style={{ padding: '24px' }}>
            <h2>Form Preview</h2>
            <div>
              <h3>Form Structure Preview</h3>
              <p>This is how your form will appear to users.</p>
              <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px', padding: '16px', marginTop: '16px' }}>
                {/* Form preview content would go here */}
                <p>Form preview functionality will be implemented here.</p>
                <p>Current form has {layout?.length || 0} sections with {Object.keys(components).length} components.</p>
              </div>
            </div>
          </div>
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
            <div style={{ marginLeft: '16px', fontSize: '12px', color: '#666' }}>
              Mode: <span style={{ 
                background: schemaMode === 'enhanced' ? '#52c41a' : schemaMode === 'hybrid' ? '#1890ff' : '#faad14',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '3px',
                fontWeight: 'bold'
              }}>
                {schemaMode.toUpperCase()}
              </span>
            </div>
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
            {(schemaMode === 'enhanced' || schemaMode === 'hybrid') && (
              <ActionButton 
                onClick={handleValidateForm}
                style={{ marginRight: '8px' }}
              >
                Validate
              </ActionButton>
            )}
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