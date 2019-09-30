import styled from "@emotion/styled";
import React from "react";
import { IBlock } from "../../models/block/block";
import OrgListItem from "./OrgListItem";

export interface IOrgListProps {
  orgs: IBlock[];
  onClick: (org: IBlock) => void;
}

const OrgList: React.SFC<IOrgListProps> = props => {
  const { orgs, onClick } = props;

  return (
    <StyledOrgList>
      {orgs.map(org => {
        return (
          <StyledOrgListItem key={org.customId}>
            <OrgListItem org={org} onClick={onClick} />
          </StyledOrgListItem>
        );
      })}
    </StyledOrgList>
  );
};

export default OrgList;

const StyledOrgList = styled.div({
  display: "flex",
  width: "100%",
  height: "100%",
  flexDirection: "column"
});

const StyledOrgListItem = styled.div({
  padding: "24px 16px",
  borderBottom: "1px solid #DDD",
  cursor: "pointer",

  ["&:last-of-type"]: {
    borderBottom: 0
  },

  ["&:hover"]: {
    backgroundColor: "#E6F7FF"
  }
});
