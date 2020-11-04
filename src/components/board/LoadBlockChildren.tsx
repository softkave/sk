import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import BlockSelectors from "../../redux/blocks/selectors";
import {
    ILoadBlockChildrenOpMeta,
    loadBlockChildrenOpAction,
} from "../../redux/operations/block/loadBlockChildren";
import OperationType from "../../redux/operations/OperationType";
import { AppDispatch, IAppState } from "../../redux/types";
import GeneralErrorList from "../GeneralErrorList";
import useOperation, { IOperationDerivedData } from "../hooks/useOperation";
import LoadingEllipsis from "../utilities/LoadingEllipsis";

export interface ILoadBlockChildrenProps {
    parent: IBlock;
    type: BlockType;
    render: (blocks: IBlock[]) => React.ReactNode;
}

const LoadBlockChildren: React.FC<ILoadBlockChildrenProps> = (props) => {
    const { parent, render, type } = props;
    const dispatch: AppDispatch = useDispatch();
    const blocks = useSelector<IAppState, IBlock[]>((state) =>
        BlockSelectors.getBlockChildren(state, parent, type)
    );

    const loadChildren = React.useCallback(
        (loadProps: IOperationDerivedData) => {
            if (!loadProps.operation) {
                console.log({ loadProps });
                dispatch(
                    loadBlockChildrenOpAction({
                        block: parent,
                        typeList: [type],
                        opId: loadProps.opId,
                    })
                );
            }
        },
        [dispatch, parent, type]
    );

    const op = useOperation(
        {
            filter: (operation) => {
                const opMeta = (operation.meta as ILoadBlockChildrenOpMeta)
                    ?.typeList;

                if (!opMeta) {
                    return false;
                }

                return (
                    operation.resourceId === parent.customId &&
                    operation.operationType ===
                        OperationType.LOAD_BLOCK_CHILDREN &&
                    opMeta.includes(type)
                );
            },
        },
        loadChildren,
        { deleteManagedOperationOnUnmount: false }
    );

    if (op.isCompleted) {
        return <React.Fragment>{render(blocks)}</React.Fragment>;
    }

    if (op.isLoading || !!!op.operation) {
        return <LoadingEllipsis />;
    } else if (op.error) {
        return <GeneralErrorList errors={op.error} />;
    }

    return <React.Fragment>{render(blocks)}</React.Fragment>;
};

export default React.memo(LoadBlockChildren);
