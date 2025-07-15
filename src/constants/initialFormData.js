import { COMPONENT, ROW, COLUMN, SECTION } from './formConstants';
import { createDefaultFormTemplate, createFormSchema, createSectionSchema } from './enhancedFormSchema';
import shortid from 'shortid';

// Backward compatible initial form data
const initialFormData = {
  layout: [
    {
      type: SECTION,
      id: shortid.generate(),
      title: 'Section 1',
      children: [
        {
          type: ROW,
          id: shortid.generate(),
          children: [
            {
              type: COLUMN,
              id: shortid.generate(),
              children: [],
            },
          ],
        },
      ],
    },
  ],
  components: {},
};

// Enhanced form data using Kissflow-inspired schema
export const enhancedInitialFormData = createDefaultFormTemplate();

// Hybrid approach - enhanced form with backward compatible layout structure
export const hybridFormData = {
  // Enhanced form metadata
  form: createFormSchema({
    title: "New Form",
    description: "Create your form by adding fields from the library"
  }),
  
  // Backward compatible layout structure
  layout: [
    {
      type: SECTION,
      id: shortid.generate(),
      title: 'Section 1',
      description: 'Add fields to this section',
      // Enhanced section properties
      visible: true,
      collapsible: false,
      required: false,
      layout: {
        columns: 1,
        spacing: "medium",
        alignment: "left"
      },
      fields: [],
      childTables: [],
      children: [
        {
          type: ROW,
          id: shortid.generate(),
          children: [
            {
              type: COLUMN,
              id: shortid.generate(),
              children: [],
            },
          ],
        },
      ],
    },
  ],
  
  // Enhanced components with field metadata
  components: {},
  
  // Form-level settings
  settings: {
    allowSave: true,
    allowSubmit: true,
    allowDraft: true,
    showProgressBar: false,
    enableAutoSave: true,
    autoSaveInterval: 30000
  },
  
  // Form permissions
  permissions: {
    view: ["all"],
    edit: ["admin", "editor"],
    delete: ["admin"],
    submit: ["all"]
  }
};

export default initialFormData;
