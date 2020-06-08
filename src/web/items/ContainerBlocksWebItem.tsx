import { Divider, Typography } from "antd";
import React from "react";
import BlockThumbnail from "../../components/block/BlockThumnail";
import StyledContainer from "../../components/styled/Container";
import { demoBoard, demoOrg } from "./data";
import WebItem from "./Item";

const ContainerBlocksWebItem: React.FC<{}> = () => {
  const label = (
    <Typography.Paragraph>
      Create <Typography.Text strong>organizations</Typography.Text> and manage{" "}
      <Typography.Text strong>boards</Typography.Text>.
    </Typography.Paragraph>
  );

  const content = (
    <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
      <BlockThumbnail block={demoOrg} showFields={["name", "type"]} />
      <StyledContainer s={{ margin: "24px" }} />
      <BlockThumbnail block={demoBoard} showFields={["name", "type"]} />
    </StyledContainer>
  );

  return <WebItem content={content} label={label} />;
};

export default ContainerBlocksWebItem;
