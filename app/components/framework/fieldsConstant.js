import { cloneDeep } from "lodash";

/**
 * Details about each key in the constant file. Please read them carefully and add them as needed to use the framework
 * Label: Label would be displayed as a label for the field.
 * Type: Type of field, could be one of: text, textarea, select, date, masked, radio.
 * name: This is the key for the value in the state. It also is used for id of the field
 * options: Options for select and radio fields. For select fields, options has to be an array of objects where each object has label and value properties. Label is displayed in the menu. For radio fields, its an array of options.
 * placeholder: Placeholder to be displayed before a value is entered in the field
 * gridClasses: The form is rendered in a grid. These classes would be added to each field to provide column span to those fields
 * disabled: Whether the field is supposed to be disabled. This can be dynamically enabled by dependent logic.
 * required: Whether the field is required in the form or not. It can be dynamically set to true using dependent logic. If set, validation error is thrown if field isn't filled.
 * requiredErrorMessage: Defines a custom required error for the field. If not provided, a generic message is displayed.
 * setToRequiredWhenEnabled: When using dependent logic, this property tells whether the field should be set to required when enabled.
 * maxLength: Defines the maximum length for text and textarea fields
 * regex: Defines the regex for a field. If set, value is tested against this regex and validation error is thrown if value doesn't satisfy the regex.
 * regexErrorMessage: Defines a custom regex error for the field. If not provided, a generic message is displayed ("Please enter a valid" followed by the field label).
 * autoFocus: This can be set on the first field of the form, so that browser automatically puts it in focus
 * showCharCount: Display a character count for the field. Ideally added to a text area field.
 * minDate: Defines a minimum allowed date for date picker fields.
 * maxDate: Defines a maximum allowed date for date picker fields.
 * mask: Defines a mask for masked fields.
 * buttonGridClasses: Defines a column grid span for the buttons in the radio fields.
 * dependentFields: Defines all the fields which are dependent on this field, i.e., the parent field. This would disable or enable all the dependent fields. Expected to be an array of field names (Name defined in name property).
 * dependsOnValues: Added on the fields which are dependent on a certain field, i.e., the child field. This would disable or enable the field based on the value selected for parent field. Expected to be an array of values present for the parent field.
 * section: set to true if this field is supposed to define the section.
 * sectionHeading: Heading to be added before each section instance.
 * maxSections: Defines the number of sections that can be added
 * sectionFields: This expects an array of the fields. This would define all the fields present in that section.
 * instances: This is an array which would be used to render all instances of the section. It would be initialized with one instance, but more instances could be added or removed when add button is clicked.
 * addButton: Defines what the add button should say.
 */

const promotionSectionConstant = [
  {
    label: "Type",
    type: "select",
    name: "emailType",
    options: [
      { label: "Work", value: "work" },
      { label: "Personal", value: "personal" },
      { label: "Other", value: "other" },
    ],
    placeholder: "Select type...",
    required: false,
    gridClasses: "col-span-12 md:col-span-3",
    disabled: true,
    setToRequiredWhenEnabled: true,
  },
  {
    label: "Email",
    type: "text",
    name: "email",
    placeholder: "Enter email...",
    required: false,
    gridClasses: "col-span-12 md:col-span-9",
    maxLength: 256,
    disabled: true,
    setToRequiredWhenEnabled: true,
    regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
  },
];

export const fieldsConstant = [
  {
    label: "First name",
    type: "text",
    name: "firstName",
    placeholder: "Enter first name...",
    required: true,
    gridClasses: "col-span-12 md:col-span-6",
    maxLength: 100,
    autoFocus: true,
  },
  {
    label: "Last name",
    type: "text",
    name: "lastName",
    placeholder: "Enter last name...",
    required: true,
    gridClasses: "col-span-12 md:col-span-6",
    maxLength: 100,
  },
  {
    label: "About",
    type: "textarea",
    name: "about",
    placeholder: "Enter information about yourself...",
    required: false,
    gridClasses: "col-span-12",
    maxLength: 300,
    showCharCount: true,
  },
  {
    label: "Gender",
    type: "select",
    name: "gender",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
    placeholder: "Select gender...",
    required: true,
    gridClasses: "col-span-12 md:col-span-6",
  },
  {
    label: "Date of Birth",
    type: "date",
    name: "dob",
    placeholder: "DD/MM/YYYY",
    required: true,
    maxDate: new Date(),
    gridClasses: "col-span-12 md:col-span-6",
  },
  {
    label: "Phone",
    type: "masked",
    name: "phone",
    mask: [
      "(",
      "0",
      ")",
      " ",
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      " ",
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
    placeholder: "(0) XXXX XXXXXX",
    required: false,
    gridClasses: "col-span-12",
  },
  {
    label: "Do you want to receive promotions via email?",
    type: "radio",
    name: "receiveEmails",
    options: ["Yes", "No"],
    required: false,
    gridClasses: "col-span-12",
    buttonGridClasses: "col-span-12 md:col-span-3",
    dependentFields: ["emails"],
  },
  {
    section: true,
    name: "emails",
    sectionHeading: "Email information",
    maxSections: 3,
    sectionFields: promotionSectionConstant,
    instances: [cloneDeep(promotionSectionConstant)],
    addButton: "Add another email",
    dependsOnValues: ["Yes"],
    disabled: true,
  },
  {
    label: "Do you want to receive promotions in mail?",
    type: "radio",
    name: "receivePromotions",
    options: ["Yes", "No"],
    required: true,
    gridClasses: "col-span-12",
    buttonGridClasses: "col-span-12 md:col-span-3",
    dependentFields: ["reason", "address", "city", "county", "postCode"],
    requiredErrorMessage:
      "Please choose if you want to receive promotions in mail",
  },
  {
    label: "If you chose no, can you please give a reason?",
    type: "text",
    name: "reason",
    placeholder: "Enter reason for choosing no...",
    required: false,
    gridClasses: "col-span-12",
    maxLength: 200,
    dependsOnValues: ["No"],
    disabled: true,
    setToRequiredWhenEnabled: true,
    requiredErrorMessage: "Please enter a reason for choosing no",
  },
  {
    label: "Address",
    type: "text",
    name: "address",
    placeholder: "Enter address...",
    required: false,
    gridClasses: "col-span-12",
    maxLength: 200,
    dependsOnValues: ["Yes"],
    disabled: true,
    setToRequiredWhenEnabled: true,
  },
  {
    label: "City",
    type: "text",
    name: "city",
    placeholder: "Enter city...",
    required: false,
    gridClasses: "col-span-12 lg:col-span-4",
    maxLength: 50,
    dependsOnValues: ["Yes"],
    disabled: true,
    setToRequiredWhenEnabled: true,
  },
  {
    label: "County",
    type: "text",
    name: "county",
    placeholder: "Enter county...",
    required: false,
    gridClasses: "col-span-12 md:col-span-6 lg:col-span-4",
    maxLength: 50,
    dependsOnValues: ["Yes"],
    disabled: true,
    setToRequiredWhenEnabled: false,
  },
  {
    label: "Post code",
    type: "text",
    name: "postCode",
    placeholder: "Enter post code...",
    required: false,
    gridClasses: "col-span-12 md:col-span-6 lg:col-span-4",
    maxLength: 10,
    dependsOnValues: ["Yes"],
    disabled: true,
    setToRequiredWhenEnabled: true,
  },
];
