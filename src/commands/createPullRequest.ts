import fetch from 'node-fetch';
import { BASE_API_URL, GITHUB_TOKEN } from '../utils/github';

export async function main() {
	const pullRequests = await listPullRequests();
	console.log('pullRequests: ', pullRequests);
	const createdPullRequest = await createPullRequest();
	console.log('created pull request: ', createdPullRequest);
}

async function createPullRequest() {
	const res = await fetch(`${BASE_API_URL}/repos/hilleer/vscode-nocms-test/pulls?access_token=${GITHUB_TOKEN}`, {
		method: 'post',
		body: JSON.stringify({
			title: 'CREATE AN API PULL REQUEST', // required; Title of the pull request: string
			head: 'create-pull-request-of-me', // required: The name of the branch where your changes are implemented: string
			base: 'master', // required: The name of the branch you want the changes pulled into. This should be an existing branch on the current repository. string
			body: '', // contents of the pull request: string
			maintainer_can_modify: true
		})
	});
	return res.json();
}

async function listPullRequests() {
	const res = await fetch(`${BASE_API_URL}/repos/hilleer/vscode-nocms-test/pulls?access_token=${GITHUB_TOKEN}`);
	return res.json();
}