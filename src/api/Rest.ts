import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  Method,
  AxiosPromise,
} from 'axios';
import Client from '../client/Client';
import Queue from './Queue';

type availableModel = 'H6160' | 'H6163' |
'H6104' | 'H6109' | 'H6110' | 'H6117' | 'H6159' | 'H7022' | 'H6086' | 'H6089' |
'H6182' | 'H6085' | 'H7014' | 'H5081' | 'H6188' | 'H6135' | 'H6137' | 'H6141' |
'H6142' | 'H6195' | 'H7005' | 'H6083' | 'H6002' | 'H6003' | 'H6148' | 'H6052' |
'H6143' | 'H6144' | 'H6050' | 'H6199' | 'H6054' | 'H5001' | 'H6050' | 'H6154' |
'H6143' | 'H6144' | 'H6072' | 'H6121' | 'H611A' | 'H5080' | 'H6062' | 'H614C' |
'H615A' | 'H615B' | 'H7020' | 'H7021' | 'H614D' | 'H611Z' | 'H611B' | 'H611C' |
'H615C' | 'H615D' | 'H7006' | 'H7007' | 'H7008' | 'H7012' | 'H7013' | 'H7050' |
'H6051' | 'H6056' | 'H6061' | 'H6058' | 'H6073' | 'H6076' | 'H619A' | 'H619C' |
'H618A' | 'H618C' | 'H6008' | 'H6071' | 'H6075' | 'H614A' | 'H614B' | 'H614E' |
'H618E' | 'H619E' | 'H605B' | 'H6087' | 'H6172' | 'H619B' | 'H619D' | 'H619Z' |
'H61A0' | 'H7060' | 'H610A' | 'H6059' | 'H7028' | 'H6198' | 'H6049';

export type cmdName = 'turn' | 'brightness' | 'color' | 'colorTern';
export type cmdValue = 'on' | 'off' | number | {
  r: number,
  g: number,
  b: number
};

interface RequestStucture {
  device: string;
  model: availableModel;
  cmd?: {
    name: cmdName;
    value: cmdValue;
  }
}

/**
 * @class Rest
 * @classdesc Manage request to the API
 * @example
 * const rest = new Rest(cliet);
 *
 * rest.get('/devices')
 *  .then(Rest.parse)
 *  .then((devices) => console.log('%s devices found', devices.length));
 */
class Rest {
  public client: Client;
  public queue: Queue;
  public config: AxiosRequestConfig<RequestStucture>;
  public instance: AxiosInstance;
  /**
   * Initialize the Rest class
   * @param {Client} client
   */
  constructor(client: Client) {
    /**
     * @property {Client} client
     */
    this.client = client;

    /**
     * @property {Queue} queue
     */
    this.queue = new Queue();

    this.config = {
      baseURL: `https://developer-api.govee.com/v${this.client.version}`,
      headers: {
        'Content-Type': 'application/json',
        'Govee-API-Key': this.client.apikey,
        'User-Agent': 'goveejs (https://github.com/shaynlink/goveejs)',
      },
      timeout: 1000,
    };

    this.instance = axios.create(this.config);
  }

  /**
   * Make request to API
   * @param {Method} method
   * @param {string} path
   * @param {any} data
   * @param {any} headers
   * @return {Promise<any>}
   */
  public request(
      method: Method,
      path: string,
      data: any = {},
      headers: any = {},
  ): AxiosPromise<any> {
    this.client.emit('debug', '[Rest] Request: %s %s', method, path);
    return this.instance({
      url: path,
      method,
      data,
      headers: headers,
    });
  }
}

export default Rest;
