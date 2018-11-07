import { workspace } from 'vscode';
import { execFile } from 'child_process';

export function executeTerminalCommand(cmd: string, cmdArgs?: any[], opts?: any): Promise<any> {
	const defaults = {
		cwd: workspace.rootPath
	};
	opts = { ...defaults, ...opts };
	return new Promise((resolve, reject) => {
		execFile(cmd, cmdArgs, opts, (err, stdout, stderr) => {
			if (err) {
				reject(err)
			}
			if (stderr) {
				console.log(stderr);
			}
			resolve(stdout);
		});
	});
}