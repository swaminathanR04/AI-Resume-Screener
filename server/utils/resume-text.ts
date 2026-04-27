import fs from 'node:fs/promises'
import path from 'node:path'
import { PDFParse } from 'pdf-parse'
import { getUploadStoragePath } from '~~/server/utils/upload-storage'

export async function extractResumeText(relativeResumePath: string) {
  const filePath = path.join(getUploadStoragePath(), relativeResumePath)
  const buffer = await fs.readFile(filePath)
  const parser = new PDFParse({ data: buffer })

  try {
    const parsed = await parser.getText()

    return parsed.text.replace(/\s+/g, ' ').trim()
  } finally {
    await parser.destroy()
  }
}
