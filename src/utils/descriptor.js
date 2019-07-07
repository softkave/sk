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
  msg = "Values do not match"
) {
  return function validatePassword(rule, value, cb, source) {
    const value0 = form.getFieldValue(field0);
    const value1 = form.getFieldValue(field1);

    if (value0 && value1 && value0 !== value1) {
      cb(msg);
    } else {
      cb();
    }
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

export function promisifyAsyncValidator(v) {
  return function(data) {
    return new Promise(function(success, reject) {
      v(data, function(errors, fields) {
        if (errors) {
          reject({ errors, fields });
        } else {
          success(fields);
        }
      });
    });
  };
}
