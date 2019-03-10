import dotProp from "dot-prop-immutable";

export function getDataFromObj(obj, dataArr, addEmpty) {
  let result = {};

  dataArr.forEach(field => {
    let data = dotProp.get(obj, field);

    if (data || addEmpty) {
      result[field] = data;
    }
  });

  return result;
}
