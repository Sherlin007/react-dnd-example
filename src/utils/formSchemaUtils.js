import {
  FIELD_TYPES,
  VALIDATION_TYPES,
  VISIBILITY_CONDITIONS,
  FIELD_CATEGORIES,
  createFieldSchema,
  createSectionSchema,
  createChildTableSchema,
  createEnhancedChildTableSchema
} from '../constants/formConstants';
import { VALIDATION_RULE_TEMPLATES } from '../constants/enhancedFormSchema';

/**
 * Form Schema Utilities
 * Provides enterprise-grade form management capabilities inspired by Kissflow
 */

export class FormSchemaManager {
  constructor(formSchema) {
    this.schema = formSchema;
  }

  // Form Management
  updateFormMetadata(metadata) {
    this.schema = {
      ...this.schema,
      ...metadata,
      updatedAt: new Date().toISOString()
    };
    return this.schema;
  }

  // Section Management
  addSection(sectionData, afterIndex = -1) {
    const newSection = createSectionSchema({
      ...sectionData,
      order: this.schema.sections ? this.schema.sections.length : 0
    });

    if (!this.schema.sections) {
      this.schema.sections = [];
    }

    if (afterIndex >= 0 && afterIndex < this.schema.sections.length) {
      this.schema.sections.splice(afterIndex + 1, 0, newSection);
    } else {
      this.schema.sections.push(newSection);
    }

    this._reorderSections();
    return newSection;
  }

  removeSection(sectionId) {
    if (!this.schema.sections) return false;
    
    const index = this.schema.sections.findIndex(s => s.id === sectionId);
    if (index >= 0) {
      this.schema.sections.splice(index, 1);
      this._reorderSections();
      return true;
    }
    return false;
  }

  updateSection(sectionId, updates) {
    if (!this.schema.sections) return false;
    
    const index = this.schema.sections.findIndex(s => s.id === sectionId);
    if (index >= 0) {
      this.schema.sections[index] = {
        ...this.schema.sections[index],
        ...updates
      };
      return this.schema.sections[index];
    }
    return false;
  }

  moveSection(sectionId, newIndex) {
    if (!this.schema.sections) return false;
    
    const currentIndex = this.schema.sections.findIndex(s => s.id === sectionId);
    if (currentIndex >= 0 && newIndex >= 0 && newIndex < this.schema.sections.length) {
      const section = this.schema.sections.splice(currentIndex, 1)[0];
      this.schema.sections.splice(newIndex, 0, section);
      this._reorderSections();
      return true;
    }
    return false;
  }

  // Field Management
  addFieldToSection(sectionId, fieldData) {
    const section = this._findSection(sectionId);
    if (!section) return false;

    const newField = createFieldSchema(fieldData.fieldType, {
      ...fieldData,
      order: section.fields ? section.fields.length : 0
    });

    if (!section.fields) {
      section.fields = [];
    }

    section.fields.push(newField);
    return newField;
  }

  removeFieldFromSection(sectionId, fieldId) {
    const section = this._findSection(sectionId);
    if (!section || !section.fields) return false;

    const index = section.fields.findIndex(f => f.id === fieldId);
    if (index >= 0) {
      section.fields.splice(index, 1);
      this._reorderFields(section);
      return true;
    }
    return false;
  }

  updateField(sectionId, fieldId, updates) {
    const section = this._findSection(sectionId);
    if (!section || !section.fields) return false;

    const index = section.fields.findIndex(f => f.id === fieldId);
    if (index >= 0) {
      section.fields[index] = {
        ...section.fields[index],
        ...updates
      };
      return section.fields[index];
    }
    return false;
  }

  moveField(sectionId, fieldId, newIndex) {
    const section = this._findSection(sectionId);
    if (!section || !section.fields) return false;

    const currentIndex = section.fields.findIndex(f => f.id === fieldId);
    if (currentIndex >= 0 && newIndex >= 0 && newIndex < section.fields.length) {
      const field = section.fields.splice(currentIndex, 1)[0];
      section.fields.splice(newIndex, 0, field);
      this._reorderFields(section);
      return true;
    }
    return false;
  }

  // Child Table Management
  addChildTableToSection(sectionId, tableData) {
    const section = this._findSection(sectionId);
    if (!section) return false;

    const newTable = createEnhancedChildTableSchema({
      ...tableData
    });

    if (!section.childTables) {
      section.childTables = [];
    }

    section.childTables.push(newTable);
    return newTable;
  }

  removeChildTableFromSection(sectionId, tableId) {
    const section = this._findSection(sectionId);
    if (!section || !section.childTables) return false;

    const index = section.childTables.findIndex(t => t.id === tableId);
    if (index >= 0) {
      section.childTables.splice(index, 1);
      return true;
    }
    return false;
  }

