import React from 'react'

function EditorTabs({ openFiles, activeFile, onTabClick, onTabClose }) {
  const getFileIcon = (path) => {
    const ext = path.split('.').pop().toLowerCase()
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

  const getFileName = (path) => {
    return path.split('/').pop()
  }

  return (
    <div className="editor-tabs">
      <div id="tabs-container">
        {Array.from(openFiles.entries()).map(([path, fileData]) => (
          <div
            key={path}
            className={`tab ${activeFile && activeFile.path === path ? 'active' : ''}`}
            onClick={() => onTabClick({ handle: fileData.handle, path })}
          >
            <span className="file-icon">{getFileIcon(path)}</span>
            <span className="tab-title">{getFileName(path)}</span>
            <span
              className="tab-close"
              onClick={(e) => {
                e.stopPropagation()
                onTabClose(path)
              }}
            >
              ×
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EditorTabs