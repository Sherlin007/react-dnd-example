import shortid from "shortid";

// Make sure these constants are properly defined and exported
export const FORM_ITEM = "formItem";
export const COMPONENT = "component";
export const ROW = "row";
export const COLUMN = "column";

// Define form field types
export const FORM_ITEMS = [
  {
    id: shortid.generate(),
    type: FORM_ITEM,
    component: {
      type: "input",
      fieldType: "text",
      label: "Text Input",
      placeholder: "Enter text",
      required: false,
    },
  },
  {
    id: shortid.generate(),
    type: FORM_ITEM,
    component: {
      type: "input",
      fieldType: "number",
      label: "Number Input",
      placeholder: "Enter number",
      required: false,
    },
  },
  {
    id: shortid.generate(),
    type: FORM_ITEM,
    component: {
      type: "select",
      label: "Select",
      placeholder: "Select an option",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
      ],
      required: false,
    },
  },
  {
    id: shortid.generate(),
    type: FORM_ITEM,
    component: {
      type: "checkbox",
      label: "Checkbox",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
      ],
      required: false,
    },
  },
  {
    id: shortid.generate(),
    type: FORM_ITEM,
    component: {
      type: "radio",
      label: "Radio Group",
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
      ],
      required: false,
    },
  },
  {
    id: shortid.generate(),
    type: FORM_ITEM,
    component: {
      type: "datepicker",
      label: "Date Picker",
      placeholder: "Select date",
      required: false,
    },
  },
  {
    id: shortid.generate(),
    type: FORM_ITEM,
    component: {
      type: "textarea",
      label: "Text Area",
      placeholder: "Enter long text",
      required: false,
    },
  },
  {
    id: shortid.generate(),
    type: FORM_ITEM,
    component: {
      type: "switch",
      label: "Switch",
      defaultChecked: false,
      required: false,
    },
  },
  {
    id: shortid.generate(),
    type: FORM_ITEM,
    component: {
      type: "slider",
      label: "Slider",
      min: 0,
      max: 100,
      defaultValue: 50,
      required: false,
    },
  },
  {
    id: shortid.generate(),
    type: FORM_ITEM,
    component: {
      type: "upload",
      label: "File Upload",
      required: false,
    },
  },
];
