import {versioning} from './constants';

/**
 * Determines version that matches with all devices
 * @param {string} device
 * @return {number}
 */
export function detectVersion(device: string): number {
  const versionList = Object.keys(versioning).map(Number).sort((a, b) => b - a);
  let actualVersion = 1;

  for (const version of versionList) {
    if (versioning[version].includes(device)) {
      actualVersion = version;
      break;
    };
  };

  return actualVersion;
};

/**
 * Get last version of the API
 * @return {number}
 */
export function getLastVersion(): number {
  return Object.keys(versioning).map(Number).sort((a, b) => b - a)[0];
}
