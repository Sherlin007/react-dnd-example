import {
  FORM,
  SECTION,
  FIELD,
  COMPONENT,
  ROW,
  COLUMN,
  FORM_ITEM,
  FIELD_TYPES,
  FIELD_CATEGORIES
} from '../constants/formConstants';
import {
  createFormSchema,
  createSectionSchema
} from '../constants/enhancedFormSchema';
import { createFieldSchema } from '../constants/formConstants';
import shortid from 'shortid';

/**
 * Schema Migration Utilities
 * Handles migration between different form schema versions
 * Ensures backward compatibility while enabling new features
 */

export class SchemaMigration {
  constructor() {
    this.migrationStrategies = {
      'legacy-to-enhanced': this.migrateLegacyToEnhanced.bind(this),
      'enhanced-to-legacy': this.migrateEnhancedToLegacy.bind(this),
      'hybrid-migration': this.migrateToHybrid.bind(this)
    };
  }

  /**
   * Migrate legacy form data to enhanced Kissflow-inspired schema
   */
  migrateLegacyToEnhanced(legacyData) {
    try {
      const enhanced = createFormSchema({
        title: legacyData.title || 'Migrated Form',
        description: legacyData.description || 'Form migrated from legacy format',
        version: '2.0.0',
        status: 'draft'
      });

      // Migrate layout to sections
      if (legacyData.layout && Array.isArray(legacyData.layout)) {
        enhanced.sections = this._migrateLegacyLayout(legacyData.layout, legacyData.components);
      }

      // Migrate form-level settings if they exist
      if (legacyData.settings) {
        enhanced.settings = {
          ...enhanced.settings,
          ...legacyData.settings
        };
      }

      // Migrate permissions if they exist
      if (legacyData.permissions) {
        enhanced.permissions = {
          ...enhanced.permissions,
          ...legacyData.permissions
        };
      }

      return {
        success: true,
        data: enhanced,
        migrationLog: this._createMigrationLog('legacy-to-enhanced', legacyData, enhanced)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        migrationLog: null
      };
    }
  }

  /**
   * Migrate enhanced schema back to legacy format for backward compatibility
   */
  migrateEnhancedToLegacy(enhancedData) {
    try {
      const legacy = {
        layout: [],
        components: {},
        title: enhancedData.title,
        description: enhancedData.description
      };

      // Convert sections back to legacy layout
      if (enhancedData.sections && Array.isArray(enhancedData.sections)) {
        enhancedData.sections.forEach((section, sectionIndex) => {
          const legacySection = {
            type: SECTION,
            id: section.id,
            title: section.title,
            description: section.description,
            children: []
          };

          // Create a row for the section
          const row = {
            type: ROW,
            id: shortid.generate(),
            children: []
          };

          // Create a column for the row
          const column = {
            type: COLUMN,
            id: shortid.generate(),
            children: []
          };

          // Convert fields to legacy components
          if (section.fields && Array.isArray(section.fields)) {
            section.fields.forEach(field => {
              const componentId = field.id;
              const legacyComponent = this._convertFieldToLegacyComponent(field);
              
              legacy.components[componentId] = legacyComponent;
              column.children.push({
                type: COMPONENT,
                id: componentId
              });
            });
          }

          row.children.push(column);
          legacySection.children.push(row);
          legacy.layout.push(legacySection);
        });
      }

      // Migrate settings and permissions
      if (enhancedData.settings) {
        legacy.settings = enhancedData.settings;
      }

      if (enhancedData.permissions) {
        legacy.permissions = enhancedData.permissions;
      }

      return {
        success: true,
        data: legacy,
        migrationLog: this._createMigrationLog('enhanced-to-legacy', enhancedData, legacy)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        migrationLog: null
      };
    }
  }

