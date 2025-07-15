import styled from "styled-components";

export const RowContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  padding: 8px;
  background-color: #fafafa;
  transition: all 0.3s;

  &:hover {
    border-color: #1890ff;
  }
`;

export const ColumnsContainer = styled.div`
  display: flex;
  padding: 8px 0;
`;