// Global variables
let editor;
let currentDirectoryHandle = null;
let openFiles = new Map();
let activeFile = null;
let fileManager = null;

// Initialize WASM module
import init, { FileManager, process_file_content } from './wasm_file_manager.js';

async function initializeWasm() {
    await init();
    fileManager = new FileManager();
    console.log('WASM FileManager initialized');
}

// Initialize Monaco Editor
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });

async function initializeEditor() {
    await initializeWasm();

    require(['vs/editor/editor.main'], function() {
        editor = monaco.editor.create(document.getElementById('editor-container'), {
            value: '// Welcome to Agentic Web IDE\n// Start coding here...\n',
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: true },
            fontSize: 14,
            wordWrap: 'on'
        });

        // Listen for editor changes to implement auto-save
        editor.onDidChangeModelContent(() => {
            if (activeFile) {
                // Auto-save functionality will be implemented here
            }
        });
    });
}

initializeEditor();

// File operations
async function openFolder() {
    try {
        const dirHandle = await window.showDirectoryPicker();
        currentDirectoryHandle = dirHandle;
        await loadFileTree(dirHandle);
    } catch (error) {
        console.error('Error opening folder:', error);
    }
}

async function loadFileTree(dirHandle, path = '') {
    const fileTreeContent = document.getElementById('file-tree-content');
    fileTreeContent.innerHTML = '';

    for await (const [name, handle] of dirHandle.entries()) {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.textContent = name;
        item.dataset.path = path + name;

        if (handle.kind === 'directory') {
            item.classList.add('directory');
            item.onclick = () => toggleDirectory(item, handle, path + name + '/');
        } else {
            item.classList.add('file');
            item.onclick = () => openFile(handle, path + name);
        }

        fileTreeContent.appendChild(item);
    }
}

function toggleDirectory(element, dirHandle, path) {
    if (element.classList.contains('expanded')) {
        element.classList.remove('expanded');
        // Collapse logic
    } else {
        element.classList.add('expanded');
        loadFileTree(dirHandle, path);
    }
}

async function openFile(fileHandle, path) {
    try {
        const file = await fileHandle.getFile();
        const content = await file.text();

        // Create or switch to tab
        createTab(path, content);

        // Update editor
        const model = monaco.editor.getModel(monaco.Uri.file(path));
        if (model) {
            editor.setModel(model);
        } else {
            const newModel = monaco.editor.createModel(content, getLanguageFromPath(path), monaco.Uri.file(path));
            editor.setModel(newModel);
        }

        activeFile = { handle: fileHandle, path };
        openFiles.set(path, { handle: fileHandle, content });
    } catch (error) {
        console.error('Error opening file:', error);
    }
}

function createTab(path, content) {
    const tabsContainer = document.getElementById('tabs-container');
    const existingTab = document.querySelector(`[data-path="${path}"]`);

    if (existingTab) {
        // Switch to existing tab
        setActiveTab(existingTab);
        return;
    }

    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.dataset.path = path;
    tab.innerHTML = `
        <span>${path.split('/').pop()}</span>
        <span class="tab-close" onclick="closeTab('${path}')">&times;</span>
    `;

    tab.onclick = () => switchToTab(path);
    tabsContainer.appendChild(tab);
    setActiveTab(tab);
}

function setActiveTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
}

function switchToTab(path) {
    const fileData = openFiles.get(path);
    if (fileData) {
        const model = monaco.editor.getModel(monaco.Uri.file(path));
        if (model) {
            editor.setModel(model);
        }
        activeFile = { handle: fileData.handle, path };
    }
}

function closeTab(path) {
    event.stopPropagation();
    openFiles.delete(path);
    const tab = document.querySelector(`[data-path="${path}"]`);
    if (tab) {
        tab.remove();
    }

    // Switch to another tab if this was active
    if (activeFile && activeFile.path === path) {
        const remainingTabs = document.querySelectorAll('.tab');
        if (remainingTabs.length > 0) {
            switchToTab(remainingTabs[0].dataset.path);
        } else {
            editor.setValue('');
            activeFile = null;
        }
    }
}

async function createNewFile() {
    if (!currentDirectoryHandle) {
        alert('Please open a folder first');
        return;
    }

    const fileName = prompt('Enter file name:');
    if (!fileName) return;

    try {
        const fileHandle = await currentDirectoryHandle.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write('');
        await writable.close();

        await loadFileTree(currentDirectoryHandle);
        openFile(fileHandle, fileName);
    } catch (error) {
        console.error('Error creating file:', error);
    }
}

