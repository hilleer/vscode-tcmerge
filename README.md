# vscode-tcmerge

vscode extension to simplify git commands to easily push and deploy your changes.

## Extension settings

This extension contributes the following settings:

* `vscode-tcmerge.repositoryName` - name of the repository.
* `vscode-tcmerge.repositoryOwner` - owner of the repository.

They are automatically set loading the extension for the first time, but can be updated manually or automatically using the command [tcmerge: Update git info](https://github.com/hilleer/vscode-tcmerge#user-content-tcmerge-update-git-info).

These settings a required for certain commands.

## Commands

### tcmerge: commit and push

Selection this command will stage, commit and push all changes using a provided commit/branch input.

The input will replace all spaces so that its valid as a branch name.

### tcmerge: Create pull request

Will create a pull request of the branch, using input as description for the pull request.

### tcmerge: Create ready branch

Creates a ready branch of your branch that your build server is listening for.

That is, it will a push a branch `ready/<current-branch-name>/<timestamp>`.

### tcmerge: Github access token

Contributes multiple selections.

In case you have not already saved an access token for GitHub:

* set access token.

It requires access to "repo". If you only expect to use public repositories, you can with "public repo".

![github-access-token-setup.PNG](https://github.com/hilleer/vscode-tcmerge/blob/master/resources/github-access-token-setup.PNG)

In case you have already saved an access token for GitHub:

* `Delete access token` - will remove the access token from storage. This command cannot be reverted.
* `Update access token` - will update the access token accordingly to a given input. This command cannot be reverted.

### tcmerge: Update git info

Updates the repository info saved in the extension config (`.vscode/settings.json`).

This information is initially set automatically when loading the extension and is required for multiple commands to work.