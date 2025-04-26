import React from "react";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { Card, Typography } from "antd";
import { FORM_ITEM } from "./constants/formConstants";

const { Text } = Typography;

const StyledCard = styled(Card)`
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
const ItemWrapper = styled.div`
  width: calc(50% - 8px);
  box-sizing: border-box;
  margin-bottom: 5px;
`;

const FormSidebarItem = ({ data }) => {
  // Add a check to ensure data exists before using it
  if (!data || !data.component) {
    console.error("FormSidebarItem received invalid data:", data);
    return null;
  }

  const [{ isDragging }, drag] = useDrag({
    type: FORM_ITEM,
    item: {
      id: data.id,
      type: "formItem", // Add this to identify sidebar items
      component: data.component,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  const getIconForType = (type) => {
    switch (type) {
      case "input":
        return "📝";
      case "select":
        return "📋";
      case "checkbox":
        return "✅";
      case "radio":
        return "⭕";
      case "datepicker":
        return "📅";
      case "textarea":
        return "📄";
      case "switch":
        return "🔘";
      case "slider":
        return "📊";
      case "upload":
        return "📎";
      default:
        return "🧩";
    }
  };

  return (
    <ItemWrapper>
      <div ref={drag} style={{ opacity }}>
        <StyledCard size="small">
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "8px", fontSize: "18px" }}>
              {getIconForType(data.component.type)}
            </span>
            <Text strong>{data.component.label}</Text>
          </div>
        </StyledCard>
      </div>
    </ItemWrapper>
  );
};

export default FormSidebarItem;