function getLanguageFromPath(path) {
    if (fileManager) {
        return fileManager.get_language_from_path(path);
    }
    // Fallback if WASM not loaded
    const ext = path.split('.').pop().toLowerCase();
    const langMap = {
        'js': 'javascript',
        'ts': 'typescript',
        'html': 'html',
        'css': 'css',
        'py': 'python',
        'rs': 'rust',
        'cpp': 'cpp',
        'c': 'c',
        'java': 'java'
    };
    return langMap[ext] || 'plaintext';
}

// Agentic features using WASM
function processContent(content, operation) {
    if (fileManager) {
        return process_file_content(content, operation);
    }
    return content;
}

function validateFileName(filename) {
    if (fileManager) {
        return fileManager.validate_file_path(filename);
    }
    return !filename.includes('..') && filename.length > 0;
}

function sanitizeFileName(filename) {
    if (fileManager) {
        return fileManager.sanitize_filename(filename);
    }
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

// Agentic coding features
function analyzeCode(content) {
    if (!fileManager) return {};

    const lineCount = content.split('\n').length;
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const trimmed = processContent(content, 'trim');

    return {
        lineCount,
        wordCount,
        isTrimmed: trimmed !== content,
        trimmed
    };
}

function suggestImprovements(content, language) {
    if (!fileManager) return [];

    const suggestions = [];

    // Basic suggestions based on content analysis
    if (content.includes('console.log')) {
        suggestions.push('Consider removing debug console.log statements before production');
    }

    if (content.includes('var ')) {
        suggestions.push('Consider using let or const instead of var for better scoping');
    }

    if (content.length > 1000) {
        suggestions.push('Large files can be split into smaller modules for better maintainability');
    }

    if (!content.includes('\n')) {
        suggestions.push('Consider adding comments to explain the code functionality');
    }

    return suggestions;
}

function formatCode(content) {
    // Basic formatting using WASM
    let formatted = processContent(content, 'trim');

    // Add basic indentation for JS/TS
    if (formatted.includes('function') || formatted.includes('if') || formatted.includes('for')) {
        // Simple indentation logic
        const lines = formatted.split('\n');
        let indentLevel = 0;
        const indentedLines = lines.map(line => {
            const trimmed = line.trim();
            if (trimmed.endsWith('{')) {
                const result = '  '.repeat(indentLevel) + trimmed;
                indentLevel++;
                return result;
            } else if (trimmed.startsWith('}')) {
                indentLevel = Math.max(0, indentLevel - 1);
                return '  '.repeat(indentLevel) + trimmed;
            } else {
                return '  '.repeat(indentLevel) + trimmed;
            }
        });
        formatted = indentedLines.join('\n');
    }

    return formatted;
}

// UI enhancements for agentic features
function addAgenticUI() {
    const editorContainer = document.getElementById('editor-container');
    const agenticPanel = document.createElement('div');
    agenticPanel.id = 'agentic-panel';
    agenticPanel.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(45, 55, 72, 0.9);
        color: white;
        padding: 10px;
        border-radius: 8px;
        font-size: 12px;
        z-index: 1000;
        max-width: 300px;
        display: none;
    `;

    const analysisBtn = document.createElement('button');
    analysisBtn.textContent = 'Analyze Code';
    analysisBtn.style.cssText = `
        background: #4a5568;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        margin: 5px;
    `;

    const formatBtn = document.createElement('button');
    formatBtn.textContent = 'Format Code';
    formatBtn.style.cssText = analysisBtn.style.cssText;

    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.id = 'suggestions';

    agenticPanel.appendChild(analysisBtn);
    agenticPanel.appendChild(formatBtn);
    agenticPanel.appendChild(suggestionsDiv);

    editorContainer.parentNode.appendChild(agenticPanel);

    // Event listeners
    analysisBtn.addEventListener('click', () => {
        const content = editor.getValue();
        const analysis = analyzeCode(content);
        const suggestions = suggestImprovements(content, getLanguageFromPath(activeFile?.path || ''));

        let html = `<h4>Code Analysis:</h4>`;
        html += `<p>Lines: ${analysis.lineCount}, Words: ${analysis.wordCount}</p>`;

        if (suggestions.length > 0) {
            html += `<h4>Suggestions:</h4><ul>`;
            suggestions.forEach(suggestion => {
                html += `<li>${suggestion}</li>`;
            });
            html += `</ul>`;
        }

        suggestionsDiv.innerHTML = html;
        agenticPanel.style.display = 'block';
    });

    formatBtn.addEventListener('click', () => {
        const content = editor.getValue();
        const formatted = formatCode(content);
        editor.setValue(formatted);
    });
}

// Initialize agentic UI after editor is ready
setTimeout(addAgenticUI, 2000);

// Event listeners
document.getElementById('open-folder-btn').addEventListener('click', openFolder);
document.getElementById('new-file-btn').addEventListener('click', createNewFile);