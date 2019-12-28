import React from "react";
import Media from "react-media";
import theme from "./theme";

export interface IRenderForDeviceProps {
  renderForMobile: () => React.ReactNode;
  renderForDesktop: () => React.ReactNode;
}

const RenderForDevice: React.FC<IRenderForDeviceProps> = props => {
  const { renderForDesktop, renderForMobile } = props;

  return (
    <Media queries={{ mobile: `(max-width: ${theme.breakpoints.sm}px)` }}>
      {matches => (
        <React.Fragment>
          {matches.mobile && renderForMobile()}
          {!matches.mobile && renderForDesktop()}
        </React.Fragment>
      )}
    </Media>
  );
};

export default RenderForDevice;