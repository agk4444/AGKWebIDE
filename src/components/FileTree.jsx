import React, { useState, useEffect } from 'react'

function FileTree({ currentDirectoryHandle, onOpenFolder, onCreateNewFile, onFileSelect }) {
  const [fileTree, setFileTree] = useState([])
  const [expandedDirs, setExpandedDirs] = useState(new Set())

  useEffect(() => {
    if (currentDirectoryHandle) {
      loadFileTree(currentDirectoryHandle)
    }
  }, [currentDirectoryHandle])

  const loadFileTree = async (dirHandle, path = '', level = 0) => {
    const items = []

    try {
      for await (const [name, handle] of dirHandle.entries()) {
        const itemPath = path ? `${path}/${name}` : name
        const item = {
          name,
          path: itemPath,
          handle,
          isDirectory: handle.kind === 'directory',
          level,
          id: `${handle.kind}-${itemPath}`
        }

        items.push(item)

        // If it's an expanded directory, load its children
        if (item.isDirectory && expandedDirs.has(itemPath)) {
          const children = await loadFileTree(handle, itemPath, level + 1)
          items.push(...children)
        }
      }
    } catch (error) {
      console.error('Error loading file tree:', error)
    }

    if (path === '') {
      setFileTree(items)
    }

    return items
  }

  const toggleDirectory = async (item) => {
    const newExpandedDirs = new Set(expandedDirs)

    if (expandedDirs.has(item.path)) {
      newExpandedDirs.delete(item.path)
    } else {
      newExpandedDirs.add(item.path)
    }

    setExpandedDirs(newExpandedDirs)

    // Reload the tree to show/hide children
    if (currentDirectoryHandle) {
      await loadFileTree(currentDirectoryHandle)
    }
  }

  const handleFileClick = (item) => {
    if (item.isDirectory) {
      toggleDirectory(item)
    } else {
      onFileSelect(item.handle, item.path)
    }
  }

  const getIndentation = (level) => {
    return { paddingLeft: `${level * 20 + 10}px` }
  }

  const getFileIcon = (item) => {
    if (item.isDirectory) {
      return expandedDirs.has(item.path) ? '📂' : '📁'
    }

    // File type icons
    const ext = item.name.split('.').pop().toLowerCase()
    const icons = {
      js: '🟨',
      jsx: '⚛️',
      ts: '🔷',
      tsx: '⚛️',
      html: '🌐',
      css: '🎨',
      json: '📄',
      md: '📝',
      py: '🐍',
      rs: '🦀',
      cpp: '⚙️',
      c: '⚙️',
      java: '☕',
      php: '🐘',
      go: '🐹',
      sql: '🗄️'
    }

    return icons[ext] || '📄'
  }

  return (
    <div className="file-tree">
      <h3>Files</h3>
      <div id="file-tree-content">
        {fileTree.map(item => (
          <div
            key={item.id}
            className={`file-item ${item.isDirectory ? 'directory' : 'file'} ${expandedDirs.has(item.path) ? 'expanded' : ''}`}
            style={getIndentation(item.level)}
            onClick={() => handleFileClick(item)}
          >
            <span className="file-icon">{getFileIcon(item)}</span>
            <span className="file-name">{item.name}</span>
          </div>
        ))}
      </div>
      <div className="file-tree-actions">
        <button id="new-file-btn" onClick={onCreateNewFile}>
          ➕ New File
        </button>
        <button id="open-folder-btn" onClick={onOpenFolder}>
          📂 Open Folder
        </button>
      </div>
    </div>
  )
}

export default FileTree