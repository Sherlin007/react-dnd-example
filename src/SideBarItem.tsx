import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { SideBarItem as StyledSideBarItem } from "./StyledComponents";
import { ISideBarItemProps } from "./types";

const SideBarItem: React.FC<ISideBarItemProps> = ({ data }) => {
  // Create a ref
  const dragRef = useRef<HTMLDivElement>(null);
  
  const [{ opacity }, drag] = useDrag({
    item: data,
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  });
  
  // Connect the ref
  drag(dragRef);
  
  return (
    <StyledSideBarItem ref={dragRef} style={{ opacity }}>
      {data.component.type}
    </StyledSideBarItem>
  );
};

export default SideBarItem;