  /**
   * Create a hybrid schema that supports both legacy and enhanced features
   */
  migrateToHybrid(sourceData) {
    try {
      let enhanced, legacy;

      // Determine source format and convert
      if (this._isEnhancedSchema(sourceData)) {
        enhanced = sourceData;
        const legacyResult = this.migrateEnhancedToLegacy(sourceData);
        if (!legacyResult.success) {
          throw new Error(legacyResult.error);
        }
        legacy = legacyResult.data;
      } else {
        legacy = sourceData;
        const enhancedResult = this.migrateLegacyToEnhanced(sourceData);
        if (!enhancedResult.success) {
          throw new Error(enhancedResult.error);
        }
        enhanced = enhancedResult.data;
      }

      const hybrid = {
        // Enhanced form metadata
        form: enhanced,
        
        // Legacy layout structure for backward compatibility
        layout: legacy.layout,
        components: legacy.components,
        
        // Hybrid-specific metadata
        schemaVersion: '2.0.0-hybrid',
        migrationInfo: {
          migratedAt: new Date().toISOString(),
          sourceFormat: this._isEnhancedSchema(sourceData) ? 'enhanced' : 'legacy',
          targetFormat: 'hybrid'
        }
      };

      return {
        success: true,
        data: hybrid,
        migrationLog: this._createMigrationLog('hybrid-migration', sourceData, hybrid)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        migrationLog: null
      };
    }
  }

  /**
   * Auto-detect schema format and migrate to target format
   */
  autoMigrate(sourceData, targetFormat = 'enhanced') {
    const sourceFormat = this._detectSchemaFormat(sourceData);
    
    if (sourceFormat === targetFormat) {
      return {
        success: true,
        data: sourceData,
        migrationLog: {
          message: 'No migration needed - source and target formats match',
          sourceFormat,
          targetFormat
        }
      };
    }

    const migrationKey = `${sourceFormat}-to-${targetFormat}`;
    const migrationStrategy = this.migrationStrategies[migrationKey];
    
    if (!migrationStrategy) {
      return {
        success: false,
        error: `No migration strategy found for ${sourceFormat} to ${targetFormat}`,
        migrationLog: null
      };
    }

    return migrationStrategy(sourceData);
  }

