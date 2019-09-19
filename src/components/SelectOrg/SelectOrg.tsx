import styled from "@emotion/styled";
import { Dropdown, Icon, Menu } from "antd";
import React from "react";

import { IBlock } from "../../models/block/block";
import StyledCapitalizeText from "../StyledCapitalizeText";

export interface ISelectOrgProps {
  orgs: IBlock[];
  currentOrgID?: string;
  trigger?: Array<"click" | "hover" | "contextMenu">;
  placeholder?: string;
  onChange?: (orgID: string) => void;
}

const SelectOrg: React.SFC<ISelectOrgProps> = props => {
  const {
    currentOrgID,
    orgs,
    onChange,
    placeholder,
    trigger: triggers
  } = props;
  const overlay = (
    <StyledMenu
      onClick={event => {
        if (onChange) {
          onChange(event.key);
        }
      }}
    >
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
