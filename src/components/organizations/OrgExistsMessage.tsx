import styled from "@emotion/styled";
import React from "react";
import FormError from "../form/FormError";

const complaintEmailAddress = "ywordk@gmail.com";

export interface IOrgExistsMessageProps {
  message?: string;
}

const OrgExistsMessage: React.FC<IOrgExistsMessageProps> = props => {
  const { message } = props;

  return (
    <div>
      <FormError error={message} />
      <StyledComplaintMessage>
        If this organization legally belongs to you, you can send a complaint to{" "}
        <a href={`mailto://${complaintEmailAddress}`}>ywordk@gmail.com</a>
      </StyledComplaintMessage>
    </div>
  );
};

OrgExistsMessage.defaultProps = {
  message: "Organization name is not available."
};

export default OrgExistsMessage;

const StyledComplaintMessage = styled.div({
  // color: "black"
});
