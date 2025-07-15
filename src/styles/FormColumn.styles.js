import styled from "styled-components";

export const ColumnContainer = styled.div`
  flex: 1 1 100%;
  padding: 8px;
  background-color: white;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    border-color: #1890ff;
  }
`;