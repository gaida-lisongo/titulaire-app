import { useState, useCallback } from 'react'
import MDEditor from '@uiw/react-md-editor'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.css'

interface MathEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function MathEditor({ value, onChange, className }: MathEditorProps) {
  const handleChange = useCallback((val: string | undefined) => {
    onChange(val || '')
  }, [onChange])

  return (
    <div className={className} data-color-mode="light">
      <MDEditor
        value={value}
        onChange={handleChange}
        previewOptions={{
          rehypePlugins: [[rehypeKatex, { output: 'mathml' }]],
          remarkPlugins: [remarkMath],
        }}
        height={400}
        preview="live"
        extraCommands={[
          {
            name: 'latex',
            keyCommand: 'latex',
            buttonProps: { 'aria-label': 'Insert LaTeX' },
            icon: <span>∑</span>,
            execute: (state, api) => {
              const modifyText = `${state.text}\n$$\n\n$$`
              api.replaceSelection(modifyText)
            },
          }
        ]}
        textareaProps={{
          placeholder: 'Écrivez votre question ici... Utilisez $$ pour les formules mathématiques'
        }}
      />
    </div>
  )
}