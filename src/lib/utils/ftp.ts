import fs from 'fs'
import Client from 'ftp'

import { error, info } from '@/lib'

// Upload a file to FTP
export async function uploadToFtp(
  host: string,
  user: string,
  password: string,
  localFilePath: string,
  remoteFilePath: string
): Promise<void> {
  const ftpClient = new Client()

  return new Promise<void>((resolve, reject) => {
    ftpClient.on('ready', () => {
      ftpClient.put(localFilePath, remoteFilePath, (err) => {
        if (err) {
          error(`❌ FTP upload failed: ${err.message}`)
          reject(new Error(`FTP upload failed: ${err.message}`))
        } else {
          info(`✅ File successfully uploaded to FTP: ${remoteFilePath}`)
          resolve()
        }
        ftpClient.end()
      })
    })

    ftpClient.on('error', (err) => {
      error(`❌ FTP connection error: ${err.message}`)
      reject(new Error(`FTP connection error: ${err.message}`))
    })

    ftpClient.connect({ host, user, password })
  })
}

// Download a file from FTP
export async function downloadFromFtp(
  host: string,
  user: string,
  password: string,
  remoteFilePath: string,
  localFilePath: string
): Promise<void> {
  const ftpClient = new Client()

  return new Promise<void>((resolve, reject) => {
    ftpClient.on('ready', () => {
      ftpClient.get(remoteFilePath, (err, stream) => {
        if (err) {
          error(`❌ FTP download failed: ${err.message}`)
          reject(new Error(`FTP download failed: ${err.message}`))
        } else {
          stream.pipe(fs.createWriteStream(localFilePath))
          stream.on('end', () => {
            info(`✅ File successfully downloaded from FTP: ${localFilePath}`)
            resolve()
          })
        }
        ftpClient.end()
      })
    })

    ftpClient.on('error', (err) => {
      error(`❌ FTP connection error: ${err.message}`)
      reject(new Error(`FTP connection error: ${err.message}`))
    })

    ftpClient.connect({ host, user, password })
  })
}
