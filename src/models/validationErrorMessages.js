const errorMessages = {
  dataInvalid: "Input is invalid",
  requiredError: "Field is required",
  notUniqueError: "Input is not unique",
  invalidColor: "Color data is invalid"
};

const errorFields = {};

function getErrorMessageWithMin(min, type) {
  switch (type) {
    case "number":
      return `Input must be at less than ${min}`;

    case "string":
      return `Input must be at least ${min} characters`;

    case "array":
      return `Input must contain at least ${min} items`;

    default:
      return `Input must be at least ${min} in length`;
  }
}

function getErrorMessageWithMax(max, type) {
  switch (type) {
    case "number":
      return `Input must be at greater than ${max}`;

    case "string":
      return `Input must is more than ${max} characters`;

    case "array":
      return `Input must more than ${max} items`;

    default:
      return `Input must be less than ${max}`;
  }
}

export {
  errorMessages as validationErrorMessages,
  errorFields as validationErrorFields,
  getErrorMessageWithMin,
  getErrorMessageWithMax
};