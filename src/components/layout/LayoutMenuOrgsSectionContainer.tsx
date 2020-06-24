import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { IBlock } from "../../models/block/block";
import BlockSelectors from "../../redux/blocks/selectors";
import KeyValueActions from "../../redux/key-value/actions";
import { KeyValueKeys } from "../../redux/key-value/types";
import { loadRootBlocksOperationAction } from "../../redux/operations/block/loadRootBlocks";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import { newId } from "../../utils/utils";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import LayoutMenuOrgsSection from "./LayoutMenuOrgsSection";

const LayoutMenuOrgsSectionContainer: React.FC<{}> = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const history = useHistory();
  const [opId] = React.useState(() => newId());
  const user = useSelector(SessionSelectors.getSignedInUserRequired);
  const orgs = useSelector<IAppState, IBlock[]>((state) =>
    BlockSelectors.getBlocks(
      state,
      user.orgs.map((org) => org.customId)
    )
  );

  const loadOrgs = React.useCallback((loadOrgsProps: IUseOperationStatus) => {
    const operation = loadOrgsProps.operation;
    const shouldLoad = !operation;

    if (shouldLoad) {
      dispatch(loadRootBlocksOperationAction({ opId: loadOrgsProps.opId }));
    }
  }, []);

  const onAddOrg = React.useCallback(() => {
    dispatch(
      KeyValueActions.setKey({ key: KeyValueKeys.ShowNewOrgForm, value: true })
    );
  }, []);

  const onSelectOrg = React.useCallback((org: IBlock) => {
    history.push(`/app/organizations/${org.customId}`);
  }, []);

  const op = useOperation({ id: opId }, loadOrgs);

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
