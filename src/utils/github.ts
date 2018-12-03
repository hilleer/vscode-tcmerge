// export const GITHUB_BASE_API_URL = 'https://api.github.com';
// export const GITHUB_TOKEN = 'e0d9f866eca8cfdcd66391f4a967f46ebe7451f2';
import fetch from 'node-fetch';

// export function getGithubToken(): string {

// }

export default class Github {
	private token: string;
	private baseApiUrl: string;
	constructor(GITHUB_TOKEN: string, GITHUB_BASE_API_URL: string) {
		this.token = GITHUB_TOKEN;
		this.baseApiUrl = GITHUB_BASE_API_URL;
	}

	public async createPullRequest(title: string, head: string) {
		const res = await fetch(`${this.baseApiUrl}/repos/hilleer/vscode-nocms-test/pulls?access_token=${this.token}`, {
			method: 'post',
			body: JSON.stringify({
				title, // required; Title of the pull request: string
				head, // required: The name of the branch where your changes are implemented: string
				base: 'master', // required: The name of the branch you want the changes pulled into. This should be an existing branch on the current repository. string
				maintainer_can_modify: true
			})
		});
		return res.json();
	}

	public async listPullRequests() {
		const res = await fetch(`${this.baseApiUrl}/repos/hilleer/vscode-nocms-test/pulls?access_token=${this.token}`);
		return res.json();
	}
}