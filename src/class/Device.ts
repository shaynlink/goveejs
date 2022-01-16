import Client from '../client/Client';
import {DataResponseDevice, PropertiesDevice} from './managers/DeviceManager';
import {cmdName, cmdValue} from '../api/Rest';
import {endpoints} from '../utils/constants';

interface CmdStructure {
  device: string;
  model: string;
  cmd: {
    name: cmdName;
    value: cmdValue;
  }
}

/**
 * Class Device
 */
class Device {
  public client: Client;
  public model: string;
  public device: string;
  public controllable: true | false;
  public retrievable: true | false;
  public supportCmds: cmdName[];
  public version: number;
  public deviceName: string | undefined;
  public properties: PropertiesDevice | undefined;

  /**
     * @param {DataResponseDevice} data
     * @param {Client} client
     */
  constructor(
      data: DataResponseDevice,
      client: Client,
  ) {
    this.client = client;

    // Product Model of your device.
    this.model = data.model;

    // Mac address of your device.
    // Use device and model to identify the target one device.
    this.device = data.device;

    // Controllable will be true when the device support command
    // to control.
    this.controllable = data.controllable;

    // Retrievable will be true when the device support querying
    // the current device state.
    this.retrievable = data.retrievable;

    // Commands supported by the device.
    this.supportCmds = data.supportCmds;

    // Name of device
    this.deviceName = data.deviceName;

    // Properties of device
    this.properties = data.properties;
  };

  /**
   * Generata a command object
   * @param {cmdName} name
   * @param {cmdValue} cmd
   * @return {CmdStructure}
   */
  private generateCmd(name: cmdName, cmd: cmdValue): CmdStructure {
    return {
      device: this.device,
      model: this.model,
      cmd: {
        name: name,
        value: cmd,
      },
    };
  };

  /**
   * Turn on / off the device
   * @param {boolean} on
   * @return {Promise<Error | void>}
   */
  turn(on: boolean): Promise<Error | void> {
    return this.client.rest.request(
        'put',
        endpoints.deviceControl,
        this.generateCmd('turn', on ? 'on' : 'off'),
    )
        .then((response) => {
          let errMessage: string = '';

          if (response.status !== 200) {
            errMessage = `Failed to turn ${on ? 'on' : 'off'} device.`;
            this.client.emit('error', errMessage);
            throw new Error(errMessage);
          };

          if (response.data.code != 200) {
            errMessage = `Failed to turn ${
              on ? 'on' : 'off'
            } device. (${response.data.message})`;
            this.client.emit('error', errMessage);
            throw new Error(errMessage);
          };

          return;
        });
  }
}

export default Device;
