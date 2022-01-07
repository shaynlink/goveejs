import {EventEmitter} from 'events';
import Device from '../class/Device';
import Rest from '../api/Rest';

/**
 * @class Client
 * @classdesc Client class for initializing controller
 * @example
 * const client = new Client('api-key');
 *
 * client.device.list()
 *  .then((devices) => console.log('%s devices found', devices.length));
 */
class Client extends EventEmitter {
  public apikey: string;
  public version: number;
  public devices: Map<string, Device>;
  public synchronize: boolean;
  public getDevice: () => Promise<Device[]>;

  /**
   * Authentificate the client
   * @param {string} apikey
   * @param {number} version
   */
  constructor(apikey: string) {
    super();
    if (
      !apikey ||
      typeof apikey !== 'string' ||
      !('GOVEE_API_KEY' in process.env)
    ) {
      throw new Error('apikey is required');
    }
    /**
     * @property {string} apikey
     * get API key to
     * Govee app -> My profile -> settings -> About us -> Apply for API Key
     */
    this.apikey = apikey || process.env.GOVEE_API_KEY as string;

    this.devices = new Map();

    this.rest = new Rest(this);

    this.synchronize = false;

    this.
  }

  /**
   * Get device list and store it in the client
   * @param {boolean} storeIt
   * @return {Promise<Device[]>}
   */
  public async getDevices(storeIt: true): Promise<Device[]> {
    return this.rest.request('GET', '/devices', this)
        .then((devices: Device[]) => {
          if (!!storeIt) {
            devices.forEach((device: Device) =>
              this.devices.set(device.device, device));
          }
        });
  }

  /**
   * Syncronize the client
   */
  public sync(): Map<string, Device> {
    if (this.synchronize) {
      return this.devices;
    };

    
  }
}

export default Client;
