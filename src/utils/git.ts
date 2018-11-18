import { executeTerminalCommand } from './terminal';

const GIT_COMMAND = 'git';

interface RepositoryInfo {
	owner: string;
	origin: string;
}

export async function getGithubRepositoryInfo(): Promise<RepositoryInfo> {
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
	return await executeTerminalCommand(GIT_COMMAND, args);
}

export async function shouldSetUpstreamBranch(branch: string): Promise<boolean> {
	const args = [
		'status',
		'-sb'
	];
	const status = await executeTerminalCommand(GIT_COMMAND, args);
	console.log('status: ', status);
	const regex = /## [\w-_]*\.{3}origin\/[\w-_]*/;
	return regex.test(status);
}