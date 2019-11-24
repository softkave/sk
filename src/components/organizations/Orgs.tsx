import styled from "@emotion/styled";
import { Button } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { IOperationFuncOptions } from "../../redux/operations/operation";
import { addBlockOperationID } from "../../redux/operations/operationIDs";
import getNewBlock from "../block/getNewBlock";
import { IBlockMethods } from "../block/methods";
import ScrollList from "../ScrollList";
import EditOrgFormWithModal from "./EditOrgFormWithModal";
import OrganizationList from "./OrganizationList";

export interface IOrgsProps {
  blockHandlers: IBlockMethods;
  orgs: IBlock[];
  user: IUser;
  onSelectOrg: (org: IBlock) => void;
}

interface IOrgsState {
  showNewOrgForm: boolean;
  newOrg?: IBlock;
}

class Orgs extends React.Component<IOrgsProps, IOrgsState> {
  constructor(props) {
    super(props);
    this.state = {
      showNewOrgForm: false
    };
  }

  public toggleNewOrgForm = () => {
    const { user } = this.props;

    this.setState(prevState => {
      const showForm = !prevState.showNewOrgForm;
      const newOrg = showForm ? getNewBlock(user, "org") : undefined;

      return {
        newOrg,
        showNewOrgForm: showForm
      };
    });
  };

  public onCreateOrg = async (org, options: IOperationFuncOptions) => {
    const { user, blockHandlers } = this.props;
    await blockHandlers.onAdd({ user, block: org }, options);
  };

  public render() {
    const { orgs, onSelectOrg } = this.props;

    return (
      <StyledOrgs>
        {this.renderNewOrgForm()}
        <ScrollList>
          <StyledOrgsContent>
            <StyledCreateOrgWrapper>
              <Button block onClick={this.toggleNewOrgForm} icon="plus">
                Create Organization
              </Button>
            </StyledCreateOrgWrapper>
            <OrganizationList orgs={orgs} onClick={org => onSelectOrg(org)} />
          </StyledOrgsContent>
        </ScrollList>
      </StyledOrgs>
    );
  }

  private renderNewOrgForm() {
    const { showNewOrgForm, newOrg } = this.state;

    if (showNewOrgForm && !!newOrg) {
      return (
        <EditOrgFormWithModal
          visible={showNewOrgForm}
          onSubmit={this.onCreateOrg}
          onClose={this.toggleNewOrgForm}
          customId={newOrg.customId}
          initialValues={newOrg}
          operationID={addBlockOperationID}
          title="Create Organization"
          submitLabel="Create Organization"
        />
      );
    }

    return null;
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
