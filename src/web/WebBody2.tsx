import React from "react";
import RenderForDevice from "../components/RenderForDevice";
import StyledContainer, {
  IStyledContainerProps
} from "../components/styled/Container";
import WebCard from "./WebCard";

const WebBody2: React.SFC<{}> = () => {
  const mobileStyle: IStyledContainerProps["s"] = {
    flexDirection: "column"
  };

  const desktopStyle: IStyledContainerProps["s"] = {
    justifyContent: "center"
  };

  const render = (style: any) => {
    return (
      <StyledContainer s={style}>
        <WebCard icon="AppstoreAddOutlined" text="Manage Tasks" />
        <WebCard icon="AppstoreAddOutlined" text="Manage Projects" />
        <WebCard icon="AppstoreAddOutlined" text="Manage Groups" />
        <WebCard
          icon="AppstoreAddOutlined"
          text="Manage Organizations and Collaborators"
        />
      </StyledContainer>
    );
  };

  return (
    <RenderForDevice
      renderForDesktop={() => render(desktopStyle)}
      renderForMobile={() => render(mobileStyle)}
    />
  );
};

export default WebBody2;
