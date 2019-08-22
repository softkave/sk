import { Button } from "antd";
import React from "react";

import { IBlock } from "../../../models/block/block";
import { IUser } from "../../../models/user/user";
import BoardContainer from "../group/BoardContainer";
import { IBlockMethods } from "../methods";
import EditOrg from "./EditOrg";
import "./orgs.css";
import OrgThumbnail from "./OrgThumbnail";

export interface IOrgsProps {
  blockHandlers: IBlockMethods;
  orgs: IBlock[];
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

  public getCurrentOrg() {
    return this.props.orgs.find(
      block => block.customId === this.state.currentOrg
    );
  }

  public render() {
    const { orgs } = this.props;
    const { currentOrg, showNewOrgForm } = this.state;

    if (currentOrg) {
      const block = this.getCurrentOrg();

      return (
        <BoardContainer
          blockID={block!.customId}
          block={block}
          onBack={() => this.setCurrentOrg(null)}
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
                onClick={() => this.setCurrentOrg(org.customId)}
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
