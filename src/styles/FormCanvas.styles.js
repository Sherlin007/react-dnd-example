import styled from "styled-components";
import { Card } from "antd";

export const CanvasContainer = styled.div`
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 200px);
  padding: 32px;
  margin: 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #f0f0f0 20%, #f0f0f0 80%, transparent 100%);
  }
`;

export const CanvasHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

export const CanvasTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #262626;
  margin: 0;
  line-height: 1.4;
`;

export const CanvasSubtitle = styled.p`
  font-size: 14px;
  color: #8c8c8c;
  margin: 4px 0 0 0;
  line-height: 1.5;
`;

export const CanvasContent = styled.div`
  position: relative;
  min-height: 400px;
`;

export const EmptyCanvasState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  padding: 48px 24px;
  border: 2px dashed #e8e8e8;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #d9d9d9;
    background: #f5f5f5;
  }
`;

export const EmptyStateIcon = styled.div`
  width: 64px;
  height: 64px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  
  svg {
    width: 24px;
    height: 24px;
    color: #bfbfbf;
  }
`;

export const EmptyStateTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #595959;
  margin: 0 0 8px 0;
`;

export const EmptyStateDescription = styled.p`
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
  line-height: 1.5;
`;