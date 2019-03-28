import { executeTerminalCommand } from '../utils/terminal';

const GIT_COMMAND = 'git';

type GitDetails = {
	owner: string;
	origin: string;
};

export class Git {
	public async getGitDetails(): Promise<GitDetails> {
		const extractInfoRegex = /git@github\.com:([A-Za-z0-9_.-]*)\/([A-Za-z0-9_.-]*)\.git/;
		const cmdArgs = ['remote', '-v'];

		const { stdout: dirtyRemoteInfo } = await executeTerminalCommand(GIT_COMMAND, cmdArgs);
		const cleanRemoteInfo = extractInfoRegex.exec(dirtyRemoteInfo.toString());

		return {
			owner: cleanRemoteInfo[1],
			origin: cleanRemoteInfo[2]
		};
	}

	public async getCurrentBranch(): Promise<string> {
		const args = [
			'symbolic-ref',
			'--short',
			'HEAD'
		];
		const { stdout: branch } = await executeTerminalCommand(GIT_COMMAND, args);
		return branch && branch.toString().trim();
	}

	public async shouldSetUpstreamBranch(): Promise<boolean> {
		const args = [
			'status',
			'-sb'
		];
		const { stdout: status } = await executeTerminalCommand(GIT_COMMAND, args);
		const regex = /## [\w-_]*\.{3}origin\/[\w-_]*/;
		return regex.test(status.toString());
	}
}