import { assertEquals, assertExists, assertGreater } from 'jsr:@std/assert';
import { deadline } from 'jsr:@std/async';
import { isIPv4 } from 'node:net';
import { v4LocalDevices } from '../index.ts';
import { NetworkLocalDevice } from '../src/types.ts';
import { isMac } from './helpers.mjs';

let devices: NetworkLocalDevice[];

Deno.test.beforeAll(async () => {
  devices = await deadline(v4LocalDevices(2, true), 45_000);
});

Deno.test('_v4LocalDevices: should be defined', () => {
  assertExists(devices);
});

Deno.test('_v4LocalDevices: should not be empty', () => {
  assertGreater(devices.length, 0);
});

Deno.test('_v4LocalDevices: should return an array of object where ip property is defined', () => {
  assertEquals(
    devices.every((device) => device.ip !== ''),
    true
  );
  assertEquals(
    devices.every((device) => device.ip !== undefined),
    true
  );
  assertEquals(
    devices.every((device) => device.ip !== null),
    true
  );
});

Deno.test('_v4LocalDevices: should return an array of object where ip must be a valid ipv4', () => {
  assertEquals(
    devices.every((device) => isIPv4(device.ip)),
    true
  );
});

Deno.test('_v4LocalDevices: should return an array of objects where mac must be valid if present', () => {
  assertEquals(
    devices.every((device) => (device.mac !== undefined ? isMac(device.mac) : true)),
    true
  );
});
