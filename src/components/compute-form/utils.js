export function stripFromData(data, toStrip) {
  if (Array.isArray(toStrip)) {
    toStrip.forEach(field => delete data[field]);
  }

  return data;
}

export function applyErrors(errors, data) {
  if (Array.isArray(errors)) {
    let fields = {};
    errors.forEach(error => {
      fields[error.field] = {
        value: data[error.field],
        errors: error.errors
      };
    });
  }
}
