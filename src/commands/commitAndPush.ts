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

	let shouldSetUpstreamBranch: boolean;
	try {
		if (currentBranch !== selectedBranch) {
			await checkoutToBranch(selectedBranch);
		}
		await stageChanges();
		await commitChanges(inputCommitInfo);
		shouldSetUpstreamBranch = await git.shouldSetUpstreamBranch();
		await pushChanges(selectedBranch, shouldSetUpstreamBranch);
		window.showInformationMessage(`Successfully pushed changes to ${selectedBranch}`);
	} catch (error) {
		const isBranchOutOfDate = error.message && error.message.includes('git pull ...');
		console.log('error!!!!', error);
		if (isBranchOutOfDate) {
			const shouldPullChanges = await window.showWarningMessage(
				'Failed to push, because your current branch is behind origin. Pull changes now?',
				'Pull',
				'Close'
			);
			if (shouldPullChanges === 'Pull') {
				try {
					await pullFromCurrentBranch(selectedBranch);
					const shouldPushAgain = await window.showInformationMessage(
						`Successfully pulled changes from ${selectedBranch}. Try to push again?`,
						'Push',
						'Close'
					);

					if (shouldPushAgain === 'Push') {
						await pushChanges(selectedBranch, shouldSetUpstreamBranch);
						window.showInformationMessage(`Successfully pushed changes to ${selectedBranch}`);
					}
				} catch (error) {
					console.log('error', error);
					return window.showErrorMessage('Failed to pull changes. Please submit a bug report');
				}
			}
			return undefined;
		}
		return window.showWarningMessage(error);
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

async function pullFromCurrentBranch(branch: string) {
	const args = ['pull', 'origin', branch];

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