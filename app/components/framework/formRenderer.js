"use client";

import React, { useState } from "react";
import Field from "./fieldRenderer";
import {
  updateDependentFields,
  validateRegexField,
  validateRegexFields,
  validateRequiredField,
  validateRequiredFields,
} from "./formHelperFunctions";
import { cloneDeep, isEmpty } from "lodash";
import Section from "./sectionRenderer";

export default function FormRenderer({
  fieldsConstant,
  handleSubmit,
  submitButtonName,
  submitButtonClasses,
}) {
  const [formState, setFormState] = useState({
    formData: {},
    requiredErrors: {},
    regexErrors: {},
  });
  const [fields, setFields] = useState(fieldsConstant);

  /**
   * Add another instance of the section by pushing another instance to the instances array of the section object.
   */
  const onAddButtonClick = (e, sectionObj) => {
    e.preventDefault();
    setFields((prevState) => {
      let updatedFields = cloneDeep(prevState);
      let sectionField = updatedFields.find(
        (field) => field.name === sectionObj.name
      );
      sectionField.instances.push(cloneDeep(sectionField.instances[0]));
      return updatedFields;
    });
  };

  /**
   * Remove the particular instance of the section. Form data and errors cleared for the instance as well.
   */
  const onRemoveButtonClick = (e, sectionObj, instanceIndex) => {
    e.preventDefault();
    setFields((prevState) => {
      let updatedFields = cloneDeep(prevState);
      let sectionField = updatedFields.find(
        (field) => field.name === sectionObj.name
      );
      sectionField.instances.splice(instanceIndex, 1);
      return updatedFields;
    });
    setFormState((prevState) => {
      let updatedState = cloneDeep(prevState);
      if (updatedState.formData[sectionObj.name]) {
        updatedState.formData[sectionObj.name].splice(instanceIndex, 1);
      }

      if (updatedState.requiredErrors[sectionObj.name]) {
        updatedState.requiredErrors[sectionObj.name].splice(instanceIndex, 1);
      }

      if (updatedState.regexErrors[sectionObj.name]) {
        updatedState.regexErrors[sectionObj.name].splice(instanceIndex, 1);
      }
      return updatedState;
    });
  };

  /**
   * onChange handler for section fields.
   */
  const onSectionChange = (sectionObj, instanceIndex, field, value) => {
    const sectionName = sectionObj.name;
    setFormState((prevState) => {
      let updatedFormData = { ...prevState.formData };
      let updatedRequiredErrors = { ...prevState.requiredErrors };
      let updatedRegexErrors = { ...prevState.regexErrors };

      if (updatedFormData[sectionName]) {
        updatedFormData[sectionName] = cloneDeep(updatedFormData[sectionName]);
      } else {
        // Initializing the section array in form data if not present
        updatedFormData[sectionName] = [];
      }
      if (!updatedFormData[sectionName][instanceIndex]) {
        // Initializing the instance object in the section array if not present
        updatedFormData[sectionName][instanceIndex] = {};
      }
      updatedFormData[sectionName][instanceIndex][field.name] = value;

      // If errors present for the field, the field is revalidated
      if (updatedRequiredErrors[sectionName]?.[instanceIndex]?.[field.name]) {
        let updatedSectionRequiredErrors = cloneDeep(
          updatedRequiredErrors[sectionName]
        );
        validateRequiredField(
          field,
          value,
          updatedSectionRequiredErrors[instanceIndex]
        );
        updatedRequiredErrors[sectionName] = updatedSectionRequiredErrors;
      }
      if (updatedRegexErrors[sectionName]?.[instanceIndex]?.[field.name]) {
        let updatedSectionRegexErrors = cloneDeep(
          updatedRegexErrors[sectionName]
        );
        validateRegexField(
          field,
          value,
          updatedSectionRegexErrors[instanceIndex]
        );
        updatedRegexErrors[sectionName] = updatedSectionRegexErrors;
      }

      return {
        ...prevState,
        requiredErrors: updatedRequiredErrors,
        regexErrors: updatedRegexErrors,
        formData: updatedFormData,
      };
    });
  };

  /**
   * onChange handler for non section fields.
   */
  const onChange = (field, value) => {
    setFormState((prevState) => {
      let updatedFormData = { ...prevState.formData, [field.name]: value };
      let updatedRequiredErrors = { ...prevState.requiredErrors };
      let updatedRegexErrors = { ...prevState.regexErrors };

      // If errors present for the field, the field is revalidated
      if (updatedRequiredErrors[field.name]) {
        validateRequiredField(field, value, updatedRequiredErrors);
      }
      if (updatedRegexErrors[field.name]) {
        validateRegexField(field, value, updatedRegexErrors);
      }

      // If this field has any child fields dependent on it, the form is updated accordingly
      if (field.dependentFields) {
        const updatedFields = updateDependentFields(
          fields,
          updatedFormData,
          updatedRequiredErrors,
          updatedRegexErrors,
          field
        );
        setFields(updatedFields);
      }

      return {
        ...prevState,
        requiredErrors: updatedRequiredErrors,
        regexErrors: updatedRegexErrors,
        formData: updatedFormData,
      };
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let updatedRequiredErrors = {},
      updatedRegexErrors = {};
    // Validate the entire form before submitting it
    validateRequiredFields(fields, formState.formData, updatedRequiredErrors);
    validateRegexFields(fields, formState.formData, updatedRegexErrors);
    if (isEmpty(updatedRequiredErrors) && isEmpty(updatedRegexErrors)) {
      handleSubmit(formState.formData);
    } else {
      setFormState((prevState) => {
        return {
          ...prevState,
          requiredErrors: updatedRequiredErrors,
          regexErrors: updatedRegexErrors,
        };
      });
    }
  };

  return (
    <form noValidate onSubmit={onSubmit}>
      <div className="grid grid-cols-12 gap-2">
        {fields.map((field, index) =>
          field.section ? (
            <Section
              key={index}
              section={field}
              onRemoveButtonClick={onRemoveButtonClick}
              formState={formState}
              onSectionChange={onSectionChange}
              onAddButtonClick={onAddButtonClick}
            />
          ) : (
            <Field
              fieldInfo={field}
              key={index}
              value={formState.formData[field.name]}
              onChange={onChange}
              error={
                formState.requiredErrors[field.name] ||
                formState.regexErrors[field.name]
              }
            />
          )
        )}
      </div>
      <button
        type="submit"
        className={
          submitButtonClasses
            ? submitButtonClasses
            : "px-4 py-2 rounded border focus:border-blue-400 focus:outline-none focus:ring-2 bg-custom-darkBlue text-white hover:opacity-95"
        }
      >
        {submitButtonName}
      </button>
    </form>
  );
}
