import shortid from "shortid";

// Core form structure constants - maintaining backward compatibility
export const FORM_ITEM = "formItem";
export const COMPONENT = "component";
export const ROW = "row";
export const COLUMN = "column";
export const SECTION = "section";

// Enhanced Kissflow-inspired constants
export const FORM = "form";
export const FIELD = "field";
export const CHILD_TABLE = "childTable";
export const TABLE_COLUMN = "tableColumn";

// Field categories following Kissflow structure
export const FIELD_CATEGORIES = {
  BASIC: "basic",
  ADVANCED: "advanced",
  FILE_MEDIA: "fileMedia",
  DATA_LOOKUP: "dataLookup",
  WIDGET: "widget",
  AI_SUGGESTED: "aiSuggested"
};

// Field types with enhanced properties
export const FIELD_TYPES = {
  // Basic fields
  TEXT: "text",
  TEXT_AREA: "textArea",
  NUMBER: "number",
  EMAIL: "email",
  PHONE: "phone",
  URL: "url",
  PASSWORD: "password",
  
  // Selection fields
  SINGLE_SELECT: "singleSelect",
  MULTI_SELECT: "multiSelect",
  RADIO: "radio",
  CHECKBOX: "checkbox",
  
  // Date/Time fields
  DATE: "date",
  DATE_TIME: "dateTime",
  TIME: "time",
  
  // Advanced fields
  RATING: "rating",
  SLIDER: "slider",
  SWITCH: "switch",
  CURRENCY: "currency",
  
  // File and media
  FILE_UPLOAD: "fileUpload",
  IMAGE_UPLOAD: "imageUpload",
  
  // Data lookup
  USER_LOOKUP: "userLookup",
  DEPARTMENT_LOOKUP: "departmentLookup",
  
  // Widget
  SIGNATURE: "signature",
  LOCATION: "location",
  BARCODE: "barcode"
};

// Validation types
export const VALIDATION_TYPES = {
  REQUIRED: "required",
  MIN_LENGTH: "minLength",
  MAX_LENGTH: "maxLength",
  MIN_VALUE: "minValue",
  MAX_VALUE: "maxValue",
  PATTERN: "pattern",
  EMAIL_FORMAT: "emailFormat",
  PHONE_FORMAT: "phoneFormat",
  URL_FORMAT: "urlFormat",
  CUSTOM: "custom"
};

// Visibility condition types
export const VISIBILITY_CONDITIONS = {
  ALWAYS: "always",
  CONDITIONAL: "conditional",
  ROLE_BASED: "roleBased",
  WORKFLOW_STAGE: "workflowStage"
};

// Permission types
export const PERMISSION_TYPES = {
  READ: "read",
  write: "write",
  hidden: "hidden",
  readOnly: "readOnly"
};

// Enhanced form field schema following Kissflow structure
export const createFieldSchema = (fieldType, overrides = {}) => ({
  id: shortid.generate(),
  type: FIELD,
  fieldType,
  category: FIELD_CATEGORIES.BASIC,
  label: "",
  description: "",
  placeholder: "",
  required: false,
  visible: true,
  readOnly: false,
  defaultValue: null,
  validations: [],
  visibilityConditions: {
    type: VISIBILITY_CONDITIONS.ALWAYS,
    conditions: []
  },
  permissions: {
    read: ["all"],
    write: ["all"]
  },
  properties: {},
  ...overrides
});

// Enhanced section schema
export const createSectionSchema = (overrides = {}) => ({
  id: shortid.generate(),
  type: SECTION,
  title: "Untitled Section",
  description: "",
  order: 0,
  visible: true,
  collapsible: false,
  collapsed: false,
  required: false,
  
  // Section layout
  layout: {
    columns: 1,
    spacing: "medium",
    alignment: "left"
  },
  
  // Section contents
  fields: [],
  childTables: [],
  
  // Visibility conditions
  visibilityConditions: {
    type: VISIBILITY_CONDITIONS.ALWAYS,
    conditions: []
  },
  
  // Section permissions
  permissions: {
    read: ["all"],
    write: ["all"]
  },
  
  // Section styling
  styling: {
    backgroundColor: null,
    borderColor: null,
    textColor: null,
    customCSS: ""
  },
  
  ...overrides
});

