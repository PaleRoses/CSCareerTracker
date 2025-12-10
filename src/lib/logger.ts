type LogLevel = 'debug' | 'info' | 'warn' | 'error'
type LogContext = Record<string, unknown>

const isDev = process.env.NODE_ENV === 'development'

function log(level: LogLevel, message: string, context?: LogContext): void {
  if (!isDev) return

  const prefix = `[${level.toUpperCase()}]`
  const args = context ? [prefix, message, context] : [prefix, message]

  console[level](...args)
}

export const logger = {
  debug: (message: string, context?: LogContext) => log('debug', message, context),
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),
  scope: (scopeName: string) => ({
    debug: (message: string, context?: LogContext) => log('debug', message, { scope: scopeName, ...context }),
    info: (message: string, context?: LogContext) => log('info', message, { scope: scopeName, ...context }),
    warn: (message: string, context?: LogContext) => log('warn', message, { scope: scopeName, ...context }),
    error: (message: string, context?: LogContext) => log('error', message, { scope: scopeName, ...context }),
  }),
}

export type { LogLevel, LogContext }
