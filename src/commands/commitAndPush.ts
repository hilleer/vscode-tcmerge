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
		return undefined;
	}

	inputCommitInfo = inputCommitInfo.trim();

	selectedBranch = await setSelectedBranch(currentBranch, inputCommitInfo);

	if (!selectedBranch) {
		return undefined;
	}

	try {
		if (currentBranch !== selectedBranch) {
			await git.checkout(selectedBranch);
		}

		const branchStatus = await git.getBranchStatus(selectedBranch);

		const shouldCancel = await updateBranchStatus(branchStatus, selectedBranch, git);
		if (shouldCancel) {
			return;
		}

		await git.stage();
		await git.commit(inputCommitInfo);
		await git.push(selectedBranch);
		window.showInformationMessage(`Successfully pushed changes to ${selectedBranch}`);
	} catch (error) {
		console.log(error);
		const message = error.message || 'An unexpected error occured';
		window.showErrorMessage(message);
	}
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

async function updateBranchStatus(branchStatus: string, branch: string, git: Git) {
	switch (branchStatus) {
		case Status.UpToDate: return false;
		case Status.PullNeeded:
			const pull = await window.showWarningMessage(
				'Origin is ahead of your branch (need to pull)',
				'Pull now',
				'cancel'
			);
			if (pull === 'cancel') {
				return true;
			}
			await git.pull(branch);
			break;
		case Status.PushNeeded:
			const push = await window.showWarningMessage(
				'Origin is behind your local branch (need to push)',
				'Push now',
				'cancel'
			);
			if (push === 'cancel') {
				return true;
			}
			await git.push(branch);
			break;
		case Status.Diverged:
			const pushAndPull = await window.showWarningMessage(
				'Origin and local branch has diverged (need to push and pull)',
				'Push and pull now',
				'cancel'
			);
			if (pushAndPull === 'cancel') {
				return true;
			}
			await git.pull(branch);
			await git.push(branch);
			break;
	}
	return false;
}