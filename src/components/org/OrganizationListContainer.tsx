import path from "path";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Route, Switch } from "react-router-dom";
import { IBlock } from "../../models/block/block";
import BlockSelectors from "../../redux/blocks/selectors";
import { loadRootBlocksOperationAction } from "../../redux/operations/block/loadRootBlocks";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import { newId } from "../../utils/utils";
import GeneralErrorList from "../GeneralErrorList";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import LayoutMenuOrgsSectionContainer from "../layout/LayoutMenuOrgsSectionContainer";
import StyledContainer from "../styled/Container";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import OrganizationContainer from "./OrganizationContainer";
import OrganizationList from "./OrganizationList";

// TODO: write a script to delete stale or blocks not found and their refs ( their ids ) in other documents
// TODO: remove all TODOs to a separate file or find a way to remove them from the final production build,
//  it's showing up in the built code
// TODO: find a way or config to only import the ant icons you use, all of them are getting pulled in into the bundle

const OrganizationListContainer: React.FC<{}> = () => {
  const dispatch: AppDispatch = useDispatch();
  const [opId] = React.useState(() => newId());

  const loadOrganizations = (helperProps: IUseOperationStatus) => {
    if (!helperProps.operation) {
      dispatch(loadRootBlocksOperationAction({ opId: helperProps.opId }));
    }
  };

  const loadOrgsOpStat = useOperation({ id: opId }, loadOrganizations);

  const render = () => {
    const renderOrganizations = () => {
      return (
        <StyledContainer s={{ paddingTop: "16px", flex: 1 }}>
          <LayoutMenuOrgsSectionContainer />
        </StyledContainer>
      );
    };

    return (
      <Switch>
        <Route exact path="/app/organizations" render={renderOrganizations} />
        <Route
          path="/app/organizations/:organizationId"
          component={OrganizationContainer}
        />
      </Switch>
    );
  };

  if (loadOrgsOpStat.isLoading || !loadOrgsOpStat.operation) {
    return <LoadingEllipsis />;
  } else if (loadOrgsOpStat.isError) {
    return <GeneralErrorList fill errors={loadOrgsOpStat.error} />;
  }

  return render();
};

export default OrganizationListContainer;
