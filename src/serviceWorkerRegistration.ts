import PushNotificationAPI from "./net/pushNotification/api";
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
        const registration =
            (await getServiceWorker()) ||
            (await navigator.serviceWorker.register("./service-worker.js"));

        return registration;
    } catch (error) {
        // TODO: should we persist to server
        devError(error);
    }
}

export async function registerPushNotification() {
    try {
        const registration = await getServiceWorker();

        if (!registration) {
            return null;
        }

        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            const response = await PushNotificationAPI.getPushNotificationKeys();

            if (!response.vapidPublicKey) {
                return;
            }

            const vapidPublicKey = response.vapidPublicKey;
            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey,
            });
        }

        if (subscription) {
            const isSubscribedToServer = await PushNotificationAPI.pushNotificationExists();

            if (!isSubscribedToServer) {
                const authKey = await subscription.getKey("auth");
                const p256dhKey = await subscription.getKey("p256dh");

                if (authKey && p256dhKey) {
                    await PushNotificationAPI.subscribePushNotification({
                        endpoint: subscription.endpoint,
                        keys: {
                            auth: arrayBufferToString(authKey),
                            p256dh: arrayBufferToString(p256dhKey),
                        },
                    });

                    UserSessionStorageFuncs.setItem(
                        sessionVariables.pushNotificationSubscibed,
                        true
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
    await registerPushNotification();
}
