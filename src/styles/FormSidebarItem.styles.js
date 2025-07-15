import styled from "styled-components";
import { Card } from "antd";

export const StyledCard = styled(Card)`
  cursor: move;
  margin-bottom: 8px;
  border-radius: 4px;
  transition: all 0.3s;
  width: 100%;
  min-width: 150px; /* Added minimum width */

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

// Updated wrapper to work with flex container
export const ItemWrapper = styled.div`
  width: calc(50% - 8px);
  box-sizing: border-box;
  margin-bottom: 5px;
`;