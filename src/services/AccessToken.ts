import { readFile, writeFile, unlink } from 'fs';
import { promisify } from 'util';
import * as path from 'path';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const unlinkAsync = promisify(unlink);

const ACCESS_TOKEN_FILENAME = 'vscode-tcmerge-access-token.txt';

export default class AccessToken {
	private accessTokenPath: string;
	constructor(appRoot: string) {
		this.accessTokenPath = path.join(appRoot);
	}
	public async hasAccessToken(): Promise<boolean> {
		const accessToken = await this.readAccessTokenFile();
		if (!accessToken || accessToken.trim() === '') {
			return false;
		}
		return true;
	}

	public getAccesstoken(): Promise<string> {
		return this.readAccessTokenFile();
	}

	public async setAccessToken(accessToken: string): Promise<void> {
		await writeFileAsync(
			this.accessTokenPath,
			accessToken,
			'utf-8'
		);
	}

	public async removeAccessToken(): Promise<void> {
		await unlinkAsync(this.accessTokenPath);
	}

	private async readAccessTokenFile(): Promise<string> {
		try {
			return await readFileAsync(this.accessTokenPath, 'utf-8');
		} catch (error) {
			return undefined;
		}
	}
}