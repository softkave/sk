import React from "react";
import {  useSelector } from "react-redux";
import { useHistory } from "react-router";
import styled from "@emotion/styled"
import { IBlock } from "../../models/block/block";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import loadRootBlocksOperationFunc from "../../redux/operations/block/loadRootBlock";
import { loadRootBlocksOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import GeneralError from "../GeneralError";
import OrganizationList from "./OrganizationList";
import OH, { IOHDerivedProps } from "../utils/OH";

const OrganizationListContainer: React.SFC<{}> = props => {
  const history = useHistory();
  const user = useSelector(getSignedInUserRequired);
  const organizations = useSelector<IReduxState, IBlock[]>(state =>
    getBlocksAsArray(state, user.orgs)
  );

  // TODO: Trim organizations not found when root blocks are loaded ( in the loadRootBlocks function )
  // TODO: Should we use length comparison or operation status?
  const areOrganizationsLoaded = organizations.length === user.orgs.length;

  const onClickOrganization = (organization: IBlock) => {
    const organizationPath = `${window.location.pathname}/${organization.customId}`;
    history.push(organizationPath);
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
    if (areOrganizationsLoaded) {
      return (
        <StyledOrganizationsListContainer><OrganizationList orgs={organizations} onClick={onClickOrganization} /></StyledOrganizationsListContainer>
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
})
