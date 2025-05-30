import dotenv from 'dotenv'
import fs from 'fs'
import moment from 'moment'

import { TaskManager } from '@/lib'

import { tasks } from './tasks'
dotenv.config()

const configString = fs.readFileSync(`${__dirname}/config.json`, `utf8`)
const config = JSON.parse(configString)

moment.locale(config.locale)

async function main() {
  const taskManager = new TaskManager(config)
  taskManager.start(tasks)
}
main()
