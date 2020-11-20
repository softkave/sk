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
import OperationActions from "../../redux/operations/actions";
import { addBlockOpAction } from "../../redux/operations/block/addBlock";
import { updateBlockOpAction } from "../../redux/operations/block/updateBlock";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import { getOpData } from "../hooks/useOperation";
import { IFormError } from "../utilities/types";
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
    const [blockData, setBlock] = React.useState<IFormBlock>(
        () => props.block || newFormBlock(user, BlockType.Org)
    );

    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState<
        IFormError<IAddBlockEndpointErrors["block"]> | undefined
    >();

    const onSubmit = async (values: IEditOrgFormValues) => {
        const data = { ...blockData, ...values };

        setLoading(true);
        setBlock(data);

        const result = props.block
            ? await dispatch(
                  updateBlockOpAction({
                      blockId: props.block.customId,
                      data,
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
                message.error("Error updating organization");
            } else {
                message.error("Error creating organization");
            }

            const flattenedErrors = flattenErrorList(opData.error);
            setErrors({
                errors: flattenedErrors,
                errorList: opData.error,
            });
        } else {
            if (props.block) {
                message.success("Organization updated successfully");
            } else {
                message.success("Organization created successfully");
                history.push(`/app/orgs/${block!.customId}`);
                onClose();
            }

            dispatch(OperationActions.deleteOperation(opData.opId));
        }
    };

    return (
        <EditOrgForm
            org={props.block}
            value={blockData as any}
            onClose={onClose}
            onSubmit={onSubmit}
            isSubmitting={loading}
            errors={errors?.errors}
        />
    );
};

export default React.memo(EditOrgFormContainer);
