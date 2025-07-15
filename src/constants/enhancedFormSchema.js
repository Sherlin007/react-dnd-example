import shortid from "shortid";
import {
  FORM,
  SECTION,
  FIELD,
  CHILD_TABLE,
  FIELD_CATEGORIES,
  FIELD_TYPES,
  VALIDATION_TYPES,
  VISIBILITY_CONDITIONS,
  PERMISSION_TYPES,
  createFieldSchema,
  createChildTableSchema
} from "./formConstants";

/**
 * Enhanced Form Schema inspired by Kissflow's enterprise form structure
 * This schema supports:
 * - Hierarchical form structure (Form > Sections > Fields/Tables)
 * - Complex field types with validations
 * - Child tables with CSV import capabilities
 * - Visibility conditions and permissions
 * - Enterprise-grade form management
 */

// Main form schema structure
export const createFormSchema = (overrides = {}) => ({
  id: shortid.generate(),
  type: FORM,
  title: "New Form",
  description: "",
  version: "1.0.0",
  status: "draft", // draft, published, archived
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: null,
  updatedBy: null,
  
  // Form-level settings
  settings: {
    allowSave: true,
    allowSubmit: true,
    allowDraft: true,
    showProgressBar: false,
    enableAutoSave: true,
    autoSaveInterval: 30000, // 30 seconds
    submitRedirectUrl: null,
    customCSS: "",
    theme: "default"
  },
  
  // Form structure
  sections: [],
  
  // Global form validations
  validations: [],
  
  // Form-level permissions
  permissions: {
    view: ["all"],
    edit: ["admin", "editor"],
    delete: ["admin"],
    submit: ["all"]
  },
  
  // Workflow integration
  workflow: {
    enabled: false,
    stages: [],
    currentStage: null
  },
  
  // Analytics and tracking
  analytics: {
    trackViews: true,
    trackSubmissions: true,
    trackFieldInteractions: false
  },
  
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

// Enhanced field validation schema
export const createValidationRule = (type, config = {}) => ({
  id: shortid.generate(),
  type,
  message: "",
  enabled: true,
  ...config
});

// Visibility condition schema
export const createVisibilityCondition = (fieldId, operator, value) => ({
  id: shortid.generate(),
  fieldId,
  operator, // equals, notEquals, contains, greaterThan, lessThan, isEmpty, isNotEmpty
  value,
  logicalOperator: "AND" // AND, OR
});

// Child table column schema
export const createTableColumnSchema = (fieldType, overrides = {}) => ({
  id: shortid.generate(),
  fieldType,
  label: "",
  required: false,
  visible: true,
  order: 0,
  width: "auto",
  validations: [],
  properties: {},
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

// Form field categories with enhanced fields
export const ENHANCED_FIELD_CATEGORIES = {
  [FIELD_CATEGORIES.BASIC]: {
    label: "Basic Fields",
    icon: "form",
    fields: [
      FIELD_TYPES.TEXT,
      FIELD_TYPES.TEXT_AREA,
      FIELD_TYPES.NUMBER,
      FIELD_TYPES.EMAIL,
      FIELD_TYPES.PHONE,
      FIELD_TYPES.URL,
      FIELD_TYPES.PASSWORD
    ]
  },
  
  [FIELD_CATEGORIES.ADVANCED]: {
    label: "Advanced Fields",
    icon: "setting",
    fields: [
      FIELD_TYPES.SINGLE_SELECT,
      FIELD_TYPES.MULTI_SELECT,
      FIELD_TYPES.RADIO,
      FIELD_TYPES.CHECKBOX,
      FIELD_TYPES.DATE,
      FIELD_TYPES.DATE_TIME,
      FIELD_TYPES.TIME,
      FIELD_TYPES.RATING,
      FIELD_TYPES.SLIDER,
      FIELD_TYPES.SWITCH,
      FIELD_TYPES.CURRENCY
    ]
  },
  
  [FIELD_CATEGORIES.FILE_MEDIA]: {
    label: "File & Media",
    icon: "file",
    fields: [
      FIELD_TYPES.FILE_UPLOAD,
      FIELD_TYPES.IMAGE_UPLOAD
    ]
  },
  
  [FIELD_CATEGORIES.DATA_LOOKUP]: {
    label: "Data Lookup",
    icon: "search",
    fields: [
      FIELD_TYPES.USER_LOOKUP,
      FIELD_TYPES.DEPARTMENT_LOOKUP
    ]
  },
  
  [FIELD_CATEGORIES.WIDGET]: {
    label: "Widgets",
    icon: "appstore",
    fields: [
      FIELD_TYPES.SIGNATURE,
      FIELD_TYPES.LOCATION,
      FIELD_TYPES.BARCODE
    ]
  }
};

// Validation rule templates
export const VALIDATION_RULE_TEMPLATES = {
  [VALIDATION_TYPES.REQUIRED]: {
    label: "Required",
    message: "This field is required",
    config: {}
  },
  
  [VALIDATION_TYPES.MIN_LENGTH]: {
    label: "Minimum Length",
    message: "Must be at least {minLength} characters",
    config: {
      minLength: 1
    }
  },
  
  [VALIDATION_TYPES.MAX_LENGTH]: {
    label: "Maximum Length",
    message: "Must be no more than {maxLength} characters",
    config: {
      maxLength: 255
    }
  },
  
  [VALIDATION_TYPES.MIN_VALUE]: {
    label: "Minimum Value",
    message: "Must be at least {minValue}",
    config: {
      minValue: 0
    }
  },
  
  [VALIDATION_TYPES.MAX_VALUE]: {
    label: "Maximum Value",
    message: "Must be no more than {maxValue}",
    config: {
      maxValue: 100
    }
  },
  
  [VALIDATION_TYPES.PATTERN]: {
    label: "Pattern",
    message: "Invalid format",
    config: {
      pattern: "",
      flags: "i"
    }
  },
  
  [VALIDATION_TYPES.EMAIL_FORMAT]: {
    label: "Email Format",
    message: "Please enter a valid email address",
    config: {
      pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
    }
  },
  
  [VALIDATION_TYPES.PHONE_FORMAT]: {
    label: "Phone Format",
    message: "Please enter a valid phone number",
    config: {
      pattern: "^[\\+]?[1-9]?[0-9]{7,15}$"
    }
  },
  
  [VALIDATION_TYPES.URL_FORMAT]: {
    label: "URL Format",
    message: "Please enter a valid URL",
    config: {
      pattern: "^https?:\\/\\/.+"
    }
  }
};

// Default form template
export const createDefaultFormTemplate = () => {
  const form = createFormSchema({
    title: "New Form",
    description: "Create your form by adding sections and fields"
  });
  
  // Add a default section
  const defaultSection = createSectionSchema({
    title: "Section 1",
    description: "Add fields to this section"
  });
  
  form.sections = [defaultSection];
  
  return form;
};

// Form schema utilities
export const FormSchemaUtils = {
  // Add a new section to form
  addSection: (form, section, afterIndex = -1) => {
    const newForm = { ...form };
    const newSection = { ...section, order: newForm.sections.length };
    
    if (afterIndex >= 0 && afterIndex < newForm.sections.length) {
      newForm.sections.splice(afterIndex + 1, 0, newSection);
    } else {
      newForm.sections.push(newSection);
    }
    
    // Reorder sections
    newForm.sections.forEach((section, index) => {
      section.order = index;
    });
    
    return newForm;
  },
  
  // Add a field to section
  addFieldToSection: (form, sectionId, field) => {
    const newForm = { ...form };
    const sectionIndex = newForm.sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex >= 0) {
      const newField = { ...field, order: newForm.sections[sectionIndex].fields.length };
      newForm.sections[sectionIndex].fields.push(newField);
    }
    
    return newForm;
  },
  
  // Add a child table to section
  addChildTableToSection: (form, sectionId, childTable) => {
    const newForm = { ...form };
    const sectionIndex = newForm.sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex >= 0) {
      newForm.sections[sectionIndex].childTables.push(childTable);
    }
    
    return newForm;
  },
  
  // Validate form schema
  validateForm: (form) => {
    const errors = [];
    
    if (!form.title || form.title.trim() === "") {
      errors.push("Form title is required");
    }
    
    if (!form.sections || form.sections.length === 0) {
      errors.push("Form must have at least one section");
    }
    
    form.sections.forEach((section, sectionIndex) => {
      if (!section.title || section.title.trim() === "") {
        errors.push(`Section ${sectionIndex + 1} title is required`);
      }
      
      if (section.fields.length === 0 && section.childTables.length === 0) {
        errors.push(`Section "${section.title}" must have at least one field or child table`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  // Convert to submission format
  toSubmissionFormat: (form) => {
    const submission = {
      formId: form.id,
      formVersion: form.version,
      submittedAt: new Date().toISOString(),
      data: {}
    };
    
    form.sections.forEach(section => {
      section.fields.forEach(field => {
        submission.data[field.id] = field.defaultValue;
      });
      
      section.childTables.forEach(table => {
        submission.data[table.id] = [];
      });
    });
    
    return submission;
  }
};

export default {
  createFormSchema,
  createSectionSchema,
  createFieldSchema,
  createChildTableSchema,
  createEnhancedChildTableSchema,
  createValidationRule,
  createVisibilityCondition,
  createTableColumnSchema,
  createDefaultFormTemplate,
  ENHANCED_FIELD_CATEGORIES,
  VALIDATION_RULE_TEMPLATES,
  FormSchemaUtils
};