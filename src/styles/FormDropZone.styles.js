import styled from "styled-components";

export const DropZoneContainer = styled.div`
  flex: 0 0 auto;
  height: 40px;
  transition: 200ms all;

  &.active {
    background: #e6f7ff;
    border: 1px dashed #1890ff;
    transition: 100ms all;
  }

  &.horizontalDrag {
    width: 40px;
    height: auto;
  }

  &.isLast:not(.horizontalDrag) {
    flex: 1 1 auto;
  }
`;