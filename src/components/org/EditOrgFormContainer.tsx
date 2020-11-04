import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { BlockType, IBlock } from "../../models/block/block";
import { addBlockOpAction } from "../../redux/operations/block/addBlock";
import { updateBlockOpAction } from "../../redux/operations/block/updateBlock";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import getNewBlock from "../block/getNewBlock";
import useOperation, { getOpStats } from "../hooks/useOperation";
import EditOrgForm, { IEditOrgFormValues } from "./EditOrgForm";

export interface IEditOrgFormContainerProps {
    onClose: () => void;

    block?: IBlock;
}

const EditOrgFormContainer: React.FC<IEditOrgFormContainerProps> = (props) => {
    const { onClose } = props;
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(SessionSelectors.assertGetUser);
    const [block, setBlock] = React.useState<IBlock>(
        props.block || getNewBlock(user, BlockType.Org)
    );

    const operationStatus = useOperation({ resourceId: block.customId });

    const errors = operationStatus.error
        ? flattenErrorListWithDepthInfinite(operationStatus.error)
        : undefined;

    React.useEffect(() => {
        if (operationStatus.isCompleted && !props.block) {
            onClose();
        }
    });

    const onSubmit = async (values: IEditOrgFormValues) => {
        const data = { ...block, ...values };
        setBlock(data);

        const result = props.block
            ? await dispatch(
                  updateBlockOpAction({
                      block,
                      data,
                      opId: operationStatus.opId,
                  })
              )
            : await dispatch(
                  addBlockOpAction({
                      block: data,
                      opId: operationStatus.opId,
                  })
              );
        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const createOrgOpStat = getOpStats(op);

        if (!props.block) {
            if (createOrgOpStat.isCompleted) {
                message.success("Org created successfully");
                history.push(`/app/orgs/${data.customId}`);
                onClose();
            }
        } else {
            if (createOrgOpStat.isCompleted) {
                message.success("Org updated successfully");
            } else if (createOrgOpStat.isError) {
                message.error("Error updating org");
            }
        }
    };

    return (
        <EditOrgForm
            org={props.block} // props.block not block, because it's used to determine if it's a new block or not
            value={block as any}
            onClose={onClose}
            onSubmit={onSubmit}
            isSubmitting={operationStatus.isLoading}
            errors={errors}
        />
    );
};

export default React.memo(EditOrgFormContainer);
