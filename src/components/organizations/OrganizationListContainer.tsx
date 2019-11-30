import styled from "@emotion/styled";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { Route, Switch } from "react-router-dom";
import { IBlock } from "../../models/block/block";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import loadRootBlocksOperationFunc from "../../redux/operations/block/loadRootBlock";
import { loadRootBlocksOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import GeneralError from "../GeneralError";
import OH, { IOHDerivedProps } from "../utils/OH";
import OrganizationContainer from "./OrganizationContainer";
import OrganizationList from "./OrganizationList";

interface IRouteMatchParams {
  organizationID?: string;
}

const OrganizationListContainer: React.SFC<{}> = props => {
  const history = useHistory();
  const organizationPath = "/app/organizations/:organizationID";
  const selectedOrganizationRouteMatch = useRouteMatch<IRouteMatchParams>(
    organizationPath
  );
  const organizationID =
    selectedOrganizationRouteMatch &&
    selectedOrganizationRouteMatch.params.organizationID;
  const user = useSelector(getSignedInUserRequired);
  const organizations = useSelector<IReduxState, IBlock[]>(state =>
    getBlocksAsArray(state, user.orgs)
  );

  // TODO: Trim organizations not found when root blocks are loaded ( in the loadRootBlocks function )
  // TODO: Should we use length comparison or operation status?
  const areOrganizationsLoaded = organizations.length === user.orgs.length;

  const onClickOrganization = (organization: IBlock) => {
    const selectedOrganizationPath = `${window.location.pathname}/${organization.customId}`;
    history.push(selectedOrganizationPath);
  };

  const loadOrganizations = (helperProps: IOHDerivedProps) => {
    const shouldLoadOrganizations = () => {
      return !!!helperProps.operation;
    };

    if (shouldLoadOrganizations()) {
      loadRootBlocksOperationFunc();
    }
  };

  const render = () => {
    const renderOrganizations = () => {
      return (
        <StyledOrganizationsListContainer>
          <OrganizationList
            orgs={organizations}
            onClick={onClickOrganization}
          />
        </StyledOrganizationsListContainer>
      );
    };

    if (areOrganizationsLoaded) {
      return (
        <Switch>
          <Route exact path="/app/organizations" render={renderOrganizations} />
          <Route
            path="/app/organizations/:organizationID"
            component={OrganizationContainer}
          />
        </Switch>
      );
    }

    return <GeneralError />;
  };

  return (
    <OH
      operationID={loadRootBlocksOperationID}
      render={render}
      loadFunc={loadOrganizations}
    />
  );
};

export default OrganizationListContainer;

const StyledOrganizationsListContainer = styled.div({
  width: "300px"
});
