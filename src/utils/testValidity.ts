const testValidity = (subject: any, required: boolean, type: string) => {
  if (subject !== undefined) {
    return typeof subject === type;
  } else if (required) {
    return false;
  } else {
    return true;
  }
};

export default testValidity;
