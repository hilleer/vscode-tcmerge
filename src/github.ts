import fetch from 'node-fetch';

const GITHUB_BASE_API_URL = 'https://api.github.com';

export default class Github {
	private baseUrl: string;
	private owner: string;
	private origin: string;

	constructor({ owner, origin }: { owner: string, origin: string }) {
		this.baseUrl = GITHUB_BASE_API_URL;
		this.origin = origin;
		this.owner = owner;
	}

	public async createPullRequest(title: string, head: string, accessToken: string, isDraft: boolean) {
		const url = `${this.baseUrl}/repos/${this.owner}/${this.origin}/pulls`;
		const res = await fetch(url, {
			method: 'POST',
			headers: { Authorization: `token ${accessToken}` },
			body: JSON.stringify({
				title, // required; Title of the pull request: string
				head, // required: The name of the branch where your changes are implemented: string
				base: 'master', // required: The name of the branch you want the changes pulled into. This should be an existing branch on the current repository. string
				draft: isDraft
			})
		});
		const json = await res.json();

		if (json.message && json.message === 'Validation Failed') {
			const message: string = json.errors[0].message;
			const isPullRequestExistError = message && /pull request already exists/i.test(message);
			const error = isPullRequestExistError
				? new GithubPullRequestExistError(message)
				: new GithubValidationFailedError(message);
			throw error;
		}
		if (json.message === 'Bad credentials') {
			throw new GithubBadCredentialsError('Github authorization failed. Please make sure your token was given necessary rights');
		}

		if (json.message === 'Not Found') {
			throw new GithubNotFoundError('Failed to create pull request. If problem persist, try updating your access token');
		}

		return json;
	}

	public async getBranchPullRequestUrl(branch: string, accessToken: string) {
		const pullRequests: any[] = await this.listPullRequests(accessToken);

		if (!pullRequests || pullRequests.length < 0) {
			return null;
		}

		const isPullRequest = (pr: any) => pr && pr.head && pr.head.ref && pr.head.ref === branch;
		const pullRequest = pullRequests.find(isPullRequest);

		return pullRequest.html_url;
	}

	private async listPullRequests(accessToken: string) {
		const res = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.origin}/pulls?access_token=${accessToken}`);
		return res.json();
	}
}

export class GithubNotFoundError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class GithubBadCredentialsError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class GithubValidationFailedError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class GithubPullRequestExistError extends Error {
	constructor(message: string) {
		super(message);
	}
}