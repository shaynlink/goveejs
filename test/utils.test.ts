import {detectVersion} from '../src/utils/utils';

describe('Utilities', () => {
  it('detect version', () => {
    const devices: string[] = ['H6163', 'H615B', 'H6008', 'H619D'];

    expect(detectVersion(devices.shift())).toBe(1);
    expect(detectVersion(devices.shift())).toBe(1.2);
    expect(detectVersion(devices.shift())).toBe(1.3);
    expect(detectVersion(devices.shift())).toBe(1.4);
  });
});
