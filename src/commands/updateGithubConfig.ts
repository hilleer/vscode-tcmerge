import { window } from 'vscode';

import {
	getWorkspaceConfiguration,
	updateWorkspaceDetails
} from '../utils/config';
import { getGitRepoIfno } from '../utils/git';

export async function main() {
	const workspaceConfiguration = getWorkspaceConfiguration();
	try {
		const gitInfo = await getGitRepoIfno();
		const { owner, origin } = gitInfo;
		await updateWorkspaceDetails({ workspaceConfiguration, owner, origin });
	} catch (error) {
		window.showWarningMessage('Something went wrong updating config...');
		return;
	}
}