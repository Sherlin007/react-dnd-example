import styled from "styled-components";
import { Typography } from "antd";

const { Title } = Typography;

export const SidebarContainer = styled.div`
  padding: 5px;
  height: 100%;
  overflow-y: auto;
  width: 300px; /* Increased width from default */
`;

export const SidebarTitle = styled(Title)`
  margin-bottom: 16px !important;
`;

// Changed from column to row layout with wrap to allow two cards per row
export const FormElementsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
`;