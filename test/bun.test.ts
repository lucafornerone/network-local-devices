import { beforeAll, describe, expect, it } from 'bun:test';
import { isIPv4 } from 'node:net';
import { v4LocalDevices } from '../index.ts';
import { NetworkLocalDevice } from '../src/types.ts';
import { isMac } from './helpers.mjs';

describe('_v4LocalDevices', () => {
  let devices: NetworkLocalDevice[];

  beforeAll(async () => {
    devices = await v4LocalDevices(2, true);
  });

  it('should be defined', () => {
    expect(devices).toBeDefined();
  });

  it('should not be empty', () => {
    expect(devices.length).toBeGreaterThan(0);
  });

  it('should return an array of object where ip property is defined', () => {
    expect(devices.every((device) => device.ip !== '')).toBe(true);
    expect(devices.every((device) => device.ip !== undefined)).toBe(true);
    expect(devices.every((device) => device.ip !== null)).toBe(true);
  });

  it('should return an array of object where ip must be a valid ipv4', () => {
    expect(devices.every((device) => isIPv4(device.ip))).toBe(true);
  });

  it('should return an array of objects where mac must be valid if present', () => {
    expect(devices.every((device) => (device.mac !== undefined ? isMac(device.mac) : true))).toBe(
      true
    );
  });
});
