import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Layout, Typography, Button, Row, Col } from 'antd';
import styled from 'styled-components';
import FormRow from './FormRow';
import FormTrashZone from './FormTrashZone';
import { ROW, COLUMN, COMPONENT } from './constants/formConstants';

const { Header, Content } = Layout;
const { Title } = Typography;

// Custom backend based on device type
const CustomBackend = ({ children }) => {
  const isMobile = window.innerWidth <= 768;
  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      {children}
    </DndProvider>
  );
};

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background-color: #fff;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledContent = styled(Content)`
  padding: 24px;
  background-color: #f0f2f5;

  @media (max-width: 768px) {
    padding: 16px 8px;
  }
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 16px 8px;
  }
`;

const ToolboxContainer = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const App = () => {
  // Sample initial layout
  const [layout, setLayout] = useState([
    {
      id: '1',
      type: ROW,
      children: [
        {
          id: '2',
          type: COLUMN,
          children: [
            {
              id: 'input1',
              type: COMPONENT,
            },
          ],
        },
      ],
    },
  ]);

  // Sample components data
  const [components, setComponents] = useState({
    input1: {
      type: 'input',
      label: 'Name',
      placeholder: 'Enter your name',
      required: true,
    },
  });

  // Handle drop of items
  const handleDrop = (dropZone, item) => {
    // Handle dropping to trash
    if (dropZone.path === 'trash') {
      const newLayout = [...layout];
      const pathParts = item.path.split('-');
      
      // Handle different item types
      if (item.type === ROW) {
        // Remove row
        newLayout.splice(parseInt(pathParts[0]), 1);
      } else if (item.type === COLUMN || item.type === COMPONENT) {
        // Navigate to the parent container
        let parent = newLayout;
        let currentPath = [];
        
        // Navigate through the path except the last part
        for (let i = 0; i < pathParts.length - 1; i++) {
          const index = parseInt(pathParts[i]);
          currentPath.push(index);
          
          if (i === 0) {
            parent = parent[index].children;
          } else {
            parent = parent[index].children;
          }
        }
        
        // Remove the item from its parent
        const lastIndex = parseInt(pathParts[pathParts.length - 1]);
        parent.splice(lastIndex, 1);
      }
      
      setLayout(newLayout);
      return;
    }
    
    // Handle normal drops (simplified version)
    console.log('Dropped item:', item, 'to zone:', dropZone);
    // Implement your drop logic here
  };

  // Add a new row
  const addRow = () => {
    const newRow = {
      id: `row-${Date.now()}`,
      type: ROW,
      children: [
        {
          id: `column-${Date.now()}`,
          type: COLUMN,
          children: [],
        },
      ],
    };
    
    setLayout([...layout, newRow]);
  };

  return (
    <CustomBackend>
      <StyledLayout>
        <StyledHeader>
          <Title level={3} style={{ margin: 0 }}>Form Builder</Title>
          <div>
            <Button type="primary">Save</Button>
          </div>
        </StyledHeader>
        
        <StyledContent>
          <FormContainer>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={6}>
                <ToolboxContainer>
                  <Button type="primary" onClick={addRow} block>Add Row</Button>
                </ToolboxContainer>
                
                <FormTrashZone onDrop={handleDrop} />
              </Col>
              
              <Col xs={24} md={18}>
                <div className="form-canvas">
                  {layout.map((row, index) => (
                    <FormRow
                      key={row.id}
                      data={row}
                      components={components}
                      handleDrop={handleDrop}
                      path={`${index}`}
                    />
                  ))}
                </div>
              </Col>
            </Row>
          </FormContainer>
        </StyledContent>
      </StyledLayout>
    </CustomBackend>
  );
};

export default App;