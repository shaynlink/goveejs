import Client from '../../client/Client';
import Device from '../Device';
import {
  APIResponseData,
  endpoints,
} from '../../utils/constants';
import {getLastVersion} from '../../utils/utils';
import {AxiosPromise} from 'axios';

type supportCmds = 'turn' | 'brightness' | 'color' | 'colorTem';

interface DataResponseDevice {
  devices: {
    // Product Model of your device.
    model: string;
    // Mac address of your device.
    // Use device and model to identify the target one device.
    device: string;
    // Controllable will be true when the device support command
    // to control.
    controllable: true | false;
    // Retrievable will be true when the device support querying
    // the current device state.
    retrievable: true | false;
    // Commands supported by the device.
    supportCmds: supportCmds[];
  }
}

/**
 * Manager devices
 */
class DeviceManager {
  public client: Client;
  public store: Map<string, Device>;

  /**
   * Initialize the DeviceManager class
   * @param {Client} client
   */
  constructor(client: Client) {
    this.client = client;

    this.store = new Map();
  }

  /**
   * Return Device class list
   * @param {APIResponseData<DataResponseDevice[]>} data
   * @return {Device[]}
   */
  private decode(data: APIResponseData<DataResponseDevice[]>): Device[] {

  };

  /**
   * Get device list and store it in the client
   * @param {boolean} store
   * @return {Promise<Device[]>}
   */
  public async getDevices(store: true): Promise<Device[] | Error | undefined> {
    return (
      this.client.rest.request(
          'GET',
          endpoints.getDevices(String(getLastVersion())),
      ) as AxiosPromise<APIResponseData<DataResponseDevice[]>>)
        .then((response) => {
          let errMessage: string = '';

          if (response.status != 200) {
            errMessage = `Failed to get devices: ${response.status}`;
            this.client.emit('error', errMessage);
            throw new Error(errMessage);
          };

          if (response.data.code != 200) {
            errMessage = `Failed to get devices: ${response.data.message}`;
            throw new Error(errMessage);
          }

          const devices = this.decode(response.data);

          if (store) {
            for (const device of devices
                .filter((d) => !this.store.has(d.device))) {
              this.store.set(device.device, device);
              this.client.emit('newDevice', device);
            }
          }

          return devices;
        });
  }
}

export default DeviceManager;
