import { window } from 'vscode';
import { AccessToken } from '../services/AccessToken';
const opn = require('opn');

const GITHUB_ACCESS_TOKEN_URL = 'https://github.com/settings/tokens/new';

type AccessTokenArgs = { accessToken: AccessToken; };

export async function main({ accessToken }: AccessTokenArgs) {

	const hasAccesstoken = await accessToken.hasAccessToken();

	if (hasAccesstoken) {
		await contributeAccessTokenExists(accessToken);
	} else {
		await contributeSetAccessToken(accessToken);
	}
}

async function contributeAccessTokenExists(accessToken: AccessToken) {
	const contributions: string[] = [
		'Delete access token',
		'Update access token'
	];

	const selectedContribution = await window.showQuickPick(contributions);

	switch (selectedContribution) {
		case 'Delete access token':
			await contributeDeleteAccessToken();
			break;
		case 'Update access token':
			await contributeUpdateAccessToken();
			break;
		default:
			return;
	}

	async function contributeDeleteAccessToken(): Promise<void> {
		const confirmDeletion = await window.showInformationMessage(
			'Are you sure you want to delete your access token? Can\'t be reverted.',
			'Cancel',
			'Confirm'
		);

		if (confirmDeletion !== 'Confirm') {
			return;
		}

		try {
			await accessToken.removeAccessToken();
			window.showInformationMessage('Access token successfully deleted!');
		} catch (error) {
			throw error;
		}
	}

	async function contributeUpdateAccessToken(): Promise<void> {
		const accessTokenInput = await getAccesstokenFromInput();

		if (!accessTokenInput) {
			return;
		}

		const confirmSelection = await window.showInformationMessage('Are you sure you want to overwrite your access token?', 'No', 'Yes');

		if (confirmSelection !== 'Yes') {
			return;
		}

		try {
			await accessToken.setAccessToken(accessTokenInput);
			window.showInformationMessage('Successfully updated access token!');
		} catch (error) {
			window.showWarningMessage('Updating access token failed!', error);
		}
	}
}

async function contributeSetAccessToken(accessToken: AccessToken): Promise<void> {
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
	const openGithubSettings = await window.showInformationMessage(
		'Create and copy-paste your personal access token on Github',
		'Close',
		'Open Github',
		'Insert'
	);

	if (openGithubSettings && openGithubSettings.toLowerCase() === 'close') {
		return undefined;
	}

	if (openGithubSettings && openGithubSettings.toLowerCase() === 'open github') {
		opn(GITHUB_ACCESS_TOKEN_URL);
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
		return undefined;
	}
	return inputAccessToken;
}