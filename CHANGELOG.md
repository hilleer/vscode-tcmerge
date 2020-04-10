## [1.4.1] 2020-04-10

### Fixed

* wrong `main` path breaking the extension.

## [1.4.0] 2020-04-10

### Added

* Make use of Github draft pull requests feature. Creating pull requests will now include a prompt to create pull request as a draft.
* Added config to optionally disable draft pull requests.

## [1.3.0] 2020-04-09

### Added

* Commit and push status in window.

### Changed

* bundle extension - reduce amount of files.

## 1.2.0

* **Create pull request:** Fix deprecated warning from GitHub when supplying token in query param.

## 1.1.0

* **Create pull request:** When trying to create a pull request for a branch that already exists, an option to open that pull request will be given.

## 1.0.2

* Fix security issues with dependency.

## 1.0.1

* Fixed security vulnerability with NPM-dependency.
* Bumped vscode lower version requirement to `1.31.0`, to use new extension API functions and get rid `opn` npm package (built in functionality now).
* Small code optimisations.
* Fix repeatingly pushing to Git when using `Commit and push` command.
* Fix issue trying to commit- and stage changes, if there are none - still allow pushing, even without no current changes, but with already commited changes.

## 1.0.0

* `Commit and push` now handles when local branch is not pushable to origin, due to conflicts (needs pull, push or has diverged).
* Small changes and fixes overall.

## 0.1.2

* Update extension logo.

## 0.1.1

* Small changes.
* Add extension icon.

## 0.1.0

* Internal code optimisations.
* Some user information- and button texts updated.

## 0.0.9

* Various feedback message has been updated and improved.
* Access tokens should now be stored in a better place, so they don't accidentally get removed. E.g. when updating extension or vscode.

## 0.0.8

* Add keywords for better search results on marketplace.
* Update readme.

## 0.0.7

* Fixes creation of pull request.
* Better handling of workspace and git settings.
* Better handling of access token - was removed with every extension update before.
* Small improvements.

## 0.0.6

* Added GIF's of commands to readme.

## 0.0.5

* Fix error message not being provided when Github communication fails.
* Add a default value to pull request title to be of current branch.

## 0.0.4

* Solve bugs with opening urls on certain platforms.
* Try to solve issues with creating pull requests on some platforms.
* Handle creating pull request when on master branch.
* Properly handle creation of pull request if access token is not yet set.
* Fix small bugs.

## 0.0.3

* Try to fix issues with creating pull request command.
* Resolve bug with access token saving.
