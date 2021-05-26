import query from "../query";
import { GetEndpointResultError, IEndpointResultBase } from "../types";
import {
    getPushSubscriptionKeysQuery,
    pushSubscriptionExistsQuery,
    subscribePushSubscriptionMutation,
    unsubscribePushSubscriptionMutation,
} from "./schema";

export interface IGetPushNotificationKeysResult extends IEndpointResultBase {
    vapidPublicKey?: string;
}

async function getPushNotificationKeys(): Promise<IGetPushNotificationKeysResult> {
    return query(
        null,
        getPushSubscriptionKeysQuery,
        {},
        "data.pushSubscription.getPushSubscriptionKeys"
    );
}

export interface IPushSubscriptionExistsResult extends IEndpointResultBase {
    exists?: boolean;
}

async function pushSubscriptionExists(
    props: ISubscribePushNotificationEndpointParams
): Promise<IPushSubscriptionExistsResult> {
    return query(
        null,
        pushSubscriptionExistsQuery,
        props,
        "data.pushSubscription.pushSubscriptionExists"
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
export type ISubscribePushNotificationEndpointErrors =
    GetEndpointResultError<ISubscribePushNotificationEndpointParams>;

async function subscribePushNotification(
    props: ISubscribePushNotificationEndpointParams
): Promise<ISubscribePushNotificationEndpointResult> {
    return query(
        null,
        subscribePushSubscriptionMutation,
        props,
        "data.pushSubscription.subscribePushSubscription"
    );
}

async function unsubscribePushNotification(): Promise<IEndpointResultBase> {
    return query(
        null,
        unsubscribePushSubscriptionMutation,
        {},
        "data.pushSubscription.unsubscribePushSubscription"
    );
}

export default class PushNotificationAPI {
    public static getPushNotificationKeys = getPushNotificationKeys;
    public static subscribePushNotification = subscribePushNotification;
    public static unsubscribePushNotification = unsubscribePushNotification;
    public static pushSubscriptionExists = pushSubscriptionExists;
}
