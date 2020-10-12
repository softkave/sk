import styled from "@emotion/styled";
import { Typography } from "antd";
import React from "react";

const Bottom: React.FC<{}> = () => {
    return (
        <BottomContainer>
            <Typography.Text strong>Contact</Typography.Text>
            <a>Email</a>
            <a>Twitter</a>
            <a>Facebook</a>
            <a>Instagram</a>
        </BottomContainer>
    );
};

export default Bottom;

const BottomContainer = styled.div({
    display: "flex",
    height: "100%",
    padding: "16px",
    alignItems: "center",
});
