import { UAParser } from "ua-parser-js";

const userAgent = new UAParser();

export function isOSWindows() {
  const windowsOS = "Windows";
  const OSName = userAgent.getOS().name;

  if (OSName) {
    return OSName.toLowerCase() === windowsOS.toLowerCase();
  }

  return false;
}

export default userAgent;
