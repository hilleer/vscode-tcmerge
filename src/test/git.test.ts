import * as assert from 'assert';
import sinon, { SinonStub } from 'sinon';
import path from 'path';

import { Git } from '../git';
import { ChildProcess } from '../childProcess';

suite('git', () => {

	let git: Git;
	let stub: SinonStub;
	let callStub: (stdout: string, stderr?: string) => void;
	suiteSetup(() => {
		stub = sinon.stub(ChildProcess.prototype, 'execFile');
		callStub = (stdout: string, stderr: string) => stub.callsFake(async (cmd: string, args?: string[], options?: any) => {
			return Promise.resolve({
				stdout: new Buffer(stdout),
				stderr: (stderr && new Buffer(stderr)) || ''
			});
		});
		const childProcess = new ChildProcess(path.join('fake', 'cwd', 'path'));
		git = new Git(childProcess);
	});
	suiteTeardown(() => {
		stub.reset();
	});
	suite('getCurrentBranch()', () => {
		suiteSetup(() => callStub('git_symbolic-ref,--short,HEAD'));
		suiteTeardown(() => stub.reset());
		suite('when called', () => {
			test('should call git with expected args', async () => {
				const actual = await git.getCurrentBranch();
				const expected = 'git_symbolic-ref,--short,HEAD';
				assert.equal(actual, expected);
			});
		});
	});
	suite('getGitDetails()', () => {
		suiteSetup(() => callStub('origin  git@github.com:hilleer/vscode-git.git'));
		suiteTeardown(() => stub.reset());
		suite('when called', () => {
			test('should call git with expected args', async () => {
				const actual = await git.getGitDetails();
				const expected = {
					owner: 'hilleer',
					origin: 'vscode-git'
				};

				assert.deepEqual(actual, expected);
			});
		});
	});
});