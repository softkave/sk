export function diff<T = any>(initial: T, current: T, shallow = false) {
  if (typeof initial === "object") {
    if (!shallow) {
      const fieldMap: { [key: string]: boolean } = Object.keys(initial)
        .concat(Object.keys(current))
        .reduce((accumulator, field) => {
          accumulator[field] = true;
          return accumulator;
        }, {});

      const fields = Object.keys(fieldMap);
      const result = Array.isArray(initial) ? [] : {};

      fields.forEach((field) => {
        const initialValue = initial[field];
        const currentValue = current[field];

        if (initialValue === currentValue) {
          return;
        }

        if (typeof initialValue !== "object") {
          result[field] = currentValue;
        }

        result[field] = diff(initialValue, currentValue, shallow);
      });

      return result;
    }
  }

  return initial === current ? current : undefined;
}
