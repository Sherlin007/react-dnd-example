import styled from "styled-components";
import { Layout, Typography, Tabs, Button } from "antd";

const { Header, Content } = Layout;
const { Title } = Typography;

export const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

export const StyledHeader = styled(Header)`
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const HeaderCenter = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
`;

export const StyledTitle = styled(Title)`
  color: #262626 !important;
  margin: 0 !important;
  font-size: 18px !important;
  font-weight: 600 !important;
`;

export const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin: 0;
  }
  
  .ant-tabs-tab {
    padding: 12px 16px;
    font-weight: 500;
    color: #8c8c8c;
  }
  
  .ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      color: #1890ff !important;
      font-weight: 600;
    }
  }
  
  .ant-tabs-ink-bar {
    background: #1890ff;
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

export const ActionButton = styled(Button)`
  height: 32px;
  border-radius: 6px;
  font-weight: 500;
  
  &.preview-btn {
    background: #f0f0f0;
    border: 1px solid #d9d9d9;
    color: #595959;
    
    &:hover {
      background: #e6f7ff;
      border-color: #91d5ff;
      color: #1890ff;
    }
  }
  
  &.save-btn {
    background: #f0f0f0;
    border: 1px solid #d9d9d9;
    color: #595959;
    
    &:hover {
      background: #e6f7ff;
      border-color: #91d5ff;
      color: #1890ff;
    }
  }
  
  &.go-live-btn {
    background: #52c41a;
    border: 1px solid #52c41a;
    color: #ffffff;
    
    &:hover {
      background: #73d13d;
      border-color: #73d13d;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 0 8px;
  }
`;

export const SavedIndicator = styled.span`
  color: #8c8c8c;
  font-size: 14px;
  margin-right: 8px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const StyledContent = styled(Content)`
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: calc(100vh - 64px);
  
  .ant-layout {
    background: transparent;
  }
  
  .ant-layout-sider {
    background: #ffffff !important;
    border-radius: 8px 0 0 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;