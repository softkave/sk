import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import OperationActions from "../../redux/operations/actions";
import store from "../../redux/store";
import { flattenErrorList } from "../../utils/utils";
import { getOpData } from "../hooks/useOperation";

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

    const opData = getOpData(op);

    if (opData.isCompleted) {
        message.success(successMessage);
    } else if (opData.isError) {
        const flattenedError = flattenErrorList(opData.error);
        message.error(flattenedError.error || errorMessage);
    }

    store.dispatch(OperationActions.deleteOperation(op.id));
};

export default handleOpResult;
