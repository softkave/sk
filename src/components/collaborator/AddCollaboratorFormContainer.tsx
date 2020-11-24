import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import { IUser } from "../../models/user/user";
import BlockSelectors from "../../redux/blocks/selectors";
import NotificationSelectors from "../../redux/notifications/selectors";
import { addCollaboratorsOperationAction } from "../../redux/operations/block/addCollaborators";
import { AppDispatch, IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import { flattenErrorList } from "../../utils/utils";
import useOperation, { getOpData } from "../hooks/useOperation";
import AddCollaboratorForm, {
    IAddCollaboratorFormValues,
} from "./AddCollaboratorForm";

export interface IAddCollaboratorFormContainerProps {
    orgId: string;
    onClose: () => void;
}

const AddCollaboratorFormContainer: React.FC<IAddCollaboratorFormContainerProps> = (
    props
) => {
    const { onClose, orgId } = props;
    const dispatch: AppDispatch = useDispatch();

    const organizationId = orgId;

    const organization = useSelector<IAppState, IBlock>(
        (state) => BlockSelectors.getBlock(state, organizationId)!
    );

    const collaboratorIds = Array.isArray(organization.collaborators)
        ? organization.collaborators
        : [];

    const collaborators = useSelector<IAppState, IUser[]>((state) =>
        UserSelectors.getUsers(state, collaboratorIds)
    );

    const requestIds = Array.isArray(organization.notifications)
        ? organization.notifications
        : [];

    const requests = useSelector<IAppState, INotification[]>((state) =>
        NotificationSelectors.getNotifications(state, requestIds)
    );

    const [data, setData] = React.useState<IAddCollaboratorFormValues>({
        collaborators: [],
    });

    const operationStatus = useOperation();

    const errors = operationStatus.error
        ? flattenErrorList(operationStatus.error)
        : undefined;

    const onSubmit = async (values: IAddCollaboratorFormValues) => {
        setData(data);

        const result = await dispatch(
            addCollaboratorsOperationAction({
                blockId: organization.customId,
                ...values,
                opId: operationStatus.opId,
            })
        );

        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const opStat = getOpData(op);

        if (opStat.isCompleted) {
            onClose();
            message.success(
                `Request${
                    values.collaborators.length > 1 ? "s" : ""
                } sent successfully`
            );

            // TODO: we need a loadBlockNotifications func
            // TODO: most likely not needed anymore with new sockets implementation
            // dispatch(loadBoardDataOperationAction({ block: organization }));
        } else if (opStat.isError) {
            message.error(
                `Error sending request${
                    values.collaborators.length > 1 ? "s" : ""
                }`
            );
        }
    };

    return (
        <AddCollaboratorForm
            existingCollaborationRequests={requests}
            existingCollaborators={collaborators}
            value={data}
            onClose={onClose}
            onSubmit={onSubmit}
            isSubmitting={operationStatus.isLoading}
            errors={errors}
        />
    );
};

export default React.memo(AddCollaboratorFormContainer);
