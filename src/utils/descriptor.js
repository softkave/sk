export function makeDescriptorFieldsRequired(descriptor, fields = []) {
  descriptor = { ...descriptor };
  fields.forEach(field => {
    let rule = descriptor[field];

    if (rule) {
      let replaceRule = [{ required: true, message: `${field} is required` }];

      if (Array.isArray(rule)) {
        replaceRule = replaceRule.concat(rule);
      } else {
        replaceRule.push(rule);
      }

      descriptor[field] = replaceRule;
    }
  });

  return descriptor;
}

export function makeConfirmValidator(
  field0,
  field1,
  form,
  msg = "values do not match"
) {
  return function validatePassword(rule, value, cb, source) {
    const value0 = form.getFieldValue(field0);
    const value1 = form.getFieldValue(field1);
    let fieldToUpdate = null;
    let fieldValue = null;
    let error = null;

    if (value0 && value1 && value0 === value1) {
      cb();
    } else {
      cb(msg);
      error = msg;
    }

    if (rule.field === field0) {
      fieldToUpdate = field1;
      fieldValue = value1;
    } else {
      fieldToUpdate = field0;
      fieldValue = value0;
    }

    form.setFields({ [fieldToUpdate]: { error, value: fieldValue } });
  };
}

export function makeNameExistsValidator(
  existingNames,
  msg = "name already exist"
) {
  return function validatePassword(rule, value, cb, source) {
    value = value.toLowerCase();
    if (existingNames.find(name => nameExists(name))) {
      cb(msg);
    }

    cb();

    function nameExists(name) {
      return name.toLowerCase() === value.toLowerCase();
    }
  };
}
