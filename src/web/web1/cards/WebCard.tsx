import styled from "@emotion/styled";
import React from "react";

export interface IWebCardProps {
    title: React.ReactNode;
}

const WebCard: React.FC<IWebCardProps> = (props) => {
    const { title, children } = props;

    return (
        <WebCardContainer>
            <div>{title}</div>
            <ContentContainer>{children}</ContentContainer>
        </WebCardContainer>
    );
};

export default WebCard;

const ContentContainer = styled.div({
    display: "flex",
    justifyContent: "center",
    flex: 1,
    marginTop: "12px",
});

const WebCardContainer = styled.div({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: "12px",
    maxWidth: "300px",
});
