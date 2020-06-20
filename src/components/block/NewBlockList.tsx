import { Avatar, Dropdown, Menu, Space, Typography } from "antd";
import React from "react";
import { MoreHorizontal } from "react-feather";
import { IBlock } from "../../models/block/block";
import StyledContainer from "../styled/Container";

export interface INewBlockListProps {
  blocks: IBlock[];
  onClick: (org: IBlock) => void;

  avatarShape?: "circle" | "square";
  avatarSize?: "large" | "small" | "default" | number;
}

const NewBlockList: React.FC<INewBlockListProps> = (props) => {
  const { blocks, avatarShape, avatarSize, onClick } = props;

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={0}>
      {blocks.map((block) => (
        <StyledContainer
          key={block.customId}
          onClick={() => onClick(block)}
          s={{
            cursor: "pointer",
            padding: "8px 16px",
            "&:hover": {
              backgroundColor: "#eee",
            },
          }}
        >
          <Avatar
            size={avatarSize}
            shape={avatarShape}
            style={{
              backgroundColor: block.color,
              marginRight: "8px",
            }}
          />
          <StyledContainer s={{ flex: 1, marginRight: "8px" }}>
            <Typography.Text ellipsis>{block.name}</Typography.Text>
          </StyledContainer>
          <StyledContainer>
            <Dropdown
              placement="bottomRight"
              trigger={["click"]}
              overlay={
                <Menu>
                  <Menu.Item>Show</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item>Delete</Menu.Item>
                </Menu>
              }
            >
              <MoreHorizontal style={{ width: "20px" }} />
            </Dropdown>
          </StyledContainer>
        </StyledContainer>
      ))}
    </Space>
  );
};

NewBlockList.defaultProps = {
  avatarShape: "square",
  avatarSize: "small",
};

export default React.memo(NewBlockList);
