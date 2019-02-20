import { readFile, writeFile, unlink, mkdir } from 'fs';
import * as os from 'os';
import { promisify } from 'util';
import * as path from 'path';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const unlinkAsync = promisify(unlink);
const mkdirAsync = promisify(mkdir);

const ACCESS_TOKEN_DIR = path.join(os.homedir(), '.vscode-tcmerge');
const ACCESS_TOKEN_FILENAME = 'access_token.txt';

export class AccessToken {
	private accessTokenPath: string;
	constructor() {
		this.accessTokenPath = path.join(ACCESS_TOKEN_DIR, ACCESS_TOKEN_FILENAME);
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

export async function createAccessTokenDir() {
	try {
		await mkdirAsync(ACCESS_TOKEN_DIR);
	} catch (error) {
		if (error.message && error.message.startsWith('EEXIST')) {
			console.info('access token dir already created.');
			return;
		}
		throw error;
	}
}