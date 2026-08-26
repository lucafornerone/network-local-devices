import { assertEquals, assertExists, assertGreater } from 'jsr:@std/assert';
import { deadline } from 'jsr:@std/async';
import { isIPv4 } from 'node:net';
import { v4LocalDevices } from '../index.ts';
import { NetworkLocalDevice } from '../src/types.ts';
import { isMac } from './helpers.mjs';

let devices: NetworkLocalDevice[];
let timeout: number | undefined;
const hasEnv = await Deno.permissions.query({ name: 'env' });
if (hasEnv && hasEnv.state === 'granted') {
  const envTimeout: string | undefined = Deno.env.get('CI_TIMEOUT');
  timeout = envTimeout ? +envTimeout : undefined;
}

Deno.test.beforeAll(async () => {
  if (timeout) {
    devices = await deadline(v4LocalDevices(2, true), timeout);
  } else {
    devices = await v4LocalDevices(2, true);
  }
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
