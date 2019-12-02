import React from "react";
import FormMessage from "./FormMessage";

export interface IFormErrorProps {
  error?: string | string[] | Error | Error[];
}

const FormError: React.FC<IFormErrorProps> = props => {
  return (
    <FormMessage type="error" message={props.error}>
      {props.children}
    </FormMessage>
  );
};

export default FormError;
