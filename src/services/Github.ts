// export const GITHUB_BASE_API_URL = 'https://api.github.com';
// export const GITHUB_TOKEN = 'e0d9f866eca8cfdcd66391f4a967f46ebe7451f2';
import fetch from 'node-fetch';

const GITHUB_BASE_API_URL = 'https://api.github.com';

type GithubArgs = {
	owner: string;
	origin: string;
};

export default class Github {
	private baseApiUrl: string;
	private origin: string;
	private owner: string;

	constructor({ origin, owner }: GithubArgs) {
		this.baseApiUrl = GITHUB_BASE_API_URL;
		this.origin = origin;
		this.owner = owner;
	}

	public async createPullRequest(title: string, head: string, accessToken: string) {
		const url = `${this.baseApiUrl}/repos/${this.owner}/${this.origin}/pulls?access_token=${accessToken}`;
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