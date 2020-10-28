import { Divider } from "antd";
import isString from "lodash/isString";
import React from "react";
import { IAppError } from "../net/types";
import GeneralError from "./GeneralError";
import StyledContainer from "./styled/Container";

export interface IGeneralErrorListProps {
    errors: string | IAppError | Array<string | IAppError>;
    fill?: boolean;
}

const GeneralErrorList: React.FC<IGeneralErrorListProps> = (props) => {
    const { errors, fill } = props;

    // TODO: should we show a generic error instead of []
    let errorList: IAppError[] = [];

    if (errors) {
        if (Array.isArray(errors)) {
            errorList = errors.map((error) =>
                isString(error) ? new Error(error) : error
            );
        } else if (isString(errors)) {
            errorList = [new Error(errors)];
        } else if ((errors as any).errors) {
            errorList = (errors as any).errors;
        } else if ((errors as Error).message) {
            errorList = [errors];
        }
    }

    // TODO: implement a better key for the items
    const content = (
        <StyledContainer
            s={{
                flexDirection: "column",
                justifyContent: "flex-start",
                maxWidth: "400px",
                width: "100%",
                padding: "0 16px",
            }}
        >
            {errorList.map((error, index) => (
                <React.Fragment
                    key={error.name ? `${error.name}-${index}` : index}
                >
                    <GeneralError error={error} />
                    {index !== errorList.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </StyledContainer>
    );

    if (fill) {
        return (
            <StyledContainer
                s={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                }}
            >
                {content}
            </StyledContainer>
        );
    }

    return content;
};

export default GeneralErrorList;
