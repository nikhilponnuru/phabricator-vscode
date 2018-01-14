// import { Selection, TextEditorRevealType } from 'vscode';
//https://github.com/Microsoft/vscode-MDTools/blob/master/extension.ts

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const createCanduit = require('canduit');
const clipboardy = require('clipboardy');
const selection = vscode.Selection;
const textEditor = vscode.textEditor;
const textDocument = vscode.textDocument;
const quickOptions = vscode.quickOptions;
const items = vscode.quickPickItems;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "phabricator-vscode" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    // let snippetShow = new SnippetShow();
    let pasteFetch = vscode.commands.registerCommand(
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        'extension.pasteFetch',
        snippetFetch()
    );
    context.subscriptions.push(pasteFetch);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;

function snippetFetch(pid) {
    vscode.window.showInputBox({ prompt: 'Enter the pid' }).then(function (pid) {
        // Convert String to Integer (base 10)
        pid = parseInt(pid, 10);
        // Create and authenticate client
        createCanduit(function (err, canduit) {
            // Execute a conduit API call
            canduit.exec("paste.search", {
                "constraints":
                    {
                        "ids": [pid],
                    },
                "attachments": {
                    "content": true,
                }
            }, function (err, users) {
                if (users == null) {
                    vscode.window.showErrorMessage("Nothing to Show")
                }
                else {
                    value = users["data"][0]["attachments"]["content"]["content"];
                    var fs = require('fs');
                    fs.writeFile("/home/nikhil_ponnuru/Documents/projects/phab-vscode/temp/3.txt", value, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        clipboardy.writeSync(value);
                        vscode.window.showInformationMessage("Copied to Clipboard")
                        console.log("The file was saved!");

                    });
                }
            });
        });
    });

}