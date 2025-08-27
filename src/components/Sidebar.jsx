import React from 'react'
import FileTree from './FileTree'
import AIAssistant from './AIAssistant'

function Sidebar({ activeView, currentDirectoryHandle, onOpenFolder, onCreateNewFile, onFileSelect, onInsertCode, currentCode, selectedCode }) {
  const renderPanel = () => {
    switch (activeView) {
      case 'explorer':
        return (
          <div className="sidebar-panel">
            <div className="sidebar-header">
              <span className="panel-title">EXPLORER</span>
            </div>
            <FileTree
              currentDirectoryHandle={currentDirectoryHandle}
              onOpenFolder={onOpenFolder}
              onCreateNewFile={onCreateNewFile}
              onFileSelect={onFileSelect}
            />
          </div>
        )
      case 'search':
        return (
          <div className="sidebar-panel">
            <div className="sidebar-header">
              <span className="panel-title">SEARCH</span>
            </div>
            <div className="search-panel">
              <div className="search-input-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search"
                />
                <button className="search-button">🔍</button>
              </div>
              <div className="search-results">
                <p className="no-results">No results found</p>
              </div>
            </div>
          </div>
        )
      case 'git':
        return (
          <div className="sidebar-panel">
            <div className="sidebar-header">
              <span className="panel-title">SOURCE CONTROL</span>
            </div>
            <div className="git-panel">
              <div className="git-changes">
                <div className="changes-section">
                  <div className="changes-header">
                    <span className="changes-count">0</span>
                    <span className="changes-label">Changes</span>
                  </div>
                  <div className="changes-list">
                    <p className="no-changes">No changes</p>
                  </div>
                </div>
                <div className="git-actions">
                  <button className="git-button">
                    <span className="git-icon">📝</span>
                    Commit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'ai':
        return (
          <AIAssistant
            onInsertCode={onInsertCode}
            onReplaceCode={(code) => {
              // Handle code replacement
              console.log('Replace code:', code)
            }}
            currentCode={currentCode}
            selectedCode={selectedCode}
          />
        )
      case 'extensions':
        return (
          <div className="sidebar-panel">
            <div className="sidebar-header">
              <span className="panel-title">EXTENSIONS</span>
            </div>
            <div className="extensions-panel">
              <div className="extensions-search">
                <input
                  type="text"
                  className="extensions-input"
                  placeholder="Search Extensions in Marketplace"
                />
              </div>
              <div className="extensions-list">
                <p className="no-extensions">No extensions installed</p>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="sidebar">
      {renderPanel()}
    </div>
  )
}

export default Sidebar