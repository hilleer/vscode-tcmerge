import { window } from 'vscode';

import {
	getGithubRepositoryInfo
} from './utils/git';
import {
	isConfigSet,
	getWorkspaceConfig,
	updateConfig
} from './utils/config';

export default async function(): Promise<void> {
	const workspaceConfig = getWorkspaceConfig();
	const configIsSet = isConfigSet(workspaceConfig);

	if (!configIsSet) {
		window.showInformationMessage('Config for GitHub repository not properly set. Trying to update it automatically....');
		try {
			const gitInfo = await getGithubRepositoryInfo();
			await updateConfig({ workspaceConfig, origin: gitInfo.origin, owner: gitInfo.owner });
		} catch (error) {
			console.error('error: ', error);
			window.showWarningMessage('Something went wrong trying to update GitHub repository info....');
		}
	}
}