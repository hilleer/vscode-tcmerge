import { window } from 'vscode';

import { getCurrentBranch } from '../utils/git';
import Github, { } from '../services/Github';
import AccessToken from '../services/AccessToken';

type CreatePullRequest = {
	github: Github;
	accessToken: AccessToken;
};

export async function main({ github, accessToken }: CreatePullRequest) {

	const hasAccessToken = await accessToken.hasAccessToken();
	if (!hasAccessToken) {
		window.showInformationMessage('Access token not set. Please set it using command "tcmerge: Set Github access token" and try again');
		return;
	}
	const githubAccessToken = await accessToken.getAccesstoken();
	try {
		const pullRequestTitle: string = await window.showInputBox({ prompt: 'Please type in the title of the pull-request', ignoreFocusOut: true });
		if (!pullRequestTitle) {
			return;
		}
		const pullRequests = await github.listPullRequests(githubAccessToken);
		console.log('pullRequests: ', pullRequests);
		const currentBranch = await getCurrentBranch();
		const createdPullRequest = await github.createPullRequest(pullRequestTitle, currentBranch, githubAccessToken);
		console.log('created pull request: ', createdPullRequest);
		return;
	} catch (error) {
		window.showErrorMessage(error);
	}
}