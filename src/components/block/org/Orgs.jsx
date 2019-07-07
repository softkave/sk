import React from "react";
import OrgThumbnail from "./OrgThumbnail.jsx";
import Board from "../group/Board";
import EditOrg from "./EditOrg.jsx";
import { Button } from "antd";
import "./orgs.css";

class Orgs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOrg: null,
      showNewOrgForm: false
    };
  }

  setCurrentOrg = id => {
    this.setState({ currentOrg: id });
  };

  toggleNewOrgForm = () => {
    this.setState(prevState => {
      return {
        showNewOrgForm: !prevState.showNewOrgForm
      };
    });
  };

  onCreateOrg = async org => {
    await this.props.blockHandlers.onAdd(org);
    this.toggleNewOrgForm();
  };

  render() {
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
