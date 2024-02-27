import * as yup from "yup";

const defaultUniqueErrorMessage = "${path} is not unique";

const defaultUniqueTest = (value1: any, value2: any) => {
  return value1 === value2;
};

type UniqueTestFunction = (value1: any, value2: any) => boolean;

yup.addMethod(
  yup.array,
  "unique",
  function (
    fn: UniqueTestFunction = defaultUniqueTest,
    message = defaultUniqueErrorMessage
  ) {
    return this.test({
      message,
      name: "unique",
      exclusive: true,
      params: { fn },
      test(value) {
        const exists = (
          collection: any[],
          item: any,
          fromIndex: number = 0
        ) => {
          for (let i = fromIndex; i < collection.length; i++) {
            const nextItem = collection[i];
            const isItem = fn(item, nextItem);

            if (isItem) {
              return true;
            }
          }

          return false;
        };

        if (Array.isArray(value)) {
          return !!value.find((item, index) => {
            return exists(value, item, index);
          });
        }

        return false;
      },
    });
  }
);
