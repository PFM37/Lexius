load()

document.addEventListener("DOMContentLoaded", () => {
    let text = localStorage.getItem(`${tabtext}`)
    text = editor.innerText
}

)

const defaultContent = {
    'index.html': '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Lexius</title>\n  </head>\n  <body>\n    Hello, World!\n  </body>\n</html>',
    'style.css': 'body {\n  background-color: #222;\n  color: white;\n}',
    'script.js': 'console.log("Lexius is running!");'
};

const tabs = ['index.html', 'style.css', 'script.js'];

function load() {
    let cod = localStorage.getItem("code");
    lexiusEditor.setValue(cod); // Assuming lexiusEditor is the Monaco editor instance
}

function getTabFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'index.html';
}

function setTabInQuery(tabName) {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tabName);
    history.pushState(null, '', '?' + params.toString());
    loadTab(tabName);
}

async function setLanguageForTab(tabName) {
    const model = window.lexiusEditor.getModel();
    const ext = tabName.split('.').pop();
    let language = 'plaintext';

    if (ext === 'html') language = 'html';
    else if (ext === 'css') language = 'css';
    else if (ext === 'js') language = 'javascript';

    monaco.editor.setModelLanguage(model, language);
}

function highlightTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active-tab', tab.textContent === tabName);
    });
}

function Save() {
    const code = lexiusEditor.getValue(); // Get code from the editor
    if (!localStorage.getItem("code")) {
        localStorage.setItem("code", code)
    }
    else {
        localStorage.clear("code")
        localStorage.setItem("code", code)
    }
}

function rota() {
    run();
    const runBtn = document.getElementsByClassName("run")[0];
    runBtn.style.animation = 'none';        // Reset
    void runBtn.offsetWidth;                // Trigger reflow
    runBtn.style.animation = 'rot 2s ease-in-out';
}

function run() {
    Save();
    const currentTab = getTabFromQuery();
    const content = window.lexiusEditor.getValue();
    const type = currentTab.endsWith('.html') ? 'text/html' :
                 currentTab.endsWith('.css') ? 'text/css' :
                 currentTab.endsWith('.js') ? 'application/javascript' :
                 'text/plain';

    const blob = new Blob([content], { type: type + ";charset=utf-8" });
    saveAs(blob, currentTab);

    if (type === 'text/html') {
        const url = URL.createObjectURL(blob);
        window.location.href = url;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.textContent;
            if (tabName === '+') {
                const newTab = prompt('Enter new tab name:');
                if (newTab && !tabs.includes(newTab)) {
                    tabs.push(newTab);
                    const newTabEl = document.createElement('div');
                    newTabEl.className = 'tab';
                    newTabEl.textContent = newTab;
                    newTabEl.style.cursor = 'pointer';
                    newTabEl.addEventListener('click', () => setTabInQuery(newTab));
                    tab.parentNode.insertBefore(newTabEl, tab);
                    setTabInQuery(newTab);
                }
            } else {
                setTabInQuery(tabName);
            }
        });
    });

    // Wait until Monaco is loaded
    const waitForMonaco = setInterval(() => {
        if (window.lexiusEditor) {
            clearInterval(waitForMonaco);
            loadTab(getTabFromQuery());
        }
    }, 100);
});

function rename() {
    const tab = document.querySelector('.tab');
    const tabtext = tab.innerText

    tab.innerHTML = `
        <div style="margin-right: 7px;">
          <img src="" alt="" class="tab-icon">
        </div>
        <div style="margin-right: 7px;">
          <input class="rename-input" type="text" placeholder="${tabtext}" value="${tabtext}" autofocus>
        </div>
    `;
    
    const input = tab.querySelector('input');
    input.addEventListener('blur', () => {
        const newName = input.value.trim();
        if (newName && newName !== tabtext) {
            tab.innerHTML = `
                <div style="margin-right: 7px;">
                  <img src="" alt="" class="tab-icon">
                </div>
                <div style="margin-right: 7px;">${newName}</div>
            `;
            tabs[tabs.indexOf(tabtext)] = newName;
            setTabInQuery(newName); 
        } else {
            tab.innerHTML = `
                <div style="margin-right: 7px;">
                  <img src="" alt="" class="tab-icon">
                </div>
                <div style="margin-right: 7px;">${tabtext}</div>
            `;
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur(); // Trigger blur event
        }
    });
}

document.querySelector('.tab.active-tab').addEventListener('dblclick', rename); // Trigger rename on double-click

const tab_icon = document.getElementsByClassName("tab-icon")[0]
const tabtext1 = document.getElementsByClassName("tabtext")[0].innerText
const tabtext2 = document.getElementsByClassName("tabtext")[0].innerHTML

function icons() {
    if (tabtext2.endsWith(".py")) {
        return tab_icon.src = "https://static-00.iconduck.com/assets.00/python-icon-512x509-pyuo2h5v.png"
    }
    
    else {
        return tab_icon.src = "res/images/default.ico";
    }
}

function updateEditorFontSize() {
    let fontSize = 14; // default

    const width = window.innerWidth;

    if (width < 480) {
        fontSize = 999999;
    } else if (width < 768) {
        fontSize = 18;
    } else if (width < 1024) {
        fontSize = 20;
    } else {
        fontSize = 999999;
    }

    if (window.lexiusEditor) {
        window.lexiusEditor.updateOptions({ fontSize });
    }
}

// Run on page load
window.addEventListener('DOMContentLoaded', updateEditorFontSize);

// Run on window resize
window.addEventListener('resize', updateEditorFontSize);

setInterval(icons, 1000);
setInterval(Save, 5000);