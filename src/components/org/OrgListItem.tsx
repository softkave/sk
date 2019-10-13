import styled from "@emotion/styled";
import React from "react";
import { IBlock } from "../../models/block/block";
import ItemAvatar from "../ItemAvatar";

export interface IOrgListItemProps {
  org: IBlock;
  onClick: (org: IBlock) => void;
}

const OrgListItem: React.SFC<IOrgListItemProps> = props => {
  const { org, onClick } = props;

  return (
    <StyledOrgListItem onClick={() => onClick(org)}>
      <StyledOrgAvatar>
        <ItemAvatar color={org.color} />
      </StyledOrgAvatar>
      <StyledOrgBody>{org.name}</StyledOrgBody>
    </StyledOrgListItem>
  );
};

export default OrgListItem;

const StyledOrgListItem = styled.div({
  display: "flex",
  width: "100%",
  height: "100%"
});

const StyledOrgAvatar = styled.div({});

const StyledOrgBody = styled.div({
  display: "flex",
  flex: 1,
  paddingLeft: "16px"
});