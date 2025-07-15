import React from "react";
import classNames from "classnames";
import { useDrop } from "react-dnd";
import { COMPONENT, FORM_ITEM, ROW, COLUMN, SECTION } from "../constants/formConstants";
import { DropZoneContainer } from "../styles/FormDropZone.styles";

const ACCEPTS = [FORM_ITEM, COMPONENT, ROW, COLUMN, SECTION];

const FormDropZone = ({ data, onDrop, isLast, className }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ACCEPTS,
    drop: (item, monitor) => {
      onDrop(data, item);
    },
    canDrop: (item, monitor) => {
      const dropZonePath = data.path;
      const splitDropZonePath = dropZonePath.split("-");
      const itemPath = item.path;

      // Sidebar items can always be dropped anywhere
      if (!itemPath) {
        return true;
      }

      const splitItemPath = itemPath.split("-");

      // Prevent dropping section into itself or its children
      if (item.type === SECTION) {
        if (dropZonePath.startsWith(itemPath)) {
          return false;
        }
      }

      // Limit columns when dragging from one row to another row
      const dropZonePathRowIndex = splitDropZonePath[0];
      const itemPathRowIndex = splitItemPath[0];
      const diffRow = dropZonePathRowIndex !== itemPathRowIndex;
      if (
        diffRow &&
        splitDropZonePath.length === 2 &&
        data.childrenCount >= 3
      ) {
        return false;
      }

      // Invalid (Can't drop a parent element (row) into a child (column))
      const parentDropInChild =
        splitItemPath?.length < splitDropZonePath.length;
      if (parentDropInChild && item.type !== SECTION) return false;

      // Current item can't possible move to it's own location
      if (itemPath === dropZonePath) return false;

      // Current area
      if (splitItemPath?.length === splitDropZonePath.length) {
        const pathToItem = splitItemPath.slice(0, -1).join("-");
        const currentItemIndex = Number(splitItemPath.slice(-1)[0]);

        const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");
        const currentDropZoneIndex = Number(splitDropZonePath.slice(-1)[0]);

        if (pathToItem === pathToDropZone) {
          const nextDropZoneIndex = currentItemIndex + 1;
          if (nextDropZoneIndex === currentDropZoneIndex) return false;
        }
      }

      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;
  return (
    <DropZoneContainer
      className={classNames({ active: isActive, isLast }, className)}
      ref={drop}
    />
  );
};

export default FormDropZone;