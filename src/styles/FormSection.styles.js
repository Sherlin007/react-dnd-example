import styled from "styled-components";
import { Card, Typography, Button } from "antd";

const { Title } = Typography;

export const SectionContainer = styled(Card)`
  margin-bottom: 16px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  &.drag-over {
    border-color: #1890ff;
    background-color: #f0f8ff;
  }
  
  &.dragging {
    opacity: 0.5;
  }
`;

export const SectionHeader = styled.div`
  padding: 12px 16px;
  background-color: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  cursor: move;
`;

export const SectionTitle = styled(Title)`
  margin: 0 !important;
  font-size: 16px !important;
  color: #333;
`;

export const SectionContent = styled.div`
  padding: 16px;
  min-height: 100px;
`;

export const SectionActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  background-color: #fafafa;
`;

export const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  height: 28px;
  padding: 0 12px;
`;