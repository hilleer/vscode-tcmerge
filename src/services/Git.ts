import { executeTerminalCommand } from '../utils/terminal';

const GIT_COMMAND = 'git';

type GitDetails = {
	owner: string;
	origin: string;
};

export enum Status {
	UpToDate = 'up-to-date',
	Diverged = 'diverged',
	PullNeeded = 'pull-needed',
	PushNeeded = 'push-needed'
}

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

	public async pushChanges(branch: string) {
		const args = ['push'];

		const shouldSetUpstreamBranch = await this.shouldSetUpstreamBranch();
		if (!shouldSetUpstreamBranch) {
			args.push('--set-upstream');
		}

		if (branch) {
			args.push('origin');
			args.push(branch);
		}

		await executeTerminalCommand(GIT_COMMAND, args);
	}

	public async pullChanges(branch?: string) {
		const args = ['pull'];

		if (branch) {
			args.push('origin');
			args.push(branch)
		}

		await executeTerminalCommand(GIT_COMMAND, args);

	}

	public async checkout(branch: string) {
		const args = ['checkout', '-b', branch];

		await executeTerminalCommand(GIT_COMMAND, args);
	}

	public async commit(message: string) {
		const args = ['commit', '-m', message];

		await executeTerminalCommand(GIT_COMMAND, args);
	}

	public async stage() {
		const args = ['add', '-A'];

		await executeTerminalCommand(GIT_COMMAND, args);
	}

	public async status(branch: string) {
		const remoteUpdateArgs = ['remote', 'update'];
		const remoteArgs = ['rev-parse', `origin/${branch}`];
		const localArgs = ['rev-parse', '@'];
		const baseArgs = ['merge-base', '@', `origin/${branch}`];

		await executeTerminalCommand('git', remoteUpdateArgs);
		const { stdout: remoteStatus } = await executeTerminalCommand('git', remoteArgs);
		const { stdout: localStatus } = await executeTerminalCommand('git', localArgs);
		const { stdout: baseStatus } = await executeTerminalCommand('git', baseArgs);

		if (remoteStatus === localStatus) {
			return Status.UpToDate;
		} else if (localStatus === baseStatus) {
			return Status.PullNeeded;
		} else if (remoteStatus === baseStatus) {
			return Status.PushNeeded;
		} else {
			return Status.Diverged;
		}
	}

	private async shouldSetUpstreamBranch(): Promise<boolean> {
		const args = [
			'status',
			'-sb'
		];
		const { stdout: status } = await executeTerminalCommand(GIT_COMMAND, args);
		const regex = /## [\w-_]*\.{3}origin\/[\w-_]*/;
		return regex.test(status.toString());
	}
}