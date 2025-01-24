import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log("Extension running");

	const disposable = vscode.commands.registerCommand('start', () => {

		let previousText: string = '';

		// Listen to document open
		const openListener = vscode.workspace.onDidOpenTextDocument((document) => {
			console.log(`Document opened: ${document.uri.fsPath}`);
			previousText = document.getText();
		});

		// Listen to text document changes (insertions, deletions, etc.)
		const changeListener = vscode.workspace.onDidChangeTextDocument((event) => {
			const changes = event.contentChanges; // Array of changes made

			changes.forEach((change) => {
				console.log('Change detected:');
				console.log(`Range: ${JSON.stringify(change.range)}`);
				if (change.text === '') {
					//if change was deletion
					const deletedText = getDeletedText(previousText, change);
					console.log(`Text deleted: "${deletedText}"`);
				} else {
					//if change was insertion
					console.log(`Text inserted: "${change.text}"`);
				}

				//update previous text
				previousText = event.document.getText();
			});
		});
	
		
	
		// Listen to document close
		const closeListener = vscode.workspace.onDidCloseTextDocument((document) => {
			console.log(`Document closed: ${document.uri.fsPath}`);
		});
	
		// Add listeners to context subscriptions
		context.subscriptions.push(changeListener, openListener, closeListener);
	});

	context.subscriptions.push(disposable);
}

function getDeletedText(previousText: string, change: vscode.TextDocumentContentChangeEvent) : string {
	// Use the change.offset and change.length directly to slice the deleted text from the previous text
    const deletedText = previousText.slice(change.rangeOffset, change.rangeOffset + change.rangeLength);

    return deletedText;
}

export function deactivate() {}
