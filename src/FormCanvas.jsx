import React from 'react';
import styled from 'styled-components';
import { Card } from 'antd';
import FormDropZone from './FormDropZone';
import FormRow from './FormRow';

const CanvasContainer = styled(Card)`
  min-height: 600px;
  margin-bottom: 24px;
  background-color: white;
`;

const FormCanvas = ({ layout, components, handleDrop }) => {
  const renderRow = (row, currentPath) => {
    return (
      <FormRow
        key={row.id}
        data={row}
        components={components}
        handleDrop={handleDrop}
        path={currentPath}
      />
    );
  };

  return (
    <CanvasContainer>
      {layout.map((row, index) => {
        const currentPath = `${index}`;

        return (
          <React.Fragment key={row.id}>
            <FormDropZone
              data={{
                path: currentPath,
                childrenCount: layout.length,
              }}
              onDrop={handleDrop}
            />
            {renderRow(row, currentPath)}
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
