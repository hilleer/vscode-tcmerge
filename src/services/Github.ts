// export const GITHUB_BASE_API_URL = 'https://api.github.com';
// export const GITHUB_TOKEN = 'e0d9f866eca8cfdcd66391f4a967f46ebe7451f2';
import fetch from 'node-fetch';

const GITHUB_BASE_API_URL = 'https://api.github.com';

export default class Github {
	private baseApiUrl: string;

	constructor() {
		this.baseApiUrl = GITHUB_BASE_API_URL;
	}

	public async createPullRequest(title: string, head: string, accessToken: string) {
		const res = await fetch(`${this.baseApiUrl}/repos/hilleer/vscode-nocms-test/pulls?access_token=${accessToken}`, {
			method: 'post',
			body: JSON.stringify({
				title, // required; Title of the pull request: string
				head, // required: The name of the branch where your changes are implemented: string
				base: 'master', // required: The name of the branch you want the changes pulled into. This should be an existing branch on the current repository. string
				maintainer_can_modify: true
			})
		});
		const json = await res.json();
		if (json.message && json.message === 'Validation Failed') {
			throw json.errors[0].message;
		}
		if (json.message === 'Bad credentials') {
			throw new Error('Github authorization failed. Please make sure your token was given necessary rights');
		}

		return json;
	}

	public async listPullRequests(accessToken: string) {
		const res = await fetch(`${this.baseApiUrl}/repos/hilleer/vscode-nocms-test/pulls?access_token=${accessToken}`);
		return res.json();
	}
}