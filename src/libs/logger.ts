import moment from 'moment'
import color, { bold } from 'ansi-colors'

const { log, error, warn: warning } = console

export function info(...args: any[]): void {
  logger('INFO', ...args)
}

export function warn(...args: any[]): void {
  logger('WARN', ...args)
}

export function err(...args: any[]): void {
  logger('ERR', ...args)
}

function logger(type: 'INFO' | 'WARN' | 'ERR', ...args: any[]): void {
  const date = moment().format('YYYY-MM-DD HH:mm:ss')

  switch (type) {
    case 'INFO':
      log(bold(color.cyan(date)), color.cyan('[INFO]:'), ...args)
      break
    case 'WARN':
      warning(bold(color.yellow(date)), color.yellow('[WARNING]:'), ...args)
      break
    case 'ERR':
      error(bold(color.red(date)), color.red('[ERRORE]:'), ...args)
      break
    default:
      break
  }
}
