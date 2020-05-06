import { AppstoreAddOutlined } from "@ant-design/icons";
import React from "react";
import RenderForDevice from "../components/RenderForDevice";
import StyledContainer, {
  IStyledContainerProps,
} from "../components/styled/Container";
import WebCard from "./WebCard";

const WebBody: React.SFC<{}> = () => {
  const mobileStyle: IStyledContainerProps["s"] = {
    flexDirection: "column",
  };

  const desktopStyle: IStyledContainerProps["s"] = {
    justifyContent: "center",
  };

  // const renderItem = () => {
  //   return (
  //     <StyledContainer>
  //       <StyledContainer></StyledContainer>
  //       <StyledContainer></StyledContainer>
  //     </StyledContainer>
  //   );
  // };

  const render = (style: any) => {
    return (
      <StyledContainer s={{ ...style, flex: 1 }}>
        <WebCard icon={<AppstoreAddOutlined />} text="Manage Tasks" />
        <WebCard icon={<AppstoreAddOutlined />} text="Manage Projects" />
        <WebCard icon={<AppstoreAddOutlined />} text="Manage Groups" />
        <WebCard
          icon={<AppstoreAddOutlined />}
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

export default WebBody;
