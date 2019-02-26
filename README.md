# vscode-tcmerge

_Note:_ This extension is in its early phase. If you find bugs, have feature requests or good ideas, please create [an issue](https://github.com/hilleer/vscode-tcmerge/issues).

This extension is highly inspired by the CLI package [tcmerge](https://github.com/debitoor/tcmerge).

## Extension settings

This extension contributes the following settings:

## Commands

### tcmerge: commit and push

Selection this command will stage, commit and push all changes using a provided commit/branch input.

The input will replace all spaces so that its valid as a branch name.

![commit-and-push.gif](https://raw.githubusercontent.com/hilleer/vscode-tcmerge/master/resources/commit-and-push.gif)

### tcmerge: Create pull request

Will create a pull request of the branch, using input as description for the pull request.

![ceeate-pull-request.gif](https://raw.githubusercontent.com/hilleer/vscode-tcmerge/master/resources/create-pull-request.gif)

### tcmerge: Create ready branch

Creates a ready branch of your branch that your build server is listening for.

That is, it will a push a branch `ready/<current-branch-name>/<timestamp>`.

![create-ready-branch.gif](https://raw.githubusercontent.com/hilleer/vscode-tcmerge/master/resources/create-ready-branch.gif)

### tcmerge: Github access token

Contributes multiple selections.

In case you have not already saved an access token for GitHub:

* set access token.

It requires access to "repo". If you only expect to use public repositories, you can with "public repo".

![create-access-token.gif](https://raw.githubusercontent.com/hilleer/vscode-tcmerge/master/resources/create-access-token.gif)

![github-access-token-setup.PNG](https://raw.githubusercontent.com/hilleer/vscode-tcmerge/master/resources/github-access-token-setup.PNG)

In case you have already saved an access token for GitHub:

* `Delete access token` - will remove the access token from storage. This command cannot be reverted.
* `Update access token` - will update the access token accordingly to a given input. This command cannot be reverted.

### tcmerge: Update git info

Updates the repository info saved in the extension config (`.vscode/settings.json`).

This information is initially set automatically when loading the extension and is required for multiple commands to work.