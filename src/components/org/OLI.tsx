import styled from "@emotion/styled";
import React from "react";
import { IBlock } from "../../models/block/block";
import ItemAvatar from "../ItemAvatar";

export interface IOrganizationListItemProps {
  org: IBlock;
  onClick: (org: IBlock) => void;
}

const OrganizationListItem: React.FC<IOrganizationListItemProps> = props => {
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

export default OrganizationListItem;

const StyledOrgListItem = styled.div({
  display: "flex",
  width: "100%",
  height: "100%",
  alignItems: "center"
});

const StyledOrgAvatar = styled.div({});

const StyledOrgBody = styled.div({
  display: "flex",
  flex: 1,
  paddingLeft: "16px"
});
