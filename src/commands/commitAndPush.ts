import { window } from 'vscode';

import { Git, Status } from '../Git';

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

		if (!isNewBranch) { // check if branch is up-to-date
			const branchStatus = await git.getBranchStatus(selectedBranch);

			const shouldPullFirst = await checkBranchStatus(branchStatus);
			if (shouldPullFirst) {
				await git.pull(selectedBranch);
			}
		}

		await git.stage();
		await git.commit(inputCommitInfo);
		await git.push(selectedBranch);
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

async function checkBranchStatus(branchStatus: string) {
	const pullNow = 'Pull now';
	switch (branchStatus) {
		case Status.PullNeeded:
			const shouldPull = await window.showWarningMessage(
				'Origin is ahead of your branch (need to pull)',
				pullNow,
				'cancel'
			);
			if (shouldPull === pullNow) {
				return true;
			}
		case Status.Diverged:
			const shouldPushAndPull = await window.showWarningMessage(
				'Origin and local branch has diverged (need to pull)',
				pullNow,
				'cancel'
			);
			if (shouldPushAndPull === pullNow) {
				return true;
			}
		case Status.UpToDate:
		case Status.PushNeeded:
		default:
			return false;
	}
}