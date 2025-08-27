import React, { useState, useEffect, useRef } from 'react'
import FileTree from './components/FileTree'
import EditorTabs from './components/EditorTabs'
import MonacoEditor from './components/MonacoEditor'
import AgenticPanel from './components/AgenticPanel'
import init, { FileManager, process_file_content } from './assets/wasm_file_manager.js'
import './App.css'

function App() {
  const [fileManager, setFileManager] = useState(null)
  const [currentDirectoryHandle, setCurrentDirectoryHandle] = useState(null)
  const [openFiles, setOpenFiles] = useState(new Map())
  const [activeFile, setActiveFile] = useState(null)
  const [wasmLoaded, setWasmLoaded] = useState(false)
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
    <div className="ide-container">
      <div className="sidebar">
        <FileTree
          currentDirectoryHandle={currentDirectoryHandle}
          onOpenFolder={openFolder}
          onCreateNewFile={createNewFile}
          onFileSelect={openFile}
        />
      </div>
      <div className="main-editor">
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
        <MonacoEditor
          ref={editorRef}
          value="// Welcome to AGK Web IDE\n// Start coding here...\n"
          language="javascript"
          theme="vs-dark"
          onChange={(value) => {
            // Handle editor changes
          }}
        />
        <AgenticPanel
          onAnalyzeCode={handleAnalyzeCode}
          onFormatCode={handleFormatCode}
        />
      </div>
    </div>
  )
}

export default App