import { window } from 'vscode';
import fetch from 'node-fetch';

import { getCurrentBranch } from '../utils/git';

export async function main({ GITHUB_BASE_API_URL, GITHUB_TOKEN }: { GITHUB_BASE_API_URL: string, GITHUB_TOKEN: string }) {
	console.log('api : ', GITHUB_BASE_API_URL);
	console.log('token: ', GITHUB_TOKEN);
	try {
		const pullRequestTitle: string = await window.showInputBox({ prompt: 'Please type in the title of the pull-request', ignoreFocusOut: true });
		const pullRequests = await listPullRequests(GITHUB_BASE_API_URL, GITHUB_TOKEN);
		console.log('pullRequests: ', pullRequests);
		const createdPullRequest = await createPullRequest({ GITHUB_BASE_API_URL, GITHUB_TOKEN, title: pullRequestTitle });
		console.log('created pull request: ', createdPullRequest);

	} catch (error) {
		throw error;
	}
}


interface CreatePullRequest {
	GITHUB_BASE_API_URL: string;
	GITHUB_TOKEN: string;
	title: string;
}

async function createPullRequest({ GITHUB_BASE_API_URL, GITHUB_TOKEN, title }: CreatePullRequest) {
	const currentBranch = await getCurrentBranch();
	const res = await fetch(`${GITHUB_BASE_API_URL}/repos/hilleer/vscode-nocms-test/pulls?access_token=${GITHUB_TOKEN}`, {
		method: 'post',
		body: JSON.stringify({
			title, // required; Title of the pull request: string
			head: currentBranch, // required: The name of the branch where your changes are implemented: string
			base: 'master', // required: The name of the branch you want the changes pulled into. This should be an existing branch on the current repository. string
			body: '', // contents of the pull request: string
			maintainer_can_modify: true
		})
	});
	return res.json();
}

async function listPullRequests(GITHUB_BASE_API_URL: string, GITHUB_TOKEN: string) {
	const res = await fetch(`${GITHUB_BASE_API_URL}/repos/hilleer/vscode-nocms-test/pulls?access_token=${GITHUB_TOKEN}`);
	return res.json();
}