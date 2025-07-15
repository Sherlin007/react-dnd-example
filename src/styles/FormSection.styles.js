import styled from "styled-components";
import { Card, Typography, Button } from "antd";

const { Title } = Typography;

export const SectionContainer = styled.div`
  margin-bottom: 24px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  overflow: hidden;
  
  &.drag-over {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
  }
  
  &.dragging {
    opacity: 0.6;
    transform: rotate(2deg);
  }
  
  &:hover {
    border-color: #d9d9d9;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

export const SectionHeader = styled.div`
  padding: 16px 20px;
  background: linear-gradient(135deg, #fafbfc 0%, #f5f6fa 100%);
  border-bottom: 1px solid #e8e8e8;
  cursor: move;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  
  &::before {
    content: '';
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 16px;
    background: #1890ff;
    border-radius: 2px;
    opacity: 0.7;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

export const SectionTitle = styled.div`
  margin: 0;
  margin-left: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  line-height: 1.4;
  letter-spacing: -0.01em;
`;

export const SectionSubtitle = styled.div`
  margin: 4px 0 0 16px;
  font-size: 13px;
  color: #8c8c8c;
  line-height: 1.3;
`;

export const SectionContent = styled.div`
  padding: 20px;
  min-height: 120px;
  background: #ffffff;
  position: relative;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #8c8c8c;
  
  .icon {
    font-size: 24px;
    margin-bottom: 12px;
    opacity: 0.6;
  }
  
  .text {
    font-size: 14px;
    line-height: 1.4;
  }
`;

export const SectionActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 16px 20px;
  background: #fafbfc;
  border-top: 1px solid #e8e8e8;
`;

export const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  height: 32px;
  padding: 0 16px;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
  background: #ffffff;
  color: #595959;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #1890ff;
    color: #1890ff;
    background: #f0f8ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(24, 144, 255, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  .anticon {
    font-size: 12px;
  }
`;

export const DeleteButton = styled(Button)`
  position: relative;
  z-index: 10;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid #ff4d4f;
  background: #fff2f0;
  color: #ff4d4f;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: #ff4d4f;
    color: #ffffff;
    border-color: #ff4d4f;
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(255, 77, 79, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  .anticon {
    font-size: 14px;
  }
`;