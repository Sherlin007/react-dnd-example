import React, { useRef } from "react";
import classNames from "classnames";
import { useDrop } from "react-dnd";
import { COMPONENT, ROW, COLUMN } from "./constants";
import { TrashDropZoneContainer } from "./StyledComponents";
import { ITrashDropZoneProps, IDragItem } from "./types";

const ACCEPTS = [ROW, COLUMN, COMPONENT];

const TrashDropZone: React.FC<ITrashDropZoneProps> = ({ data, onDrop }) => {
  // Create a ref
  const dropRef = useRef<HTMLDivElement>(null);
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ACCEPTS,
    drop: (item: IDragItem, monitor) => {
      onDrop(data, item);
    },
    canDrop: (item, monitor) => {
      const layout = data.layout;
      const itemPath = item.path;
      const splitItemPath = itemPath ? itemPath.split("-") : [];
      const itemPathRowIndex = splitItemPath[0];
      const itemRowChildrenLength =
        itemPathRowIndex !== undefined && layout[Number(itemPathRowIndex)]
          ? layout[Number(itemPathRowIndex)].children.length
          : 0;

      // prevent removing a col when row has only one col
      if (
        item.type === COLUMN &&
        itemRowChildrenLength &&
        itemRowChildrenLength < 2
      ) {
        return false;
      }

      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  // Connect the ref
  drop(dropRef);

  const isActive = isOver && canDrop;
  return (
    <TrashDropZoneContainer
      className={classNames({ active: isActive })}
      ref={dropRef}
    >
      Drop here to delete
    </TrashDropZoneContainer>
  );
};

export default TrashDropZone;