import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { BlockType, IBlock } from "../../models/block/block";
import { addBlockOperationAction } from "../../redux/operations/block/addBlock";
import { updateBlockOperationAction } from "../../redux/operations/block/updateBlock";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import getNewBlock from "../block/getNewBlock";
import useOperation, { getOperationStats } from "../hooks/useOperation";
import Org, { IOrgValues } from "./Org";

export interface IOrgContainerProps {
  onClose: () => void;

  block?: IBlock;
}

const OrgContainer: React.FC<IOrgContainerProps> = (props) => {
  const { onClose } = props;
  const dispatch: AppDispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(SessionSelectors.getSignedInUserRequired);
  const [block, setBlock] = React.useState<IBlock>(
    props.block || getNewBlock(user, BlockType.Org)
  );

  const opStat = useOperation();

  const errors = opStat.error
    ? flattenErrorListWithDepthInfinite(opStat.error)
    : undefined;

  const onSubmit = async (values: IOrgValues) => {
    const data = { ...block, ...values };
    setBlock(data);
    const result = props.block
      ? await dispatch(
          updateBlockOperationAction({ block, data, opId: opStat.opId })
        )
      : await dispatch(addBlockOperationAction({ block, opId: opStat.opId }));
    const op = unwrapResult(result);

    if (!op) {
      return;
    }

    const createOrgOpStat = getOperationStats(op);

    if (!props.block) {
      if (createOrgOpStat.isCompleted) {
        message.success("Org created successfully");
        history.push(`/app/organizations/${data.customId}`);
      } else if (createOrgOpStat.isError) {
        message.error("Error creating org");
      }
    } else {
      if (createOrgOpStat.isCompleted) {
        message.success("Org updated successfully");
        onClose();
      } else if (createOrgOpStat.isError) {
        message.error("Error updating org");
      }
    }
  };

  return (
    <Org
      formOnly={!props.block}
      org={props.block} // props.block not block, because it's used to determine if it's a new block or not
      value={block as any}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={opStat.isLoading}
      errors={errors}
    />
  );
};

export default React.memo(OrgContainer);
