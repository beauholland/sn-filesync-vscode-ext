# filesync README

## Features

This extension makes it easier for us to run the sn-filesync node tool.

**If you are wondering more about the commands, refer to the sn-filesync README.md**

## Requirements

Nil

## Extension Package

proxy=http://rosydproxy:8080
https-proxy=http://rosydproxy:8080
strict-ssl=false
registry=http://registry.npmjs.org/

npm install -g vsce
vsce package


## Extension Settings

**NOTE: The following is done after running npm install in the sn-filesync folder.

Usage:
1. cmd + shft + p (Opens the command palette).
2. type RTTMS
3. Four options will come up RTTMS search, RTTMS sync, RTTMS setup, RTTMS watch.

**FIRST TIME RUNNING sn-filesync**
* RTTMS setup - Creates the necessary directories and sets your username/password in the config files:
    1. Type your user name in (i.e corp\bob.smith).
    2. Type your password in (Yes.. plain text.. not my fault..).

* RTTMS search - Pulls the specified file down from dev or patch:
    1. Select the environment you want to get the file from.
    2. Select the type of file.
    3. Type the full file name in (case INsensitive) pressing enter when complete.
    4. Check the TERMINAL that the file downloaded fine.
    5. Navigate to the file (NOTE: If the file isn't there, click the refresh symbol next to the folder name in the explorer. VSCode doesn't always automatically refresh this very well).

* RTTMS watch - Watches for changes that you have done to the files, on save it pushes them to the environment:
    1. Select the environment you want to compare and push files to.

* RTTMS sync - Runs the resync and then watches your files:
    1. Select the environemnt you want to resync your files too.

## Known Issues

* It's perfect.

## Release Notes
*0.0.1
Initial Release

*0.0.2
Added the option of watching as a finishing task of RTTMS search

*0.0.3
Added Rttms BitBucket so that i can just run that and it commits with the specific commit message and then does "git push -u origin". My bitbucket repo root is ../src. So it just captures any changes in rttmsdev, riotintodev. 
