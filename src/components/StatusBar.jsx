import React from 'react'

function StatusBar({ activeFile, cursorPosition, language }) {
  const getFileName = (path) => {
    if (!path) return 'No file open'
    return path.split('/').pop()
  }

  const getFileIcon = (path) => {
    if (!path) return '📄'
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

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-item">
          <span className="file-icon">{getFileIcon(activeFile?.path)}</span>
          <span className="file-name">{getFileName(activeFile?.path)}</span>
        </span>
      </div>

      <div className="status-center">
        <span className="status-item">
          <span className="git-branch">main</span>
        </span>
        <span className="status-item">
          <span className="sync-status">🔄</span>
        </span>
      </div>

      <div className="status-right">
        <span className="status-item">
          <span className="language">{language || 'plaintext'}</span>
        </span>
        <span className="status-item">
          <span className="encoding">UTF-8</span>
        </span>
        <span className="status-item">
          <span className="line-ending">CRLF</span>
        </span>
        <span className="status-item">
          <span className="cursor-position">
            Ln {cursorPosition?.line || 1}, Col {cursorPosition?.column || 1}
          </span>
        </span>
        <span className="status-item">
          <span className="live-share">🔴</span>
        </span>
      </div>
    </div>
  )
}

export default StatusBar