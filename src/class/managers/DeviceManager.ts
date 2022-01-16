import Client from '../../client/Client';
import Device from '../Device';
import {
  APIResponseData,
  endpoints,
} from '../../utils/constants';
import {AxiosPromise} from 'axios';
import {cmdName} from '../../api/Rest';

export interface DataResponse {
  devices: DataResponseDevice[];
}

export interface PropertiesDevice {
  colorTerm?: {
    range?: {
      min: number;
      max: number;
    }
  }
}

export interface DataResponseDevice {
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
  supportCmds: cmdName[];
  // Name of device
  deviceName?: string;
  // Properties of device
  properties?: PropertiesDevice;
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
   * @param {APIResponseData<DataResponse>} data
   * @return {Device[]}
   */
  private decode(data: APIResponseData<DataResponse>): Device[] {
    const devices: Device[] = [];

    for (const device of data.data.devices) {
      devices.push(new Device(device, this.client));
    }

    return devices;
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
          endpoints.getDevices,
      ) as AxiosPromise<APIResponseData<DataResponse>>)
        .then((response) => {
          let errMessage: string = '';

          if (response.status != 200) {
            errMessage = `Failed to get devices: ${response.status}`;
            this.client.emit('error', errMessage);
            throw new Error(errMessage);
          };

          if (response.data.code != 200) {
            errMessage = `Failed to get devices: ${response.data.message}`;
            this.client.emit('error', errMessage);
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
