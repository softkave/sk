import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { IBlock } from "../../models/block/block";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import { setKeyValue } from "../../redux/key-value/actions";
import { KeyValueProperties } from "../../redux/key-value/reducer";
import loadRootBlocksOperationFunc from "../../redux/operations/block/loadRootBlocks";
import OperationType from "../../redux/operations/OperationType";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IAppState } from "../../redux/store";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import LayoutMenuOrgsSection from "./LayoutMenuOrgsSection";

const LayoutMenuOrgsSectionContainer: React.FC<{}> = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector(getSignedInUserRequired);
  const orgs = useSelector<IAppState, IBlock[]>((state) =>
    getBlocksAsArray(
      state,
      user.orgs.map((org) => org.customId)
    )
  );

  const loadOrgs = React.useCallback((loadOrgsProps: IUseOperationStatus) => {
    const operation = loadOrgsProps.operation;
    const shouldLoad = !operation;

    if (shouldLoad) {
      loadRootBlocksOperationFunc();
    }
  }, []);

  const onAddOrg = React.useCallback(() => {
    dispatch(setKeyValue([KeyValueProperties.ShowNewOrgForm, true]));
  }, []);

  const onSelectOrg = React.useCallback((org: IBlock) => {
    history.push(`/app/organizations/${org.customId}`);
  }, []);

  const op = useOperation(
    {
      operationType: OperationType.LoadRootBlocks,
    },
    loadOrgs
  );

  return (
    <LayoutMenuOrgsSection
      isLoading={op.isLoading}
      // errorMessage={op.error}
      orgs={orgs}
      onAddOrg={onAddOrg}
      onSelectOrg={onSelectOrg}
    />
  );
};

export default React.memo(LayoutMenuOrgsSectionContainer);
