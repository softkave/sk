import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    IPermissionGroup,
    IPermissionGroupInput,
} from "../../models/access-control/types";
import { IBlock } from "../../models/block/block";
import { ICollaborator } from "../../models/user/user";
import { IAddPermissionGroupsAPIErrors } from "../../net/access-control/fns";
import { addPermissionGroupsOpAction } from "../../redux/operations/accessControl/addPermissionGroups";
import { updatePermissionGroupsOpAction } from "../../redux/operations/accessControl/updatePermissionGroups";
import OperationActions from "../../redux/operations/actions";
import PermissionGroupsSelectors from "../../redux/permissionGroups/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import { flattenErrorList, indexArray } from "../../utils/utils";
import { getOpData } from "../hooks/useOperation";
import { IFormError } from "../utilities/types";
import PermissionGroupForm from "./PermissionGroupForm";

export interface IPermissionGroupFormContainerProps {
    blockId: string;
    org: IBlock;
    onClose: () => void;
    permissionGroup?: IPermissionGroup;
    assignedUsers?: ICollaborator[];
}

function initialValues(prev?: IPermissionGroup): IPermissionGroupInput {
    return {
        name: "",
        description: "",
        prevId: prev?.customId,
        users: [],
    };
}

function fromExisting(
    pg: IPermissionGroup,
    users: ICollaborator[]
): IPermissionGroupInput {
    return {
        name: pg.name,
        description: pg.description,
        nextId: pg.nextId,
        prevId: pg.prevId,
        users: users.map((user) => user.customId),
    };
}

const EditOrgFormContainer: React.FC<IPermissionGroupFormContainerProps> = (
    props
) => {
    const { blockId, org, onClose } = props;

    const dispatch: AppDispatch = useDispatch();

    const pgs = useSelector<IAppState, IPermissionGroup[]>((state) => {
        return PermissionGroupsSelectors.filter(
            state,
            (pg) => pg.resourceId === blockId
        );
    });

    const collaborators = useSelector<IAppState, ICollaborator[]>((state) => {
        return UserSelectors.getUsers(state, org.collaborators || []);
    });

    const collaboratorsMap = indexArray(collaborators, { path: "customId" });

    const [data, setData] = React.useState<IPermissionGroupInput>(() =>
        props.permissionGroup
            ? fromExisting(props.permissionGroup, props.assignedUsers || [])
            : initialValues()
    );

    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState<
        | IFormError<IAddPermissionGroupsAPIErrors["permissionGroups"]>
        | undefined
    >();

    const onSubmit = async (values: IPermissionGroupInput) => {
        const d = { ...data, ...values };

        setLoading(true);
        setData(d);

        const result = props.permissionGroup
            ? await dispatch(
                  updatePermissionGroupsOpAction({
                      blockId,
                      permissionGroups: [
                          { customId: props.permissionGroup.customId, data: d },
                      ],
                      deleteOpOnComplete: true,
                  })
              )
            : await dispatch(
                  addPermissionGroupsOpAction({
                      blockId,
                      // TODO: tempId
                      permissionGroups: [{ tempId: "", data: d }],
                      deleteOpOnComplete: true,
                  })
              );

        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const opData = getOpData(op);

        setLoading(false);

        if (opData.error) {
            if (props.permissionGroup) {
                message.error("Error updating permission group");
            } else {
                message.error("Error creating permission group");
            }

            const flattenedErrors = flattenErrorList(opData.error);
            setErrors({
                errors: flattenedErrors,
                errorList: opData.error,
            });
        } else {
            if (props.permissionGroup) {
                message.success("Permission group updated successfully");
            } else {
                message.success("Permission group created successfully");
                // onClose();
            }

            dispatch(OperationActions.deleteOperation(opData.opId));
        }
    };

    return (
        <PermissionGroupForm
            collaborators={collaborators}
            collaboratorsMap={collaboratorsMap}
            existingGroups={pgs}
            value={data}
            onClose={onClose}
            onSubmit={onSubmit}
            isSubmitting={loading}
            errors={errors?.errors}
        />
    );
};

export default React.memo(EditOrgFormContainer);
