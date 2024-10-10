import Client from 'ftp'
import fs from 'fs'

// Funzione per caricare un file su FTP
async function uploadToFtp(
  host: string,
  user: string,
  password: string,
  localFilePath: string,
  remoteFilePath: string
) {
  const ftpClient = new Client()

  return new Promise<void>((resolve, reject) => {
    ftpClient.on('ready', () => {
      ftpClient.put(localFilePath, remoteFilePath, (err) => {
        if (err) {
          reject(`Errore nel caricamento su FTP: ${err.message}`)
        } else {
          console.log(`File caricato con successo su FTP: ${remoteFilePath}`)
          resolve()
        }
        ftpClient.end()
      })
    })

    ftpClient.connect({ host, user, password })
  })
}

// Funzione per scaricare un file da FTP
async function downloadFromFtp(
  host: string,
  user: string,
  password: string,
  remoteFilePath: string,
  localFilePath: string
) {
  const ftpClient = new Client()

  return new Promise<void>((resolve, reject) => {
    ftpClient.on('ready', () => {
      ftpClient.get(remoteFilePath, (err, stream) => {
        if (err) {
          reject(`Errore nel download da FTP: ${err.message}`)
        } else {
          stream.pipe(fs.createWriteStream(localFilePath))
          stream.on('end', () => {
            console.log(`File scaricato con successo da FTP: ${localFilePath}`)
            resolve()
          })
        }
        ftpClient.end()
      })
    })

    ftpClient.connect({ host, user, password })
  })
}
