import styled from "styled-components";

export const ComponentContainer = styled.div`
  position: relative;
  padding: 16px;
  background-color: white;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

export const DeleteButton = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  color: #ff4d4f;
  font-size: 16px;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s;

  ${ComponentContainer}:hover & {
    opacity: 1;
  }
`;