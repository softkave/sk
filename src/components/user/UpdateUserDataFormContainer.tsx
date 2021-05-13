import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IUpdateUserEndpointErrors } from "../../net/user/user";
import { updateUserOpAction } from "../../redux/operations/session/updateUser";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import { getOpData } from "../hooks/useOperation";
import { IFormError } from "../utilities/types";
import UpdateUserFormData, {
    IUpdateUserDataFormData,
} from "./UpdateUserDataForm";

const UpdateUserDataFormContainer: React.FC<{}> = () => {
    const dispatch: AppDispatch = useDispatch();

    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] =
        React.useState<IFormError<IUpdateUserEndpointErrors> | undefined>();

    const user = useSelector(SessionSelectors.assertGetUser);

    const onSubmit = async (data: IUpdateUserDataFormData) => {
        setLoading(true);

        const result = await dispatch(
            updateUserOpAction({
                user: data,
                deleteOpOnComplete: true,
            })
        );

        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const opData = getOpData(op);

        if (opData.isCompleted) {
            message.success("Profile updated successfully");
        } else if (opData.isError) {
            const flattenedErrors = flattenErrorList(opData.error);
            setErrors({
                errors: flattenedErrors,
                errorList: opData.error,
            });

            message.error("Error updating your profile");
        }

        setLoading(false);
    };

    return (
        <UpdateUserFormData
            user={user}
            onSubmit={onSubmit}
            isSubmitting={loading}
            errors={errors?.errors}
        />
    );
};

export default UpdateUserDataFormContainer;
