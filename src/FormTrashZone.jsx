import React from "react";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import { DeleteOutlined } from "@ant-design/icons";
import { COMPONENT, ROW, COLUMN } from "./constants/formConstants";

const ACCEPTS = [ROW, COLUMN, COMPONENT];

const TrashContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 2px dashed #ff4d4f;
  border-radius: 4px;
  margin: 24px auto;
  transition: all 0.3s;

  &.active {
    background-color: #fff1f0;
    border-color: #ff7875;
  }

  .trash-icon {
    font-size: 32px;
    color: #ff4d4f;
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    margin: 16px auto;

    .trash-icon {
      font-size: 24px;
    }
  }
`;

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
