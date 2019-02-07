import { window } from 'vscode';
const opn = require('opn');

import { getCurrentBranch } from '../utils/git';
import Github, { } from '../services/Github';
import AccessToken from '../services/AccessToken';
import { getAccesstokenFromInput } from './accessToken';

type CreatePullRequest = {
	github: Github;
	accessToken: AccessToken;
};

export async function main({ github, accessToken }: CreatePullRequest) {

	const currentBranch = await getCurrentBranch();

	if (currentBranch === 'master') {
		window.showInformationMessage(`Current branch is master, please go to the right branch and try again`);
		return;
	}

	const hasAccessToken = await accessToken.hasAccessToken();
	if (!hasAccessToken) {
		const continueCreatingPullRequest = await setAccessToken(accessToken);
		if (!continueCreatingPullRequest) {
			return;
		}
	}

	const githubAccessToken = await accessToken.getAccesstoken();
	try {
		const pullRequestTitle: string = await window.showInputBox({ prompt: 'Please type in the title of the pull-request', ignoreFocusOut: true });
		if (!pullRequestTitle) {
			return;
		}

		const { html_url } = await github.createPullRequest(pullRequestTitle, currentBranch, githubAccessToken);
		const selection = await window.showInformationMessage('Successfully created pull request!', 'close', 'Open pull request');
		if (selection === 'Open pull request') {
			opn(html_url);
		}
	} catch (error) {
		window.showErrorMessage(error);
		return;
	}
}

async function setAccessToken(accessToken: AccessToken): Promise<boolean> {
	const setAccessTokenAnswer = await window.showInformationMessage('Access token not set yet. Do you want to set it now?', 'Close', 'Yes');
	switch (setAccessTokenAnswer) {
		case 'Yes':
			try {
				const inputAccessToken = await getAccesstokenFromInput();
				await accessToken.setAccessToken(inputAccessToken);

				const createPullRequestNow = await window.showInformationMessage('Access token set! Create pull request now?', 'Close', 'Yes');

				if (createPullRequestNow === 'Yes') {
					return true;
				}
			} catch (error) {
				window.showErrorMessage(error);
				return false;
			}
		default:
			return false;
	}
}