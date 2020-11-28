import { Empty } from "antd";
import React from "react";
import StyledContainer from "../styled/Container";
import withDrawer, { WithDrawerType } from "../withDrawer";

const FeedbackSentMessage: React.FC<{}> = () => {
    return (
        <StyledContainer
            s={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Empty description="Feedback sent successfully!" />
        </StyledContainer>
    );
};

export default withDrawer(FeedbackSentMessage, {
    type: WithDrawerType.Modal,
    okText: "New Feedback",
    cancelText: "Close",
    cancelButtonProps: {
        danger: true,
    },
});
