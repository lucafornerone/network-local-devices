export interface NetworkLocalDevice {
  ip: string;
  mac?: string;
  name?: string;
}

export enum Platform {
  MacOS = 'darwin',
  Linux = 'linux',
  Windows = 'windows',
}

export enum Runtime {
  Bun = 'bun',
  Deno = 'deno',
  Node = 'node',
}

export interface IRuntime {
  platform(): Platform;
  spawnCommand(cmds: string[], ips: string): Promise<string>;
}

export interface ILocalDeviceOutputPlatform {
  ip: string;
  mac: string | null;
  name: string | null;
}

export interface IPlatform {
  localDevices(ips: string, timeout: number): Promise<ILocalDeviceOutputPlatform[]>;
}

export type Spawner = (cmds: string[], ips: string) => Promise<string>;

export class RuntimeNotSupportedError extends Error {
  constructor() {
    super('Runtime not supported');
    this.name = 'RuntimeNotSupportedError';
  }
}

export class PlatformNotSupportedError extends Error {
  constructor(runtime: Runtime, platform: string) {
    super(`${runtime} ${platform} platform not supported`);
    this.name = 'PlatformNotSupportedError';
  }
}
