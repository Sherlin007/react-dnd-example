import React from 'react';
import shortid from 'shortid';
import FormDropZone from './FormDropZone';
import FormRow from './FormRow';
import FormSection from './FormSection';
import { SECTION, ROW, COLUMN } from '../constants/formConstants';
import { CanvasContainer } from '../styles/FormCanvas.styles';

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

  return (
    <CanvasContainer>
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
    </CanvasContainer>
  );
};

export default FormCanvas;