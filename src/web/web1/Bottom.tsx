import styled from "@emotion/styled";
import { Space, Typography } from "antd";
import React from "react";
import { Facebook, Instagram, Mail, Twitter } from "react-feather";
import IconLink from "./IconLink";

const Bottom: React.FC<{}> = () => {
    return (
        <BottomContainer>
            <Space direction="vertical">
                <Typography.Text strong>Contact</Typography.Text>
                <IconLink
                    icon={<Mail />}
                    text="abayomi@softkave.com"
                    href="mailto:abayomi@softkave.com"
                />
                <IconLink
                    icon={<Instagram />}
                    text="softkavehq"
                    href="https://www.instagram.com/softkavehq/"
                />
                <IconLink
                    icon={<Twitter />}
                    text="softkave"
                    href="https://twitter.com/softkave"
                />
                <IconLink
                    icon={<Facebook />}
                    text="softave"
                    href="https://www.facebook.com/softkave"
                />
            </Space>
        </BottomContainer>
    );
};

export default Bottom;

const BottomContainer = styled.div({
    display: "flex",
    height: "100%",
    padding: "16px",
    flexDirection: "column",
    width: "100%",
});
