import * as yup from "yup";
import { invokeEndpoint, invokeEndpointWithAuth } from "../invokeEndpoint";
import { GetEndpointResultError, IEndpointResultBase } from "../types";
import { endpointYupOptions, isUserSignedIn } from "../utils";

const basePath = "/system";
const sendFeedbackPath = `${basePath}/sendFeedback`;

export interface ISendFeedbackEndpointParams {
  feedback: string;
  description?: string;
  notifyEmail?: string;
}

export type ISendFeedbackEndpointResult = IEndpointResultBase;
export type ISendFeedbackEndpointErrors = GetEndpointResultError<ISendFeedbackEndpointParams>;

const sendFeedbackYupSchema = yup.object().shape({
  feedback: yup.string().required(),
  description: yup.string(),
  notifyEmail: yup.string(),
});

async function sendFeedback(
  props: ISendFeedbackEndpointParams
): Promise<ISendFeedbackEndpointResult> {
  const data = sendFeedbackYupSchema.validateSync(props, endpointYupOptions);
  if (isUserSignedIn()) {
    return invokeEndpointWithAuth<ISendFeedbackEndpointResult>({
      data,
      path: sendFeedbackPath,
      apiType: "REST",
    });
  } else {
    return invokeEndpoint<ISendFeedbackEndpointResult>({
      data,
      path: sendFeedbackPath,
      apiType: "REST",
    });
  }
}

export default class SystemAPI {
  static sendFeedback = sendFeedback;
}