  /**
   * Validate migrated data
   */
  validateMigration(originalData, migratedData, targetFormat) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
      dataIntegrity: {
        fieldsPreserved: true,
        structureValid: true,
        metadataPreserved: true
      }
    };

    try {
      // Basic structure validation
      if (!migratedData) {
        validation.errors.push('Migrated data is null or undefined');
        validation.isValid = false;
        return validation;
      }

      // Format-specific validation
      switch (targetFormat) {
        case 'enhanced':
          this._validateEnhancedSchema(migratedData, validation);
          break;
        case 'legacy':
          this._validateLegacySchema(migratedData, validation);
          break;
        case 'hybrid':
          this._validateHybridSchema(migratedData, validation);
          break;
        default:
          validation.errors.push(`Unknown target format: ${targetFormat}`);
          validation.isValid = false;
      }

      // Data integrity checks
      this._checkDataIntegrity(originalData, migratedData, validation);

    } catch (error) {
      validation.errors.push(`Validation error: ${error.message}`);
      validation.isValid = false;
    }

    validation.isValid = validation.errors.length === 0;
    return validation;
  }

  // Private helper methods
  _migrateLegacyLayout(layout, components = {}) {
    const sections = [];

    layout.forEach((item, index) => {
      if (item.type === SECTION) {
        const section = createSectionSchema({
          id: item.id,
          title: item.title || `Section ${index + 1}`,
          description: item.description || '',
          order: index
        });

        // Extract fields from the section's children
        section.fields = this._extractFieldsFromChildren(item.children, components);
        sections.push(section);
      } else if (item.type === ROW) {
        // Handle standalone rows (create a section for them)
        const section = createSectionSchema({
          title: `Section ${index + 1}`,
          description: 'Migrated from standalone row',
          order: index
        });

        section.fields = this._extractFieldsFromChildren([item], components);
        sections.push(section);
      }
    });

    return sections;
  }

  _extractFieldsFromChildren(children, components) {
    const fields = [];

    const extractFromItem = (item) => {
      if (item.type === COMPONENT && components[item.id]) {
        const component = components[item.id];
        const field = this._convertLegacyComponentToField(component);
        if (field) {
          fields.push(field);
        }
      } else if (item.children) {
        item.children.forEach(extractFromItem);
      }
    };

    children.forEach(extractFromItem);
    return fields;
  }

  _convertLegacyComponentToField(component) {
    // Map legacy component types to new field types
    const typeMapping = {
      'input': component.fieldType === 'number' ? FIELD_TYPES.NUMBER : FIELD_TYPES.TEXT,
      'textarea': FIELD_TYPES.TEXT_AREA,
      'select': FIELD_TYPES.SINGLE_SELECT,
      'checkbox': FIELD_TYPES.CHECKBOX,
      'radio': FIELD_TYPES.RADIO,
      'datepicker': FIELD_TYPES.DATE,
      'switch': FIELD_TYPES.SWITCH,
      'slider': FIELD_TYPES.SLIDER,
      'upload': FIELD_TYPES.FILE_UPLOAD,
      'email': FIELD_TYPES.EMAIL,
      'phone': FIELD_TYPES.PHONE,
      'name': FIELD_TYPES.TEXT
    };

    const fieldType = typeMapping[component.type] || FIELD_TYPES.TEXT;
    
    const field = createFieldSchema(fieldType, {
      id: component.id,
      label: component.label || component.content || 'Migrated Field',
      placeholder: component.placeholder || '',
      required: component.required || false,
      defaultValue: component.defaultValue || component.defaultChecked || null
    });

    // Migrate component-specific properties
    if (component.options) {
      field.properties.options = component.options;
    }

    if (component.min !== undefined) {
      field.properties.min = component.min;
    }

    if (component.max !== undefined) {
      field.properties.max = component.max;
    }

    return field;
  }

  _convertFieldToLegacyComponent(field) {
    // Map new field types back to legacy component types
    const typeMapping = {
      [FIELD_TYPES.TEXT]: 'input',
      [FIELD_TYPES.NUMBER]: 'input',
      [FIELD_TYPES.EMAIL]: 'input',
      [FIELD_TYPES.PHONE]: 'input',
      [FIELD_TYPES.TEXT_AREA]: 'textarea',
      [FIELD_TYPES.SINGLE_SELECT]: 'select',
      [FIELD_TYPES.MULTI_SELECT]: 'select',
      [FIELD_TYPES.CHECKBOX]: 'checkbox',
      [FIELD_TYPES.RADIO]: 'radio',
      [FIELD_TYPES.DATE]: 'datepicker',
      [FIELD_TYPES.DATE_TIME]: 'datepicker',
      [FIELD_TYPES.SWITCH]: 'switch',
      [FIELD_TYPES.SLIDER]: 'slider',
      [FIELD_TYPES.FILE_UPLOAD]: 'upload',
      [FIELD_TYPES.IMAGE_UPLOAD]: 'upload'
    };

    const component = {
      id: field.id,
      type: typeMapping[field.fieldType] || 'input',
      label: field.label,
      placeholder: field.placeholder,
      required: field.required,
      content: field.label
    };

    // Add field type for input components
    if (component.type === 'input') {
      if (field.fieldType === FIELD_TYPES.NUMBER) {
        component.fieldType = 'number';
      } else if (field.fieldType === FIELD_TYPES.EMAIL) {
        component.fieldType = 'email';
      } else {
        component.fieldType = 'text';
      }
    }

    // Migrate properties
    if (field.properties) {
      if (field.properties.options) {
        component.options = field.properties.options;
      }
      if (field.properties.min !== undefined) {
        component.min = field.properties.min;
      }
      if (field.properties.max !== undefined) {
        component.max = field.properties.max;
      }
    }

    if (field.defaultValue !== undefined && field.defaultValue !== null) {
      if (field.fieldType === FIELD_TYPES.SWITCH) {
        component.defaultChecked = field.defaultValue;
      } else {
        component.defaultValue = field.defaultValue;
      }
    }

    return component;
  }

  _isEnhancedSchema(data) {
    return data && (
      data.type === FORM ||
      (data.sections && Array.isArray(data.sections)) ||
      data.schemaVersion
    );
  }

  _detectSchemaFormat(data) {
    if (!data) return 'unknown';
    
    if (data.form && data.layout) {
      return 'hybrid';
    }
    
    if (this._isEnhancedSchema(data)) {
      return 'enhanced';
    }
    
    if (data.layout && data.components) {
      return 'legacy';
    }
    
    return 'unknown';
  }

  _createMigrationLog(migrationType, sourceData, targetData) {
    return {
      migrationType,
      timestamp: new Date().toISOString(),
      sourceFormat: this._detectSchemaFormat(sourceData),
      targetFormat: this._detectSchemaFormat(targetData),
      sourceDataSize: JSON.stringify(sourceData).length,
      targetDataSize: JSON.stringify(targetData).length,
      fieldsCount: this._countFields(targetData),
      sectionsCount: this._countSections(targetData)
    };
  }

  _countFields(data) {
    let count = 0;
    
    if (data.sections) {
      data.sections.forEach(section => {
        if (section.fields) {
          count += section.fields.length;
        }
      });
    } else if (data.components) {
      count = Object.keys(data.components).length;
    }
    
    return count;
  }

  _countSections(data) {
    if (data.sections) {
      return data.sections.length;
    } else if (data.layout) {
      return data.layout.filter(item => item.type === SECTION).length;
    }
    return 0;
  }

  _validateEnhancedSchema(data, validation) {
    if (!data.type || data.type !== FORM) {
      validation.errors.push('Enhanced schema must have type "form"');
    }
    
    if (!data.title) {
      validation.warnings.push('Form title is missing');
    }
    
    if (!data.sections || !Array.isArray(data.sections)) {
      validation.errors.push('Enhanced schema must have sections array');
    }
  }

  _validateLegacySchema(data, validation) {
    if (!data.layout || !Array.isArray(data.layout)) {
      validation.errors.push('Legacy schema must have layout array');
    }
    
    if (!data.components || typeof data.components !== 'object') {
      validation.errors.push('Legacy schema must have components object');
    }
  }

  _validateHybridSchema(data, validation) {
    if (!data.form) {
      validation.errors.push('Hybrid schema must have form object');
    }
    
    if (!data.layout) {
      validation.errors.push('Hybrid schema must have layout array');
    }
    
    if (!data.components) {
      validation.errors.push('Hybrid schema must have components object');
    }
  }

  _checkDataIntegrity(original, migrated, validation) {
    // This is a simplified integrity check
    // In a real implementation, you'd want more comprehensive checks
    
    const originalFieldCount = this._countFields(original);
    const migratedFieldCount = this._countFields(migrated);
    
    if (originalFieldCount !== migratedFieldCount) {
      validation.warnings.push(
        `Field count mismatch: original ${originalFieldCount}, migrated ${migratedFieldCount}`
      );
      validation.dataIntegrity.fieldsPreserved = false;
    }
  }
}

// Export singleton instance and utilities
export const schemaMigration = new SchemaMigration();

export const MigrationUtils = {
  // Quick migration functions
  toLegacy: (data) => schemaMigration.autoMigrate(data, 'legacy'),
  toEnhanced: (data) => schemaMigration.autoMigrate(data, 'enhanced'),
  toHybrid: (data) => schemaMigration.autoMigrate(data, 'hybrid'),
  
  // Validation
  validate: (original, migrated, format) => 
    schemaMigration.validateMigration(original, migrated, format),
  
  // Detection
  detectFormat: (data) => schemaMigration._detectSchemaFormat(data),
  
  // Batch migration
  batchMigrate: async (dataArray, targetFormat = 'enhanced') => {
    const results = [];
    
    for (const data of dataArray) {
      const result = schemaMigration.autoMigrate(data, targetFormat);
      results.push({
        original: data,
        result,
        index: results.length
      });
    }
    
    return {
      total: dataArray.length,
      successful: results.filter(r => r.result.success).length,
      failed: results.filter(r => !r.result.success).length,
      results
    };
  }
};

export default schemaMigration;