# React Form Framework

A lightweight yet powerful React-based framework designed to simplify the creation and management of complex forms. Built with scalability and flexibility in mind, this framework handles dynamic field rendering, field dependencies, validations, and repeatable sections – all while maintaining a clean and intuitive codebase.

---

## **Why This Framework?**

Creating complex, multi-page forms can be a developer's nightmare – filled with repetitive boilerplate code, cumbersome validation logic, and a constant struggle to maintain consistency. This framework was designed to address these pain points and streamline the process of building robust forms by providing:

- **field configuration-driven approach**: Define your form fields in a single object, and the framework takes care of the rest.
- **Dynamic field logic**: Automatically enable/disable or show/hide fields based on user inputs.
- **Repeatable sections**: Allow users to add or remove field groups dynamically.
- **Validation made simple**: Comprehensive validation logic is built in, ensuring accuracy without overwhelming the user.
- **Customisable styling**: Easily integrate with your preferred CSS framework, including Tailwind CSS, Material UI, or Bootstrap.

## **Live Demo**

[Visit the Demo](https://nextjs.org)

---

## **Features**

### 1. **Dynamic Field Rendering**

Fields are rendered dynamically based on the configuration provided in the field object. Add fields, set dependencies, and customise behaviour with ease.

### 2. **Field Dependencies**

Set up field logic to enable/disable or toggle visibility based on the values of other fields. Perfect for creating responsive, intuitive forms.

### 3. **Repeatable Sections**

For scenarios requiring repeatable inputs (e.g., multiple addresses or emails), this framework allows users to dynamically add or remove sections, with built-in limits and validation.

### 4. **Comprehensive Validation**

Handle everything from onBlur and onChange validations to submit-time validation. Different states for validation triggers ensure a smooth user experience.

### 5. **Styling Flexibility**

The rendering components are modular and can be swapped out to fit any CSS framework. Tailwind CSS is included by default, but you can easily adapt it for Material UI, Bootstrap, or any other styling solution.

---

## **Getting Started**

### **Installation**

1. Clone the repository:

```bash
   git clone https://github.com/Yusuf023/react-form-framework.git
```

2. Navigate to the project directory:

```bash
   cd react-form-framework
```

3. Install dependencies:

```bash
   npm install
```

4. Start the development server:

```bash
   npm run dev
```

### **Usage**

1. Define a field object:
   The field configuration is the heart of this framework. It outlines constraints of individual fields.
   Below is an example:

```js
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
];
```

2. Import the Framework:
   Import the `FormRenderer` component and pass the `fieldsConstants` created above, `handleSubmit` function to handle the form data, and `submitButtonName` to specify the name of the submit button:

```js
import FormRenderer from "./framework/formRenderer";

function App() {
  const handleSubmit = (formData) => {
    // Code to handle form submission
    alert("Form is valid!");
  };
  return (
    <div className="container m-auto py-10">
      <FormRenderer
        fieldsConstant={fieldsConstant}
        handleSubmit={handleSubmit}
        submitButtonName="Submit"
      />
    </div>
  );
}
```

3. Customise as needed:
   The framework is designed to be flexible. Modify the rendering components, validation logic, or styling as per your requirements.

---

## **Props**

Each key in the field object would drive a particular constraint of this framework. Here's a complete list of all supported keys and what they do:

- **label**: Label would be displayed as a label for the field.
- **type**: Type of field, could be one of: text, textarea, select, date, masked, radio.
- **name**: This is the key for the value in the state. It also is used for id of the field
- **options**: Options for select and radio fields. For select fields, options has to be an array of objects where each object has label and value properties. Label is displayed in the menu. For radio fields, its an array of options.
- **placeholder**: Placeholder to be displayed before a value is entered in the field
- **gridClasses**: The form is rendered in a grid. These classes would be added to each field to provide column span to those fields
- **disabled**: Whether the field is supposed to be disabled. This can be dynamically enabled by dependent logic.
- **required**: Whether the field is required in the form or not. It can be dynamically set to true using dependent logic. If set, validation error is thrown if field isn't filled.
- **requiredErrorMessage**: Defines a custom required error for the field. If not provided, a generic message is displayed.
- **setToRequiredWhenEnabled**: When using dependent logic, this property tells whether the field should be set to required when enabled.
- **maxLength**: Defines the maximum length for text and textarea fields
- **regex**: Defines the regex for a field. If set, value is tested against this regex and validation error is thrown if value doesn't satisfy the regex.
- **regexErrorMessage**: Defines a custom regex error for the field. If not provided, a generic message is displayed ("Please enter a valid" followed by the field label).
- **autoFocus**: This can be set on the first field of the form, so that browser automatically puts it in focus
- **showCharCount**: Display a character count for the field. Ideally added to a text area field.
- **minDate**: Defines a minimum allowed date for date picker fields.
- **maxDate**: Defines a maximum allowed date for date picker fields.
- **mask**: Defines a mask for masked fields.
- **buttonGridClasses**: Defines a column grid span for the buttons in the radio fields.
- **dependentFields**: Defines all the fields which are dependent on this field, i.e., the parent field. This would disable or enable all the dependent fields. Expected to be an array of field names (Name defined in name property).
- **dependsOnValues**: Added on the fields which are dependent on a certain field, i.e., the child field. This would disable or enable the field based on the value selected for parent field. Expected to be an array of values present for the parent field.
- **section**: set to true if this field is supposed to define the section.
- **sectionHeading**: Heading to be added before each section instance.
- **maxSections**: Defines the number of sections that can be added
- **sectionFields**: This expects an array of the fields. This would define all the fields present in that section.
- **instances**: This is an array which would be used to render all instances of the section. It would be initialized with one instance, but more instances could be added or removed when add button is clicked.
- **addButton**: Defines what the add button should say.

---

### **License**

This project is licensed under the MIT License. Feel free to use it, modify it, and build upon it as needed.

### **Contributing**

Contributions are welcome! Feel free to fork the repository and submit a pull request with your changes.