// Child table schema
export const createChildTableSchema = (overrides = {}) => ({
  id: shortid.generate(),
  type: CHILD_TABLE,
  label: "Child Table",
  description: "",
  required: false,
  visible: true,
  minRows: 0,
  maxRows: 1000,
  allowCSVImport: false,
  columns: [],
  validations: [],
  visibilityConditions: {
    type: VISIBILITY_CONDITIONS.ALWAYS,
    conditions: []
  },
  permissions: {
    read: ["all"],
    write: ["all"]
  },
  ...overrides
});

// Enhanced child table with CSV import capabilities
export const createEnhancedChildTableSchema = (overrides = {}) => ({
  ...createChildTableSchema(),
  
  // CSV Import settings (following Kissflow guidelines)
  csvImport: {
    enabled: false,
    maxRows: 1000,
    allowedDelimiters: [","],
    encoding: "UTF-8",
    requiredColumns: [],
    columnMapping: {},
    validationRules: {
      mandatoryFields: true,
      dataTypeValidation: true,
      customValidations: []
    }
  },
  
  // Table display settings
  display: {
    showRowNumbers: true,
    allowSorting: true,
    allowFiltering: false,
    pagination: {
      enabled: false,
      pageSize: 10
    },
    exportOptions: {
      allowExport: true,
      formats: ["csv", "excel"]
    }
  },
  
  // Table behavior
  behavior: {
    allowAddRows: true,
    allowDeleteRows: true,
    allowEditRows: true,
    allowDuplicateRows: false,
    confirmDelete: true
  },
  
  ...overrides
});

