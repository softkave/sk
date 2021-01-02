import styled from "@emotion/styled";
import { Typography } from "antd";
import React from "react";
import { Facebook, Instagram, Mail, Twitter } from "react-feather";
import RenderForDevice from "../../components/RenderForDevice";
import IconLink from "./IconLink";

const desktopStyles = {
    bottom: { justifyContent: "center" },
    iconLink: { marginRight: "24px" },
};

const mobileStyles = {
    bottom: {
        flexDirection: "column",
        width: "100%",
        height: "100%",
        justifyContent: "center",
    },
    iconLink: { marginBottom: "16px" },
};

const Bottom: React.FC<{}> = () => {
    const render = (mobile = false) => {
        const styles = mobile ? mobileStyles : desktopStyles;

        return (
            <BottomContainer style={styles.bottom as any}>
                {mobile && (
                    <Typography.Text strong style={{ marginBottom: "16px" }}>
                        Contact
                    </Typography.Text>
                )}
                <IconLink
                    icon={<Mail />}
                    text="abayomi@softkave.com"
                    href="mailto:abayomi@softkave.com"
                    style={styles.iconLink}
                />
                <IconLink
                    icon={<Instagram />}
                    text="softkavehq"
                    href="https://www.instagram.com/softkavehq/"
                    style={styles.iconLink}
                />
                <IconLink
                    icon={<Twitter />}
                    text="softkave"
                    href="https://twitter.com/softkave"
                    style={styles.iconLink}
                />
                <IconLink
                    icon={<Facebook />}
                    text="softkave"
                    href="https://www.facebook.com/softkave"
                    style={styles.iconLink}
                />
            </BottomContainer>
        );
    };

    return (
        <RenderForDevice
            renderForDesktop={() => render(false)}
            renderForMobile={() => render(true)}
        />
    );
};

export default Bottom;

const BottomContainer = styled.div({
    display: "flex",
    padding: "16px",
    width: "100%",
});
