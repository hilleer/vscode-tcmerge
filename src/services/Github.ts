import fetch from 'node-fetch';
import { Git } from './Git';

const GITHUB_BASE_API_URL = 'https://api.github.com';

export default class Github {
	private baseApiUrl: string;
	private git: Git;

	constructor(git: Git) {
		this.baseApiUrl = GITHUB_BASE_API_URL;
		this.git = git;
	}

	public async createPullRequest(title: string, head: string, accessToken: string) {
		const { origin, owner } = await this.git.getGitDetails();
		const url = `${this.baseApiUrl}/repos/${owner}/${origin}/pulls?access_token=${accessToken}`;
		const res = await fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				title, // required; Title of the pull request: string
				head, // required: The name of the branch where your changes are implemented: string
				base: 'master', // required: The name of the branch you want the changes pulled into. This should be an existing branch on the current repository. string
			})
		});
		const json = await res.json();

		if (json.message && json.message === 'Validation Failed') {
			throw json.errors[0].message;
		}
		if (json.message === 'Bad credentials') {
			throw new Error('Github authorization failed. Please make sure your token was given necessary rights');
		}

		if (json.message === 'Not Found') {
			throw new Error('Failed to create pull request. If problem persist, try updating your access token');
		}

		return json;
	}

	public async listPullRequests(accessToken: string) {
		const res = await fetch(`${this.baseApiUrl}/repos/hilleer/vscode-nocms-test/pulls?access_token=${accessToken}`);
		return res.json();
	}
}