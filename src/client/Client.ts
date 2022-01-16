import {EventEmitter} from 'events';
import Rest from '../api/Rest';
import DeviceManager from '../class/managers/DeviceManager';

/**
 * @class Client
 * @classdesc Client class for initializing controller
 * @example
 * const client = new Client('api-key');
 *
 * client.device.list()
 *  .then((devices) => console.log('%s devices found', devices.length));
 *
 * client.on('newDevice', (devices) => {
 *  console.log('New device found: %s', devices.length);
 * })
 *
 * client.sync();
 */
class Client extends EventEmitter {
  public apikey: string;
  public version: number;
  public devices: DeviceManager;
  public rest: Rest;
  public synchronize: boolean;
  public timer: NodeJS.Timer | null;

  /**
   * Authentificate the client
   * @param {string} apikey
   * @param {number} version
   */
  constructor(
      apikey: string,
      version = parseFloat(process.env.GOVEE_API_VERSION as string),
  ) {
    super();
    if (
      !apikey &&
      typeof apikey !== 'string' &&
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

    this.version = version || 1;

    this.devices = new DeviceManager(this);

    this.rest = new Rest(this);

    this.synchronize = false;

    this.timer = null;
  }

  /**
   * Syncronize the client
   * @return {Device}
   */
  public async sync(): Promise<this> {
    if (this.synchronize) {
      return this;
    }

    this.emit('debug', '[Client] Syncronize enable');

    this.synchronize = true;

    this.emit('debug', '[Client] Syncronize');

    await this.devices.getDevices(true);
    this.timer = null;

    this.timer = setTimeout(async () => {
      this.emit('debug', '[Client] Syncronize');

      await this.devices.getDevices(true);
      this.timer = null;

      this.sync();
    }, 1000 * 60);

    return this;
  }

  /**
   * Unsyncronize the client
   * @return {void}
   */
  public unsync(): void {
    this.emit('debug', '[Client] Syncronize disable');

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = null;
    this.synchronize = false;

    return void 0;
  }
}

export default Client;
