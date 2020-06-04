import React from "react";
import { INetError } from "../../net/types";
import FormMessage from "./FormMessage";

export interface IFormErrorProps {
  error?: string | string[] | Error | Error[] | INetError | INetError[];
}

const FormError: React.SFC<IFormErrorProps> = (props) => {
  return (
    <FormMessage type="error" message={props.error}>
      {props.children}
    </FormMessage>
  );
};

export default FormError;
