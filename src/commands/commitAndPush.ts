import { executeTerminalCommand } from '../utils/terminal';

const GIT_COMMAND = 'git';

export async function main() {
	console.log('commit and push');

	await stageChanges();
	await commitChanges();
	await pushChanges();
}

async function stageChanges() {
	const args = [
		'add',
		'-A'
	];
	await executeTerminalCommand(GIT_COMMAND, args);
}

async function commitChanges() {
	const args = [
		'commit',
		'-m',
		'default message'
	];
	await executeTerminalCommand(GIT_COMMAND, args);
}

async function pushChanges() {
	const args = [
		'push',
		'origin',
		'master'
	];
	await executeTerminalCommand(GIT_COMMAND, args);
}