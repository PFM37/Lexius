const editor = document.getElementsById("editor");
let lang = "html";

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
      'editor.background': '#333333',
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

  // Register the '!' abbreviation snippet provider for HTML
  monaco.languages.registerCompletionItemProvider('html', {
    triggerCharacters: ['!'],
    provideCompletionItems: function(model, position) {
      const lineContent = model.getLineContent(position.lineNumber).slice(0, position.column - 1).trim();

      // Trigger only when the line contains just '!'
      if (lineContent === '!') {
        return {
          suggestions: [{
            label: 'HTML5 Boilerplate',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              '<!DOCTYPE html>',
              '<html lang="en">',
              '<head>',
              '  <meta charset="UTF-8">',
              '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
              '  <title>Document</title>',
              '</head>',
              '<body>',
              '',
              '</body>',
              '</html>'
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'HTML5 Boilerplate',
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column - 1,
              endLineNumber: position.lineNumber,
              endColumn: position.column
            }
          }]
        };
      }
      return { suggestions: [] };
    }
  });

  // Manually trigger the suggestion expansion after typing '!'
  lexiusEditor.onKeyDown(function (e) {
    // Check for '!' key press without Ctrl or Alt
    if (e.key === '1' && !e.ctrlKey && !e.altKey) {
      lexiusEditor.trigger('keyboard', 'editor.action.triggerSuggest', {});
    }
  });
});
