import { Button } from "antd";
import React from "react";

import { IBlock } from "../../../models/block/block";
import { IUser } from "../../../models/user/user";
import Board from "../group/Board";
import { IBlockMethods } from "../methods";
import EditOrg from "./EditOrg";
import "./orgs.css";
import OrgThumbnail from "./OrgThumbnail";

export interface IOrgsProps {
  blockHandlers: IBlockMethods;
  orgs: { [key: string]: IBlock };
  user: IUser;
}

interface IOrgsState {
  currentOrg?: string | null;
  showNewOrgForm: boolean;
}

class Orgs extends React.Component<IOrgsProps, IOrgsState> {
  constructor(props) {
    super(props);
    this.state = {
      currentOrg: null,
      showNewOrgForm: false
    };
  }

  public setCurrentOrg = id => {
    this.setState({ currentOrg: id });
  };

  public toggleNewOrgForm = () => {
    this.setState(prevState => {
      return {
        showNewOrgForm: !prevState.showNewOrgForm
      };
    });
  };

  public onCreateOrg = async org => {
    await this.props.blockHandlers.onAdd(org);
    this.toggleNewOrgForm();
  };

  public render() {
    const { orgs, blockHandlers, user } = this.props;
    const { currentOrg, showNewOrgForm } = this.state;

    if (currentOrg) {
      return (
        <Board
          rootBlock={orgs[currentOrg]}
          onBack={() => this.setCurrentOrg(null)}
          blockHandlers={blockHandlers}
          user={user}
        />
      );
    }

    return (
      <div className="sk-orgs">
        <EditOrg
          visible={showNewOrgForm}
          onSubmit={this.onCreateOrg}
          onClose={this.toggleNewOrgForm}
          existingOrgs={Object.keys(orgs).map(orgId => orgs[orgId].name)}
        />
        <div className="sk-orgs-header">
          <Button onClick={this.toggleNewOrgForm} icon="plus">
            Create Org
          </Button>
        </div>
        <div className="sk-orgs-content">
          {Object.keys(orgs).map(orgId => {
            const org = orgs[orgId];
            return (
              <OrgThumbnail
                key={org.customId}
                org={org}
                onClick={() => this.setCurrentOrg(orgId)}
                className="sk-orgs-thumbnail"
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default Orgs;
