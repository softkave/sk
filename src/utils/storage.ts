export type StorageType = "localStorage" | "sessionStorage";

export function storageAvailable(type: StorageType) {
    const storage = window[type];

    if (!storage) {
        return false;
    }

    try {
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            // everything except Firefox
            (e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === "QuotaExceededError" ||
                // Firefox
                e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0
        );
    }
}

export let appLocalStorage = storageAvailable("localStorage")
    ? window.localStorage
    : null;
export let appSessionStorage = storageAvailable("sessionStorage")
    ? window.sessionStorage
    : null;

type StorageName = StorageType | "local" | "session";
function getStorageType(storageType: StorageName) {
    switch (storageType) {
        case "local":
        case "localStorage":
            return appLocalStorage;

        case "session":
        case "sessionStorage":
        default:
            return appSessionStorage;
    }
}

const defaultStorageType: StorageName = "local";

export function setItem(
    key: string,
    data: string | boolean | number | null,
    storageType = defaultStorageType
) {
    const storageObject = getStorageType(storageType);

    if (storageObject) {
        storageObject.setItem(key, String(data));
    }
}

export function removeItem(key, storageType = defaultStorageType) {
    const storageObject = getStorageType(storageType);

    if (storageObject) {
        storageObject.removeItem(key);
    }
}

export function getItem(key, storageType = defaultStorageType) {
    const storageObject = getStorageType(storageType);

    if (storageObject) {
        return storageObject.getItem(key);
    }
}
