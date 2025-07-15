import styled from "styled-components";
import { Layout, Typography } from "antd";

const { Header, Content } = Layout;
const { Title } = Typography;

export const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

export const StyledHeader = styled(Header)`
  background-color: #001529;
  padding: 0 24px;
  display: flex;
  align-items: center;
`;

export const StyledTitle = styled(Title)`
  color: white !important;
  margin: 0 !important;
`;

export const StyledContent = styled(Content)`
  padding: 24px;
  background-color: #f0f2f5;
`;