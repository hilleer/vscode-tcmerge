import { window } from 'vscode';

import {
	getWorkspaceConfig,
	updateConfig
} from '../utils/config';
import { getGithubRepositoryInfo } from '../utils/git';

export async function main() {
	const workspaceConfig = getWorkspaceConfig();
	try {
		const gitInfo = await getGithubRepositoryInfo();
		const { owner, origin } = gitInfo;
		await updateConfig({ workspaceConfig, owner, origin });
	} catch (error) {
		console.error(error);
		window.showWarningMessage('Something went wrong updating config...');
		return;
	}
}