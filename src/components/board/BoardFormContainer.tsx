import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
    BlockType,
    IBlock,
    IFormBlock,
    newFormBlock,
} from "../../models/block/block";
import { IAddBlockEndpointErrors } from "../../net/block/types";
import BlockSelectors from "../../redux/blocks/selectors";
import OperationActions from "../../redux/operations/actions";
import { addBlockOpAction } from "../../redux/operations/block/addBlock";
import { updateBlockOpAction } from "../../redux/operations/block/updateBlock";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import BoardForm, { IBoardFormValues } from "../board/BoardForm";
import { getOpData } from "../hooks/useOperation";
import { IFormError } from "../utilities/types";

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

    const [blockData, setBlock] = React.useState<IFormBlock>(
        () => props.block || newFormBlock(user, BlockType.Board, org)
    );

    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState<
        IFormError<IAddBlockEndpointErrors["block"]> | undefined
    >();

    const onSubmit = async (values: IBoardFormValues) => {
        const data = { ...blockData, ...values };

        setLoading(true);
        setBlock(data);

        const result = props.block
            ? await dispatch(
                  updateBlockOpAction({
                      data,
                      blockId: props.block.customId,
                  })
              )
            : await dispatch(
                  addBlockOpAction({
                      block: data,
                  })
              );

        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const opData = getOpData(op);
        const block = op.status.data;

        setLoading(false);

        if (opData.error) {
            if (props.block) {
                message.error("Error updating board");
            } else {
                message.error("Error creating board");
            }

            const flattenedErrors = flattenErrorList(opData.error);
            setErrors({
                errors: flattenedErrors,
                errorList: opData.error,
            });
        } else {
            if (props.block) {
                message.success("Board updated successfully");
            } else {
                message.success("Board created successfully");
                history.push(`/app/orgs/${block!.customId}`);
                onClose();
            }

            dispatch(OperationActions.deleteOperation(opData.opId));
        }
    };

    return (
        <BoardForm
            parent={org}
            value={blockData as any}
            onClose={onClose}
            board={props.block}
            onSubmit={onSubmit}
            isSubmitting={loading}
            errors={errors?.errors}
        />
    );
};

export default React.memo(BoardFormContainer);
