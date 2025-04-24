import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { COMPONENT } from "./constants";
import { ComponentContainer } from "./StyledComponents";
import { IComponentProps } from "./types";

const Component: React.FC<IComponentProps> = ({ data, components, path }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    item: { type: COMPONENT, id: data.id, path },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const component = components[data.id];

  return (
    <ComponentContainer
      ref={ref}
      style={{ opacity }}
      className="draggable"
    >
      <div>{data.id}</div>
      <div>{component.content}</div>
    </ComponentContainer>
  );
};

export default Component;