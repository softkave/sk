import { unwrapResult } from "@reduxjs/toolkit";
import { message, notification } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { changePasswordOperationAction } from "../../redux/operations/session/changePassword";
import { AppDispatch } from "../../redux/types";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import useOperation, { getOpStats } from "../hooks/useOperation";
import ChangePassword, { IChangePasswordFormData } from "./ChangePassword";

// TODO: Implement an endpoint to get user email from token ( forgot password and session token )
// TODO: Implement a way to supply token to a net call
// TODO: Implement an endpoint to convert forgot password token to change password token ( maybe not necessary )

const changePasswordSuccessMessage = "Password changed successfully";

const ChangePasswordWithTokenContainer: React.FC<{}> = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const operationStatus = useOperation();

    const errors = operationStatus.error
        ? flattenErrorListWithDepthInfinite(operationStatus.error)
        : undefined;

    const onSubmit = async (data: IChangePasswordFormData) => {
        const query = new URLSearchParams(window.location.search);
        const token = query.get("t");

        if (!token) {
            message.error("Invalid credentials");
            notification.error({
                message: "Invalid credentials",
                description:
                    "Please try again from the change password email sent to you.",
            });

            history.push("/");
            return;
        }

        const result = await dispatch(
            changePasswordOperationAction({
                token,
                password: data.password,
                opId: operationStatus.opId,
            })
        );

        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const opStat = getOpStats(op);

        if (opStat.isCompleted) {
            message.success(changePasswordSuccessMessage);
        } else if (opStat.isError) {
            message.error("Error changing password");
        }
    };

    return (
        <ChangePassword
            onSubmit={onSubmit}
            isSubmitting={operationStatus.isLoading}
            errors={errors}
        />
    );
};

export default React.memo(ChangePasswordWithTokenContainer);
