import { NetworkElement, v4IpList } from 'network-ip-list';
import { currentPlatform, currentRuntime } from './src/common.ts';
import { NetworkLocalDevice } from './src/types.ts';

/**
 * Discovers active IPv4 devices on the local network for the current runtime and platform.
 *
 * This function first determines the current runtime and platform, then generates a list of potential IPv4 addresses
 * on the current network, omitting the gateway and broadcast addresses by default. It then calls the platform's
 * `localDevices` method to scan those IPs and returns an array of objects containing details for each active device found.
 *
 * @example
 * ```typescript
 * const devices = await v4LocalDevices();
 * console.log(devices); // [ { ip: '192.168.1.5', mac: '00:1a:2b:3c:4d:5e', name: 'my-laptop' } ]
 * ```
 *
 * @param timeout - The timeout in seconds for checking each device's availability.
 * @param currentIp - Whether to include the current device's own IP address in the network scan.
 * @returns A promise that resolves to an array of discovered local network devices:
 * - `ip`: The IPv4 address of the discovered device.
 * - `mac`: The MAC address of the device (optional, included if found).
 * - `name`: The resolved hostname of the device (optional, included if found).
 */
export async function v4LocalDevices(
  timeout = 3,
  currentIp = false
): Promise<NetworkLocalDevice[]> {
  const runtime = await currentRuntime();
  const platform = await currentPlatform(runtime);

  const omit = [NetworkElement.Gateway, NetworkElement.Broadcast];
  if (!currentIp) {
    // omit current ip from ip list
    omit.push(NetworkElement.CurrentDevice);
  }
  // list of potential v4 ips connected to the current network
  const ipList: string[] = await v4IpList({ omit });
  const ips = ipList.join('\n');
  const devices = await platform.localDevices(ips, timeout);
  return devices.map((device) => {
    return {
      ip: device.ip,
      ...(device.mac && { mac: device.mac }),
      ...(device.name && { name: device.name }),
    };
  });
}
