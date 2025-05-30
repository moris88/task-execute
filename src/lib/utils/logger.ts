import fs from 'fs'
import moment from 'moment'
import path from 'path'
import { createLogger, format, transports } from 'winston'

// Path configurabile via env o default su /logs
const logDir = path.resolve(process.cwd(), process.env.LOG_DIR ?? 'logs')

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

const date = moment().format('YYYY_MM_DD')
const logFilePath = path.join(logDir, `${date}.log`)

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(), // colora il livello (info, warn, error...)
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: [
    new transports.Console(), // log colorato in console
    new transports.File({ filename: logFilePath }), // file senza colori
  ],
})

const { info, warn, error } = logger

export {
  logger as default, // esporta il logger come default
  error,
  info,
  warn,
}
