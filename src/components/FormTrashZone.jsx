import React from "react";
import { useDrop } from "react-dnd";
import { DeleteOutlined } from "@ant-design/icons";
import { COMPONENT, ROW, COLUMN } from "../constants/formConstants";
import { TrashContainer } from "../styles/FormTrashZone.styles";

const ACCEPTS = [ROW, COLUMN, COMPONENT];

const FormTrashZone = ({ onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ACCEPTS,
    drop: (item, monitor) => {
      onDrop({ layout: [] }, item);
    },
    canDrop: (item, monitor) => {
      // Prevent removing a column when row has only one column
      if (
        item.type === COLUMN &&
        item.path &&
        item.path.split("-").length === 2
      ) {
        const rowIndex = item.path.split("-")[0];
        if (item.children && item.children.length === 1) {
          return false;
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
    <TrashContainer ref={drop} className={isActive ? "active" : ""}>
      <DeleteOutlined className="trash-icon" />
    </TrashContainer>
  );
};

export default FormTrashZone;