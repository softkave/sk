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
import { IAppState } from "../../redux/store";
import { getDefaultBoardViewType } from "../board/utils";
import SingleOperationHelper, {
  ISingleOperationHelperDerivedProps,
} from "../OperationHelper";
import StyledContainer from "../styled/Container";
import OrganizationContainer from "./OrganizationContainer";
import OrganizationList from "./OrganizationList";

// TODO: write a script to delete stale or blocks not found and their refs ( their ids ) in other documents
// TODO: remove all TODOs to a separate file or find a way to remove them from the final production build,
//  it's showing up in the built code
// TODO: find a way or config to only import the ant icons you use, all of them are getting pulled in into the bundle

const OrganizationListContainer: React.FC<{}> = () => {
  const history = useHistory();
  const user = useSelector(getSignedInUserRequired);
  const organizations = useSelector<IAppState, IBlock[]>((state) =>
    getBlocksAsArray(state, user.orgs)
  );

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
          s={{
            justifyContent: "center",
            width: "100%",
            padding: "32px 16px",
            paddingTop: 0,
          }}
        >
          <OrganizationList
            orgs={organizations}
            onClick={onClickOrganization}
          />
        </StyledContainer>
      );
    };

    return (
      <Switch>
        <Route exact path="/app/organizations" render={renderOrganizations} />
        <Route
          path="/app/organizations/:organizationID"
          component={OrganizationContainer}
        />
      </Switch>
    );
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
