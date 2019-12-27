import { Divider } from "antd";
import React from "react";
import GeneralError, { IGeneralErrorProps } from "./GeneralError";
import StyledContainer from "./styled/Container";

export interface IGeneralErrorListProps {
  errors: Array<IGeneralErrorProps["error"]>;
}

const GeneralErrorList: React.FC<IGeneralErrorListProps> = props => {
  const { errors } = props;

  return (
    <StyledContainer
      s={{
        flexDirection: "column",
        justifyContent: "flex-start",
        maxWidth: "400px",
        width: "100%",
        padding: "0 16px"
      }}
    >
      {errors.map((error, index) => (
        <React.Fragment>
          <GeneralError error={error} />
          {index !== errors.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </StyledContainer>
  );
};

export default GeneralErrorList;
