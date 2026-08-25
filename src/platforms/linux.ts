import { ILocalDeviceOutputPlatform, IPlatform, Spawner } from '../types.ts';

export class LinuxPlatform implements IPlatform {
  constructor(private spawner: Spawner) {}

  /**
   * Scans the network on Linux platform using native shell commands to discover devices and retrieve details.
   * This Linux-specific function reads from the local ARP table and host entries to collect MACs and names.
   *
   * @param {string} ips - A newline-separated list of IPv4 addresses to scan.
   * @param {number} timeout - The timeout in seconds for each individual ping command.
   * @returns {Promise<ILocalDeviceOutputPlatform[]>} A promise that resolves to an array of objects containing active device details:
   * - `ip`: The IP address of the discovered device.
   * - `mac`: The MAC address of the device, if available in the ARP table.
   * - `name`: The resolved hostname of the device, if found.
   */
  async localDevices(ips: string, timeout: number): Promise<ILocalDeviceOutputPlatform[]> {
    const command = `(while read -r ip; do (ping -W ${timeout} -c 1 $ip >/dev/null &&
     { mac=$(awk -v ip="$ip" '$1==ip {print $4}' /proc/net/arp);
     name=$(getent hosts $ip | awk '{print $2}');
     echo "{\\"ip\\":\\"$ip\\",\\"mac\\":\\"$mac\\",\\"name\\":\\"$name\\"}"; }) & done; wait)`;

    const outputCommand = await this.spawner(['/bin/sh', '-c', command], ips);
    const objects = outputCommand.split('\n').join(',');
    return JSON.parse(`[${objects}]`);
  }
}
