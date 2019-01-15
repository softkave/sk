export function makeDescriptorFieldsRequired(descriptor, fields = []) {
  fields.forEach(field => {
    let rule = descriptor[field];

    if (rule) {
      let replaceRule = [{ required: true }];

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
    //console.log(arguments);
    const value0 = form.getFieldValue(field0);
    const value1 = form.getFieldValue(field1);
    if (value0 && value1 && value0 === value1) {
      cb();
    }

    cb(msg);
  };
}

export function makeNameExistsValidator(
  existingNames,
  msg = "Name already exist"
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
