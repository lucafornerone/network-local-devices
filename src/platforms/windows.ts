import { ILocalDeviceOutputPlatform, IPlatform, Spawner } from '../types.ts';

export class WindowsPlatform implements IPlatform {
  constructor(private spawner: Spawner) {}

  /**
   * Scans the network on Windows platforms using PowerShell commands to discover devices and retrieve details.
   * This Windows-specific function uses asynchronous pings, Get-NetNeighbor, and .NET DNS APIs to collect data.
   *
   * @param {string} ips - A newline-separated list of IPv4 addresses to scan.
   * @param {number} timeout - The timeout in seconds for each individual ping command.
   * @returns {Promise<ILocalDeviceOutputPlatform[]>} A promise that resolves to an array of objects containing active device details:
   * - `ip`: The IP address of the discovered device.
   * - `mac`: The MAC address of the device, if available in the neighbor table.
   * - `name`: The resolved hostname of the device, if found.
   */
  async localDevices(ips: string, timeout: number): Promise<ILocalDeviceOutputPlatform[]> {
    const command = `$ips = $input;
    $timeout = ${timeout * 1000};
    $tasks = foreach ($ip in $ips) {
      $ping = New-Object System.Net.NetworkInformation.Ping;
      [PSCustomObject]@{ IP = $ip; Task = $ping.SendPingAsync($ip, $timeout) }
    };
    [System.Threading.Tasks.Task]::WaitAll($tasks.Task); $results = foreach ($t in $tasks) { $isOnline = $t.Task.Result.Status -eq 'Success'; 
    $mac = if ($isOnline) { (Get-NetNeighbor -IPAddress $t.IP -ErrorAction SilentlyContinue).LinkLayerAddress } else { $null };
    $name = if ($isOnline) { $ErrorActionPreference = 'SilentlyContinue'; [System.Net.Dns]::GetHostEntry($t.IP).HostName } else { $null };
    [PSCustomObject]@{ ip = $t.IP; Online = $isOnline; mac = $mac; name = $name } };
    $results | Where-Object { $_.Online } | Select-Object ip, mac, name | ConvertTo-Json`;

    const outputCommand = await this.spawner(
      ['powershell', '-NoProfile', '-Command', command],
      ips
    );
    const output = JSON.parse(outputCommand);
    return Array.isArray(output) ? output : [output];
  }
}
