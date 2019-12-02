import { Divider } from "antd";
import React from "react";
import GeneralError, { IGeneralErrorProps } from "./GeneralError";

export interface IGeneralErrorListProps {
  errors: Array<IGeneralErrorProps["error"]>;
}

const GeneralErrorList: React.FC<IGeneralErrorListProps> = props => {
  const { errors } = props;

  return (
    <React.Fragment>
      {errors.map((error, index) => (
        <React.Fragment>
          <GeneralError error={error} />
          {index !== errors.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

export default GeneralErrorList;
