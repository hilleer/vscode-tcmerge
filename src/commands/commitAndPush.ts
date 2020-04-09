import { window, ProgressLocation, Progress } from 'vscode';

import { Git, Status, PushArg } from '../Git';

type CommitAndPushArgs = {
	git: Git;
};

export async function main({ git }: CommitAndPushArgs): Promise<void> {
	window.withProgress({
		location: ProgressLocation.Window,
		title: 'tcmerge'
	}, (progress) => doCheckoutCommitPush(git, progress));
}

async function doCheckoutCommitPush(git: Git, progress: Progress<{ message?: string, increment?: number }>) {
	progress.report({ message: 'git status' });

	const { stdout: gitStatus } = await git.status();
	const shouldStageAndCommit = !String(gitStatus).includes('nothing to commit');

	progress.report({ message: 'get commit info', increment: 10 });

	let inputCommitInfo: string;
	if (shouldStageAndCommit) {
		inputCommitInfo = await window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: 'Branch- and commit info'
		});

		if (!inputCommitInfo) {
			return;
		}
		inputCommitInfo = inputCommitInfo.trim();
	}

	progress.report({ message: 'get checkout branch', increment: 10 });

	const currentBranch = await git.getCurrentBranch();

	const checkoutBranch = await getCheckoutBranch(currentBranch, inputCommitInfo);

	if (!checkoutBranch) {
		return;
	}

	let isNewBranch = false;
	try {
		if (currentBranch !== checkoutBranch) {
			progress.report({ message: `git checkout ${checkoutBranch}`, increment: 10 });

			isNewBranch = true;
			await git.checkout(checkoutBranch);
		}

		if (!isNewBranch) {
			progress.report({ message: 'is branch up to date', increment: 10 });
			const branchStatus = await git.getBranchStatus(checkoutBranch);

			const shouldPull = await checkShouldPull(branchStatus);
			if (shouldPull) {
				await git.pull(checkoutBranch);
			}
		}

		if (shouldStageAndCommit) {
			progress.report({ message: 'stage changes', increment: 10 });
			await git.stage();
			progress.report({ message: 'commit changes', increment: 10 });
			await git.commit(inputCommitInfo);
		}

		progress.report({ message: 'push changes', increment: 10 });
		await git.push(checkoutBranch, [PushArg.SetUpstream]);
		window.showInformationMessage(`Successfully pushed changes to ${checkoutBranch}`);
	} catch (error) {
		const message = error.message || 'An unexpected error occured';
		window.showErrorMessage(message);
	}
}

async function getCheckoutBranch(currentBranch: string, commitMessage: string) {
	if (currentBranch.startsWith('master')) {
		const branchName = commitMessage ? commitMessage.replace(/\s/g, '-') : currentBranch;
		const pushToShownBranch = 'push to shown branch';
		const selection = await window.showInformationMessage(
			`Current branch is master. Do you want to push to ${branchName} instead?`,
			pushToShownBranch,
			'push to master'
		);
		return selection === pushToShownBranch
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