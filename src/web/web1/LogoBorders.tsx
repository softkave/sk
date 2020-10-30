import styled from "@emotion/styled";
import { Typography } from "antd";
import React from "react";

const LogoBorders: React.FC<{}> = () => {
    return (
        <LogoContainer>
            <Typography.Title
                style={{ margin: 0, fontSize: "16px", color: "black" }}
                level={3}
            >
                Softkave
            </Typography.Title>
        </LogoContainer>
    );
};

export default LogoBorders;

const LogoContainer = styled.div({
    padding: "8px",
    border: "2px solid grey",
    textTransform: "uppercase",
    borderRight: "32px solid grey",
    display: "inline-block",
    fontWeight: "bold",
});
