import React from "react";
import { useDrag } from "react-dnd";
import { SideBarItem as StyledSideBarItem } from "./StyledComponents";

const SideBarItem = ({ data }) => {
  const [{ opacity }, drag] = useDrag({
    item: data,
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  });
  
  return (
    <StyledSideBarItem ref={drag} style={{ opacity }}>
      {data.component.type}
    </StyledSideBarItem>
  );
};
export default SideBarItem;
