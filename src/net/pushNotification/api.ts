import * as yup from "yup";
import { invokeEndpointWithAuth } from "../invokeEndpoint";
import { GetEndpointResultError, IEndpointResultBase } from "../types";
import { endpointYupOptions } from "../utils";

const basePath = "/pushNotification";
const getPushNotificationKeysPath = `${basePath}/getPushNotificationKeys`;
const subscribePushNotificationPath = `${basePath}/subscribePushNotification`;
const unsubscribePushNotificationPath = `${basePath}/unsubscribePushNotification`;
const pushSubscriptionExistsPath = `${basePath}/pushSubscriptionExists`;

export interface IGetPushNotificationKeysResult extends IEndpointResultBase {
  vapidPublicKey?: string;
}

async function getPushNotificationKeys(): Promise<IGetPushNotificationKeysResult> {
  return invokeEndpointWithAuth<IGetPushNotificationKeysResult>({
    path: getPushNotificationKeysPath,
    apiType: "REST",
  });
}

export interface IPushSubscriptionExistsResult extends IEndpointResultBase {
  exists?: boolean;
}

const subscribePushNotificationYupSchema = yup.object().shape({
  endpoint: yup.string().required(),
  keys: yup.object().shape({
    p256dh: yup.string().required(),
    auth: yup.string().required(),
  }),
});

async function pushSubscriptionExists(
  props: ISubscribePushNotificationEndpointParams
): Promise<IPushSubscriptionExistsResult> {
  return invokeEndpointWithAuth<IPushSubscriptionExistsResult>({
    path: pushSubscriptionExistsPath,
    apiType: "REST",
    data: subscribePushNotificationYupSchema.validateSync(
      props,
      endpointYupOptions
    ),
  });
}

export interface ISubscribePushNotificationEndpointParams {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export type ISubscribePushNotificationEndpointResult = IEndpointResultBase;
export type ISubscribePushNotificationEndpointErrors =
  GetEndpointResultError<ISubscribePushNotificationEndpointParams>;

async function subscribePushNotification(
  props: ISubscribePushNotificationEndpointParams
): Promise<ISubscribePushNotificationEndpointResult> {
  return invokeEndpointWithAuth<ISubscribePushNotificationEndpointResult>({
    path: subscribePushNotificationPath,
    apiType: "REST",
    data: subscribePushNotificationYupSchema.validateSync(
      props,
      endpointYupOptions
    ),
  });
}

async function unsubscribePushNotification(): Promise<IEndpointResultBase> {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: unsubscribePushNotificationPath,
    apiType: "REST",
  });
}

export default class PushNotificationAPI {
  public static getPushNotificationKeys = getPushNotificationKeys;
  public static subscribePushNotification = subscribePushNotification;
  public static unsubscribePushNotification = unsubscribePushNotification;
  public static pushSubscriptionExists = pushSubscriptionExists;
}
