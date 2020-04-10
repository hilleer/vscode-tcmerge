'use strict';
import { window, commands, workspace } from 'vscode';

import Github from './github';
import { AccessToken, createAccessTokenDir } from './accessToken';
import { Git } from './Git';
import { ChildProcess } from './childProcess';

import { main as commitAndPushCommand } from './commands/commitAndPush';
import { main as accessTokenCommand } from './commands/accessToken';
import { main as createPullRequestCommand } from './commands/createPullRequest';
import { main as createReadyBranchCommand } from './commands/createReadyBranch';

export async function activate() {
	const childProcess = new ChildProcess(workspace.rootPath);
	const git = new Git(childProcess);

	const [gitDetails] = await Promise.all([
		git.getGitDetails(),
		createAccessTokenDir()
	]);

	const accessToken = new AccessToken();
	const github = new Github(gitDetails);

	commands.registerCommand('extension.accessToken', () => accessTokenCommand({ accessToken }));
	commands.registerCommand('extension.commitAndPush', () => commitAndPushCommand({ git }));
	commands.registerCommand('extension.createReadyBranch', () => createReadyBranchCommand({ git }));
	commands.registerCommand('extension.createPullRequest', () => createPullRequestCommand({ git, github, accessToken }));
}

// this method is called when your extension is deactivated
export function deactivate() {
	return window.showInformationMessage('Successfully deactivated extension');
}