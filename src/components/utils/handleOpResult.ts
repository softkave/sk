import { PayloadAction, unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import { ILoadingState } from "../../redux/key-value/types";
import { isLoadingState } from "../../redux/operations/utils";
import { flattenErrorList } from "../../utils/utils";

const handleOpResult = async ({
  result,
  successMessage,
  errorMessage,
}: {
  result: PayloadAction<ILoadingState<any>, string, any> | PayloadAction<unknown, string, any>;
  successMessage?: string;
  errorMessage?: string;
}) => {
  const op = unwrapResult(result);

  if (!isLoadingState(op)) return;
  if (op.error) {
    const flattenedError = flattenErrorList(op.error);
    message.error(flattenedError.error || errorMessage);
  } else {
    message.success(successMessage);
  }
};

export default handleOpResult;
