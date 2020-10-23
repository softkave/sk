import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { loginUserOperationAction } from "../../redux/operations/session/loginUser";
import { AppDispatch } from "../../redux/types";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import useOperation, { getOpStats } from "../hooks/useOperation";
import Login, { ILoginFormValues } from "./Login";

const LoginContainer: React.FC<{}> = () => {
    const dispatch: AppDispatch = useDispatch();
    const operationStatus = useOperation();

    const errors = operationStatus.error
        ? flattenErrorListWithDepthInfinite(operationStatus.error)
        : undefined;

    const onSubmit = async (user: ILoginFormValues) => {
        const result = await dispatch(
            loginUserOperationAction({
                opId: operationStatus.opId,
                email: user.email,
                password: user.password,
                remember: user.remember,
            })
        );
        const loginOp = unwrapResult(result);

        if (!loginOp) {
            return;
        }

        const loginOpStat = getOpStats(loginOp);

        if (loginOpStat.isError) {
            message.error("Error login you in");
        }
    };

    return (
        <Login
            onSubmit={onSubmit}
            isSubmitting={operationStatus.isLoading}
            errors={errors}
        />
    );
};

export default React.memo(LoginContainer);
