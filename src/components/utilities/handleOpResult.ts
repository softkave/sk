import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import OperationActions from "../../redux/operations/actions";
import store from "../../redux/store";
import { getOpStats } from "../hooks/useOperation";

const handleOpResult = async ({
    result,
    successMessage,
    errorMessage,
}: {
    result: any;
    successMessage: string;
    errorMessage: string;
}) => {
    const op: any = unwrapResult(result);

    if (!op) {
        return;
    }

    const opStat = getOpStats(op);

    if (opStat.isCompleted) {
        message.success(successMessage);
    } else if (opStat.isError) {
        message.error(errorMessage);
    }

    store.dispatch(OperationActions.deleteOperation(op.id));
};

export default handleOpResult;
