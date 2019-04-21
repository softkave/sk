<<<<<<< HEAD:src/components/compute-form/utils.js
export function makeSubmitHandler(form, onSubmit, onError) {
  return function (event) {
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
  // let formValuesObj = {};
  console.log(form, errors)
  return;
  // if (Array.isArray(errors)) {
  //   errors.forEach(error => {
  //     formValuesObj[error.fieldName] = {
  //       value: error.value || form.getFieldsValue(error.fieldName),
  //       errors: error.errors
  //     };
  //   });

  //   form.setFields(formValuesObj);
  // } else if (typeof errors === "object") {
  //   Object.keys(errors).forEach(fieldName => {
  //     let error = errors[fieldName];
  //     // if (!error.value) {
  //     //   error.value = form.getFieldsValue(fieldName);
  //     // }
  //   });

  //   form.setFields(errors);
  // }
}
=======
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
>>>>>>> cb76368d304ef130b5864922dd098d1785bda3cf:src/components/form-utils.js
