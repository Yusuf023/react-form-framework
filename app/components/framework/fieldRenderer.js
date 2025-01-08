import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MaskedInput from "react-text-mask";
import { isNumber } from "lodash";

export default function Field({
  fieldInfo,
  value,
  onChange,
  error,
  sectionFieldIndex,
}) {
  const baseClasses =
    "w-full px-4 py-2 border rounded focus:border-blue-400 focus:outline-none focus:ring-2";
  const errorClasses = error
    ? "border-red-500 focus:border-red-500 ring-red-300"
    : "border-gray-300";
  const disabledClasses = fieldInfo.disabled
    ? "bg-gray-100 cursor-not-allowed text-gray-500"
    : "bg-white";

  // For section fields, the index is added to the name, so that the id remains unique
  const name = isNumber(sectionFieldIndex)
    ? fieldInfo.name + sectionFieldIndex
    : fieldInfo.name;

  const fieldClasses = `${baseClasses} ${errorClasses} ${disabledClasses}`;

  // Render field dynamically based on the field type
  const renderField = () => {
    switch (fieldInfo.type) {
      case "text":
        return (
          <input
            type="text"
            id={name}
            name={name}
            className={fieldClasses}
            value={value || ""}
            onChange={(e) => onChange(fieldInfo, e.target.value)}
            disabled={fieldInfo.disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            placeholder={fieldInfo.placeholder}
            maxLength={fieldInfo.maxLength}
            autoFocus={fieldInfo.autoFocus}
          />
        );
      case "textarea":
        return (
          <textarea
            id={name}
            name={name}
            className={fieldClasses}
            value={value || ""}
            onChange={(e) => onChange(fieldInfo, e.target.value)}
            disabled={fieldInfo.disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            placeholder={fieldInfo.placeholder}
            maxLength={fieldInfo.maxLength}
            autoFocus={fieldInfo.autoFocus}
          />
        );
      case "select":
        return (
          <Select
            options={fieldInfo.options}
            value={value || ""}
            onChange={(selectedOption) => onChange(fieldInfo, selectedOption)}
            isDisabled={fieldInfo.disabled}
            classNamePrefix="react-select"
            className={
              "react-select-container " + (error && "react-select-error")
            }
            aria-label={fieldInfo.label}
            isClearable={true}
            instanceId={name}
            placeholder={fieldInfo.placeholder}
            autoFocus={fieldInfo.autoFocus}
          />
        );
      case "date":
        return (
          <DatePicker
            selected={value || ""}
            onChange={(selectedDate) => onChange(fieldInfo, selectedDate)}
            dateFormat={"dd/MM/yyyy"}
            disabled={fieldInfo.disabled}
            className={fieldClasses}
            aria-label={fieldInfo.label}
            placeholderText={fieldInfo.placeholder}
            id={name}
            autoFocus={fieldInfo.autoFocus}
            showMonthDropdown
            showYearDropdown
            maxDate={fieldInfo.maxDate}
            minDate={fieldInfo.minDate}
          />
        );
      case "masked":
        return (
          <MaskedInput
            mask={fieldInfo.mask}
            id={name}
            name={name}
            className={fieldClasses}
            value={value || ""}
            onChange={(e) => onChange(fieldInfo, e.target.value)}
            disabled={fieldInfo.disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            placeholder={fieldInfo.placeholder}
            autoFocus={fieldInfo.autoFocus}
          />
        );
      case "radio":
        return (
          <div className="grid grid-cols-12 gap-2">
            {fieldInfo.options.map((option) => (
              <button
                key={option}
                type="button"
                className={`${
                  fieldInfo.buttonGridClasses || "col-span-3"
                } px-4 py-2 rounded border focus:border-blue-400 focus:outline-none focus:ring-2 ${
                  value === option
                    ? "bg-custom-darkBlue text-white"
                    : "bg-white text-gray-700 hover:bg-custom-lightGray"
                } ${
                  fieldInfo.disabled
                    ? "cursor-not-allowed border-gray-300 !text-gray-400"
                    : ""
                }`}
                disabled={fieldInfo.disabled}
                onClick={() => onChange(fieldInfo, option)}
                aria-pressed={value === option}
              >
                {option}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`mb-4 ${fieldInfo.gridClasses || "col-span-12"} ${
        fieldInfo.disabled
          ? "opacity-50 pointer-events-none cursor-not-allowed"
          : ""
      }`}
    >
      {fieldInfo.label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
          id={`${name}Label`}
        >
          {fieldInfo.label}
          {fieldInfo.required && <span className="text-red-500">*</span>}
        </label>
      )}
      {renderField()}
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-500 font-medium">
          {error}
        </p>
      )}
      {fieldInfo.showCharCount && (
        <p className="text-sm text-gray-400 float-right">
          {value ? value.trim().length : 0}/{fieldInfo.maxLength}
        </p>
      )}
    </div>
  );
}

/* PropTypes for the Field Component. Read about them in the fieldsConstant file for their use cases */
Field.propTypes = {
  fieldInfo: PropTypes.shape({
    label: PropTypes.string,
    type: PropTypes.oneOf([
      "text",
      "textarea",
      "select",
      "date",
      "masked",
      "radio",
    ]).isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.oneOf([
      PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
      PropTypes.array,
    ]),
    mask: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
    placeholder: PropTypes.string,
    required: PropTypes.bool.isRequired,
    gridClasses: PropTypes.string.isRequired,
    maxLength: PropTypes.number,
    showCharCount: PropTypes.bool,
    autoFocus: PropTypes.bool,
    disabled: PropTypes.bool,
  }).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};
