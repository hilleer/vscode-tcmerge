import { window } from 'vscode';

import { executeTerminalCommand } from '../utils/terminal';
import { getCurrentBranch, shouldSetUpstreamBranch } from '../utils/git';

const GIT_COMMAND = 'git';

export async function main() {
	let selectedBranch: string;

	const currentBranch = await getCurrentBranch();

	let inputCommitInfo = await window.showInputBox({
		ignoreFocusOut: true,
		placeHolder: 'Branch- and commit info'
	});

	if (!inputCommitInfo) {
		return;
	}

	inputCommitInfo = inputCommitInfo.trim();

	selectedBranch = await setSelectedBranch(currentBranch, inputCommitInfo);

	try {
		if (currentBranch !== selectedBranch) {
			await checkoutToBranch(selectedBranch);
		}
		await stageChanges();
		await commitChanges(inputCommitInfo);
		await pushChanges(selectedBranch);
		window.showInformationMessage(`Successfully pushed changes to ${selectedBranch}`);
	} catch (error) {
		console.error(error);
		window.showWarningMessage('Something went wrong....');
		return;
	}
}

async function stageChanges() {
	const args = [
		'add',
		'-A'
	];
	await executeTerminalCommand(GIT_COMMAND, args);
}

async function commitChanges(commitMessage: string) {
	const args = [
		'commit',
		'-m',
		commitMessage
	];

	await executeTerminalCommand(GIT_COMMAND, args);
}

async function pushChanges(branch: string) {
	const args = [
		'push'
	];
	const upstreamIsSet: boolean = await shouldSetUpstreamBranch();

	if (!upstreamIsSet) {
		args.push('--set-upstream');
		args.push('origin');
		args.push(branch);
	}
	await executeTerminalCommand(GIT_COMMAND, args);
}

async function checkoutToBranch(branch: string): Promise<void> {
	const args = [
		'checkout',
		'-b',
		branch
	];
	await executeTerminalCommand(GIT_COMMAND, args);
}

async function setSelectedBranch(currentBranch: string, commitMessage: string) {
	const branchName = commitMessage.replace(/\s/g, '-');
	if (/^master/.test(currentBranch)) {
		const selection = await window.showInformationMessage(`Current branch is master. Do you want to push to ${branchName} instead?`, 'yes', 'no');
		return selection === 'yes'
			? branchName
			: 'master';
	}
	return currentBranch;
}