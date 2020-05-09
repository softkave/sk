export const validateWithYupSchema = (yupSchema, values) => {
  try {
    yupSchema.validateSync(values, { abortEarly: false });

    return null;
  } catch (validationError) {
    const err: any = {};

    if (
      Array.isArray(validationError.inner) &&
      validationError.inner.length > 0
    ) {
      validationError.inner.forEach((er) => {
        if (!err[er.path]) {
          err[er.path] = er.message;
        }
      });
    } else {
      err[validationError.path] = validationError.message;
    }

    return err;
  }
};
