import csv from 'csv-parser'
import fs from 'fs'
import { createObjectCsvWriter } from 'csv-writer'
import { Logger } from '@/libs'

// Funzione per convertire CSV in JSON
export async function csvToJson(csvFilePath: string, jsonFilePath: string) {
  try {
    const results: any[] = []

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on(`data`, (data) => results.push(data))
      .on(`end`, () => {
        fs.writeFileSync(jsonFilePath, JSON.stringify(results, null, 2))
        Logger.info(`JSON scritto con successo in ${jsonFilePath}`)
      })
  } catch (error) {
    Logger.err(`Errore nella scrittura del JSON:`, error)
  }
}

// Funzione per convertire JSON in CSV
export async function jsonToCsv(jsonFilePath: string, csvFilePath: string) {
  try {
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, `utf-8`))

    // Assicurati che jsonData sia un array
    if (!Array.isArray(jsonData)) {
      throw new Error(`Il file JSON deve contenere un array di oggetti.`)
    }

    // Estrai le intestazioni dalla prima voce dell'array
    const headers = Object.keys(jsonData[0]).map((key) => ({
      id: key,
      title: key,
    }))

    // Crea il writer per il CSV
    const csvWriter = createObjectCsvWriter({
      path: csvFilePath,
      header: headers,
    })

    await csvWriter.writeRecords(jsonData)
    Logger.info(`CSV scritto con successo in ${csvFilePath}`)
  } catch (error) {
    Logger.err(`Errore nella scrittura del CSV:`, error)
  }
}
