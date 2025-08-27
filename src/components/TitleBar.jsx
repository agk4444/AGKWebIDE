import React from 'react'

function TitleBar({ title, onCommandPalette }) {
  const handleDoubleClick = () => {
    // Maximize/minimize functionality could be added here
  }

  return (
    <div className="title-bar" onDoubleClick={handleDoubleClick}>
      <div className="title-bar-left">
        <div className="menu-items">
          <span className="menu-item">File</span>
          <span className="menu-item">Edit</span>
          <span className="menu-item">View</span>
          <span className="menu-item">Go</span>
          <span className="menu-item">Run</span>
          <span className="menu-item">Terminal</span>
          <span className="menu-item">Help</span>
        </div>
      </div>

      <div className="title-bar-center">
        <span className="title-text">{title}</span>
      </div>

      <div className="title-bar-right">
        <button
          className="title-button command-palette-btn"
          onClick={onCommandPalette}
          title="Command Palette (Ctrl+Shift+P)"
        >
          <span className="command-icon">🔍</span>
        </button>
        <div className="window-controls">
          <button className="window-control minimize" title="Minimize">─</button>
          <button className="window-control maximize" title="Maximize">⬜</button>
          <button className="window-control close" title="Close">×</button>
        </div>
      </div>
    </div>
  )
}

export default TitleBar