import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { COMPONENT } from "./constants/formConstants";
import { DeleteOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Radio,
  DatePicker,
  Switch,
  Slider,
  Upload,
  Button,
  InputNumber,
} from "antd";

const { TextArea } = Input;
const { Group: CheckboxGroup } = Checkbox;
const { Group: RadioGroup } = Radio;

const ComponentContainer = styled.div`
  position: relative;
  padding: 16px;
  background-color: white;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

const DeleteButton = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  color: #ff4d4f;
  font-size: 16px;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s;

  ${ComponentContainer}:hover & {
    opacity: 1;
  }
`;

const FormComponent = ({ data, component, path, handleDrop }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: COMPONENT,
    item: {
      id: data.id,
      path,
      type: COMPONENT,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  // Make sure component exists before rendering
  if (!component) {
    console.warn(`No component found for id: ${data.id}`);
    return null;
  }

  const handleDelete = (e) => {
    e.stopPropagation();
    if (handleDrop) {
      // Instead of using { path: "trash" }, we should directly call handleDropToTrash
      // or modify how we're passing the delete information
      handleDrop({ path: "trash" }, { type: COMPONENT, id: data.id, path });
    }
  };

  const renderFormElement = () => {
    if (!component) return null;

    switch (component.type) {
      case "input":
        return (
          <Form.Item label={component.label} required={component.required}>
            {component.fieldType === "number" ? (
              <InputNumber
                placeholder={component.placeholder}
                style={{ width: "100%" }}
              />
            ) : (
              <Input placeholder={component.placeholder} />
            )}
          </Form.Item>
        );

      case "select":
        return (
          <Form.Item label={component.label} required={component.required}>
            <Select
              placeholder={component.placeholder}
              style={{ width: "100%" }}
              options={component.options}
            />
          </Form.Item>
        );

      case "checkbox":
        return (
          <Form.Item label={component.label} required={component.required}>
            <CheckboxGroup options={component.options} />
          </Form.Item>
        );

      case "radio":
        return (
          <Form.Item label={component.label} required={component.required}>
            <RadioGroup options={component.options} />
          </Form.Item>
        );

      case "datepicker":
        return (
          <Form.Item label={component.label} required={component.required}>
            <DatePicker
              placeholder={component.placeholder}
              style={{ width: "100%" }}
            />
          </Form.Item>
        );

      case "textarea":
        return (
          <Form.Item label={component.label} required={component.required}>
            <TextArea placeholder={component.placeholder} rows={4} />
          </Form.Item>
        );

      case "switch":
        return (
          <Form.Item
            label={component.label}
            required={component.required}
            valuePropName="checked"
          >
            <Switch defaultChecked={component.defaultChecked} />
          </Form.Item>
        );

      case "slider":
        return (
          <Form.Item label={component.label} required={component.required}>
            <Slider
              min={component.min}
              max={component.max}
              defaultValue={component.defaultValue}
            />
          </Form.Item>
        );

      case "upload":
        return (
          <Form.Item label={component.label} required={component.required}>
            <Upload>
              <Button>Click to Upload</Button>
            </Upload>
          </Form.Item>
        );

      default:
        return <div>Unknown component type: {component.type}</div>;
    }
  };

  return (
    <ComponentContainer ref={ref} style={{ opacity }}>
      <DeleteButton onClick={handleDelete}>
        <DeleteOutlined />
      </DeleteButton>
      {renderFormElement()}
    </ComponentContainer>
  );
};

export default FormComponent;
