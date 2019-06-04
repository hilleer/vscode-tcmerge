'use strict';
import { window, commands, Disposable, workspace } from 'vscode';

import Github from './github';
import { AccessToken, createAccessTokenDir } from './accessToken';
import { Git } from './Git';
import { ChildProcess } from './childProcess';

export async function activate() {
	const childProcess = new ChildProcess(workspace.rootPath);
	const git = new Git(childProcess);

	const [gitDetails] = await Promise.all([
		git.getGitDetails(),
		createAccessTokenDir()
	]);

	const accessToken = new AccessToken();
	const github = new Github(gitDetails);

	registerCommand('./commands/commitAndPush', 'commitAndPush', { git });
	registerCommand('./commands/createReadyBranch', 'createReadyBranch', { git });
	registerCommand('./commands/accessToken', 'accessToken', { accessToken });
	registerCommand('./commands/createPullRequest', 'createPullRequest', { github, accessToken, git });
}

function registerCommand(activationPath: string, activationName: string, args: any): Disposable {
	const activation = require(activationPath);
	return commands.registerCommand(`extension.${activationName}`, () => activation.main(args));
}

// this method is called when your extension is deactivated
export function deactivate() {
	return window.showInformationMessage('Successfully deactivated extension');
}