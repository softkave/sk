import { Divider } from "antd";
import React from "react";
import GeneralError, { IGeneralErrorProps } from "./GeneralError";
import StyledContainer from "./styled/Container";

export interface IGeneralErrorListProps {
  errors: Array<IGeneralErrorProps["error"]>;
  fill?: boolean;
}

const GeneralErrorList: React.FC<IGeneralErrorListProps> = props => {
  const { errors, fill } = props;

  const a = (
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

  if (fill) {
    return (
      <StyledContainer
        s={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px"
        }}
      >
        {a}
      </StyledContainer>
    );
  }

  return a;
};

export default GeneralErrorList;