  updateChildTable(sectionId, tableId, updates) {
    const section = this._findSection(sectionId);
    if (!section || !section.childTables) return false;

    const index = section.childTables.findIndex(t => t.id === tableId);
    if (index >= 0) {
      section.childTables[index] = {
        ...section.childTables[index],
        ...updates
      };
      return section.childTables[index];
    }
    return false;
  }

  // Validation Management
  addValidationToField(sectionId, fieldId, validationType, config = {}) {
    const field = this._findField(sectionId, fieldId);
    if (!field) return false;

    const template = VALIDATION_RULE_TEMPLATES[validationType];
    if (!template) return false;

    const validation = {
      id: `validation_${Date.now()}`,
      type: validationType,
      message: template.message,
      enabled: true,
      ...template.config,
      ...config
    };

    if (!field.validations) {
      field.validations = [];
    }

    field.validations.push(validation);
    return validation;
  }

  removeValidationFromField(sectionId, fieldId, validationId) {
    const field = this._findField(sectionId, fieldId);
    if (!field || !field.validations) return false;

    const index = field.validations.findIndex(v => v.id === validationId);
    if (index >= 0) {
      field.validations.splice(index, 1);
      return true;
    }
    return false;
  }

  // Visibility Conditions
  addVisibilityCondition(sectionId, fieldId, condition) {
    const field = this._findField(sectionId, fieldId);
    if (!field) return false;

    if (!field.visibilityConditions) {
      field.visibilityConditions = {
        type: VISIBILITY_CONDITIONS.CONDITIONAL,
        conditions: []
      };
    }

    field.visibilityConditions.conditions.push(condition);
    field.visibilityConditions.type = VISIBILITY_CONDITIONS.CONDITIONAL;
    return true;
  }

  removeVisibilityCondition(sectionId, fieldId, conditionId) {
    const field = this._findField(sectionId, fieldId);
    if (!field || !field.visibilityConditions) return false;

    const index = field.visibilityConditions.conditions.findIndex(c => c.id === conditionId);
    if (index >= 0) {
      field.visibilityConditions.conditions.splice(index, 1);
      
      if (field.visibilityConditions.conditions.length === 0) {
        field.visibilityConditions.type = VISIBILITY_CONDITIONS.ALWAYS;
      }
      
      return true;
    }
    return false;
  }

