import styled from "@emotion/styled";
import { Button } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { IBlockMethods } from "../block/methods";
import ScrollList from "../ScrollList";
import EditOrg from "./EditOrg";
import OrgList from "./OrgList";

export interface IOrgsProps {
  blockHandlers: IBlockMethods;
  orgs: IBlock[];
  user: IUser;
  onSelectOrg: (org: IBlock) => void;
}

interface IOrgsState {
  showNewOrgForm: boolean;
}

class Orgs extends React.Component<IOrgsProps, IOrgsState> {
  constructor(props) {
    super(props);
    this.state = {
      showNewOrgForm: false
    };
  }

  public toggleNewOrgForm = () => {
    this.setState(prevState => {
      return {
        showNewOrgForm: !prevState.showNewOrgForm
      };
    });
  };

  public onCreateOrg = async org => {
    const { user, blockHandlers } = this.props;
    await blockHandlers.onAdd(user, org);
    this.toggleNewOrgForm();
  };

  public render() {
    const { orgs, onSelectOrg } = this.props;
    const { showNewOrgForm } = this.state;

    return (
      <StyledOrgs>
        <EditOrg
          visible={showNewOrgForm}
          onSubmit={this.onCreateOrg}
          onClose={this.toggleNewOrgForm}
        />
        <ScrollList>
          <StyledOrgsContent>
            <StyledCreateOrgWrapper>
              <Button block onClick={this.toggleNewOrgForm} icon="plus">
                Create Org
              </Button>
            </StyledCreateOrgWrapper>
            <OrgList orgs={orgs} onClick={org => onSelectOrg(org)} />
          </StyledOrgsContent>
        </ScrollList>
      </StyledOrgs>
    );
  }
}

export default Orgs;

const StyledOrgs = styled.div({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "auto"
});

const StyledCreateOrgWrapper = styled.div({
  padding: "32px 0"
});

const StyledOrgsContent = styled.div({
  boxSizing: "border-box",
  maxWidth: "400px",
  width: "100%",
  margin: "auto",
  padding: "24px 0"
});
