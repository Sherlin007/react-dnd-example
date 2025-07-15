import React from 'react';
import shortid from 'shortid';
import { FileTextOutlined } from '@ant-design/icons';
import FormDropZone from './FormDropZone';
import FormRow from './FormRow';
import FormSection from './FormSection';
import { SECTION, ROW, COLUMN } from '../constants/formConstants';
import { 
  CanvasContainer, 
  CanvasHeader, 
  CanvasTitle, 
  CanvasSubtitle, 
  CanvasContent,
  EmptyCanvasState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription
} from '../styles/FormCanvas.styles';

const FormCanvas = ({ layout, components, handleDrop, onSelectComponent, onAddSection, onAddTable }) => {

  const handleAddSection = (afterPath) => {
    if (onAddSection) {
      const newSection = {
        type: SECTION,
        id: shortid.generate(),
        title: 'New Section',
        children: []
      };
      onAddSection(newSection, afterPath);
    }
  };

  const handleAddTable = (afterPath) => {
    if (onAddTable) {
      const newTable = {
        type: ROW,
        id: shortid.generate(),
        children: [
          {
            type: COLUMN,
            id: shortid.generate(),
            children: []
          },
          {
            type: COLUMN,
            id: shortid.generate(),
            children: []
          }
        ]
      };
      onAddTable(newTable, afterPath);
    }
  };
  
  const renderItem = (item, currentPath) => {
    if (item.type === SECTION) {
      return (
        <FormSection
          key={item.id}
          data={item}
          components={components}
          handleDrop={handleDrop}
          path={currentPath}
          onSelectComponent={onSelectComponent}
          onAddSection={handleAddSection}
          onAddTable={handleAddTable}
        />
      );
    } else {
      // Fallback to row for backward compatibility
      return (
        <FormRow
          key={item.id}
          data={item}
          components={components}
          handleDrop={handleDrop}
          path={currentPath}
          onSelectComponent={onSelectComponent}
        />
      );
    }
  };

  const isEmpty = !layout || layout.length === 0;

  return (
    <CanvasContainer>
      <CanvasHeader>
        <div>
          <CanvasTitle>New Form</CanvasTitle>
          <CanvasSubtitle>Create your form by adding fields from the library</CanvasSubtitle>
        </div>
      </CanvasHeader>
      
      <CanvasContent>
        {isEmpty ? (
          <EmptyCanvasState>
            <EmptyStateIcon>
              <FileTextOutlined />
            </EmptyStateIcon>
            <EmptyStateTitle>Start building your form</EmptyStateTitle>
            <EmptyStateDescription>
              Drag and drop form elements from the sidebar to begin creating your form
            </EmptyStateDescription>
          </EmptyCanvasState>
        ) : (
          <>
            {layout.map((item, index) => {
              const currentPath = `${index}`;

              return (
                <React.Fragment key={item.id}>
                  <FormDropZone
                    data={{
                      path: currentPath,
                      childrenCount: layout.length,
                    }}
                    onDrop={handleDrop}
                  />
                  {renderItem(item, currentPath)}
                </React.Fragment>
              );
            })}
            <FormDropZone
              data={{
                path: `${layout.length}`,
                childrenCount: layout.length,
              }}
              onDrop={handleDrop}
              isLast
            />
          </>
        )}
      </CanvasContent>
    </CanvasContainer>
  );
};

export default FormCanvas;