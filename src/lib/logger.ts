type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

interface LogEntry {
  level: LogLevel
  message: string
  context?: LogContext
  timestamp: string
}

const config = {
  enableConsole: process.env.NODE_ENV === 'development',
  minLevel: (process.env.LOG_LEVEL as LogLevel) || 'debug',
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[config.minLevel]
}

function formatError(error: unknown): object {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }
  return { value: String(error) }
}

function createLogEntry(
  level: LogLevel,
  message: string,
  context?: LogContext
): LogEntry {
  return {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  }
}

function logToConsole(entry: LogEntry): void {
  if (!config.enableConsole) return

  const prefix = `[${entry.level.toUpperCase()}]`
  const contextStr = entry.context ? JSON.stringify(entry.context, null, 2) : ''

  switch (entry.level) {
    case 'error':
      console.error(prefix, entry.message, contextStr)
      break
    case 'warn':
      console.warn(prefix, entry.message, contextStr)
      break
    case 'info':
      console.info(prefix, entry.message, contextStr)
      break
    case 'debug':
      console.debug(prefix, entry.message, contextStr)
      break
  }
}

function logToService(_entry: LogEntry): void {}

function log(level: LogLevel, message: string, context?: LogContext): void {
  if (!shouldLog(level)) return

  const normalizedContext = context
    ? Object.fromEntries(
        Object.entries(context).map(([key, value]) => [
          key,
          value instanceof Error ? formatError(value) : value,
        ])
      )
    : undefined

  const entry = createLogEntry(level, message, normalizedContext)

  logToConsole(entry)
  logToService(entry)
}

export const logger = {
  debug: (message: string, context?: LogContext) => log('debug', message, context),
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),
  scope: (scopeName: string) => ({
    debug: (message: string, context?: LogContext) =>
      log('debug', message, { scope: scopeName, ...context }),
    info: (message: string, context?: LogContext) =>
      log('info', message, { scope: scopeName, ...context }),
    warn: (message: string, context?: LogContext) =>
      log('warn', message, { scope: scopeName, ...context }),
    error: (message: string, context?: LogContext) =>
      log('error', message, { scope: scopeName, ...context }),
  }),
}

export type { LogLevel, LogContext, LogEntry }
