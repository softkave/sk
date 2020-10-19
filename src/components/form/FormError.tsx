import React from "react";
import { IAppError } from "../../net/types";
import FormMessage from "./FormMessage";

export interface IFormErrorProps {
    error?: string | string[] | Error | Error[] | IAppError | IAppError[];
}

const FormError: React.SFC<IFormErrorProps> = (props) => {
    return (
        <FormMessage type="error" message={props.error}>
            {props.children}
        </FormMessage>
    );
};

export default FormError;
