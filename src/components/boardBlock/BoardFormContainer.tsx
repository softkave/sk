import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { BlockType, IBlock } from "../../models/block/block";
import BlockSelectors from "../../redux/blocks/selectors";
import { addBlockOperationAction } from "../../redux/operations/block/addBlock";
import { updateBlockOperationAction } from "../../redux/operations/block/updateBlock";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import getNewBlock from "../block/getNewBlock";
import useOperation, { getOperationStats } from "../hooks/useOperation";
import BoardForm, { IBoardFormValues } from "./BoardForm";

export interface IBoardFormContainerProps {
    orgId: string;
    onClose: () => void;

    block?: IBlock;
}

const BoardFormContainer: React.FC<IBoardFormContainerProps> = (props) => {
    const { onClose, orgId } = props;
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(SessionSelectors.assertGetUser);
    const org = useSelector<IAppState, IBlock>((state) => {
        return BlockSelectors.getBlock(state, orgId)!;
    });

    const [block, setBlock] = React.useState<IBlock>(
        props.block || getNewBlock(user, BlockType.Board, org)
    );

    const operationStatus = useOperation();
    const errors = operationStatus.error
        ? flattenErrorListWithDepthInfinite(operationStatus.error)
        : undefined;

    const onSubmit = async (values: IBoardFormValues) => {
        const data = { ...block, ...values };
        setBlock(data);

        const result = props.block
            ? await dispatch(
                  updateBlockOperationAction({
                      block,
                      data,
                      opId: operationStatus.opId,
                  })
              )
            : await dispatch(
                  addBlockOperationAction({
                      block: data,
                      opId: operationStatus.opId,
                  })
              );
        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const opStat = getOperationStats(op);

        if (!props.block) {
            if (opStat.isCompleted) {
                message.success("Board created successfully");
                history.push(
                    `/app/organizations/${data.parent}/boards/${data.customId}`
                );
                onClose();
            } else if (opStat.isError) {
                message.error("Error creating board");
            }
        } else {
            if (opStat.isCompleted) {
                message.success("Board updated successfully");
            } else if (opStat.isError) {
                message.error("Error updating board");
            }
        }
    };

    return (
        <BoardForm
            parent={org}
            value={block as any}
            onClose={onClose}
            board={props.block}
            onSubmit={onSubmit}
            isSubmitting={operationStatus.isLoading}
            errors={errors}
        />
    );
};

export default React.memo(BoardFormContainer);
