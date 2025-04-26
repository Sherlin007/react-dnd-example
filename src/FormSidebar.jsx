import React from "react";
import styled from "styled-components";
import { Typography, Divider } from "antd";
import FormSidebarItem from "./FormSidebarItem";

const { Title } = Typography;

const SidebarContainer = styled.div`
  padding: 16px;
  height: 100%;
  overflow-y: auto;
  width: 300px; /* Increased width from default */

  @media (max-width: 768px) {
    padding: 8px;
    width: 100%;
    max-height: 300px;
  }
`;

const SidebarTitle = styled(Title)`
  margin-bottom: 16px !important;
`;

// Changed from column to row layout with wrap to allow two cards per row
const FormElementsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const FormSidebar = ({ items }) => {
  return (
    <SidebarContainer>
      <SidebarTitle level={4}>Form Elements</SidebarTitle>
      <Divider />
      <FormElementsContainer>
        {items.map((item) => (
          <FormSidebarItem key={item.id} data={item} />
        ))}
      </FormElementsContainer>
    </SidebarContainer>
  );
};

export default FormSidebar;
