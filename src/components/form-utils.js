import { devLog } from "../utils/log";

export function makeSubmitHandler(form, onSubmit, onError) {
  return function(event) {
    if (event) {
      event.preventDefault();
    }

    form.validateFieldsAndScroll(async (errors, data) => {
      if (!errors) {
        try {
          await onSubmit(data);
        } catch (thrownError) {
          if (onError) {
            onError(thrownError);
          } else {
            applyErrors(form, thrownError);
          }

          if (process.env.NODE_ENV === "development") {
            console.error(thrownError);
          }
        }
      }
    });
  };
}

export function applyErrors(form, errors) {
  let formValuesObj = {};
  if (Array.isArray(errors)) {
    errors.forEach(error => {
      formValuesObj[error.fieldName] = {
        value: error.value || form.getFieldsValue(error.fieldName),
        errors: error.errors
      };
    });

    form.setFields(formValuesObj);
  } else if (typeof errors === "object") {
    Object.keys(errors).forEach(fieldName => {
      let error = errors[fieldName];
      if (!error.value) {
        error.value = form.getFieldsValue(fieldName);
      }
    });

    form.setFields(errors);
  }
}

const noop = () => {};

function getPrimaryFieldName(fieldName) {
  const fieldArray = fieldName.split(".");
  const primaryField = fieldArray[0];
  return primaryField;
}

function defaultProcessData(data) {
  return { hasError: false, values: data };
}

function defaultProcessFieldError(id, value, errors) {
  return { value, errors: Array.isArray(errors) ? errors : null };
}

export function constructSubmitHandler({
  form,
  process,
  submitCallback,
  processFieldError,
  beforeProcess,
  successfulProcess,
  beforeErrorProcess,
  afterErrorProcess,
  completedProcess
}) {
  if (typeof submitCallback !== "function") {
    throw new Error("submitCallback function not provided");
  }

  if (!form) {
    throw new Error("form object not provided");
  }

  process = process || defaultProcessData;
  processFieldError = processFieldError || defaultProcessFieldError;
  beforeProcess = beforeProcess || noop;
  successfulProcess = successfulProcess || noop;
  beforeErrorProcess = beforeErrorProcess || noop;
  afterErrorProcess = afterErrorProcess || noop;
  completedProcess = completedProcess || noop;

  return function handler(event) {
    if (event) {
      event.preventDefault();
    }

    form.validateFieldsAndScroll(async (errors, values) => {
      console.log({ errors, values });
      if (!errors) {
        beforeProcess();
        const { hasError, values: processedValues } = process(values);
        console.log({ hasError, processedValues });

        if (!hasError) {
          try {
            await submitCallback(processedValues);
            successfulProcess();
          } catch (error) {
            submitHandlerOnError({
              error,
              beforeErrorProcess,
              form,
              processFieldError,
              afterErrorProcess
            });
          }
        }

        completedProcess();
      }
    });
  };
}
function submitHandlerOnError({
  error,
  beforeErrorProcess,
  form,
  processFieldError,
  afterErrorProcess
}) {
  devLog(error);
  beforeErrorProcess(error);
  let fields = {};
  let indexedErrors = {};
  const values = form.getFieldsValue();

  if (Array.isArray(error)) {
    indexedErrors = error.reduce((accumulator, err) => {
      const primaryFieldName = getPrimaryFieldName(err.field);

      if (accumulator[primaryFieldName]) {
        accumulator[primaryFieldName].push(err);
      } else {
        accumulator[primaryFieldName] = [err];
      }

      return accumulator;
    }, {});

    console.log(indexedErrors);
    Object.keys(values).forEach(id => {
      const fieldValue = values[id];
      const processedFieldData = processFieldError(
        id,
        fieldValue,
        indexedErrors[id],
        indexedErrors
      );

      fields[id] = processedFieldData;
    });
  }

  console.log(fields);
  form.setFields(fields);
  afterErrorProcess(indexedErrors);
}
