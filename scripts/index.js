const ta = document.getElementsByClassName("ta")[0];
const defaultContent = {
    'index.html': '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Lexius</title>\n  </head>\n  <body>\n    Hello, World!\n  </body>\n</html>',
    'style.css': 'body {\n  background-color: #222;\n  color: white;\n}',
    'script.js': 'console.log("Lexius is running!");'
};
const tabs = ['index.html', 'style.css', 'script.js'];

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

function loadTab(tabName) {
    let content = localStorage.getItem(`tab_${tabName}`);
    if (!content && defaultContent[tabName]) {
        content = defaultContent[tabName];
    }
    ta.value = content || '';
    highlightTab(tabName);
}

function highlightTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active-tab', tab.textContent === tabName);
    });
}

function Save() {
    const currentTab = getTabFromQuery();
    localStorage.setItem(`tab_${currentTab}`, ta.value);
}

function rota() {
    run();
    document.getElementsByClassName("run")[0].style.animation = 'rot ease-in-out 2s';
}

function run() {
    Save();
    const currentTab = getTabFromQuery();
    const blob = new Blob([ta.value], { type: "text/html;charset=utf-8" });
    saveAs(blob, currentTab);
    const url = URL.createObjectURL(blob);
    window.location.href = url;
}

document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to existing tabs
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
                    localStorage.setItem(`tab_${newTab}`, '');
                    setTabInQuery(newTab);
                }
            } else {
                setTabInQuery(tabName);
            }
        });
    });

    loadTab(getTabFromQuery());
});