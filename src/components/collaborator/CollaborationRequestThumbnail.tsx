import styled from "@emotion/styled";
import { Typography } from "antd";
import React from "react";
import { INotification } from "../../models/notification/notification";
import cloneWithWidth from "../styled/cloneWithWidth";
import StyledContainer from "../styled/Container";
import CollaborationRequestStatus from "./CollaborationRequestStatus";

export interface ICollaborationRequestThumbnailProps {
    request: INotification;
    style?: React.CSSProperties;
    className?: string;
    onClick?: () => void;
}

const CollaborationRequestThumbnail: React.SFC<ICollaborationRequestThumbnailProps> = (
    props
) => {
    const { request, style, onClick, className } = props;

    return (
        <StyledContainer
            s={{ width: "100%" }}
            style={style}
            onClick={onClick}
            className={className}
        >
            {cloneWithWidth(
                <StyledRequestDataContainer>
                    <Typography.Text ellipsis>
                        {request.to.email}
                    </Typography.Text>
                    <StyledContainer s={{ marginTop: "4px" }}>
                        <CollaborationRequestStatus request={request} />
                    </StyledContainer>
                </StyledRequestDataContainer>,
                { marginLeft: 16 }
            )}
        </StyledContainer>
    );
};

export default CollaborationRequestThumbnail;

const StyledRequestDataContainer = styled.div({
    flex: 1,
    display: "flex",
    flexDirection: "column",
});
