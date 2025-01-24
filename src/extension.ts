import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log("Extension running\n");
	const disposable = vscode.commands.registerCommand('keyTracker.start', () => {
		//capture active editor, if there is one
		const activeEditor = vscode.window.activeTextEditor;

		let previousText: string = '';

		if (activeEditor) {
			//if there is a document opened, capture its text
			previousText = activeEditor.document.getText();
			console.log(`Initial document loaded: ${activeEditor.document.uri.fsPath}\n`);
		}

		//listen to active document change
		const activeEditorChangeListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
			if (editor) {
				//if there is still a document opened
				previousText = editor.document.getText();
				console.log(`Active document changed: ${editor.document.uri.fsPath}\n`);
			}
		});

		//listen to text document changes (insertions, deletions, etc.)
		const textChangeListener = vscode.workspace.onDidChangeTextDocument((event) => {
			const changes = event.contentChanges; //array of changes made

			changes.forEach((change) => {
				
				console.log("Change detected:");
				console.log(`File: ${event.document.uri.fsPath}`)
				console.log(`Range: ${JSON.stringify(change.range)}`);
				if (change.text === '') {
					//if change was deletion
					const deletedText = getDeletedText(previousText, change);
					console.log(`Text deleted: "${deletedText}"\n`);
				} else {
					//if change was insertion
					console.log(`Text inserted: "${change.text}"\n`);
				}

			});
			
			//update previous text
			previousText = event.document.getText();
		});

		//listen for save events
		const saveListener = vscode.workspace.onDidSaveTextDocument((document) => {
			// Capture diagnostics after a file is saved
			const diagnostics = vscode.languages.getDiagnostics(document.uri);
			console.log(`Diagnostics for ${document.uri.fsPath}:`);
			diagnostics.forEach((diagnostic) => {
				console.log(`[${diagnostic.severity}] ${diagnostic.message}`);
			});
			console.log();
		});
	
		// Add listeners to context subscriptions
		context.subscriptions.push(textChangeListener, activeEditorChangeListener, saveListener);

	});

	context.subscriptions.push(disposable);
}

//gets deleted text given previous text and the change made
function getDeletedText(previousText: string, change: vscode.TextDocumentContentChangeEvent) : string {
	// Use the change.rangeOffset and change.rangeLength directly to slice the deleted text from the previous text
    const deletedText = previousText.slice(change.rangeOffset, change.rangeOffset + change.rangeLength);

    return deletedText;
}

export function deactivate() {}
