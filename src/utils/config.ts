import * as vscode from 'vscode';
import { WorkspaceConfiguration } from 'vscode';

interface ExtensionWorkspaceConfig extends WorkspaceConfiguration {
	repositoryName?: RepositoryName | null;
	repositoryOwner?: RepositoryOwner | null;
}

type RepositoryName = {

};

type RepositoryOwner = {

};

enum ConfigOption {
	name = 'repositoryName',
	owner = 'repositoryOwner'
}

export function getWorkspaceConfig(): ExtensionWorkspaceConfig {
	return vscode.workspace.getConfiguration('vscode-git');
}

export function isConfigSet(config: ExtensionWorkspaceConfig): boolean {
	const inspectName = config.inspect(ConfigOption.name);
	console.log('inspect name: ', inspectName);
	const inspectOwner = config.inspect(ConfigOption.owner);
	console.log('inspect owner: ', inspectOwner);
	console.log('sinecpt owner has it! ', inspectOwner.hasOwnProperty('workspaceValue'));
	if (
		inspectName.hasOwnProperty('workspaceValue') &&
		inspectName.workspaceValue !== inspectName.defaultValue &&
		inspectOwner.hasOwnProperty('workspaceValue') &&
		inspectOwner.workspaceValue !== inspectOwner.defaultValue
	) {
		return true;
	}
	return false;
}

export function updateConfig() {

}