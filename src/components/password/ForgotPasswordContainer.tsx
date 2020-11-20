import { unwrapResult } from "@reduxjs/toolkit";
import { message, notification } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { requestForgotPasswordOpAction } from "../../redux/operations/session/requestForgotPassword";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import useOperation, { getOpData } from "../hooks/useOperation";
import ForgotPassword, { IForgotPasswordFormData } from "./ForgotPassword";

const successMessage = `
  Request successful,
  a change password link will been sent to your email address shortly`;

const ForgotPasswordWithTokenContainer: React.FC<{}> = () => {
    const dispatch: AppDispatch = useDispatch();
    const [key, setKey] = React.useState(Math.random().toString());
    const operationStatus = useOperation();

    const errors = operationStatus.error
        ? flattenErrorList(operationStatus.error)
        : undefined;

    const onSubmit = async (data: IForgotPasswordFormData) => {
        const result = await dispatch(
            requestForgotPasswordOpAction({
                email: data.email,
                opId: operationStatus.opId,
            })
        );

        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const opStat = getOpData(op);

        if (opStat.isCompleted) {
            notification.success({
                message: "Request successful",
                description: successMessage,
                duration: 0,
            });

            setKey(Math.random().toString());
        } else if (opStat.isError) {
            message.error("Error requesting change of password");
        }
    };

    return (
        <ForgotPassword
            key={key}
            onSubmit={onSubmit}
            isSubmitting={operationStatus.isLoading}
            errors={errors}
        />
    );
};

export default React.memo(ForgotPasswordWithTokenContainer);
