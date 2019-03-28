import { workspace } from 'vscode';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

type TerminalCommand = {
	stdout: Buffer;
	stderr: Buffer;
};

export async function executeTerminalCommand(cmd: string, cmdArgs?: any[], opts?: any): Promise<TerminalCommand> {
	const defaults = {
		cwd: workspace.rootPath
	};
	opts = { ...defaults, ...opts };

	return execFileAsync(cmd, cmdArgs, opts);
}