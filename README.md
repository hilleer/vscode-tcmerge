# vscode-tcmerge

_Note:_ This extension is in its early phase. If you find bugs, have feature requests or good ideas, please create [an issue](https://github.com/hilleer/vscode-tcmerge/issues).

This extension is highly inspired by the CLI package [debitoor/tcmerge](https://github.com/debitoor/tcmerge).

### Table of contents

* [tcmerge: commit and push](#user-content-tcmerge-commit-and-push)
* [tcmerge: Create pull request](#user-content-tcmerge-create-pull-request)
* [tcmerge: Create ready branch](#user-content-tcmerge-create-ready-branch)
* [tcmerge: Github access token](#user-content-tcmerge-github-access-token)
* [Design](#user-content-design)

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

That is, it will a push a branch `ready/<current-branch-name>/<timestamp>` to origin.

![create-ready-branch.gif](https://raw.githubusercontent.com/hilleer/vscode-tcmerge/master/resources/create-ready-branch.gif)

### tcmerge: Github access token

Contributes multiple selections based on its current state, defined by if you have saved an access token.

An access token is necessary for the command [tcmerge: Create pull request](#user-content-tcmerge-create-ready-branch) to work.

In case you have not already saved an access token for GitHub, selecting this command will let you by showing:

* `set access token`.

You need to create an access token to your Github account on [Github](https://github.com/settings/tokens/new).

It requires access to scope `repo` if you expect to create pull requests in private repositories, otherwise you can just select `public_repo`.

![create-access-token.gif](https://raw.githubusercontent.com/hilleer/vscode-tcmerge/master/resources/create-access-token.gif)

![github-access-token-setup.png](https://raw.githubusercontent.com/hilleer/vscode-tcmerge/master/resources/github-access-token-setup.png)

In case you have already saved an access token for GitHub:

* `Delete access token` - will remove the access token from storage. This command cannot be reverted.
* `Update access token` - will update the access token accordingly to a given input. This command cannot be reverted.

## Design

Extension logo is designed and created by [Mads Uldbæk](https://www.linkedin.com/in/madsuldbaek/).

Please do not re-use, modify or change it in anyway without contacting him and having his approval first.