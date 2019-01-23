import { window } from 'vscode';

import AccessToken from "../services/AccessToken";

export async function main({ accessToken }: { accessToken: AccessToken }): Promise<void> {
	try {
		await accessToken.removeAccessToken();
		window.showInformationMessage('Successfully deleted access token!');
	} catch (error) {
		window.showErrorMessage('Something went wrong deleting access token...');
	}
}