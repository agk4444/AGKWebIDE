import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import * as monaco from 'monaco-editor'

const MonacoEditor = forwardRef(({ value, language, theme, onChange, onCursorPositionChange }, ref) => {
  const editorRef = useRef(null)
  const monacoEditorRef = useRef(null)

  useImperativeHandle(ref, () => ({
    getValue: () => monacoEditorRef.current?.getValue() || '',
    setValue: (newValue) => monacoEditorRef.current?.setValue(newValue),
    updateLanguage: (newLanguage) => {
      const model = monacoEditorRef.current?.getModel()
      if (model) {
        monaco.editor.setModelLanguage(model, newLanguage)
      }
    },
    focus: () => monacoEditorRef.current?.focus(),
    getCursorPosition: () => {
      const position = monacoEditorRef.current?.getPosition()
      return position ? { line: position.lineNumber, column: position.column } : { line: 1, column: 1 }
    }
  }))

  useEffect(() => {
    if (!editorRef.current) return

    // Initialize Monaco Editor
    monacoEditorRef.current = monaco.editor.create(editorRef.current, {
      value: value || '',
      language: language || 'javascript',
      theme: theme || 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: true },
      fontSize: 14,
      wordWrap: 'on',
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      folding: true,
      lineNumbers: 'on',
      renderWhitespace: 'boundary',
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: true,
      smoothScrolling: true,
      mouseWheelZoom: true
    })

    // Listen for changes
    const disposable = monacoEditorRef.current.onDidChangeModelContent(() => {
      if (onChange) {
        onChange(monacoEditorRef.current.getValue())
      }
    })

    // Listen for cursor position changes
    const cursorDisposable = monacoEditorRef.current.onDidChangeCursorPosition((e) => {
      if (onCursorPositionChange) {
        onCursorPositionChange({
          line: e.position.lineNumber,
          column: e.position.column
        })
      }
    })

    // Handle window resize
    const handleResize = () => {
      monacoEditorRef.current?.layout()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      disposable.dispose()
      cursorDisposable.dispose()
      window.removeEventListener('resize', handleResize)
      monacoEditorRef.current?.dispose()
    }
  }, [])

  useEffect(() => {
    if (monacoEditorRef.current && value !== monacoEditorRef.current.getValue()) {
      monacoEditorRef.current.setValue(value || '')
    }
  }, [value])

  useEffect(() => {
    if (monacoEditorRef.current && language) {
      const model = monacoEditorRef.current.getModel()
      if (model) {
        monaco.editor.setModelLanguage(model, language)
      }
    }
  }, [language])

  useEffect(() => {
    if (monacoEditorRef.current && theme) {
      monaco.editor.setTheme(theme)
    }
  }, [theme])

  return (
    <div
      ref={editorRef}
      className="monaco-editor-container"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px'
      }}
    />
  )
})

MonacoEditor.displayName = 'MonacoEditor'

export default MonacoEditor