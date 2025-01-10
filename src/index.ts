import dotenv from 'dotenv'
import integration from './integration'
import { Logger } from '@/libs'

dotenv.config()

Logger.info(`Esecuzione del programma...`)
integration()
