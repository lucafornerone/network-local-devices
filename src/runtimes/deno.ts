import { platformFromRuntimeOs } from '../common.ts';
import { IRuntime, Platform, Runtime } from '../types.ts';

export class DenoRuntime implements IRuntime {
  /**
   * Spawns a command in the Deno runtime and returns its standard output as a string.
   *
   * @param {string[]} cmds - The command and its arguments to execute.
   * @param {string} ips - A newline-separated list of IP addresses passed to the process stdin.
   * @returns {Promise<string>} A promise that resolves to the trimmed standard output of the command.
   */
  async spawnCommand(cmds: string[], ips: string): Promise<string> {
    // command args are cmds strings starting from second position
    const options: Deno.CommandOptions = {
      args: cmds.slice(1),
      stdin: 'piped',
      stdout: 'piped',
      stderr: 'null',
    };
    const command = new Deno.Command(cmds[0], options);
    const process: Deno.ChildProcess = command.spawn();

    // stream input
    const inputBytes: Uint8Array = new TextEncoder().encode(ips);
    const writer = process.stdin.getWriter();
    await writer.write(inputBytes);
    writer.releaseLock();
    process.stdin.close();

    const { stdout } = await process.output();
    const textDecoder = new TextDecoder();
    return textDecoder.decode(stdout).trim();
  }

  /**
   * Determines and returns the current platform for the Deno runtime.
   *
   * @returns {Platform} The detected platform corresponding to the Deno runtime.
   * @throws {PlatformNotSupportedError} If the platform is not supported.
   */
  platform(): Platform {
    return platformFromRuntimeOs(Runtime.Deno, Deno.build.os);
  }
}
