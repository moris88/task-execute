import SftpClient from 'ssh2-sftp-client'

import { error, info } from '@/lib'

// Upload a file to SFTP
export async function uploadToSftp(
  host: string,
  port: number,
  user: string,
  password: string,
  localFilePath: string,
  remoteFilePath: string
): Promise<void> {
  const sftp = new SftpClient()

  try {
    await sftp.connect({ host, port, username: user, password })
    await sftp.put(localFilePath, remoteFilePath)
    info(`✅ File successfully uploaded to SFTP: ${remoteFilePath}`)
  } catch (err: any) {
    error(`❌ SFTP upload failed: ${err.message}`)
    throw new Error(`SFTP upload failed: ${err.message}`)
  } finally {
    await sftp.end()
  }
}

// Download a file from SFTP
export async function downloadFromSftp(
  host: string,
  port: number,
  user: string,
  password: string,
  remoteFilePath: string,
  localFilePath: string
): Promise<void> {
  const sftp = new SftpClient()

  try {
    await sftp.connect({ host, port, username: user, password })
    await sftp.get(remoteFilePath, localFilePath)
    info(`✅ File successfully downloaded from SFTP: ${localFilePath}`)
  } catch (err: any) {
    error(`❌ SFTP download failed: ${err.message}`)
    throw new Error(`SFTP download failed: ${err.message}`)
  } finally {
    await sftp.end()
  }
}
