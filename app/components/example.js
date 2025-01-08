"use client";

import React from "react";
import FormRenderer from "./framework/formRenderer";
import { fieldsConstant } from "./framework/fieldsConstant";

export default function Example() {
  const handleSubmit = (formData) => {
    // Code to handle form submission
    alert("Form is valid!");
  };
  return (
    <div className="container m-auto py-10 px-4">
      <FormRenderer
        fieldsConstant={fieldsConstant}
        handleSubmit={handleSubmit}
        submitButtonName="Submit"
        showClearButton
      />
    </div>
  );
}
