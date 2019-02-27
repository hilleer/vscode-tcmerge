import { window } from 'vscode';

import { executeTerminalCommand } from '../utils/terminal';
import { Git } from '../services/Git';

type CreateReadyBranch = {
	git: Git;
};

export async function main({ git }: CreateReadyBranch): Promise<void> {
	const currentBranch = await git.getCurrentBranch();

	if (/^master$/.test(currentBranch)) {
		window.showInformationMessage('You are currently on master branch. It is not possible to create a ready-branch while on master');
		return;
	}

	const selection = await window.showInformationMessage(`Create ready branch of branch ${currentBranch}?`, 'yes', 'cancel');

	if (selection !== 'yes') {
		return;
	}

	const timestamp = Date.now();
	const readyBranch = `ready/${currentBranch}/${timestamp}`;

	try {
		await executeTerminalCommand(
			'git',
			[
				'push',
				'origin',
				`${currentBranch}:${readyBranch}`
			]
		);
		window.showInformationMessage(`Successfully created ready branch of ${currentBranch}`);
	} catch (error) {
		window.showErrorMessage(error);
		return;
	}
}