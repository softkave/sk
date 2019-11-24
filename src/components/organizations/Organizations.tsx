import React from "react";
import { useDispatch, useStore } from "react-redux";
import { useHistory } from "react-router";
import { IBlock } from "../../models/block/block";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import loadRootBlocksOperationFunc from "../../redux/operations/block/loadRootBlock";
import { loadRootBlocksOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import GeneralError from "../GeneralError";
import OperationHelper, {
  IOperationHelperDerivedProps
} from "../utils/OperationHelper";
import OrganizationList from "./OrganizationList";

const OrganizationsMain: React.SFC<{}> = props => {
  const history = useHistory();
  const store = useStore<IReduxState>();
  const dispatch = useDispatch();
  const state = store.getState();
  const user = getSignedInUserRequired(state);
  const organizations = getBlocksAsArray(state, user.orgs);

  // TODO: Trim organizations not found when root blocks are loaded ( in the loadRootBlocks function )
  // TODO: Should we use length comparison or operation status?
  const areOrganizationsLoaded = organizations.length === user.orgs.length;

  const onClickOrganization = (organization: IBlock) => {
    const organizationPath = `${window.location.pathname}/${organization.customId}`;
    history.push(organizationPath);
  };

  const loadOrganizations = (helperProps: IOperationHelperDerivedProps) => {
    const shouldLoadOrganizations = () => {
      return (
        !areOrganizationsLoaded &&
        !(helperProps.isLoading || helperProps.isError)
      );
    };

    if (shouldLoadOrganizations()) {
      loadRootBlocksOperationFunc(state, dispatch);
    }
  };

  const render = () => {
    if (areOrganizationsLoaded) {
      return (
        <OrganizationList orgs={organizations} onClick={onClickOrganization} />
      );
    }

    return <GeneralError />;
  };

  return (
    <OperationHelper
      operationID={loadRootBlocksOperationID}
      render={render}
      loadFunc={loadOrganizations}
    />
  );
};

export default OrganizationsMain;
