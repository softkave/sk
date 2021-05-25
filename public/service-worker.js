/// <reference lib="WebWorker" />
/* eslint-disable no-restricted-globals */

// TODO: add version to know if to close older version and install
// and activate a new version
// TODO: add appName for localhost and local dev
// TODO: add try-catch to all code blocks and return logs to the server
// TODO: can we get this working in Typescript instead?

self.addEventListener("install", (e) => {
    console.log("[Service Worker] install");
});

// TODO: implement service worker registration not waiting for
// existing clients to close or reload, maybe by version
const chatNotificationTag = "chat-tag";
const boardsBySoftkaveURL = self.location.origin;

// TODO: handle when the server sends multiple push notifications in succession
// TODO: preferrably only show notifications if the user has token in local storage
// or has at least one open tab logged in
self.addEventListener("push", function (event) {
    if (!(self.Notification && self.Notification.permission === "granted")) {
        return;
    }

    const message = event.data ? event.data.text() : "You have new messages";
    event.waitUntil(
        self.registration.showNotification("Boards by Softkave", {
            body: message,
            tag: chatNotificationTag,
            data: { url: boardsBySoftkaveURL },
        })
    );
});

// Notification click event listener
self.addEventListener("notificationclick", (e) => {
    // Close the notification popout
    e.notification.close();

    // Get all the Window clients
    // eslint-disable-next-line no-undef
    e.waitUntil(
        // eslint-disable-next-line no-undef
        clients.matchAll({ type: "window" }).then((clientsArr) => {
            // If a Window tab matching the targeted URL already exists, focus that;
            const hadWindowToFocus = clientsArr.some((windowClient) =>
                windowClient.url === e.notification.data.url
                    ? (windowClient.focus(), true)
                    : false
            );

            // Otherwise, open a new tab to the applicable URL and focus it.
            if (!hadWindowToFocus)
                // eslint-disable-next-line no-undef
                clients
                    .openWindow(e.notification.data.url)
                    .then((windowClient) =>
                        windowClient ? windowClient.focus() : null
                    );
        })
    );
});
