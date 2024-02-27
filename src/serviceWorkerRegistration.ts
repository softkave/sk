import PushNotificationAPI from "./net/pushNotification/api";
import { assertEndpointResult } from "./net/utils";
import { updateClientOpAction } from "./redux/operations/session/updateClient";
import store from "./redux/store";
import UserSessionStorageFuncs, { sessionVariables } from "./storage/userSession";
import { urlBase64ToUint8Array } from "./utils/utils";

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
      (await getServiceWorker()) || (await navigator.serviceWorker.register(workerURL));
    return registration;
  } catch (error) {
    // TODO: should we persist to server
    console.error(error);
  }
}

// TODO: write code to auto check if operation passes and retry
// if it failed
export async function registerPushNotification() {
  const registration = await getServiceWorker();
  if (!registration) {
    return null;
  }

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    const response = await PushNotificationAPI.getPushNotificationKeys();
    assertEndpointResult(response);

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
    const subStr = JSON.stringify(subscription);
    const subData = JSON.parse(subStr);
    const authKeyBuf = subData.keys.auth;
    const p256dhKeyBuf = subData.keys.p256dh;
    if (authKeyBuf && p256dhKeyBuf) {
      const auth = authKeyBuf.toString();
      const p256dh = p256dhKeyBuf.toString();
      const existsResult = await PushNotificationAPI.pushSubscriptionExists({
        endpoint: subscription.endpoint,
        keys: {
          auth,
          p256dh,
        },
      });
      assertEndpointResult(existsResult);

      if (!existsResult.exists) {
        const result = await PushNotificationAPI.subscribePushNotification({
          endpoint: subscription.endpoint,
          keys: {
            auth,
            p256dh,
          },
        });

        assertEndpointResult(result);
        UserSessionStorageFuncs.setItem(sessionVariables.isSubcribedToPushNotifications, true);
        store.dispatch(
          updateClientOpAction({
            data: { isSubcribedToPushNotifications: true },
          })
        );
      }
    }
  }

  return subscription;
}

export async function serviceWorkerInit() {
  await registerServiceWorker();
}
