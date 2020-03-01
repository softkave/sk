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

  const e = Array.isArray(errors)
    ? errors
    : (errors as any).errors
    ? (errors as any).errors
    : []; // TODO: should we show a generic error instead of []

  // TODO: implement a better key for the items
  const content = (
    <StyledContainer
      s={{
        flexDirection: "column",
        justifyContent: "flex-start",
        maxWidth: "400px",
        width: "100%",
        padding: "0 16px"
      }}
    >
      {e.map((error, index) => (
        <React.Fragment key={error.name ? `${error.name}-${index}` : index}>
          <GeneralError error={error} />
          {index !== e.length - 1 && <Divider />}
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
        {content}
      </StyledContainer>
    );
  }

  return content;
};

export default GeneralErrorList;
