'use strict';
import * as vscode from 'vscode';

// import activations from 'activations.json';
import setGithubRepoInfo from './setGithubRepoInfo';
import Github from './utils/github';
export const GITHUB_BASE_API_URL = 'https://api.github.com';
export const GITHUB_TOKEN = 'e0d9f866eca8cfdcd66391f4a967f46ebe7451f2';

type Activation = {
	activationPath: string;
	activationName: string;
	args: any
};

export function activate(context: vscode.ExtensionContext) {
	setGithubRepoInfo();

	const github = new Github(GITHUB_TOKEN, GITHUB_BASE_API_URL);

	const activations: Activation[] = [
		{ activationPath: './commands/commitAndPush', activationName: 'commitAndPush', args: {} },
		{ activationPath: './commands/createPullRequest', activationName: 'createPullRequest', args: { github } },
		{ activationPath: './commands/createReadyBranch', activationName: 'createReadyBranch', args: {} },
		{ activationPath: './commands/updateGithubConfig', activationName: 'updateGithubConfig', args: {} },
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