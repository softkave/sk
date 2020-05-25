import React from "react";

const useInsertFormikErrors = (errors: any) => {
  const formikRef = React.useRef<any>();

  React.useEffect(() => {
    if (formikRef.current) {
      if (errors) {
        formikRef.current.setErrors(errors);
      } else {
        formikRef.current.setErrors({});
      }
    }
  }, [errors]);

  return formikRef;
};

export default useInsertFormikErrors;