// Enhanced form items with Kissflow-inspired structure
export const ENHANCED_FORM_FIELDS = {
  // Basic Fields
  [FIELD_TYPES.TEXT]: createFieldSchema(FIELD_TYPES.TEXT, {
    label: "Text Input",
    placeholder: "Enter text",
    category: FIELD_CATEGORIES.BASIC,
    properties: {
      maxLength: 255,
      minLength: 0
    }
  }),
  
  [FIELD_TYPES.TEXT_AREA]: createFieldSchema(FIELD_TYPES.TEXT_AREA, {
    label: "Text Area",
    placeholder: "Enter long text",
    category: FIELD_CATEGORIES.BASIC,
    properties: {
      rows: 4,
      maxLength: 2000
    }
  }),
  
  [FIELD_TYPES.NUMBER]: createFieldSchema(FIELD_TYPES.NUMBER, {
    label: "Number Input",
    placeholder: "Enter number",
    category: FIELD_CATEGORIES.BASIC,
    properties: {
      min: null,
      max: null,
      step: 1,
      precision: 0
    }
  }),
  
  [FIELD_TYPES.EMAIL]: createFieldSchema(FIELD_TYPES.EMAIL, {
    label: "Email",
    placeholder: "Enter email address",
    category: FIELD_CATEGORIES.BASIC,
    validations: [VALIDATION_TYPES.EMAIL_FORMAT]
  }),
  
  [FIELD_TYPES.PHONE]: createFieldSchema(FIELD_TYPES.PHONE, {
    label: "Phone Number",
    placeholder: "Enter phone number",
    category: FIELD_CATEGORIES.BASIC,
    validations: [VALIDATION_TYPES.PHONE_FORMAT]
  }),
  
  // Selection Fields
  [FIELD_TYPES.SINGLE_SELECT]: createFieldSchema(FIELD_TYPES.SINGLE_SELECT, {
    label: "Single Select",
    placeholder: "Select an option",
    category: FIELD_CATEGORIES.BASIC,
    properties: {
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" }
      ],
      allowOther: false
    }
  }),
  
  [FIELD_TYPES.MULTI_SELECT]: createFieldSchema(FIELD_TYPES.MULTI_SELECT, {
    label: "Multi Select",
    placeholder: "Select multiple options",
    category: FIELD_CATEGORIES.BASIC,
    properties: {
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" }
      ],
      maxSelections: null
    }
  }),
  
  [FIELD_TYPES.RADIO]: createFieldSchema(FIELD_TYPES.RADIO, {
    label: "Radio Group",
    category: FIELD_CATEGORIES.BASIC,
    properties: {
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" }
      ],
      layout: "vertical"
    }
  }),
  
  [FIELD_TYPES.CHECKBOX]: createFieldSchema(FIELD_TYPES.CHECKBOX, {
    label: "Checkbox Group",
    category: FIELD_CATEGORIES.BASIC,
    properties: {
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" }
      ],
      layout: "vertical"
    }
  }),
  
  // Date/Time Fields
  [FIELD_TYPES.DATE]: createFieldSchema(FIELD_TYPES.DATE, {
    label: "Date",
    placeholder: "Select date",
    category: FIELD_CATEGORIES.BASIC,
    properties: {
      format: "YYYY-MM-DD",
      minDate: null,
      maxDate: null
    }
  }),
  
  [FIELD_TYPES.DATE_TIME]: createFieldSchema(FIELD_TYPES.DATE_TIME, {
    label: "Date Time",
    placeholder: "Select date and time",
    category: FIELD_CATEGORIES.BASIC,
    properties: {
      format: "YYYY-MM-DD HH:mm",
      minDate: null,
      maxDate: null
    }
  }),
  
  // Advanced Fields
  [FIELD_TYPES.RATING]: createFieldSchema(FIELD_TYPES.RATING, {
    label: "Rating",
    category: FIELD_CATEGORIES.ADVANCED,
    properties: {
      max: 5,
      allowHalf: false,
      character: "★"
    }
  }),
  
  [FIELD_TYPES.SLIDER]: createFieldSchema(FIELD_TYPES.SLIDER, {
    label: "Slider",
    category: FIELD_CATEGORIES.ADVANCED,
    defaultValue: 50,
    properties: {
      min: 0,
      max: 100,
      step: 1,
      marks: {}
    }
  }),
  
  [FIELD_TYPES.SWITCH]: createFieldSchema(FIELD_TYPES.SWITCH, {
    label: "Switch",
    category: FIELD_CATEGORIES.ADVANCED,
    defaultValue: false,
    properties: {
      checkedText: "Yes",
      uncheckedText: "No"
    }
  }),
  
  [FIELD_TYPES.CURRENCY]: createFieldSchema(FIELD_TYPES.CURRENCY, {
    label: "Currency",
    placeholder: "Enter amount",
    category: FIELD_CATEGORIES.ADVANCED,
    properties: {
      currency: "USD",
      symbol: "$",
      precision: 2
    }
  }),
  
  // File and Media
  [FIELD_TYPES.FILE_UPLOAD]: createFieldSchema(FIELD_TYPES.FILE_UPLOAD, {
    label: "File Upload",
    category: FIELD_CATEGORIES.FILE_MEDIA,
    properties: {
      maxSize: 10, // MB
      allowedTypes: ["pdf", "doc", "docx", "xls", "xlsx"],
      multiple: false
    }
  }),
  
  [FIELD_TYPES.IMAGE_UPLOAD]: createFieldSchema(FIELD_TYPES.IMAGE_UPLOAD, {
    label: "Image Upload",
    category: FIELD_CATEGORIES.FILE_MEDIA,
    properties: {
      maxSize: 5, // MB
      allowedTypes: ["jpg", "jpeg", "png", "gif"],
      multiple: false,
      maxWidth: 1920,
      maxHeight: 1080
    }
  }),
  
  // Data Lookup
  [FIELD_TYPES.USER_LOOKUP]: createFieldSchema(FIELD_TYPES.USER_LOOKUP, {
    label: "User Lookup",
    placeholder: "Select user",
    category: FIELD_CATEGORIES.DATA_LOOKUP,
    properties: {
      multiple: false,
      departments: [],
      roles: []
    }
  })
};

// Backward compatibility - maintain existing FORM_ITEMS structure
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
