/// <reference lib="WebWorker" />

// export empty type because of tsc --isolatedModules flag
export type {};
declare const self: ServiceWorkerGlobalScope;

self.addEventListener("install", (e) => {
    console.log("[Service Worker] install");
});

// TODO: handle when the server sends multiple push notifications in succession
self.addEventListener("push", function (event) {
    if (Notification.permission === "granted") {
        const payload = event.data ? event.data.text() : "no payload";
        event.waitUntil(
            self.registration.showNotification("Softkave Chat Notification", {
                body: payload,
            })
        );
    }
});
