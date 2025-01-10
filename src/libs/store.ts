import path from 'path'
import fs from 'fs'
import { err, info } from './logger'

const projectRoot =
  __dirname.split(path.sep)[__dirname.split(path.sep).length - 1] === `dist`
    ? __dirname
    : path.resolve(__dirname, `../`)

export function write(filename: string, content: any): void {
  try {
    const dataPath = path.join(projectRoot, `data`, filename)
    fs.mkdirSync(path.join(projectRoot, `data`), { recursive: true })
    fs.writeFileSync(dataPath, JSON.stringify(content, null, 3), `utf8`)
    info(`File written:`, dataPath)
  } catch (error: any) {
    err(`Error writing file:`, error)
  }
}

export function read(filename: string): any {
  try {
    const dataPath = path.join(projectRoot, `data`, filename)
    fs.mkdirSync(path.join(projectRoot, `data`), { recursive: true })
    const dataString = fs.readFileSync(dataPath, `utf8`)
    const data = JSON.parse(dataString)
    info(`File read:`, dataPath)
    return data
  } catch (error: any) {
    err(`Error reading file:`, error)
    return null
  }
}
