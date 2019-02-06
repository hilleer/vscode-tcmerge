import { readFile, writeFile, unlink } from 'fs';
import { promisify } from 'util';
import * as path from 'path';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const unlinkAsync = promisify(unlink);

const ACCESS_TOKEN_PATH = path.join(__dirname, '..', '..', 'accessToken.txt');

console.log('ACCESS TOKEN PATH: ', ACCESS_TOKEN_PATH);

export default class AccessToken {
	public async hasAccessToken(): Promise<boolean> {
		const accessToken = await this.readAccessTokenFile();
		if (accessToken.trim() === '') {
			return false;
		}
		return true;
	}

	public getAccesstoken(): Promise<string> {
		try {

		} catch (error) {

		}
		return this.readAccessTokenFile();
	}

	public async setAccessToken(accessToken: string): Promise<void> {
		await writeFileAsync(
			ACCESS_TOKEN_PATH,
			accessToken,
			'utf-8'
		);
	}

	public async removeAccessToken(): Promise<void> {
		await unlinkAsync(ACCESS_TOKEN_PATH);
	}

	private async readAccessTokenFile(): Promise<string> {
		try {
			return await readFileAsync(ACCESS_TOKEN_PATH, 'utf-8');
		} catch (error) {
			return '';
		}
	}
}