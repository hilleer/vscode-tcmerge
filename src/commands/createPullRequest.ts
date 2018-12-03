import { window } from 'vscode';
import fetch from 'node-fetch';

import { getCurrentBranch } from '../utils/git';
import Github, { } from '../utils/Github';

type CreatePullRequest = {
	github: Github;
};

export async function main({ github }: CreatePullRequest) {
	try {
		const pullRequestTitle: string = await window.showInputBox({ prompt: 'Please type in the title of the pull-request', ignoreFocusOut: true });
		if (!pullRequestTitle) {
			return;
		}
		const pullRequests = await github.listPullRequests();
		console.log('pullRequests: ', pullRequests);
		const currentBranch = await getCurrentBranch();
		const createdPullRequest = await github.createPullRequest(pullRequestTitle, currentBranch);
		console.log('created pull request: ', createdPullRequest);
		return;
	} catch (error) {
		throw error;
	}
}