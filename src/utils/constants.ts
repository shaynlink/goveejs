export const endpoints = {
  getDevices: `/devices`,
  deviceControl: `/devices/control`,
};

export interface APIResponseData<D> {
  code: number;
  message: 'success' | string;
  data: D;
}
