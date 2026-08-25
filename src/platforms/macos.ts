import { ILocalDeviceOutputPlatform, IPlatform, Spawner } from '../types.ts';

export class MacOSPlatform implements IPlatform {
  constructor(private spawner: Spawner) {}

  /**
   * Scans the network on macOS platforms using native shell commands to discover devices and retrieve details.
   * This macOS-specific function queries the system ARP tool and uses dig to collect MACs and hostnames.
   *
   * @param {string} ips - A newline-separated list of IPv4 addresses to scan.
   * @param {number} timeout - The timeout in seconds for each individual ping command.
   * @returns {Promise<ILocalDeviceOutputPlatform[]>} A promise that resolves to an array of objects containing active device details:
   * - `ip`: The IP address of the discovered device.
   * - `mac`: The MAC address of the device, if available in the ARP table.
   * - `name`: The resolved hostname of the device, if found.
   */
  async localDevices(ips: string, timeout: number): Promise<ILocalDeviceOutputPlatform[]> {
    const command = `while read -r ip; do (ping -t ${timeout} -c 1 $ip >/dev/null &&
     { mac=$(arp -n $ip | awk '{print $4}');
     name=$(dig +short -x $ip | sed 's/.$//');
     echo "{\\"ip\\":\\"$ip\\",\\"mac\\":\\"$mac\\",\\"name\\":\\"$name\\"}"; } &); done; wait`;

    const outputCommand = await this.spawner(['/bin/sh', '-c', command], ips);
    const objects = outputCommand.split('\n').join(',');
    return JSON.parse(`[${objects}]`);
  }
}
