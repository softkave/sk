import React from "react";
import { appConstants } from "../../models/app/constants";
import FormError from "../forms/FormError";

export interface IOrganizationExistsMessageProps {
  message?: string;
}

const OrganizationExistsMessage: React.FC<IOrganizationExistsMessageProps> = (
  props
) => {
  const { message } = props;
  return (
    <div>
      <FormError error={message} />
      <div>
        If this organization legally belongs to you, you can send a complaint to{" "}
        <a href={`mailto://${appConstants.complaintEmailAddress}`}>
          abayomi@softkave.com
        </a>
        .
      </div>
    </div>
  );
};

OrganizationExistsMessage.defaultProps = {
  message: "Organization name is not available.",
};

export default OrganizationExistsMessage;
