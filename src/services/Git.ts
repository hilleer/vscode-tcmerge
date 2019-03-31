import { ExecFilePromise, ChildProcess } from '../utils/childProcess';

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

type ExecFileArgs = {
	cmd?: string;
	args?: string[];
	options?: any;
};

type ExecFileWrapper = ({ cmd, args, options }: ExecFileArgs) => ExecFilePromise;

export class Git {
	private execFile: ExecFileWrapper;
	constructor(childProcess: ChildProcess) {
		this.execFile = ({ cmd = 'git', args, options }: ExecFileArgs) => childProcess.execFile(cmd, args, options);
	}
	public async getGitDetails(): Promise<GitDetails> {
		const extractInfoRegex = /git@github\.com:([A-Za-z0-9_.-]*)\/([A-Za-z0-9_.-]*)\.git/;
		const args = ['remote', '-v'];

		const { stdout: dirtyRemoteInfo } = await this.execFile({ args });
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
		const { stdout: branch } = await this.execFile({ args });
		return branch && branch.toString().trim();
	}

	public async push(branch: string, forceUpstream?: boolean) {
		const args = ['push'];

		const shouldSetUpstreamBranch = forceUpstream || await this.shouldSetUpstreamBranch();
		if (shouldSetUpstreamBranch) {
			args.push('--set-upstream');
		}

		if (branch) {
			args.push('origin');
			args.push(branch);
		}

		await await this.execFile({ args });
	}

	public async pull(branch?: string) {
		const args = ['pull'];

		if (branch) {
			args.push('origin');
			args.push(branch);
		}

		await await this.execFile({ args });
	}

	public async checkout(branch: string) {
		const args = ['checkout', '-b', branch];

		await await this.execFile({ args });
	}

	public async commit(message: string) {
		const args = ['commit', '-m', message];

		await await this.execFile({ args });
	}

	public async stage() {
		const args = ['add', '-A'];

		await await this.execFile({ args });
	}

	public async status(branch: string) {
		const shouldSetUpstreamBranch = await this.shouldSetUpstreamBranch();
		if (!shouldSetUpstreamBranch) {
			await this.push(branch, true);
		}
		const remoteUpdateArgs = ['remote', 'update'];
		const remoteArgs = ['rev-parse', `origin/${branch}`];
		const localArgs = ['rev-parse', '@'];
		const baseArgs = ['merge-base', '@', `origin/${branch}`];

		await this.execFile({ args: remoteUpdateArgs });
		const { stdout: localStatus } = await this.execFile({ args: localArgs });
		const { stdout: remoteStatus } = await this.execFile({ args: remoteArgs });
		const { stdout: baseStatus } = await this.execFile({ args: baseArgs });

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
		const { stdout: status } = await this.execFile({ args });
		const regex = /## [\w-_]*\.{3}origin\/[\w-_]*/;
		return regex.test(status.toString());
	}
}