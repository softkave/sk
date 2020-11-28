import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import { IUser } from "../../models/user/user";
import { IAddCollaboratorEndpointErrors } from "../../net/block/types";
import BlockSelectors from "../../redux/blocks/selectors";
import NotificationSelectors from "../../redux/notifications/selectors";
import { addCollaboratorsOperationAction } from "../../redux/operations/block/addCollaborators";
import { AppDispatch, IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import { flattenErrorList } from "../../utils/utils";
import { getOpData } from "../hooks/useOperation";
import { IFormError } from "../utilities/types";
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

    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState<
        IFormError<IAddCollaboratorEndpointErrors> | undefined
    >();

    const onSubmit = async (values: IAddCollaboratorFormValues) => {
        setLoading(true);
        setData(data);

        const result = await dispatch(
            addCollaboratorsOperationAction({
                deleteOpOnComplete: true,
                blockId: organization.customId,
                ...values,
            })
        );

        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const opData = getOpData(op);

        setLoading(false);

        if (opData.isCompleted) {
            onClose();
            message.success(
                `Request${
                    values.collaborators.length > 1 ? "s" : ""
                } sent successfully.`
            );
        } else if (opData.isError) {
            const flattenedErrors = flattenErrorList(opData.error);
            setErrors({
                errors: flattenedErrors,
                errorList: opData.error,
            });

            message.error(
                `Error sending request${
                    values.collaborators.length > 1 ? "s" : ""
                }.`
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
            isSubmitting={loading}
            errors={errors?.errors}
        />
    );
};

export default React.memo(AddCollaboratorFormContainer);
