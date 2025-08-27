import React, { useState, useEffect, useRef } from 'react'
import TitleBar from './components/TitleBar'
import ActivityBar from './components/ActivityBar'
import Sidebar from './components/Sidebar'
import EditorTabs from './components/EditorTabs'
import MonacoEditor from './components/MonacoEditor'
import StatusBar from './components/StatusBar'
import Terminal from './components/Terminal'
import CommandPalette from './components/CommandPalette'
import init, { FileManager, process_file_content } from './assets/wasm_file_manager.js'
import './App.css'

function App() {
  const [fileManager, setFileManager] = useState(null)
  const [currentDirectoryHandle, setCurrentDirectoryHandle] = useState(null)
  const [openFiles, setOpenFiles] = useState(new Map())
  const [activeFile, setActiveFile] = useState(null)
  const [wasmLoaded, setWasmLoaded] = useState(false)
  const [activeView, setActiveView] = useState('explorer')
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [terminalVisible, setTerminalVisible] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const editorRef = useRef(null)

  // Initialize WASM on component mount
  useEffect(() => {
    const initializeWasm = async () => {
      try {
        await init()
        const fm = new FileManager()
        setFileManager(fm)
        setWasmLoaded(true)
        console.log('WASM FileManager initialized')
      } catch (error) {
        console.error('Failed to initialize WASM:', error)
      }
    }

    initializeWasm()
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault()
            setSidebarVisible(prev => !prev)
            break
          case 'j':
            e.preventDefault()
            setTerminalVisible(prev => !prev)
            break
          case 'p':
            if (e.shiftKey) {
              e.preventDefault()
              setCommandPaletteOpen(true)
            }
            break
          case 'n':
            e.preventDefault()
            handleCommand('file.new')
            break
          case 'o':
            e.preventDefault()
            handleCommand('file.open')
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Command handler
  const handleCommand = (commandId) => {
    switch (commandId) {
      case 'file.new':
        createNewFile()
        break
      case 'file.open':
        openFolder()
        break
      case 'view.toggleTerminal':
        setTerminalVisible(prev => !prev)
        break
      case 'view.toggleSidebar':
        setSidebarVisible(prev => !prev)
        break
      case 'workbench.action.showCommands':
        setCommandPaletteOpen(true)
        break
      case 'ai.generateCode':
        setActiveView('ai')
        // Simulate AI code generation request
        setTimeout(() => {
          const aiPanel = document.querySelector('.ai-assistant')
          if (aiPanel) {
            const event = new CustomEvent('ai-request', {
              detail: { type: 'generate', prompt: 'Generate a function to handle user authentication' }
            })
            aiPanel.dispatchEvent(event)
          }
        }, 100)
        break
      case 'ai.explainCode':
        setActiveView('ai')
        setTimeout(() => {
          const aiPanel = document.querySelector('.ai-assistant')
          if (aiPanel) {
            const event = new CustomEvent('ai-request', {
              detail: { type: 'explain', prompt: 'Explain what this code does' }
            })
            aiPanel.dispatchEvent(event)
          }
        }, 100)
        break
      case 'ai.fixBug':
        setActiveView('ai')
        setTimeout(() => {
          const aiPanel = document.querySelector('.ai-assistant')
          if (aiPanel) {
            const event = new CustomEvent('ai-request', {
              detail: { type: 'fix', prompt: 'Fix any bugs in this code' }
            })
            aiPanel.dispatchEvent(event)
          }
        }, 100)
        break
      default:
        console.log('Command executed:', commandId)
    }
  }

  // File operations
  const openFolder = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker()
      setCurrentDirectoryHandle(dirHandle)
      await loadFileTree(dirHandle)
    } catch (error) {
      console.error('Error opening folder:', error)
    }
  }

  const loadFileTree = async (dirHandle, path = '') => {
    // Implementation for loading file tree
    // This will be expanded based on the original logic
    console.log('Loading file tree for:', dirHandle.name)
  }

  const openFile = async (fileHandle, path) => {
    try {
      const file = await fileHandle.getFile()
      const content = await file.text()

      // Create or switch to tab
      setOpenFiles(prev => {
        const newFiles = new Map(prev)
        newFiles.set(path, { handle: fileHandle, content })
        return newFiles
      })

      setActiveFile({ handle: fileHandle, path })

      // Update editor content
      if (editorRef.current) {
        const language = fileManager ? fileManager.get_language_from_path(path) : 'plaintext'
        editorRef.current.setValue(content)
        editorRef.current.updateLanguage(language)
      }
    } catch (error) {
      console.error('Error opening file:', error)
    }
  }

  const createNewFile = async () => {
    if (!currentDirectoryHandle) {
      alert('Please open a folder first')
      return
    }

    const fileName = prompt('Enter file name:')
    if (!fileName) return

    try {
      const fileHandle = await currentDirectoryHandle.getFileHandle(fileName, { create: true })
      const writable = await fileHandle.createWritable()
      await writable.write('')
      await writable.close()

      await loadFileTree(currentDirectoryHandle)
      openFile(fileHandle, fileName)
    } catch (error) {
      console.error('Error creating file:', error)
    }
  }

  // Agentic features
  const analyzeCode = (content) => {
    if (!fileManager) return {}

    const lineCount = content.split('\n').length
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length
    const trimmed = processContent(content, 'trim')

    return {
      lineCount,
      wordCount,
      isTrimmed: trimmed !== content,
      trimmed
    }
  }

  const processContent = (content, operation) => {
    if (fileManager) {
      return process_file_content(content, operation)
    }
    return content
  }

  const suggestImprovements = (content, language) => {
    if (!fileManager) return []

    const suggestions = []

    if (content.includes('console.log')) {
      suggestions.push('Consider removing debug console.log statements before production')
    }

    if (content.includes('var ')) {
      suggestions.push('Consider using let or const instead of var for better scoping')
    }

    if (content.length > 1000) {
      suggestions.push('Large files can be split into smaller modules for better maintainability')
    }

    if (!content.includes('\n')) {
      suggestions.push('Consider adding comments to explain the code functionality')
    }

    return suggestions
  }

  const formatCode = (content) => {
    let formatted = processContent(content, 'trim')

    // Basic formatting logic
    if (formatted.includes('function') || formatted.includes('if') || formatted.includes('for')) {
      const lines = formatted.split('\n')
      let indentLevel = 0
      const indentedLines = lines.map(line => {
        const trimmed = line.trim()
        if (trimmed.endsWith('{')) {
          const result = '  '.repeat(indentLevel) + trimmed
          indentLevel++
          return result
        } else if (trimmed.startsWith('}')) {
          indentLevel = Math.max(0, indentLevel - 1)
          return '  '.repeat(indentLevel) + trimmed
        } else {
          return '  '.repeat(indentLevel) + trimmed
        }
      })
      formatted = indentedLines.join('\n')
    }

    return formatted
  }

  const handleAnalyzeCode = () => {
    if (!editorRef.current) return

    const content = editorRef.current.getValue()
    const analysis = analyzeCode(content)
    const suggestions = suggestImprovements(content, '')

    let html = `<h4>Code Analysis:</h4>`
    html += `<p>Lines: ${analysis.lineCount}, Words: ${analysis.wordCount}</p>`

    if (suggestions.length > 0) {
      html += `<h4>Suggestions:</h4><ul>`
      suggestions.forEach(suggestion => {
        html += `<li>${suggestion}</li>`
      })
      html += `</ul>`
    }

    // Update agentic panel with analysis
    console.log('Analysis:', { analysis, suggestions })
  }

  const handleFormatCode = () => {
    if (!editorRef.current) return

    const content = editorRef.current.getValue()
    const formatted = formatCode(content)
    editorRef.current.setValue(formatted)
  }

  return (
    <div className="vscode-container">
      <TitleBar
        title="AGK Web IDE - Untitled Workspace"
        onCommandPalette={() => setCommandPaletteOpen(true)}
      />

      <div className="vscode-workbench">
        <ActivityBar
          activeView={activeView}
          onViewChange={setActiveView}
        />

        {sidebarVisible && (
          <Sidebar
            activeView={activeView}
            currentDirectoryHandle={currentDirectoryHandle}
            onOpenFolder={openFolder}
            onCreateNewFile={createNewFile}
            onFileSelect={openFile}
            onInsertCode={(code) => {
              if (editorRef.current) {
                const currentValue = editorRef.current.getValue()
                const newValue = currentValue + '\n\n' + code
                editorRef.current.setValue(newValue)
              }
            }}
            currentCode={editorRef.current?.getValue() || ''}
            selectedCode="" // Could be enhanced to get selected text
          />
        )}

        <div className="vscode-editor-area">
          <div className="vscode-editor-group">
            <EditorTabs
              openFiles={openFiles}
              activeFile={activeFile}
              onTabClick={(file) => setActiveFile(file)}
              onTabClose={(path) => {
                setOpenFiles(prev => {
                  const newFiles = new Map(prev)
                  newFiles.delete(path)
                  return newFiles
                })
                if (activeFile && activeFile.path === path) {
                  setActiveFile(null)
                }
              }}
            />

            <div className="vscode-editor-container">
              <MonacoEditor
                ref={editorRef}
                value="// Welcome to AGK Web IDE\n// Start coding here...\n"
                language="javascript"
                theme="vs-dark"
                onChange={(value) => {
                  // Handle editor changes
                }}
                onCursorPositionChange={setCursorPosition}
              />
            </div>
          </div>

          {terminalVisible && (
            <Terminal
              isVisible={terminalVisible}
              onToggle={() => setTerminalVisible(false)}
            />
          )}
        </div>
      </div>

      <StatusBar
        activeFile={activeFile}
        cursorPosition={cursorPosition}
        language={activeFile ? (fileManager ? fileManager.get_language_from_path(activeFile.path) : 'plaintext') : 'plaintext'}
      />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onCommand={handleCommand}
      />
    </div>
  )
}

export default App