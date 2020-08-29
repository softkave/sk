import React from "react";
import Scrollbars, { ScrollbarProps } from "react-custom-scrollbars";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";

export interface IDeviceScrollbarProps {
    children: React.ReactNode;
    scrollbarProps?: ScrollbarProps;
    style?: React.CSSProperties;
}

const DeviceScrollbar: React.FC<IDeviceScrollbarProps> = (props) => {
    const { children, scrollbarProps, style } = props;

    const mobile = React.useCallback(
        () => (
            <StyledContainer
                s={{
                    flex: 1,
                    overflow: "auto",
                    flexDirection: "column",
                    width: "100%",
                    ...style,
                }}
            >
                {children}
            </StyledContainer>
        ),
        [children]
    );

    const desktop = React.useCallback(
        () => (
            <Scrollbars
                {...scrollbarProps}
                style={{ ...style, ...(scrollbarProps?.style || {}) }}
            >
                {children}
            </Scrollbars>
        ),
        [children]
    );

    return (
        <RenderForDevice renderForDesktop={desktop} renderForMobile={mobile} />
    );
};

DeviceScrollbar.defaultProps = { scrollbarProps: {}, style: {} };

export default React.memo(DeviceScrollbar);
