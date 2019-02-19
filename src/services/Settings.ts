import * as os from 'os';
import * as path from 'path';

const ACCESS_TOKEN_FILE_NAME = 'access_token.txt';

export class Settings {
	public getTokenPath(): string {
		const platform = process.platform;

		let tokenPath: string;
		switch (platform) {
			case 'linux':
				break;
			case 'darwin':
				tokenPath = path.join(
					os.homedir(),
					'.vscode-tcmerge',
					ACCESS_TOKEN_FILE_NAME
				);
				break;
			case 'win32':
				break;
		}
		return tokenPath;
	}
}