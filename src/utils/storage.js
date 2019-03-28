export function storageAvailable(type) {
  try {
    var storage = window[type],
      x = "__storage_test__";
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

function getStorageType(storageType) {
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

const defaultStorageType = "local";

export function setItem(key, data, storageType = defaultStorageType) {
  let storageObject = getStorageType(storageType);

  if (storageObject) {
    storageObject.setItem(key, data);
  }
}

export function removeItem(key, storageType = defaultStorageType) {
  let storageObject = getStorageType(storageType);

  if (storageObject) {
    storageObject.removeItem(key);
  }
}

export function getItem(key, storageType = defaultStorageType) {
  let storageObject = getStorageType(storageType);

  if (storageObject) {
    return storageObject.getItem(key);
  }
}
