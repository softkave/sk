import React from "react";
import FormError from "../forms/FormError";

const complaintEmailAddress = "abayomi@softkave.com";

export interface IOrgExistsMessageProps {
  message?: string;
}

const OrgExistsMessage: React.FC<IOrgExistsMessageProps> = (props) => {
  const { message } = props;

  return (
    <div>
      <FormError error={message} />
      <div>
        If this organization legally belongs to you, you can send a complaint to{" "}
        <a href={`mailto://${complaintEmailAddress}`}>abayomi@softkave.com</a>.
      </div>
    </div>
  );
};

OrgExistsMessage.defaultProps = {
  message: "Organization name is not available.",
};

export default OrgExistsMessage;
