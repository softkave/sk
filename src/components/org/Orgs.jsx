import React from "react";
import OrgThumbnail from "./OrgThumbnail.jsx";
import RootGroup from "../group/RootGroup.jsx";
import EditOrg from "./EditOrg.jsx";
import { Row, Col } from "antd";

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

  render() {
    const { orgs, blockHandlers, user } = this.props;
    const { currentOrg, showNewOrgForm } = this.state;

    if (currentOrg) {
      return (
        <RootGroup
          rootBlock={orgs[currentOrg]}
          onBack={() => this.setCurrentOrg(null)}
          blockHandlers={blockHandlers}
          user={user}
        />
      );
    }

    return (
      <div>
        <EditOrg
          visible={showNewOrgForm}
          onSubmit={blockHandlers.onAdd}
          onClose={this.toggleNewOrgForm}
          existingOrgs={Object.keys(orgs).map(org => org.name)}
        />
        <Row gutter={16}>
          {orgs.map(org => {
            return (
              <Col key={org.id} sm={24} md={8} lg={6}>
                <OrgThumbnail org={org} onClick={this.setCurrentOrg} />
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}

export default Orgs;
