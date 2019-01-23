import { window } from 'vscode';

import { getCurrentBranch } from '../utils/git';
import { executeTerminalCommand } from '../utils/terminal';

type CreateReadyBranch = {
};

export async function main({ }: CreateReadyBranch): Promise<void> {
	const currentBranch = await getCurrentBranch();

	if (/^master$/.test(currentBranch)) {
		window.showInformationMessage('You are currently checked-in branch is master. You can\'t create a ready branch of master');
		return;
	}

	const clicked = await window.showInformationMessage(`Creating ready branch of ${currentBranch}. Do you want to continue?`, 'yes', 'no');

	if (clicked !== 'yes') {
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