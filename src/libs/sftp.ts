import SftpClient from 'ssh2-sftp-client'

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
    console.log(`File caricato con successo su SFTP: ${remoteFilePath}`)
  } catch (error: any) {
    console.error(`Errore nel caricamento su SFTP: ${error.message}`)
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
    console.log(`File scaricato con successo da SFTP: ${localFilePath}`)
  } catch (error: any) {
    console.error(`Errore nel download da SFTP: ${error.message}`)
  } finally {
    sftp.end()
  }
}
