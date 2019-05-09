import { window } from 'vscode';

import { Git } from '../Git';

type CreateReadyBranchArgs = {
	git: Git;
};

export async function main({ git }: CreateReadyBranchArgs): Promise<void> {
	const currentBranch = await git.getCurrentBranch();

	if (currentBranch.startsWith('master')) {
		window.showInformationMessage('You are currently on master branch. It is not possible to create a ready-branch while on master');
		return;
	}

	const selection = await window.showInformationMessage(`Create ready branch of branch ${currentBranch}?`, 'Create ready branch', 'cancel');

	if (!selection || selection !== 'Create ready branch') {
		return;
	}

	const timestamp = Date.now();
	const readyBranch = `${currentBranch}:ready/${currentBranch}/${timestamp}`;

	try {
		await git.push(readyBranch);
		window.showInformationMessage(`Successfully created ready branch of ${currentBranch}`);
	} catch (error) {
		window.showErrorMessage(error);
		return;
	}
}