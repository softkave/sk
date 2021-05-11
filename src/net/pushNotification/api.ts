import query from "../query";
import { GetEndpointResultError, IEndpointResultBase } from "../types";
import {
    getPushNotificationKeysQuery,
    pushSubscriptionExistsQuery,
    subscribePushNotificationMutation,
    unsubscribePushNotificationMutation,
} from "./schema";

export interface IGetPushNotificationKeysResult extends IEndpointResultBase {
    vapidPublicKey?: string;
}

async function getPushNotificationKeys(): Promise<IGetPushNotificationKeysResult> {
    return query(
        null,
        getPushNotificationKeysQuery,
        {},
        "data.pushNotification.getPushNotificationKeys"
    );
}

export interface IPushNotificationExistsResult extends IEndpointResultBase {
    exists?: boolean;
}

async function pushNotificationExists(): Promise<IPushNotificationExistsResult> {
    return query(
        null,
        pushSubscriptionExistsQuery,
        {},
        "data.pushNotification.pushNotificationExists"
    );
}

export interface ISubscribePushNotificationEndpointParams {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export type ISubscribePushNotificationEndpointResult = IEndpointResultBase;
export type ISubscribePushNotificationEndpointErrors = GetEndpointResultError<ISubscribePushNotificationEndpointParams>;

async function subscribePushNotification(
    props: ISubscribePushNotificationEndpointParams
): Promise<ISubscribePushNotificationEndpointResult> {
    return query(
        null,
        subscribePushNotificationMutation,
        props,
        "data.pushNotification.subscribePushNotification"
    );
}

async function unsubscribePushNotification(): Promise<IEndpointResultBase> {
    return query(
        null,
        unsubscribePushNotificationMutation,
        {},
        "data.pushNotification.unsubscribePushNotification"
    );
}

export default class PushNotificationAPI {
    public static getPushNotificationKeys = getPushNotificationKeys;
    public static subscribePushNotification = subscribePushNotification;
    public static unsubscribePushNotification = unsubscribePushNotification;
    public static pushNotificationExists = pushNotificationExists;
}
