import path from "path";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Route, Switch } from "react-router-dom";
import { IBlock } from "../../models/block/block";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import loadRootBlocksOperationFunc from "../../redux/operations/block/loadRootBlocks";
import { loadRootBlocksOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { getDefaultBoardViewType } from "../board/utils";
import GeneralError from "../GeneralError";
import SingleOperationHelper, {
  ISingleOperationHelperDerivedProps,
} from "../OperationHelper";
import StyledContainer from "../styled/Container";
import OrganizationContainer from "./OrganizationContainer";
import OrganizationList from "./OrganizationList";

const OrganizationListContainer: React.FC<{}> = () => {
  const history = useHistory();
  const user = useSelector(getSignedInUserRequired);
  const organizations = useSelector<IReduxState, IBlock[]>((state) =>
    getBlocksAsArray(state, user.orgs)
  );

  // TODO: Trim organizations not found when root blocks are loaded ( in the loadRootBlocks function )
  // TODO: Should we use length comparison or operation status?
  const areOrganizationsLoaded = organizations.length === user.orgs.length;

  const onClickOrganization = (organization: IBlock) => {
    const bt = getDefaultBoardViewType(organization);
    const routePath = path.normalize(
      window.location.pathname + "/" + organization.customId + `/tasks?bt=${bt}`
    );

    history.push(routePath);
  };

  const loadOrganizations = (
    helperProps: ISingleOperationHelperDerivedProps
  ) => {
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
        <StyledContainer
          s={{ justifyContent: "center", width: "100%", padding: "0 16px" }}
        >
          <OrganizationList
            orgs={organizations}
            onClick={onClickOrganization}
          />
        </StyledContainer>
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
    <SingleOperationHelper
      operationID={loadRootBlocksOperationID}
      render={render}
      loadFunc={loadOrganizations}
    />
  );
};

export default OrganizationListContainer;
