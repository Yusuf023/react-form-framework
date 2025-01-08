import React, { Fragment } from "react";
import Field from "./fieldRenderer";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export default function Section({
  section,
  onRemoveButtonClick,
  formState,
  onSectionChange,
  onAddButtonClick,
}) {
  return (
    <>
      {section.instances.map((instance, instanceIndex) => (
        // Loop through each instance of the section
        <Fragment key={instanceIndex}>
          <div
            className={`col-span-12 ${
              section.disabled
                ? "opacity-50 pointer-events-none cursor-not-allowed"
                : ""
            }`}
          >
            <span>
              {section.sectionHeading} {instanceIndex + 1}
            </span>
            {/* Display the delete button for all sections except the first one */}
            {instanceIndex !== 0 && (
              <button
                onClick={(e) => onRemoveButtonClick(e, section, instanceIndex)}
                disabled={section.disabled}
                className="float-right text-red-500"
              >
                <RemoveCircleOutlineIcon fontSize="medium" />
              </button>
            )}
          </div>
          {instance.map((sectionField, sectionFieldIndex) => (
            // Loop through each field of the instance
            <Field
              fieldInfo={sectionField}
              key={sectionFieldIndex}
              value={
                formState.formData[section.name]?.[instanceIndex]?.[
                  sectionField.name
                ]
              }
              onChange={(sectionField, value) =>
                onSectionChange(section, instanceIndex, sectionField, value)
              }
              error={
                formState.requiredErrors[section.name]?.[instanceIndex]?.[
                  sectionField.name
                ] ||
                formState.regexErrors[section.name]?.[instanceIndex]?.[
                  sectionField.name
                ]
              }
              sectionFieldIndex={instanceIndex}
            />
          ))}
        </Fragment>
      ))}
      {/* Add Button is displayed at the end of all sections, if the number is less than max sections allowed */}
      {section.instances.length < section.maxSections && (
        <div
          className={`mb-4 col-span-12 ${
            section.disabled
              ? "opacity-50 pointer-events-none cursor-not-allowed"
              : ""
          }`}
        >
          <button
            onClick={(e) => onAddButtonClick(e, section)}
            disabled={section.disabled}
            className="flex items-center"
          >
            <AddCircleOutlineIcon
              fontSize="large"
              className="text-custom-darkBlue"
            />
            <div>&nbsp;{section.addButton}</div>
          </button>
        </div>
      )}
    </>
  );
}
