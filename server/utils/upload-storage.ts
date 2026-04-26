import path from 'node:path'

export function getUploadStoragePath() {
  return process.env.UPLOAD_STORAGE_PATH || path.join(process.cwd(), '.data', 'uploads')
}
