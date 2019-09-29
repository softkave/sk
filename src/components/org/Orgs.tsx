import styled from "@emotion/styled";
import { Button } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { IBlockMethods } from "../block/methods";
import EditOrg from "./EditOrg";
import OrgThumbnail from "./OrgThumbnail";

import "./orgs.css";

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
        <div className="sk-orgs-header">
          <Button onClick={this.toggleNewOrgForm} icon="plus">
            Create Org
          </Button>
        </div>
        <div className="sk-orgs-content">
          {orgs.map(org => {
            return (
              <OrgThumbnail
                key={org.customId}
                org={org}
                onClick={() => onSelectOrg(org)}
                className="sk-orgs-thumbnail"
              />
            );
          })}
        </div>
      </StyledOrgs>
    );
  }
}

export default Orgs;

const StyledOrgs = styled.div({
  overflowY: "auto"
});
