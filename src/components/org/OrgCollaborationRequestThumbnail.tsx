import { Typography } from "antd";
import React from "react";
import { INotification } from "../../models/notification/notification";
import CollaborationRequestStatus from "../collaborator/CollaborationRequestStatus";
import ItemAvatar from "../ItemAvatar";
import StyledContainer from "../styled/Container";

export interface IOrgCollaborationRequestThumbnailProps {
    collabRequest: INotification;
    style?: React.CSSProperties;
    onClick?: () => void;
}

const OrgCollaborationRequestThumbnail: React.SFC<IOrgCollaborationRequestThumbnailProps> = (
    props
) => {
    const { collabRequest, onClick, style } = props;

    // TODO: do line clamping on the texts
    return (
        <StyledContainer
            s={{ flex: 1, cursor: "pointer", ...style }}
            onClick={onClick}
        >
            <StyledContainer>
                <ItemAvatar size="default" />
            </StyledContainer>
            <StyledContainer
                s={{
                    lineHeight: "16px",
                    flex: 1,
                    marginLeft: 16,
                    flexDirection: "column",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography.Text strong>
                    {collabRequest.from?.blockName}
                </Typography.Text>
                <CollaborationRequestStatus request={collabRequest} />
            </StyledContainer>
        </StyledContainer>
    );
};

OrgCollaborationRequestThumbnail.defaultProps = {
    style: {},
};

export default React.memo(OrgCollaborationRequestThumbnail);
