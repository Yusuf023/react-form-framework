import _ from "lodash";

/**
 * Validate if the field has any data
 * @param {Object} field Field Object
 * @param {Any} value Field Value
 * @param {Object} errors Errors Object
 */
export const validateRequiredField = (field, value, errors) => {
  switch (field.type) {
    // Validate text, textarea and masked fields by trimming them and checking if empty
    case "text":
    case "textarea":
    case "masked":
      if (_.isEmpty(_.trim(value))) {
        errors[field.name] =
          field.requiredErrorMessage || `Please enter ${field.label}`;
      } else {
        delete errors[field.name];
      }
      break;
    // Validate select and radio fields by checking if empty
    case "select":
    case "radio":
      if (_.isEmpty(value)) {
        errors[field.name] =
          field.requiredErrorMessage || `Please select ${field.label}`;
      } else {
        delete errors[field.name];
      }
      break;
    // Validate date field by checking if its a date
    case "date":
      if (!_.isDate(value)) {
        errors[field.name] =
          field.requiredErrorMessage || `Please choose ${field.label}`;
      } else {
        delete errors[field.name];
      }
  }
};

/**
 * Traverses through all the fields and check if the required fields have any data
 * @param {Array} fields Array of field objects
 * @param {Object} formData Form data
 * @param {Object} errors Error Object
 */
export const validateRequiredFields = (fields, formData, errors) => {
  // Iterate through each field
  _.forEach(fields, (field) => {
    if (field.required) {
      // Get field value from formData using the name
      const value = _.get(formData, field.name);
      // Validate the field
      validateRequiredField(field, value, errors);
    } else if (field.section) {
      // For sections, fields in each instance are validated
      let sectionErrors = [];
      // Looping on each section to get individual instances
      field.instances.forEach((section, sectionIndex) => {
        let instanceErrors = {};
        // Looping on each instance to get individual fields
        _.forEach(section, (sectionField) => {
          if (sectionField.required) {
            // Get field value from formData using the sectionName, sectionIndex and then field name
            const value = _.get(
              formData,
              `${field.name}[${sectionIndex}].${sectionField.name}`
            );
            // Validate the field
            validateRequiredField(sectionField, value, instanceErrors);
          }
        });
        // If there are any errors in that section instance, it is added to the section errors array
        if (!_.isEmpty(instanceErrors)) {
          sectionErrors[sectionIndex] = instanceErrors;
        }
      });
      // If there are any errors for that section, it is added to the error object.
      if (!_.isEmpty(sectionErrors)) {
        errors[field.name] = sectionErrors;
      }
    }
  });
};

/**
 * Validate the field against provided regex
 * @param {Object} field Field Object
 * @param {Any} value Field Value
 * @param {Object} errors Errors Object
 */
export const validateRegexField = (field, value, errors) => {
  const regex = new RegExp(field.regex);
  // Test value against regex if there's a value
  if (value && !regex.test(value)) {
    errors[field.name] =
      field.regexErrorMessage || `Please enter a valid ${field.label}`;
  } else {
    // Remove the error if test returned true
    delete errors[field.name];
  }
};

/**
 * Traverses through all the fields and check the fields against provided regex
 * @param {Array} fields Array of field objects
 * @param {Object} formData Form data
 * @param {Object} errors Error Object
 */
export const validateRegexFields = (fields, formData, errors) => {
  // Iterate through each field
  _.forEach(fields, (field) => {
    if (field.regex) {
      // Get field value from formData using the name
      const value = _.get(formData, field.name);
      validateRegexField(field, value, errors);
    } else if (field.section) {
      // For sections, fields in each instance are validated
      let sectionErrors = [];
      // Looping on each section to get individual instances
      field.instances.forEach((section, sectionIndex) => {
        let instanceErrors = {};
        // Looping on each instance to get individual fields
        _.forEach(section, (sectionField) => {
          if (sectionField.regex) {
            // Get field value from formData using the sectionName, sectionIndex and then field name
            const value = _.get(
              formData,
              `${field.name}[${sectionIndex}].${sectionField.name}`
            );
            // Validate the field
            validateRegexField(sectionField, value, instanceErrors);
          }
        });
        // If there are any errors in that section instance, it is added to the section errors array
        if (!_.isEmpty(instanceErrors)) {
          sectionErrors[sectionIndex] = instanceErrors;
        }
      });
      // If there are any errors for that section, it is added to the error object.
      if (!_.isEmpty(sectionErrors)) {
        errors[field.name] = sectionErrors;
      }
    }
  });
};

/**
 * Dynamically disable or enable dependent fields
 * @param {Array} fields Array of field objects
 * @param {Object} updatedFormData Form data
 * @param {Object} updatedRequiredErrors Required error data
 * @param {Object} updatedRegexErrors Regex error data
 * @param {Object} parentField Parent field object
 * @returns Updated Array of field Objects
 */
export const updateDependentFields = (
  fields,
  updatedFormData,
  updatedRequiredErrors,
  updatedRegexErrors,
  parentField
) => {
  let updatedFields = _.cloneDeep(fields);

  // Update only dependent fields
  _.forEach(parentField.dependentFields, (dependentFieldName) => {
    const dependentField = updatedFields.find(
      (field) => field.name === dependentFieldName
    );

    // Check if the value of the parent field is present in the dependsOnValue array of the child field
    if (
      dependentField.dependsOnValues.includes(updatedFormData[parentField.name])
    ) {
      // If the dependent field is a section, the section is looped through and enabled
      if (dependentField.section) {
        dependentField.instances.map((instance) => {
          instance.map((sectionField) => {
            // Enable the field and set the required to true based on whether the field should be required when enabled
            sectionField.disabled = false;
            sectionField.required = sectionField.setToRequiredWhenEnabled;
          });
        });
      }
      // If the dependent field is not a section, the required property of the field is set based on whether the field should be required when enabled
      else {
        dependentField.required = dependentField.setToRequiredWhenEnabled;
      }
      dependentField.disabled = false;
    } else {
      // If the value is not present in the dependsOnValue, the field is cleared, disabled and required is set to false. Data and errors are deleted from the state
      if (dependentField.section) {
        dependentField.instances = [_.cloneDeep(dependentField.sectionFields)];
      } else {
        dependentField.required = false;
      }
      dependentField.disabled = true;
      delete updatedRequiredErrors[dependentField.name];
      delete updatedRegexErrors[dependentField.name];
      delete updatedFormData[dependentField.name];
    }
  });

  return updatedFields;
};
