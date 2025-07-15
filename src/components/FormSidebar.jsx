import React from "react";
import { Divider } from "antd";
import FormSidebarItem from "./FormSidebarItem";
import { SidebarContainer, SidebarTitle, FormElementsContainer } from "../styles/FormSidebar.styles";

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