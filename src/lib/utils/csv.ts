import csv from 'csv-parser'
import { createObjectCsvWriter } from 'csv-writer'
import fs from 'fs'

import { error, info } from '@/lib'

// Convert CSV to JSON
export async function csvToJson(csvFilePath: string, jsonFilePath: string) {
  try {
    const results: any[] = []

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        fs.writeFileSync(jsonFilePath, JSON.stringify(results, null, 2))
        info(`✅ JSON successfully written to: ${jsonFilePath}`)
      })
  } catch (err: any) {
    error(`❌ Failed to write JSON: ${err.message}`)
  }
}

// Convert JSON to CSV
export async function jsonToCsv(jsonFilePath: string, csvFilePath: string) {
  try {
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))

    if (!Array.isArray(jsonData)) {
      throw new Error('The JSON file must contain an array of objects.')
    }

    const headers = Object.keys(jsonData[0]).map((key) => ({
      id: key,
      title: key,
    }))

    const csvWriter = createObjectCsvWriter({
      path: csvFilePath,
      header: headers,
    })

    await csvWriter.writeRecords(jsonData)
    info(`✅ CSV successfully written to: ${csvFilePath}`)
  } catch (err: any) {
    error(`❌ Failed to write CSV: ${err.message}`)
  }
}
