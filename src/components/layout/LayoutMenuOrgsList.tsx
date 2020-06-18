import { Avatar, Space, Typography } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import StyledContainer from "../styled/Container";

export interface ILayoutMenuOrgsListProps {
  orgs: IBlock[];
  onClick: (org: IBlock) => void;
}

const LayoutMenuOrgsList: React.FC<ILayoutMenuOrgsListProps> = (props) => {
  const { orgs, onClick } = props;

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {orgs.map((org) => (
        <StyledContainer
          key={org.customId}
          onClick={() => onClick(org)}
          s={{
            cursor: "pointer",
            padding: "4px 16px",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <Space>
            <Avatar
              size="small"
              shape="square"
              style={{
                backgroundColor: org.color,
              }}
            />
            <Typography.Text ellipsis>{org.name}</Typography.Text>
          </Space>
        </StyledContainer>
      ))}
    </Space>
  );
};

export default React.memo(LayoutMenuOrgsList);
