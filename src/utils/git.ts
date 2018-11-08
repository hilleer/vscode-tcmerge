import { executeTerminalCommand } from './terminal';

interface RepositoryInfo {
	owner: string;
	origin: string;
}

export async function getGithubRepositoryInfo(): Promise<RepositoryInfo> {
	const extractInfoRegex = /git@github\.com:([A-Za-z0-9_.-]*)\/([A-Za-z0-9_.-]*)\.git/;

	const cmd = 'git';
	const cmdArgs = [
		'remote',
		'-v'
	];
	const dirtyRemoteInfo = await executeTerminalCommand(cmd, cmdArgs);
	const cleanRemoteInfo = extractInfoRegex.exec(dirtyRemoteInfo);

	return {
		owner: cleanRemoteInfo[1],
		origin: cleanRemoteInfo[2]
	};
}