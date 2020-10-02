import React from "react";
import Scrollbars, { ScrollbarProps } from "react-custom-scrollbars";
import StyledContainer from "../styled/Container";
import userAgent from "../userAgent";

export interface ICustomScrollbarProps {
    children: React.ReactNode;
    scrollbarProps?: ScrollbarProps;
    style?: React.CSSProperties;
}

const useNativeScrollbarForDevices = ["mobile", "tablet"];
const WINDOWS = "windows";

const CustomScrollbar: React.FC<ICustomScrollbarProps> = (props) => {
    const { children, scrollbarProps, style } = props;

    const deviceType = userAgent.getDevice().type;
    const OS = userAgent.getOS().name;

    const useCustomScrollbar = React.useMemo(() => {
        if (OS && OS.toLowerCase() === WINDOWS) {
            return true;
        } else if (
            deviceType &&
            useNativeScrollbarForDevices.includes(deviceType)
        ) {
            return false;
        }

        return true;
    }, [deviceType, OS]);

    if (useCustomScrollbar) {
        return (
            <Scrollbars
                autoHide
                {...scrollbarProps}
                style={{ ...style, ...(scrollbarProps?.style || {}) }}
            >
                {children}
            </Scrollbars>
        );
    } else {
        return (
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
        );
    }
};

CustomScrollbar.defaultProps = { scrollbarProps: {}, style: {} };

export default React.memo(CustomScrollbar);
