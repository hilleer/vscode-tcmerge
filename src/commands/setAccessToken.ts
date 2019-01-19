import { window } from 'vscode';
import open from 'open';
import AccessToken from '../services/AccessToken';

const GITHUB_ACCESS_TOKEN_URL = 'https://github.com/settings/tokens/new';

export async function main({ accessToken }: { accessToken: AccessToken }) {
	const inputAccessToken = await getAccesstokenFromInput();

	if (!inputAccessToken) {
		return;
	}

	try {
		await accessToken.setAccessToken(inputAccessToken);
		window.showInformationMessage('Access token successfully saved!');
	} catch (error) {
		window.showErrorMessage('Something went wrong saving access token.');
	}
}

export async function getAccesstokenFromInput(): Promise<string> {
	const openGithubSettings = await window.showInformationMessage('Create and copy-paste your personal access token on Github', 'Close', 'Open Github', 'Insert');

	if (openGithubSettings.toLowerCase() === 'close') {
		return '';
	}

	if (openGithubSettings.toLowerCase() === 'open github') {
		open(GITHUB_ACCESS_TOKEN_URL);
	}

	const inputAccessToken = await window.showInputBox({
		ignoreFocusOut: true,
		placeHolder: 'access token',
		prompt: 'Please insert your access token'
	});

	if (!inputAccessToken) {
		window.showInformationMessage('Access token was not saved');
		return '';
	}

	if (/^\s*$/.test(inputAccessToken)) {
		window.showWarningMessage('Empty access token was provided');
		return '';
	}
	return inputAccessToken;
}