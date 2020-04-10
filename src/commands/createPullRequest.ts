import { window, env, Uri, workspace } from 'vscode';

import Github, { GithubPullRequestExistError } from '../github';
import { AccessToken } from '../accessToken';
import { getAccesstokenFromInput } from './accessToken';
import { Git } from '../Git';

type CreatePullRequestArgs = {
	github: Github;
	accessToken: AccessToken;
	git: Git;
};

enum PullRequestType {
	Draft = 'Draft',
	Regular = 'Regular'
}

const OPEN_PULL_REQUEST = 'Open pull request';

export async function main({ github, accessToken, git }: CreatePullRequestArgs): Promise<void> {
	const config = workspace.getConfiguration();
	const useDraftPullRequest = config.get('tcmerge.useDraftPullRequest');

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

		let draftPullRequest = false;
		if (useDraftPullRequest) {
			const draftResponse = await window.showInformationMessage('Please select pull request type', PullRequestType.Draft, PullRequestType.Regular);
			
			if (draftResponse === PullRequestType.Draft) {
				draftPullRequest = true;
			}
		}

		const { html_url } = await github.createPullRequest(pullRequestTitle, currentBranch, githubAccessToken, draftPullRequest);
		const selection = await window.showInformationMessage(
			'Successfully created pull request!',
			'Close',
			OPEN_PULL_REQUEST
		);
		if (selection === OPEN_PULL_REQUEST && html_url) {
			env.openExternal(Uri.parse(html_url));
		}
	} catch (error) {
		await handleError(error, github, currentBranch, githubAccessToken);
	}
}

// TODO: Refactor - split out responsibility.
async function setAccessToken(accessToken: AccessToken): Promise<boolean> {
	const setAccessTokenAnswer = await window.showInformationMessage(
		'Access token not set yet. Do you want to set it now?',
		'Close',
		'Yes'
	);

	if (setAccessTokenAnswer === 'Yes') {
		try {
			const inputAccessToken = await getAccesstokenFromInput();
			await accessToken.setAccessToken(inputAccessToken);

			const createPullRequestNow = await window.showInformationMessage(
				'Access token set! Create pull request now?',
				'Close',
				'Yes'
			);

			if (createPullRequestNow === 'Yes') {
				return true;
			}
		} catch (error) {
			window.showErrorMessage(error);
			return false;
		}
	}

	return false;
}

async function showErrorMessage(error: any) {
	return window.showErrorMessage(error);
}

async function handleError(error: any, github: Github, currentBranch: string, githubAccessToken: string) {
	console.error(error);
	if (error instanceof GithubPullRequestExistError) {
		const pullRequestUrl = await github.getBranchPullRequestUrl(currentBranch, githubAccessToken);
		const openPullRequestSelection = await window.showInformationMessage(
			error.message,
			(pullRequestUrl && OPEN_PULL_REQUEST) || null
		);
		const shouldOpenPullRequest = openPullRequestSelection === OPEN_PULL_REQUEST;
		shouldOpenPullRequest && pullRequestUrl && env.openExternal(Uri.parse(pullRequestUrl));
		return;
	}
	if (error.message) {
		showErrorMessage(error.message);
		return;
	}
	showErrorMessage(error);
}