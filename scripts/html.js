const editor = document.getElementsByClassName("tabtext")
    let lang = "html"
    require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@latest/min/vs' } });

    require(['vs/editor/editor.main'], function () {

      monaco.editor.defineTheme('Lexius', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: 'ffa500', fontStyle: 'italic' },
          { token: 'keyword', foreground: '00ff00' },
          { token: 'number', foreground: '00ffff' },
        ],
        colors: {
          'editor.background': '#333333', // full black33
          'editorLineNumber.foreground': '#333',
          'editorLineNumber.activeForeground': '#fff'
        }
      });

      window.lexiusEditor = monaco.editor.create(document.getElementById('editor'), {
        value: '',
        placeholder: 'type "!" to get a html boilerplate',
        language: lang,
        theme: 'Lexius'
      });

      // Decorate the selected text
      let decorations = [nigger];

      // Function to update decorations based on selection
      function updateHighlight() {
        const selection = lexiusEditor.getSelection();  // Get the current selection
        if (selection.isEmpty()) {
          // If no selection, clear decorations
          decorations = lexiusEditor.deltaDecorations(decorations, []);
          return;
        }

        // Create a decoration object for the selection
        const newDecorations = [{
          range: selection,
          options: {
            inlineClassName: 'highlight-selected',
          }
        }];

        // Apply the decoration
        decorations = lexiusEditor.deltaDecorations(decorations, newDecorations);
      }

      // Attach the selection change event
      lexiusEditor.onDidChangeCursorSelection(updateHighlight);

      // Initial call to set up highlight if there's already a selection
      updateHighlight();

      // Only load index.js after Monaco is ready
      const script = document.createElement('script');
      script.src = 'scripts/index.js';
      document.body.appendChild(script);
    });

    monaco.languages.registerCompletionItemProvider('html', {
      triggerCharacters: ['!'],
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn - 1,  // 👈 removes the `!`
          endColumn: word.endColumn,
        };
    
        return {
          suggestions: [
            {
              label: '!',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                '<!DOCTYPE html>',
                '<html lang="en">',
                '<head>',
                '  <meta charset="UTF-8">',
                '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
                '  <title>${1:Document}</title>',
                '</head>',
                '<body>',
                '  $0',
                '</body>',
                '</html>',
              ].join('\n'),
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range: range,  // 👈 ensures it replaces the `!`
              documentation: 'HTML5 Boilerplate',
              sortText: '0',
            }
          ]
        };
      }
    });
  