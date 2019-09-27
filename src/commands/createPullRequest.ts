import { window, env, Uri } from 'vscode';

import Github, { GithubPullRequestExistError, GithubNotFoundError, GithubBadCredentialsError } from '../github';
import { AccessToken } from '../accessToken';
import { getAccesstokenFromInput } from './accessToken';
import { Git } from '../Git';

type CreatePullRequestArgs = {
	github: Github;
	accessToken: AccessToken;
	git: Git;
};

const OPEN_PULL_REQUEST = 'Open pull request';

export async function main({ github, accessToken, git }: CreatePullRequestArgs): Promise<void> {

	const currentBranch = await git.getCurrentBranch();

	if (currentBranch === 'master') {
		window.showInformationMessage(`Current branch is master, please go to the right branch and try again`);
		return;
	}

	const hasAccessToken = await accessToken.hasAccessToken();

	if (!hasAccessToken) {
		const shouldCreatePullRequest = await setAccessToken(accessToken);
		if (!shouldCreatePullRequest) {
			return;
		}
	}

	const githubAccessToken = await accessToken.getAccesstoken();
	try {
		const pullRequestTitle: string = await window.showInputBox({
			value: currentBranch,
			prompt: 'Please type in the title of the pull request',
			placeHolder: 'Type in the title of the pull request',
			ignoreFocusOut: true
		});

		if (!pullRequestTitle) {
			return;
		}

		const { html_url } = await github.createPullRequest(pullRequestTitle, currentBranch, githubAccessToken);
		const selection = await window.showInformationMessage(
			'Successfully created pull request!',
			'close',
			OPEN_PULL_REQUEST
		);
		if (selection === OPEN_PULL_REQUEST && html_url) {
			env.openExternal(Uri.parse(html_url));
		}
	} catch (error) {
		await handleError(error, github, currentBranch, githubAccessToken);
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

async function showErrorMessage(error: any) {
	return window.showErrorMessage(error);
}

type CreatePullRequestError =
	GithubNotFoundError
	| GithubBadCredentialsError
	| GithubPullRequestExistError
	| GithubBadCredentialsError
	| Error
	| any;

async function handleError(error: CreatePullRequestError, github: Github, currentBranch: string, githubAccessToken: string) {
	if (error instanceof GithubPullRequestExistError) {
		const openPullRequestSelection = await window.showErrorMessage(
			error.message,
			OPEN_PULL_REQUEST
		);
		const shouldOpenPullRequest = openPullRequestSelection === OPEN_PULL_REQUEST;
		const pullRequestUrl = await github.getBranchPullRequestUrl(currentBranch, githubAccessToken);
		shouldOpenPullRequest && env.openExternal(Uri.parse(pullRequestUrl));
		return;
	}
	if (error.message) {
		showErrorMessage(error.message);
		return;
	}
	showErrorMessage(error);
}