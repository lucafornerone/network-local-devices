import { platform } from 'node:os';
import { platformFromRuntimeOs } from '../common.ts';
import { IRuntime, Platform, Runtime } from '../types.ts';

export class BunRuntime implements IRuntime {
  /**
   * Spawns a command in the Bun runtime and returns its standard output as a string.
   *
   * @param {string[]} cmds - The command and its arguments to execute.
   * @param {string} ips - A newline-separated list of IP addresses passed to the process stdin.
   * @returns {Promise<string>} A promise that resolves to the trimmed standard output of the command.
   */
  async spawnCommand(cmds: string[], ips: string): Promise<string> {
    const { stdout } = Bun.spawn(cmds, {
      stdin: Buffer.from(ips),
      stderr: 'ignore',
    });
    // @ts-ignore: Bypassing TS compiler error since this code runs exclusively on Bun
    return (await stdout.text()).trim();
  }

  /**
   * Determines and returns the current platform for the Bun runtime.
   *
   * @returns {Platform} The detected platform corresponding to the Bun runtime.
   * @throws {PlatformNotSupportedError} If the platform is not supported.
   */
  platform(): Platform {
    return platformFromRuntimeOs(Runtime.Bun, platform());
  }
}
