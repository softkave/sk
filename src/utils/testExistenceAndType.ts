const testExistenceAndType = (
  subject: any,
  required: boolean,
  type: string
) => {
  if (type === "undefined") {
    return subject === undefined;
  }

  if (subject !== undefined && subject !== null) {
    return typeof subject === type;
  }

  if (required) {
    return false;
  }

  return true;
};

export default testExistenceAndType;
