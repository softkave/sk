class Model {
  constructor({ data }) {
    this.replace(data);
  }

  dump() {
    const data = this.data;
    this.data = null;
    return data;
  }

  replace(data) {
    this.data = data;
  }

  valid() {
    return !!this.data;
  }
}
