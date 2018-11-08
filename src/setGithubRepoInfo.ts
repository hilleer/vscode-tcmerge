import {
	getGithubRepositoryInfo
} from './utils/git';
import { isConfigSet, getWorkspaceConfig } from './utils/config';

export default async function(): Promise<void> {
	const config = getWorkspaceConfig();
	console.log('configuration: ', config);
	const gitInfo = await getGithubRepositoryInfo();
	const configIsSet = isConfigSet(config);
	console.log('set?', configIsSet);

	try {
		// await configuration.update(VscodeGitConfig.name, gitInfo.origin);
		// await configuration.update(VscodeGitConfig.owner, gitInfo.owner);
	} catch (error) {
		console.log('error: ', error);
	}

	console.log('git info owner: ', gitInfo);
}