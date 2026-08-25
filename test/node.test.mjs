import { isIPv4 } from 'node:net';
import { expect } from 'chai';
import { before } from 'mocha';
import { v4LocalDevices } from '../dist/index.js';
import { isMac } from './helpers.mjs';

describe('_v4LocalDevices', () => {
  let devices;

  before(async () => {
    devices = await v4LocalDevices(2, true);
    console.log(devices);
  });

  it('should be defined', () => {
    expect(devices).to.not.be.undefined;
  });

  it('should not be empty', () => {
    expect(devices).to.not.be.empty;
  });

  it('should return an array of object where ip property is defined', () => {
    expect(devices.every((device) => device.ip !== '')).to.be.true;
    expect(devices.every((device) => device.ip !== undefined)).to.be.true;
    expect(devices.every((device) => device.ip !== null)).to.be.true;
  });

  it('should return an array of object where ip must be a valid ipv4', () => {
    expect(devices.every((device) => isIPv4(device.ip))).to.be.true;
  });

  it('should return an array of objects where mac must be valid if present', () => {
    expect(devices.every((device) => (device.mac !== undefined ? isMac(device.mac) : true))).to.be
      .true;
  });
});
