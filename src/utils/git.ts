import { executeTerminalCommand } from './terminal';

const GIT_COMMAND = 'git';

export interface RepositoryDetails {
	owner: string;
	origin: string;
}

export async function getGitRepoIfno(): Promise<RepositoryDetails> {
	const extractInfoRegex = /git@github\.com:([A-Za-z0-9_.-]*)\/([A-Za-z0-9_.-]*)\.git/;

	const cmdArgs = [
		'remote',
		'-v'
	];
	const dirtyRemoteInfo = await executeTerminalCommand(GIT_COMMAND, cmdArgs);
	const cleanRemoteInfo = extractInfoRegex.exec(dirtyRemoteInfo);

	return {
		owner: cleanRemoteInfo[1],
		origin: cleanRemoteInfo[2]
	};
}

export async function getCurrentBranch(): Promise<string> {
	const args = [
		'symbolic-ref',
		'--short',
		'HEAD'
	];
	const branch: string = await executeTerminalCommand(GIT_COMMAND, args);
	return branch.trim();
}

export async function shouldSetUpstreamBranch(): Promise<boolean> {
	const args = [
		'status',
		'-sb'
	];
	const status = await executeTerminalCommand(GIT_COMMAND, args);
	const regex = /## [\w-_]*\.{3}origin\/[\w-_]*/;
	return regex.test(status);
}