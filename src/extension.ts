'use strict';
import * as vscode from 'vscode';

// import activations from 'activations.json';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "vscode-git" is now active!');
	let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);

	type Activation = {
		activationPath: string;
		activationName: string;
	};

	const activations: Activation[] = [
		{ activationPath: './commands/commitAndPush', activationName: 'commitAndPush' },
		{ activationPath: './commands/createPullRequest', activationName: 'createPullRequest'}
	];

	for (const activation of activations) {
		const { activationPath, activationName } = activation;
		const command = registerCommand(activationPath, activationName);
		context.subscriptions.push(command);
	}
}

function registerCommand(activationPath: string, activationName: string): vscode.Disposable {
	const activation = require(activationPath);
	return vscode.commands.registerCommand(`extension.${activationName}`, () => activation.main());
}

// this method is called when your extension is deactivated
export function deactivate() {
}