import { window } from 'vscode';

import { Git, Status, PushArg } from '../Git';

type CommitAndPushArgs = {
	git: Git;
};

export async function main({ git }: CommitAndPushArgs): Promise<void> {
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

	let isNewBranch = false;
	try {
		if (currentBranch !== selectedBranch) {
			isNewBranch = true;
			await git.checkout(selectedBranch);
		}

		if (!isNewBranch) {
			const branchStatus = await git.getBranchStatus(selectedBranch);

			const shouldPull = await checkShouldPull(branchStatus);
			if (shouldPull) {
				await git.pull(selectedBranch);
			}
		}

		const { stdout: gitStatus } = await git.status();
		const shouldStageAndCommit = !String(gitStatus).includes('nothing to commit');

		if (shouldStageAndCommit) {
			await git.stage();
			await git.commit(inputCommitInfo);
		}

		await git.push(selectedBranch, [PushArg.SetUpstream]);
		window.showInformationMessage(`Successfully pushed changes to ${selectedBranch}`);
	} catch (error) {
		const message = error.message || 'An unexpected error occured';
		window.showErrorMessage(message);
	}
}

async function setSelectedBranch(currentBranch: string, commitMessage: string) {
	const branchName = commitMessage.replace(/\s/g, '-');

	if (currentBranch.startsWith('master')) {
		const selection = await window.showInformationMessage(
			`Current branch is master. Do you want to push to ${branchName} instead?`, 'push to shown branch', 'push to master'
		);
		return selection === 'push to shown branch'
			? branchName
			: 'master';
	}
	return currentBranch;
}

async function checkShouldPull(branchStatus: string) {
	const pullNowOption = 'Pull now';
	let pullMessage: string;

	switch (branchStatus) {
		case Status.PullNeeded:
			pullMessage = 'Origin is ahead of your branch (need to pull)';
			break;
		case Status.Diverged:
			pullMessage = 'Origin and local branch has diverged (need to pull)';
			break;
		case Status.UpToDate:
		case Status.PushNeeded:
		default:
			break; // no-need to pull in those cases
	}

	if (pullMessage) {
		const shouldPullAnswer = await window.showWarningMessage(
			pullMessage,
			pullNowOption,
			'Cancel'
		);

		if (shouldPullAnswer === pullNowOption) {
			return true;
		}
	}

	return false;
}