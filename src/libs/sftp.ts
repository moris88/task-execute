import SftpClient from 'ssh2-sftp-client'
import { Logger } from '@/libs'

// Funzione per caricare un file su SFTP
export async function uploadToSftp(
  host: string,
  port: number,
  user: string,
  password: string,
  localFilePath: string,
  remoteFilePath: string
) {
  const sftp = new SftpClient()

  try {
    await sftp.connect({ host, port, username: user, password })
    await sftp.put(localFilePath, remoteFilePath)
    Logger.info(`File caricato con successo su SFTP: ${remoteFilePath}`)
  } catch (error: any) {
    Logger.err(`Errore nel caricamento su SFTP: ${error.message}`)
  } finally {
    sftp.end()
  }
}

// Funzione per scaricare un file da SFTP
export async function downloadFromSftp(
  host: string,
  port: number,
  user: string,
  password: string,
  remoteFilePath: string,
  localFilePath: string
) {
  const sftp = new SftpClient()

  try {
    await sftp.connect({ host, port, username: user, password })
    await sftp.get(remoteFilePath, localFilePath)
    Logger.info(`File scaricato con successo da SFTP: ${localFilePath}`)
  } catch (error: any) {
    Logger.err(`Errore nel download da SFTP: ${error.message}`)
  } finally {
    sftp.end()
  }
}
