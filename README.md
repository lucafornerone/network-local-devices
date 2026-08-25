# network-local-devices
[![CI](https://github.com/lucafornerone/network-local-devices/workflows/CI/badge.svg)](https://github.com/lucafornerone/network-local-devices/actions?query=workflow%3ACI)

## Purpose

This package was inspired by [local-devices](https://github.com/DylanPiercey/local-devices), which has not been updated for over 4 years.

Effortlessly discover all connected devices to the local network. This package provides the IP address, MAC address and device name.
It includes specific code for each runtime (Bun, Deno, Node) and operating system. This ensures maximum performance by only loading components when necessary.

## How it works

This package retrieves all connected devices by pinging all potential IPs on the local network, calculating them based on the default gateway and the current network type, instead of relying on the ARP table (as the package I was inspired by). This allows it to find devices that are not present in the ARP table but are still reachable.

All spawned OS-level commands are available by default on each system and require no additional installation. Specifically:

- Linux: `ping`, `arp` and `getent hosts`
- macOS: `ping`, `arp` and `dig`
- Windows: `ping`, PowerShell’s `Get-NetNeighbor` and `GetHostEntry`

The commands are spawned through the active runtime. Specifically:

- Bun: `Bun.spawn`
- Deno: `Deno.Command`
- Node: `spawn` from `child_process`

The output of these commands is parsed into `JSON` (on Windows) or processed using `awk` and `sed` (on Linux and macOS), ensuring a consistent key–value structure for all retrieved information.

It is ESM-only and fully written in TypeScript. It is available on JSR and npm.

## Works on
The package has been tested and works correctly on the following operating systems and runtimes:

|             | Bun  | Deno | Node |
|-------------|------|------|------|
| **macOS**   |  ✔  |  ✔   |  ✔  |
| **Linux**   |  ✔  |  ✔   |  ✔  |
| **Windows** |  ✔  |  ✔   |  ✔  |

## JSR

For complete installation and usage details with JSR, visit the [package page](https://jsr.io/@lucafornerone/network-local-devices).

From JSR, you can install the package and access documentation for all available methods. It is recommended for use with Bun and Deno, with sources available directly in TypeScript.

## npm

Installation:

```bash
npm install network-local-devices
```

## Usage example

```javascript
import { v4LocalDevices } from 'network-local-devices';

(async () => {
  // Get all connected devices to the local network
  const devices = await v4LocalDevices();
  console.log(devices);
  /*
  [
    { 
      ip: '192.168.1.5',
      mac: '00:1a:2b:3c:4d:5e',
      name: 'my-laptop' 
    },
    { 
      ip: '192.168.1.8',
      mac: '74:d4:35:89:ef:01',
      name: 'my-phone' 
    }
  ]
  */

  // Search with a 5 seconds timeout and include current IP
  const devicesWithCurrentIp = await v4LocalDevices(5, true);
  console.log(devicesWithCurrentIp);
  /*
  [
    { 
      ip: '192.168.1.4',
      mac: '3c:22:fb:a1:b2:c3',
      name: 'my-mac' 
    },
    { 
      ip: '192.168.1.5',
      mac: '00:1a:2b:3c:4d:5e',
      name: 'my-laptop' 
    },
    { 
      ip: '192.168.1.8',
      mac: '74:d4:35:89:ef:01',
      name: 'my-phone' 
    }
  ]
  */
})();
```

## Test

Bun:

```bash
bun install
bun test test/bun.test.ts
```

Deno:

```bash
deno test test/deno.test.ts --allow-run
```

Node:

```bash
npm install
npm run test
```

## Contribute

I'm happy to welcome any contribution, big or small, feel free to contribute however you prefer! Whether it's code or just suggestions, everything is appreciated.
Please use the GitHub Discussions section to share your ideas or ask questions.

## License

network-local-devices is [MIT licensed](LICENSE).