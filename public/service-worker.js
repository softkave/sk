/* eslint-disable no-restricted-globals */

// TODO: can we get this working in Typescript instead?

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
