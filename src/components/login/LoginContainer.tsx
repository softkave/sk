import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { loginUserOpAction } from "../../redux/operations/session/loginUser";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import useOperation, { getOpData } from "../hooks/useOperation";
import Login, { ILoginFormValues } from "./Login";

const LoginContainer: React.FC<{}> = () => {
    const dispatch: AppDispatch = useDispatch();
    const operationStatus = useOperation();

    const errors = operationStatus.error
        ? flattenErrorList(operationStatus.error)
        : undefined;

    const onSubmit = async (user: ILoginFormValues) => {
        const result = await dispatch(
            loginUserOpAction({
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

        const loginOpStat = getOpData(loginOp);

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
