import PushNotificationAPI from "./net/pushNotification/api";
import { updateClientOpAction } from "./redux/operations/session/updateClient";
import store from "./redux/store";
import UserSessionStorageFuncs, {
    sessionVariables,
} from "./storage/userSession";
import { devError } from "./utils/log";
import { arrayBufferToString, urlBase64ToUint8Array } from "./utils/utils";

export function supportsServiceWorkers() {
    if ("serviceWorker" in navigator) {
        return true;
    }
}

export async function getServiceWorker(scope?: string) {
    if (!supportsServiceWorkers()) {
        return null;
    }

    return navigator.serviceWorker.getRegistration(scope);
}

export async function registerServiceWorker() {
    if (!supportsServiceWorkers()) {
        return null;
    }

    try {
        const workerURL = `${process.env.PUBLIC_URL}/service-worker.js`;
        const registration =
            (await getServiceWorker()) ||
            (await navigator.serviceWorker.register(workerURL));

        return registration;
    } catch (error) {
        // TODO: should we persist to server
        console.error(error);
    }
}

// TODO: write code to auto check if operation passes and retry
// if it failed
export async function registerPushNotification() {
    try {
        const registration = await getServiceWorker();

        if (!registration) {
            return null;
        }

        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            const response =
                await PushNotificationAPI.getPushNotificationKeys();

            if (!response.vapidPublicKey) {
                return null;
            }

            const vapidPublicKey = response.vapidPublicKey;
            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey,
            });
        }

        if (subscription) {
            const authKeyBuf = subscription.getKey("auth");
            const p256dhKeyBuf = subscription.getKey("p256dh");

            if (authKeyBuf && p256dhKeyBuf) {
                const auth = arrayBufferToString(authKeyBuf);
                const p256dh = arrayBufferToString(p256dhKeyBuf);

                const isSubscribedToServer =
                    await PushNotificationAPI.pushSubscriptionExists({
                        endpoint: subscription.endpoint,
                        keys: {
                            auth,
                            p256dh,
                        },
                    });

                if (!isSubscribedToServer) {
                    await PushNotificationAPI.subscribePushNotification({
                        endpoint: subscription.endpoint,
                        keys: {
                            auth,
                            p256dh,
                        },
                    });

                    UserSessionStorageFuncs.setItem(
                        sessionVariables.pushNotificationSubscibed,
                        true
                    );

                    store.dispatch(
                        updateClientOpAction({
                            data: { isSubcribedToPushNotifications: true },
                            deleteOpOnComplete: true,
                        })
                    );
                }
            }
        }

        return subscription;
    } catch (error) {
        devError(error);
        return null;
    }
}

export async function serviceWorkerInit() {
    await registerServiceWorker();
}
