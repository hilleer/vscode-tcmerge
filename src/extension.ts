'use strict';
import * as vscode from 'vscode';

// import activations from 'activations.json';
import setGithubRepoInfo from './setGithubRepoInfo';
import { GITHUB_BASE_API_URL, GITHUB_TOKEN } from './utils/github';

export function activate(context: vscode.ExtensionContext) {
	setGithubRepoInfo();

	console.log('Congratulations, your extension "vscode-git" is now active!');
	const disposable = vscode.commands.registerCommand('extension.sayHello', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);

	type Activation = {
		activationPath: string;
		activationName: string;
		args: any
	};

	const activations: Activation[] = [
		{ activationPath: './commands/commitAndPush', activationName: 'commitAndPush', args: {} },
		{ activationPath: './commands/createPullRequest', activationName: 'createPullRequest', args: { GITHUB_BASE_API_URL, GITHUB_TOKEN } },
		{ activationPath: './commands/updateGithubConfig', activationName: 'updateGithubConfig', args: {} }
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