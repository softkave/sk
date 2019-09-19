import { Button } from "antd";
import React from "react";

import { IBlock } from "../../../models/block/block";
import { IUser } from "../../../models/user/user";
import BoardContainer from "../group/BoardContainer";
import { IBlockMethods } from "../methods";
import EditOrg from "./EditOrg";
import OrgThumbnail from "./OrgThumbnail";

import "./orgs.css";

export interface IOrgsProps {
  blockHandlers: IBlockMethods;
  orgs: IBlock[];
  user: IUser;
  onSelectOrg: (orgID?: string) => void;
  currentOrg?: IBlock;
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
    await this.props.blockHandlers.onAdd({ block: org, user: this.props.user });
    this.toggleNewOrgForm();
  };

  public render() {
    const { orgs, onSelectOrg, currentOrg } = this.props;
    const { showNewOrgForm } = this.state;

    if (currentOrg) {
      return (
        <BoardContainer
          blockID={currentOrg.customId}
          block={currentOrg}
          onBack={() => onSelectOrg()}
        />
      );
    }

    return (
      <div className="sk-orgs">
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
                onClick={() => onSelectOrg(org.customId)}
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
