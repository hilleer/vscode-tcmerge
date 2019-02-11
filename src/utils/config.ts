import { WorkspaceConfiguration, workspace } from 'vscode';
import { RepositoryDetails } from './git';

enum ConfigOption {
	Origin = 'origin',
	Owner = 'owner'
}

export function getWorkspaceConfiguration(): WorkspaceConfiguration {
	return workspace.getConfiguration('vscode-tcmerge');
}

export function getRepositoryDetails(): RepositoryDetails {
	const workspaceConfiguration = getWorkspaceConfiguration();
	return {
		origin: workspaceConfiguration.get('origin'),
		owner: workspaceConfiguration.get('owner')
	};
}

export function isWorkspaceConfigSet(config: WorkspaceConfiguration): boolean {
	const inspectName = config.inspect(ConfigOption.Origin);
	const inspectOwner = config.inspect(ConfigOption.Owner);

	return Boolean(inspectName.workspaceValue) && Boolean(inspectOwner.workspaceValue);
}

type Updateconfig = {
	workspaceConfiguration: WorkspaceConfiguration;
	origin: string;
	owner: string;
};
export async function updateWorkspaceDetails({ workspaceConfiguration, origin, owner }: Updateconfig): Promise<RepositoryDetails> {
	await workspaceConfiguration.update('origin', origin);
	await workspaceConfiguration.update('owner', owner);
	return {
		origin,
		owner
	};
}