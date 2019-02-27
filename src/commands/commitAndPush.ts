import { window } from 'vscode';

import { executeTerminalCommand } from '../utils/terminal';
import { Git } from '../services/Git';

type CommitAndPush = {
	git: Git;
};

const GIT_COMMAND = 'git';

export async function main({ git }: CommitAndPush) {
	let selectedBranch: string;

	const currentBranch = await git.getCurrentBranch();

	let inputCommitInfo = await window.showInputBox({
		ignoreFocusOut: true,
		placeHolder: 'Branch- and commit info'
	});

	if (!inputCommitInfo) {
		return;
	}

	inputCommitInfo = inputCommitInfo.trim();

	selectedBranch = await setSelectedBranch(currentBranch, inputCommitInfo);

	if (!selectedBranch) {
		return;
	}

	try {
		if (currentBranch !== selectedBranch) {
			await checkoutToBranch(selectedBranch);
		}
		await stageChanges();
		await commitChanges(inputCommitInfo);
		const shouldSetUpstreamBranch = await git.shouldSetUpstreamBranch();
		await pushChanges(selectedBranch, shouldSetUpstreamBranch);
		window.showInformationMessage(`Successfully pushed to branch ${selectedBranch}`);
	} catch (error) {
		window.showWarningMessage(error);
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

async function pushChanges(branch: string, shouldSetUpstreamBranch: boolean) {
	const args = [
		'push'
	];

	if (!shouldSetUpstreamBranch) {
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
		const selection = await window.showInformationMessage(
			`Current branch is master. Do you want to push to ${branchName} instead?`, 'push to shown branch', 'push to master'
		);
		return selection === 'push to shown branch'
			? branchName
			: 'master';
	}
	return currentBranch;
}