'use strict';
var vscode = require('vscode');
var fs = require('fs');
var path = require('path');

function activate(context) {

    console.log('Extension "filesync" is now active!');
    var scriptTypes = {
        'Business rule': 'sys_script',
        'Script include': 'sys_script_include',
        'UI page': 'sys_ui_page',
        'UI script': 'sys_ui_script',
        'UI action': 'sys_ui_action',
        'UI macro': 'sys_ui_macro',
        'Catalog client script': 'catalog_script_client',
        'Client script': 'sys_script_client',
        'Email script': 'sys_script_email',
        'Inbound action': 'sysevent_in_email_action',
        'Processor': 'sys_processor',
        'Script action': 'sysevent_script_action',
        'Stylesheet': 'content_css',
        'Dynamic content block': 'content_block_programmatic',
        'Email template': 'sysevent_email_template',
        'Fix script': 'sys_script_fix',
        'Scripted web service': 'sys_web_service',
        'Scripted REST resource': 'sys_ws_operation',
        'Widget': 'sp_widget',
        'CSS': 'content_css'
    };
    var scriptTypeArray = Object.keys(scriptTypes);
    var vsPath = vscode.workspace.rootPath;

    var first = vscode.commands.registerCommand('extension.firstRttms', function () {

        if (!(fs.existsSync(path.join(vsPath, 'src')))) {
            var rootPath = path.join(vsPath, 'src');
            var rttmsPath = path.join(vsPath, 'src/rttmsdev');
            var riotintodevPath = path.join(vsPath, 'src/riotintodev');
            fs.mkdirSync(rootPath);
            fs.mkdirSync(rttmsPath);
            fs.mkdirSync(riotintodevPath);
        }


        vscode.window.showInputBox({ prompt: 'what is your rttms username? i.e corp\\bob.smith' })
            .then(function (value) {
                if (value == "") {
                    vscode.window.showErrorMessage("No username provided");
                    return;
                } else if (value == undefined) {
                    return;
                }
                var username = value;
                vscode.window.showInputBox({ prompt: 'What is your rttms password? #sorryForPlainText' })
                    .then(function (value) {
                        if (value == "") {
                            vscode.window.showErrorMessage("No password provided");
                            return;
                        } else if (value == undefined) {
                            return;
                        }

                        var pw = value;
                        var devPath = path.join(vsPath, 'rttmsdev.config.json');
                        var patchPath = path.join(vsPath, 'riotintodev.config.json');
                        //
                        //Writing username and password to patch config json file
                        //
                        fs.readFile(devPath, function (err, contents) {
                            if (err) throw err;
                            contents = JSON.parse(contents);
                            contents.roots['src/rttmsdev'].user = username;
                            contents.roots['src/rttmsdev'].pass = pw;
                            fs.writeFile(devPath, JSON.stringify(contents, null, '\t'), function (err) {
                                if (err) throw err;
                                vscode.window.setStatusBarMessage("finished writing username and password to rttmsdev.config.json", 3000);
                            });
                        });
                        //
                        //Writing username and password to patch config json file
                        //
                        fs.readFile(patchPath, function (err, contents) {
                            if (err) throw err;
                            contents = JSON.parse(contents);
                            contents.roots['src/riotintodev'].user = username;
                            contents.roots['src/riotintodev'].pass = pw;
                            fs.writeFile(patchPath, JSON.stringify(contents, null, '\t'), function (err) {
                                if (err) throw err;
                                vscode.window.setStatusBarMessage("finished writing username and password to riotintodev.config.json", 3000);
                            });
                        });
                    });
            });
    });

    var gitCommit = vscode.commands.registerCommand('extension.SendToBucket', function () {
        vscode.window.showInputBox({ prompt: 'Add a commit message (Mandatory)' })
            .then(function (value) {
                if (value == "") {
                    vscode.window.showErrorMessage("No commit message added..... I told you it was mandatory!");
                    return;
                } else if (value == undefined) {
                    return;
                }

                var terminal = vscode.window.createTerminal("commit");
                terminal.show(true);
                terminal.sendText('cd src', true);
                terminal.sendText('git add .', true);
                terminal.sendText('git commit -m "' + value + '"', true);
                terminal.sendText('git push -u origin', true);
                vscode.window.setStatusBarMessage("Commiting and pushing files", 4000);
            });
    });

    var watch = vscode.commands.registerCommand('extension.watchRttms', function () {
        vscode.window.showQuickPick(['rttmsdev', 'riotintodev'], { placeHolder: 'Which environment?' })
            .then(function (value) {
                if (value == undefined)
                    return;
                var terminal = vscode.window.createTerminal({ name: "watcher", processId: 1 });
                terminal.show(true);
                terminal.sendText('node bin/app.js --config ' + value + '.config.json', true);
                vscode.window.setStatusBarMessage("watching file in " + value, 4000);
            });
    });

    var sync = vscode.commands.registerCommand('extension.syncRttms', function () {
        vscode.window.showQuickPick(['rttmsdev', 'riotintodev'], { placeHolder: 'Which environment?' })
            .then(function (value) {
                if (value == undefined)
                    return;
                var terminal = vscode.window.createTerminal("watcher");
                terminal.show(true);
                terminal.sendText('node bin/app.js --config ' + value + '.config.json --resync', true);
                vscode.window.setStatusBarMessage("resyncing files in environment: " + value, 4000);

            });
    });

    var search = vscode.commands.registerCommand('extension.searchRttms', function () {
        vscode.window.showQuickPick(['rttmsdev', 'riotintodev'], { placeHolder: 'Which environment?' })
            .then(function (value) {
                if (value == undefined)
                    return;
                var environ = value;
                vscode.window.showQuickPick(scriptTypeArray, { placeHolder: 'What type is the script?' })
                    .then(function (value) {
                        if (value == undefined)
                            return;
                        var scriptType = scriptTypes[value];
                        vscode.window.showInputBox({ prompt: 'What is the script name?' })
                            .then(function (value) {
                                if (value == "") {
                                    vscode.window.showErrorMessage("No file to search for..");
                                    return;
                                } else if (value == undefined) {
                                    return;
                                }

                                var terminal = vscode.window.createTerminal("node");
                                terminal.show(true);
                                terminal.sendText('node bin/app.js --config ' + environ + '.config.json --search --search_query "name=' + value + '" + --search_table ' + scriptType + ' --download;', true);
                                vscode.window.setStatusBarMessage("Searching for files now...", 4000);
                                vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: 'Do you want to watch the files now?' })
                                    .then(function (value) {
                                        if (value == undefined)
                                            return;
                                        else if (value == 'Yes')
                                            vscode.commands.executeCommand('extension.watchRttms');
                                        else
                                            return;
                                    });
                            });
                    });
            });
    });

    context.subscriptions.push(search);
    context.subscriptions.push(watch);
    context.subscriptions.push(first);
    context.subscriptions.push(sync);
    context.subscriptions.push(gitCommit);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;