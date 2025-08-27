import React, { useState, useEffect, useRef } from 'react'

function CommandPalette({ isOpen, onClose, onCommand }) {
  const [query, setQuery] = useState('')
  const [filteredCommands, setFilteredCommands] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  const commands = [
    { id: 'file.new', title: 'File: New File', category: 'File' },
    { id: 'file.open', title: 'File: Open Folder', category: 'File' },
    { id: 'file.save', title: 'File: Save', category: 'File' },
    { id: 'edit.find', title: 'Edit: Find', category: 'Edit' },
    { id: 'edit.replace', title: 'Edit: Replace', category: 'Edit' },
    { id: 'view.toggleTerminal', title: 'View: Toggle Terminal', category: 'View' },
    { id: 'view.toggleSidebar', title: 'View: Toggle Side Bar Visibility', category: 'View' },
    { id: 'git.commit', title: 'Git: Commit', category: 'Git' },
    { id: 'git.push', title: 'Git: Push', category: 'Git' },
    { id: 'terminal.new', title: 'Terminal: Create New Terminal', category: 'Terminal' },
    { id: 'workbench.action.showCommands', title: 'Show All Commands', category: 'Developer' },
    { id: 'workbench.action.reloadWindow', title: 'Developer: Reload Window', category: 'Developer' },
  ]

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredCommands(commands.slice(0, 8))
    } else {
      const filtered = commands.filter(cmd =>
        cmd.title.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredCommands(filtered.slice(0, 8))
    }
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev =>
            prev < filteredCommands.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            handleCommandSelect(filteredCommands[selectedIndex])
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, onClose])

  const handleCommandSelect = (command) => {
    onCommand(command.id)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <div className="command-input-container">
          <input
            ref={inputRef}
            type="text"
            className="command-input"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="command-list">
          {filteredCommands.map((command, index) => (
            <div
              key={command.id}
              className={`command-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleCommandSelect(command)}
            >
              <div className="command-content">
                <div className="command-title">{command.title}</div>
                <div className="command-category">{command.category}</div>
              </div>
            </div>
          ))}
          {filteredCommands.length === 0 && (
            <div className="command-item no-results">
              <div className="command-content">
                <div className="command-title">No matching commands</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommandPalette