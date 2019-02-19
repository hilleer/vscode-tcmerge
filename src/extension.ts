'use strict';
import * as vscode from 'vscode';

import Github from './services/Github';
import AccessToken from './services/AccessToken';
import setGitInfo from './setGitInfo';
import { Settings } from './services/Settings';

export async function activate() {
	const gitConfig = await setGitInfo();

	const settings = new Settings();
	const tokenPath = settings.getTokenPath();
	const accessToken = new AccessToken(tokenPath);
	const github = new Github(gitConfig);

	registerCommand('./commands/commitAndPush', 'commitAndPush', {});
	registerCommand('./commands/createReadyBranch', 'createReadyBranch', {});
	registerCommand('./commands/updateGithubConfig', 'updateGithubConfig', {});
	registerCommand('./commands/accessToken', 'accessToken', {});
	registerCommand('./commands/createPullRequest', 'createPullRequest', { github, accessToken });
}

function registerCommand(activationPath: string, activationName: string, args: any): vscode.Disposable {
	const activation = require(activationPath);
	return vscode.commands.registerCommand(`extension.${activationName}`, () => activation.main(args));
}

// this method is called when your extension is deactivated
export function deactivate() {
	return vscode.window.showInformationMessage('Successfully deactivated extension');
}