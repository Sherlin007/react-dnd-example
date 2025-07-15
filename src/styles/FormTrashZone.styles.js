import styled from "styled-components";

export const TrashContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 2px dashed #ff4d4f;
  border-radius: 4px;
  margin: 24px auto;
  transition: all 0.3s;

  &.active {
    background-color: #fff1f0;
    border-color: #ff7875;
  }

  .trash-icon {
    font-size: 32px;
    color: #ff4d4f;
  }
`;