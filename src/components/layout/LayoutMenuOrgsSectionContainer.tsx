import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import loadRootBlocksOperationFunc from "../../redux/operations/block/loadRootBlocks";
import OperationIds from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IAppState } from "../../redux/store";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import LayoutMenuOrgsSection from "./LayoutMenuOrgsSection";

const LayoutMenuOrgsSectionContainer: React.FC<{}> = (props) => {
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

  const onAddOrg = React.useCallback(() => {}, []);

  const onSelectOrg = React.useCallback((org: IBlock) => {}, []);

  const op = useOperation(
    {
      operationId: OperationIds.loadRootBlocks,
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
