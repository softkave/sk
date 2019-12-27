import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import loadBlockChildrenOperationFunc from "../../redux/operations/block/loadBlockChildren";
import { getBlockChildrenOperationID } from "../../redux/operations/operationIDs";
import { IReduxState } from "../../redux/store";
import GeneralError from "../GeneralError";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import Loading from "../Loading";
import StyledContainer from "../styled/Container";

export interface IBlockChildrenProps {
  parent: IBlock;
  getChildrenIDs: () => string[];
  render: (blocks: IBlock[]) => React.ReactNode;
}

const BlockChildren: React.FC<IBlockChildrenProps> = props => {
  const { parent, render, getChildrenIDs } = props;
  const blockIDs = getChildrenIDs();
  const blocks = useSelector<IReduxState, IBlock[]>(state =>
    getBlocksAsArray(state, blockIDs)
  );

  const loadParentChildren = (loadProps: IUseOperationStatus) => {
    if (!!!loadProps.operation) {
      loadBlockChildrenOperationFunc({ block: parent });
    }
  };

  const loadParentChildrenStatus = useOperation(
    { operationID: getBlockChildrenOperationID, resourceID: parent.customId },
    loadParentChildren
  );

  if (
    loadParentChildrenStatus.isLoading ||
    !!!loadParentChildrenStatus.operation
  ) {
    return (
      <StyledContainer
        s={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Loading />
      </StyledContainer>
    );
  } else if (loadParentChildrenStatus.error) {
    return (
      <StyledContainer
        s={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px"
        }}
      >
        <GeneralError error={loadParentChildrenStatus.error} />
      </StyledContainer>
    );
  }

  return <React.Fragment>{render(blocks)}</React.Fragment>;
};

export default BlockChildren;
