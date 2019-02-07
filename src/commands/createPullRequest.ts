import { window } from 'vscode';
const opn = require('opn');

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

		const currentBranch = await getCurrentBranch();
		const { html_url} = await github.createPullRequest(pullRequestTitle, currentBranch, githubAccessToken);
		const selection = await window.showInformationMessage('Successfully created pull request!', 'close', 'Open pull request');
		if (selection === 'Open pull request') {
			opn(html_url);
		}
	} catch (error) {
		window.showErrorMessage(error);
		return;
	}
}