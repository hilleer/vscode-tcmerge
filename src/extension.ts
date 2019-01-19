'use strict';
import * as vscode from 'vscode';

import setGithubRepoInfo from './setGithubRepoInfo';
import Github from './services/Github';
import AccessToken from './services/AccessToken';

type Activation = {
	activationPath: string;
	activationName: string;
	args?: any
};

export async function activate(context: vscode.ExtensionContext) {
	setGithubRepoInfo();
	const accessToken = new AccessToken();
	const github = new Github();

	const activations: Activation[] = [
		{ activationPath: './commands/commitAndPush', activationName: 'commitAndPush', args: {} },
		{ activationPath: './commands/createReadyBranch', activationName: 'createReadyBranch', args: {} },
		{ activationPath: './commands/updateGithubConfig', activationName: 'updateGithubConfig', args: {} },
		{ activationPath: './commands/setAccessToken', activationName: 'setAccessToken', args: { accessToken } },
		{ activationPath: './commands/createPullRequest', activationName: 'createPullRequest', args: { github, accessToken } },
		{ activationPath: './commands/deleteAccessToken', activationName: 'deleteAccessToken', args: { accessToken } }
	];

	for (const activation of activations) {
		const { activationPath, activationName, args } = activation;
		const command = registerCommand(activationPath, activationName, args);
		context.subscriptions.push(command);
	}
}

function registerCommand(activationPath: string, activationName: string, args: any): vscode.Disposable {
	const activation = require(activationPath);
	return vscode.commands.registerCommand(`extension.${activationName}`, () => activation.main(args));
}

// this method is called when your extension is deactivated
export function deactivate() {
}