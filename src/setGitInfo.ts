import { window } from 'vscode';

import {
	getGitRepoIfno, RepositoryDetails
} from './utils/git';
import {
	isWorkspaceConfigSet,
	getWorkspaceConfiguration,
	updateWorkspaceDetails,
	getRepositoryDetails
} from './utils/config';

export default async function(): Promise<RepositoryDetails> {
	const workspaceConfiguration = getWorkspaceConfiguration();
	const configIsSet = isWorkspaceConfigSet(workspaceConfiguration);

	if (configIsSet) {
		return getRepositoryDetails();
	}

	window.setStatusBarMessage('Saving Git info to config...', 7500);
	const gitInfo = await getGitRepoIfno();
	const repositoryDetails = await updateWorkspaceDetails({ workspaceConfiguration, origin: gitInfo.origin, owner: gitInfo.owner });
	return {
		...repositoryDetails
	};
}