  // Form Validation
  validateForm() {
    const errors = [];
    const warnings = [];

    // Form-level validation
    if (!this.schema.title || this.schema.title.trim() === '') {
      errors.push('Form title is required');
    }

    if (!this.schema.sections || this.schema.sections.length === 0) {
      errors.push('Form must have at least one section');
    }

    // Section-level validation
    if (this.schema.sections) {
      this.schema.sections.forEach((section, sectionIndex) => {
        if (!section.title || section.title.trim() === '') {
          errors.push(`Section ${sectionIndex + 1} title is required`);
        }

        if ((!section.fields || section.fields.length === 0) && 
            (!section.childTables || section.childTables.length === 0)) {
          warnings.push(`Section "${section.title}" has no fields or child tables`);
        }

        // Field-level validation
        if (section.fields) {
          section.fields.forEach((field, fieldIndex) => {
            if (!field.label || field.label.trim() === '') {
              errors.push(`Field ${fieldIndex + 1} in section "${section.title}" must have a label`);
            }

            // Validate field-specific requirements
            this._validateFieldSpecific(field, section.title, errors, warnings);
          });
        }

        // Child table validation
        if (section.childTables) {
          section.childTables.forEach((table, tableIndex) => {
            if (!table.label || table.label.trim() === '') {
              errors.push(`Child table ${tableIndex + 1} in section "${section.title}" must have a label`);
            }

            if (!table.columns || table.columns.length === 0) {
              warnings.push(`Child table "${table.label}" has no columns`);
            }
          });
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Export/Import
  exportSchema() {
    return JSON.stringify(this.schema, null, 2);
  }

  importSchema(schemaJson) {
    try {
      const imported = JSON.parse(schemaJson);
      this.schema = imported;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Analytics
  getFormAnalytics() {
    const analytics = {
      totalSections: this.schema.sections ? this.schema.sections.length : 0,
      totalFields: 0,
      totalChildTables: 0,
      fieldsByType: {},
      fieldsByCategory: {},
      sectionsWithConditions: 0,
      fieldsWithValidations: 0
    };

    if (this.schema.sections) {
      this.schema.sections.forEach(section => {
        if (section.fields) {
          analytics.totalFields += section.fields.length;
          
          section.fields.forEach(field => {
            // Count by type
            analytics.fieldsByType[field.fieldType] = 
              (analytics.fieldsByType[field.fieldType] || 0) + 1;
            
            // Count by category
            analytics.fieldsByCategory[field.category] = 
              (analytics.fieldsByCategory[field.category] || 0) + 1;
            
            // Count validations
            if (field.validations && field.validations.length > 0) {
              analytics.fieldsWithValidations++;
            }
          });
        }

        if (section.childTables) {
          analytics.totalChildTables += section.childTables.length;
        }

        if (section.visibilityConditions && 
            section.visibilityConditions.type === VISIBILITY_CONDITIONS.CONDITIONAL) {
          analytics.sectionsWithConditions++;
        }
      });
    }

    return analytics;
  }

  // Private helper methods
  _findSection(sectionId) {
    if (!this.schema.sections) return null;
    return this.schema.sections.find(s => s.id === sectionId);
  }

  _findField(sectionId, fieldId) {
    const section = this._findSection(sectionId);
    if (!section || !section.fields) return null;
    return section.fields.find(f => f.id === fieldId);
  }

  _reorderSections() {
    if (this.schema.sections) {
      this.schema.sections.forEach((section, index) => {
        section.order = index;
      });
    }
  }

  _reorderFields(section) {
    if (section.fields) {
      section.fields.forEach((field, index) => {
        field.order = index;
      });
    }
  }

  _validateFieldSpecific(field, sectionTitle, errors, warnings) {
    switch (field.fieldType) {
      case FIELD_TYPES.SINGLE_SELECT:
      case FIELD_TYPES.MULTI_SELECT:
      case FIELD_TYPES.RADIO:
      case FIELD_TYPES.CHECKBOX:
        if (!field.properties || !field.properties.options || 
            field.properties.options.length === 0) {
          warnings.push(`Field "${field.label}" in section "${sectionTitle}" has no options`);
        }
        break;
      
      case FIELD_TYPES.FILE_UPLOAD:
      case FIELD_TYPES.IMAGE_UPLOAD:
        if (field.properties && field.properties.maxSize && field.properties.maxSize > 100) {
          warnings.push(`Field "${field.label}" has a large max file size (${field.properties.maxSize}MB)`);
        }
        break;
      
      case FIELD_TYPES.CURRENCY:
        if (!field.properties || !field.properties.currency) {
          warnings.push(`Currency field "${field.label}" should specify a currency`);
        }
        break;
    }
  }
}

// Utility functions
export const FormSchemaUtils = {
  // Create a new form schema manager
  createManager: (schema) => new FormSchemaManager(schema),
  
  // Convert legacy form data to enhanced schema
  convertLegacyToEnhanced: (legacyData) => {
    // Implementation for converting old format to new enhanced schema
    // This ensures backward compatibility
    const enhanced = {
      id: `form_${Date.now()}`,
      type: 'form',
      title: 'Converted Form',
      description: '',
      version: '1.0.0',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [],
      settings: {
        allowSave: true,
        allowSubmit: true,
        allowDraft: true,
        showProgressBar: false,
        enableAutoSave: true,
        autoSaveInterval: 30000
      },
      permissions: {
        view: ['all'],
        edit: ['admin', 'editor'],
        delete: ['admin'],
        submit: ['all']
      }
    };

    if (legacyData.layout) {
      legacyData.layout.forEach(section => {
        if (section.type === 'section') {
          const enhancedSection = createSectionSchema({
            title: section.title || 'Untitled Section',
            description: section.description || ''
          });
          
          enhanced.sections.push(enhancedSection);
        }
      });
    }

    return enhanced;
  },
  
  // Generate form submission template
  generateSubmissionTemplate: (schema) => {
    const template = {
      formId: schema.id,
      formVersion: schema.version,
      submittedAt: null,
      submittedBy: null,
      status: 'draft', // draft, submitted, approved, rejected
      data: {}
    };

    if (schema.sections) {
      schema.sections.forEach(section => {
        if (section.fields) {
          section.fields.forEach(field => {
            template.data[field.id] = field.defaultValue || null;
          });
        }
        
        if (section.childTables) {
          section.childTables.forEach(table => {
            template.data[table.id] = [];
          });
        }
      });
    }

    return template;
  },
  
  // Validate form submission
  validateSubmission: (schema, submissionData) => {
    const errors = [];
    const manager = new FormSchemaManager(schema);
    
    if (schema.sections) {
      schema.sections.forEach(section => {
        if (section.fields) {
          section.fields.forEach(field => {
            const value = submissionData.data[field.id];
            
            // Required field validation
            if (field.required && (value === null || value === undefined || value === '')) {
              errors.push(`Field "${field.label}" is required`);
            }
            
            // Field-specific validations
            if (field.validations && value !== null && value !== undefined && value !== '') {
              field.validations.forEach(validation => {
                if (validation.enabled) {
                  const validationError = manager._validateFieldValue(field, value, validation);
                  if (validationError) {
                    errors.push(validationError);
                  }
                }
              });
            }
          });
        }
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default FormSchemaUtils;