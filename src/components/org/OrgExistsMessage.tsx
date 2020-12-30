import styled from "@emotion/styled";
import React from "react";
import FormError from "../forms/FormError";

const complaintEmailAddress = "abayomi@softkave.com";

export interface IOrgExistsMessageProps {
    message?: string;
}

const OrgExistsMessage: React.SFC<IOrgExistsMessageProps> = (props) => {
    const { message } = props;

    return (
        <div>
            <FormError error={message} />
            <StyledComplaintMessage>
                If this organization legally belongs to you, you can send a
                complaint to{" "}
                <a href={`mailto://${complaintEmailAddress}`}>
                    abayomi@softkave.com
                </a>
            </StyledComplaintMessage>
        </div>
    );
};

OrgExistsMessage.defaultProps = {
    message: "Organization name is not available.",
};

export default OrgExistsMessage;

const StyledComplaintMessage = styled.div({
    // color: "black"
});
