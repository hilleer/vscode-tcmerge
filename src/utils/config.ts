import { WorkspaceConfiguration, workspace } from 'vscode';

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
	return workspace.getConfiguration('vscode-tcmerge');
}

export function isConfigSet(config: ExtensionWorkspaceConfig): boolean {
	const inspectName = config.inspect(ConfigOption.name);
	const inspectOwner = config.inspect(ConfigOption.owner);

	return Boolean(inspectName.workspaceValue) && Boolean(inspectOwner.workspaceValue);
}

type Updateconfig = {
	workspaceConfig: ExtensionWorkspaceConfig;
	origin: string;
	owner: string;
};

export async function updateConfig({ workspaceConfig, origin, owner }: Updateconfig): Promise<void> {
	await workspaceConfig.update('repositoryName', origin);
	await workspaceConfig.update('repositoryOwner', owner);
}