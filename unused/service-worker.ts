/// <reference lib="WebWorker" />

// export empty type because of tsc --isolatedModules flag
export type {};
declare const self: ServiceWorkerGlobalScope;

// This is required for the compilation process
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ignored = self.__WB_MANIFEST;

self.addEventListener("install", (e) => {
    console.log("[Service Worker] install");
});

// TODO: handle when the server sends multiple push notifications in succession
// TODO: preferrably only show notifications if the user has token in local storage
// or has at least one open tab logged in
self.addEventListener("push", function (event) {
    if (Notification.permission === "granted") {
        // TODO: should we update the server if the user has not
        // granted us notifications permission?
        const payload = event.data ? event.data.text() : "no payload";
        event.waitUntil(
            self.registration.showNotification("Softkave Chat Notification", {
                body: payload,
            })
        );
    }
});
