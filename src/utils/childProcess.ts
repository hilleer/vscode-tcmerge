import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export type ExecFile = (cmd: string, args?: string[], options?: any) => ExecFilePromise;

export type ExecFilePromise = Promise<{
	stdout: Buffer;
	stderr: Buffer;
}>;

export class ChildProcess {
	private cwd: string;
	constructor(cwd: string) {
		this.cwd = cwd;
	}

	public async execFile(cmd: string, args?: string[], options?: any) {
		options = { cwd: this.cwd, ...options };

		return execFileAsync(cmd, args, options);
	}
}