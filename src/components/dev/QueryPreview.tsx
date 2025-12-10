'use client'

import { Tooltip, Box } from '@mui/material'
import { type ReactNode } from 'react'
import { QUERY_DEFINITIONS, type QueryName } from '@/lib/queries/core/query-definitions'
import { useDevMode } from './DevModeContext'

interface QueryPreviewProps {
  query: QueryName
  children: ReactNode
  disabled?: boolean
}

type TokenType = 'keyword' | 'string' | 'param' | 'number' | 'comment' | 'boolean' | 'text'

interface Token {
  type: TokenType
  value: string
}

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: '#c678dd',
  string: '#98c379',
  param: '#e5c07b',
  number: '#d19a66',
  comment: '#5c6370',
  boolean: '#d19a66',
  text: '#abb2bf',
}

const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'AND', 'OR',
  'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'UPDATE', 'DELETE', 'INTO',
  'VALUES', 'SET', 'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'CASE', 'WHEN',
  'THEN', 'ELSE', 'END', 'NULL', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'ASC', 'DESC',
  'RETURNING', 'WITH', 'UNION', 'EXCEPT', 'INTERSECT', 'EXISTS', 'CREATE', 'ALTER', 'DROP',
  'TABLE', 'INDEX', 'VIEW', 'CONSTRAINT', 'PRIMARY', 'FOREIGN', 'KEY', 'REFERENCES',
  'CASCADE', 'DEFAULT', 'CHECK', 'UNIQUE', 'NOW', 'INTERVAL', 'COALESCE', 'NULLIF',
])

function tokenizeSQL(sql: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < sql.length) {
    if (sql.slice(i, i + 2) === '--') {
      const end = sql.indexOf('\n', i)
      const commentEnd = end === -1 ? sql.length : end
      tokens.push({ type: 'comment', value: sql.slice(i, commentEnd) })
      i = commentEnd
      continue
    }

    if (sql[i] === "'") {
      let j = i + 1
      while (j < sql.length && sql[j] !== "'") j++
      tokens.push({ type: 'string', value: sql.slice(i, j + 1) })
      i = j + 1
      continue
    }

    if (sql[i] === '$' && /\d/.test(sql[i + 1] || '')) {
      let j = i + 1
      while (j < sql.length && /\d/.test(sql[j])) j++
      tokens.push({ type: 'param', value: sql.slice(i, j) })
      i = j
      continue
    }

    if (/\d/.test(sql[i])) {
      let j = i
      while (j < sql.length && /[\d.]/.test(sql[j])) j++
      tokens.push({ type: 'number', value: sql.slice(i, j) })
      i = j
      continue
    }

    if (/[a-zA-Z_]/.test(sql[i])) {
      let j = i
      while (j < sql.length && /[a-zA-Z0-9_]/.test(sql[j])) j++
      const word = sql.slice(i, j)
      const upper = word.toUpperCase()
      if (upper === 'TRUE' || upper === 'FALSE') {
        tokens.push({ type: 'boolean', value: word })
      } else if (SQL_KEYWORDS.has(upper)) {
        tokens.push({ type: 'keyword', value: word })
      } else {
        tokens.push({ type: 'text', value: word })
      }
      i = j
      continue
    }

    tokens.push({ type: 'text', value: sql[i] })
    i++
  }

  return tokens
}

function highlightSQL(sql: string): ReactNode {
  const tokens = tokenizeSQL(sql.trim())
  return tokens.map((token, idx) => (
    <span key={idx} style={{ color: TOKEN_COLORS[token.type] }}>
      {token.value}
    </span>
  ))
}

export function QueryPreview({
  query,
  children,
  disabled = false,
}: QueryPreviewProps) {
  const { sqlModeEnabled } = useDevMode()

  if (disabled || !sqlModeEnabled) {
    return <>{children}</>
  }

  const sql = QUERY_DEFINITIONS[query]
  const queryLabel = query.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <Tooltip
      title={
        <Box sx={{ maxWidth: 700, overflow: 'auto' }}>
          <Box
            component="span"
            sx={{
              display: 'block',
              fontWeight: 600,
              fontSize: 12,
              color: '#61afef',
              mb: 1,
              fontFamily: 'monospace',
            }}
          >
            {queryLabel}
          </Box>
          <Box
            component="pre"
            sx={{
              margin: 0,
              fontSize: 12,
              lineHeight: 1.5,
              fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {highlightSQL(sql)}
          </Box>
        </Box>
      }
      followCursor
      enterDelay={200}
      leaveDelay={100}
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: '#282c34',
            border: '1px solid #3e4451',
            p: 2,
            borderRadius: 1.5,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          cursor: 'help',
          borderRadius: 2,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: '2px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
            opacity: 0.5,
            transition: 'opacity 0.2s ease',
          },
          '&:hover::before': {
            opacity: 0.8,
          },
          '&::after': {
            content: '"SQL"',
            position: 'absolute',
            top: -8,
            right: 8,
            fontSize: 9,
            fontWeight: 700,
            fontFamily: 'monospace',
            color: 'rgba(168, 85, 247, 0.9)',
            backgroundColor: 'rgba(15, 15, 20, 0.95)',
            padding: '1px 6px',
            borderRadius: 1,
            zIndex: 1,
            letterSpacing: '0.5px',
          },
        }}
      >
        {children}
      </Box>
    </Tooltip>
  )
}
