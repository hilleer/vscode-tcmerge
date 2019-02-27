'use strict';
import * as vscode from 'vscode';

import Github from './services/Github';
import { AccessToken, createAccessTokenDir } from './services/AccessToken';
import { Git } from './services/Git';

export async function activate() {
	const git = new Git();
	const gitDetails = await git.getGitDetails();

	await createAccessTokenDir();
	const accessToken = new AccessToken();
	const github = new Github(gitDetails);

	registerCommand('./commands/commitAndPush', 'commitAndPush', { git });
	registerCommand('./commands/createReadyBranch', 'createReadyBranch', { git });
	registerCommand('./commands/accessToken', 'accessToken', { accessToken });
	registerCommand('./commands/createPullRequest', 'createPullRequest', { github, accessToken, git });
}

function registerCommand(activationPath: string, activationName: string, args: any): vscode.Disposable {
	const activation = require(activationPath);
	return vscode.commands.registerCommand(`extension.${activationName}`, () => activation.main(args));
}

// this method is called when your extension is deactivated
export function deactivate() {
	return vscode.window.showInformationMessage('Successfully deactivated extension');
}