import React from "react";
import classNames from "classnames";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import { COMPONENT, FORM_ITEM, ROW, COLUMN } from "./constants/formConstants";

const ACCEPTS = [FORM_ITEM, COMPONENT, ROW, COLUMN];

const DropZoneContainer = styled.div`
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
      if (parentDropInChild) return false;

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
