class NetFieldError {
  constructor(field, errors) {
    this.field = field;
    this.errors = Array.isArray(errors) ? errors : [JSON.stringify(errors)];
    this.name = "NetFieldError";
  }
}

export default class NetError extends Error {
  constructor(errors) {
    super();
    this.name = "NetError";
    this.errors = [];
    if (Array.isArray(errors)) {
      this.errors = errors.map(
        error => new NetFieldError(error.field, error.errors)
      );
    } else if (typeof errors === "object") {
      this.errors.push(new NetFieldError(errors.field, errors.errors));
    } else {
      this.errors.push(new NetFieldError("error", errors));
    }
  }
}
