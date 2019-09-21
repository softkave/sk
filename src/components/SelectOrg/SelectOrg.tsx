import styled from "@emotion/styled";
import { Dropdown, Icon, Menu } from "antd";
import React from "react";

import { findBlock, IBlock } from "../../models/block/block";
import { orgsViewName } from "../../redux/view/orgs";
import StyledCapitalizeText from "../StyledCapitalizeText";

export interface ISelectOrgProps {
  orgs: IBlock[];
  onSelectOrg: (org: IBlock) => void;
  gotoOrgs: () => void;
  currentOrgID?: string;
  trigger?: Array<"click" | "hover" | "contextMenu">;
  placeholder?: string;
}

const SelectOrg: React.SFC<ISelectOrgProps> = props => {
  const {
    currentOrgID,
    orgs,
    onSelectOrg,
    gotoOrgs,
    placeholder,
    trigger: triggers
  } = props;

  const overlay = (
    <StyledMenu
      onClick={event => {
        if (event.key === orgsViewName) {
          gotoOrgs();
        } else {
          onSelectOrg(findBlock(orgs, event.key)!);
        }
      }}
    >
      <Menu.Item key={orgsViewName}>Orgs</Menu.Item>
      <Menu.Divider />
      {orgs.map(org => {
        return (
          <Menu.Item key={org.customId}>
            <StyledCapitalizeText>{org.name}</StyledCapitalizeText>
          </Menu.Item>
        );
      })}
    </StyledMenu>
  );

  const currentOrg = currentOrgID
    ? orgs.find(org => org.customId === currentOrgID)
    : null;

  const content = currentOrg ? currentOrg.name : placeholder;

  return (
    <StyledSelectOrg>
      <Dropdown overlay={overlay} trigger={triggers}>
        <StyledDropdownContent>
          <StyledOrgOrPlaceholder>{content}</StyledOrgOrPlaceholder>
          <StyledDropdownIcon type="caret-down" />
        </StyledDropdownContent>
      </Dropdown>
    </StyledSelectOrg>
  );
};

SelectOrg.defaultProps = {
  trigger: ["click"],
  placeholder: "Select Org"
};

export default SelectOrg;

const StyledSelectOrg = styled.div({
  display: "flex",
  justifyContent: "center"
});

const StyledDropdownContent = styled.div({
  textAlign: "center",
  cursor: "pointer",
  maxWidth: 300,
  minWidth: 200
});

const StyledOrgOrPlaceholder = styled.span({});

const StyledDropdownIcon = styled(Icon)({
  marginLeft: "8px",
  display: "inline-block",
  verticalAlign: "middle"
});

const StyledMenu = styled(Menu)({});
