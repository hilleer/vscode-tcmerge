import { workspace, WorkspaceConfiguration } from 'vscode';

enum ConfigKey {
	Tmp = ''
}

// Currently unused
export class Config {
	private workspaceConfig: WorkspaceConfiguration;
	constructor() {
		this.workspaceConfig = workspace.getConfiguration('vscode-tcmerge');
	}

	public async updateConfigKey(key: string, value: string | boolean | number): Promise<void> {
		await this.workspaceConfig.update(key, value);
	}

	public getConfigKey(key: ConfigKey) {
		return this.workspaceConfig.get(key);
	}
}