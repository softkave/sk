import SystemAPI, { ISendFeedbackEndpointParams } from "../../../net/system/api";
import { makeAsyncOp02NoPersist } from "../utils";

export const sendFeedbackOpAction = makeAsyncOp02NoPersist(
  "op/system/sendFeedback",
  async (arg: ISendFeedbackEndpointParams) => {
    const result = await SystemAPI.sendFeedback({
      feedback: arg.feedback,
      description: arg.description,
      notifyEmail: arg.notifyEmail,
    });

    if (result && result.errors) {
      throw result.errors;
    }
  }
);
