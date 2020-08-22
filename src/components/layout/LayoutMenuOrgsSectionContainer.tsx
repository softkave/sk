import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { IBlock } from "../../models/block/block";
import BlockSelectors from "../../redux/blocks/selectors";
import KeyValueActions from "../../redux/key-value/actions";
import { KeyValueKeys } from "../../redux/key-value/types";
import { loadRootBlocksOperationAction } from "../../redux/operations/block/loadRootBlocks";
import OperationType from "../../redux/operations/OperationType";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import { newId } from "../../utils/utils";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import LayoutMenuOrgsSection from "./LayoutMenuOrgsSection";

const LayoutMenuOrgsSectionContainer: React.FC<{}> = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(SessionSelectors.getSignedInUserRequired);
  const orgs = useSelector<IAppState, IBlock[]>((state) =>
    BlockSelectors.getBlocks(
      state,
      user.orgs.map((org) => org.customId)
    )
  );

  const orgRouteMatch = useRouteMatch<{ orgId: string }>(
    "/app/organizations/:orgId"
  );

  const loadOrgs = React.useCallback(
    async (loadOrgsProps: IUseOperationStatus) => {
      const operation = loadOrgsProps.operation;
      const shouldLoad = !operation;

      if (shouldLoad) {
        await dispatch(
          loadRootBlocksOperationAction({ opId: loadOrgsProps.opId })
        );
        dispatch(
          KeyValueActions.setKey({
            key: KeyValueKeys.RootBlocksLoaded,
            value: true,
          })
        );
      }
    },
    [dispatch]
  );

  const op = useOperation({ type: OperationType.LoadRootBlocks }, loadOrgs, {
    deleteManagedOperationOnUnmount: false,
  });

  const onAddOrg = React.useCallback(() => {
    dispatch(
      KeyValueActions.setKey({ key: KeyValueKeys.ShowNewOrgForm, value: true })
    );
  }, [dispatch]);

  const onSelectOrg = React.useCallback(
    (org: IBlock) => {
      history.push(`/app/organizations/${org.customId}`);
    },
    [history]
  );

  return (
    <LayoutMenuOrgsSection
      isLoading={op.isLoading}
      errorMessage={op.error ? "Error loading orgs" : undefined}
      orgs={orgs}
      onAddOrg={onAddOrg}
      onSelectOrg={onSelectOrg}
      orgId={orgRouteMatch?.params.orgId}
    />
  );
};

export default React.memo(LayoutMenuOrgsSectionContainer);
