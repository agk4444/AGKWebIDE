import React, { useState, useRef, useEffect } from 'react'

function Terminal({ isVisible, onToggle }) {
  const [command, setCommand] = useState('')
  const [history, setHistory] = useState([
    { type: 'output', content: 'Welcome to AGK Web IDE Terminal', timestamp: new Date() },
    { type: 'output', content: '$ ', timestamp: new Date() }
  ])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef(null)
  const terminalRef = useRef(null)

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isVisible])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    // Add command to history
    setHistory(prev => [...prev, { type: 'input', content: `$ ${trimmedCmd}`, timestamp: new Date() }])
    setCommandHistory(prev => [...prev, trimmedCmd])

    // Process command
    let output = ''
    switch (trimmedCmd.toLowerCase()) {
      case 'help':
        output = `Available commands:
  help     - Show this help message
  clear    - Clear terminal
  pwd      - Show current directory
  ls       - List files
  echo     - Echo text
  date     - Show current date
  whoami   - Show current user`
        break
      case 'clear':
        setHistory([{ type: 'output', content: '$ ', timestamp: new Date() }])
        setCommand('')
        return
      case 'pwd':
        output = '/home/user/agk-web-ide'
        break
      case 'ls':
        output = `src/
public/
package.json
README.md
Dockerfile`
        break
      case 'echo':
        output = 'Hello from AGK Web IDE Terminal!'
        break
      case 'date':
        output = new Date().toString()
        break
      case 'whoami':
        output = 'agk-user'
        break
      default:
        output = `Command not found: ${trimmedCmd}. Type 'help' for available commands.`
    }

    if (output) {
      setHistory(prev => [...prev, { type: 'output', content: output, timestamp: new Date() }])
    }

    setHistory(prev => [...prev, { type: 'output', content: '$ ', timestamp: new Date() }])
    setCommand('')
    setHistoryIndex(-1)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(command)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCommand(commandHistory[newIndex] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCommand('')
        } else {
          setHistoryIndex(newIndex)
          setCommand(commandHistory[newIndex])
        }
      }
    }
  }

  if (!isVisible) return null

  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <div className="terminal-tabs">
          <span className="terminal-tab active">Terminal</span>
          <button className="terminal-close" onClick={onToggle}>×</button>
        </div>
      </div>
      <div className="terminal-content" ref={terminalRef}>
        {history.map((item, index) => (
          <div key={index} className={`terminal-line ${item.type}`}>
            {item.type === 'input' && <span className="terminal-prompt">{item.content}</span>}
            {item.type === 'output' && <span className="terminal-output">{item.content}</span>}
          </div>
        ))}
        <div className="terminal-input-line">
          <span className="terminal-prompt">$ </span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  )
}

export default Terminal