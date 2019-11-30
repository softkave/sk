import styled from "@emotion/styled";
import { Empty } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import StyledCenterContainer from "../styled/CenterContainer";
import OrganizationListItem from "./OrganizationListItem";

export interface IOrganizationListProps {
  orgs: IBlock[];
  onClick: (org: IBlock) => void;
}

const OrganizationList: React.SFC<IOrganizationListProps> = props => {
  const { orgs, onClick } = props;

  if (orgs.length === 0) {
    return (
      <StyledEmptyContainer>
        <Empty description="Create an organization to get started." />
      </StyledEmptyContainer>
    );
  }

  return (
    <StyledOrgList>
      <StyledHeader>Organizations</StyledHeader>
      <StyledList>
        {orgs.map(org => {
          return (
            <StyledOrgListItem key={org.customId}>
              <OrganizationListItem org={org} onClick={onClick} />
            </StyledOrgListItem>
          );
        })}
      </StyledList>
    </StyledOrgList>
  );
};

export default OrganizationList;

const StyledOrgList = styled.div({
  display: "flex",
  width: "100%",
  height: "100%",
  flexDirection: "column"
});

const lastOfTypeSelector = "&:last-of-type";
const hoverSelector = "&:hover";
const StyledOrgListItem = styled.div({
  padding: "24px 16px",
  borderBottom: "1px solid #DDD",
  cursor: "pointer",

  [lastOfTypeSelector]: {
    borderBottom: 0
  },

  [hoverSelector]: {
    backgroundColor: "#E6F7FF"
  }
});

const StyledEmptyContainer = styled(StyledCenterContainer)({
  marginTop: 64
});

const StyledHeader = styled.h1({
  padding: "0 16px",
  marginBottom: 0
});

const StyledList = styled.div({
  overflow: "auto"
});
