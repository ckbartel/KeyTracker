import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log("Extension running\n");

	//listen to text document changes (insertions, deletions, etc.)
	const textChangeListener = vscode.workspace.onDidChangeTextDocument((event) => {
		const changes = event.contentChanges; //array of changes made

		changes.forEach((change) => {

			let currDate = new Date();

			console.log("Change detected:");
			console.log(`Date: ${currDate.toISOString()}`)
			console.log(`File: ${event.document.uri.fsPath}`);
			console.log(`Position: ${change.rangeOffset}`);
			if (change.text === '') {
				//if change was deletion
				console.log(`Delete: ${change.rangeLength}\n`);
			} else {
				//if change was insertion
				//note: the rangeLength gives how many characters were deleted in the change, so slicing it off fixese auto completions!!!
				console.log(`Insert: ${change.text.slice(change.rangeLength)}\n`);
			}

		});
	});

	//listen for save events
	const saveListener = vscode.workspace.onDidSaveTextDocument((document) => {
		//capture diagnostics after a file is saved
		setTimeout(() => {
			const diagnostics = vscode.languages.getDiagnostics(document.uri);
			console.log(`Diagnostics for ${document.uri.fsPath}:`);
			diagnostics.forEach((diagnostic) => {
				console.log(`[${diagnostic.severity}] ${diagnostic.message} ${JSON.stringify(diagnostic.range)}`);
			});
			console.log("");
		}, 1000);
	});

	//add listeners to context subscriptions
	context.subscriptions.push(textChangeListener, saveListener);

}

export function deactivate() {}
