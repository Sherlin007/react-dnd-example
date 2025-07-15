import React from "react";
import { useDrag } from "react-dnd";
import { Typography } from "antd";
import { FORM_ITEM } from "../constants/formConstants";
import { StyledCard, ItemWrapper } from "../styles/FormSidebarItem.styles";

const { Text } = Typography;

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