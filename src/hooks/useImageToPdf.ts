import { useState, useCallback } from 'react'
import { saveAs } from 'file-saver'
import { generatePdfFromImages } from '../lib/pdf'
import type { PageSize } from '../lib/pdf'
import type { QualityPreset } from '../lib/image'

interface ImageFile {
  id: string
  file: File
  preview: string
}

interface UseImageToPdfReturn {
  files: ImageFile[]
  isConverting: boolean
  progress: number
  pageSize: PageSize
  quality: QualityPreset
  addFiles: (newFiles: File[]) => void
  removeFile: (id: string) => void
  reorderFiles: (fromIndex: number, toIndex: number) => void
  clearFiles: () => void
  setPageSize: (size: PageSize) => void
  setQuality: (quality: QualityPreset) => void
  convert: () => Promise<void>
}

export function useImageToPdf(): UseImageToPdfReturn {
  const [files, setFiles] = useState<ImageFile[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [pageSize, setPageSize] = useState<PageSize>('a4')
  const [quality, setQuality] = useState<QualityPreset>('high')

  const addFiles = useCallback((newFiles: File[]) => {
    const imageFiles = newFiles
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      }))
    setFiles((prev) => [...prev, ...imageFiles])
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [])

  const reorderFiles = useCallback((fromIndex: number, toIndex: number) => {
    setFiles((prev) => {
      const result = [...prev]
      const [removed] = result.splice(fromIndex, 1)
      result.splice(toIndex, 0, removed)
      return result
    })
  }, [])

  const clearFiles = useCallback(() => {
    files.forEach((file) => URL.revokeObjectURL(file.preview))
    setFiles([])
  }, [files])

  const convert = useCallback(async () => {
    if (files.length === 0) return

    setIsConverting(true)
    setProgress(0)

    try {
      const blob = await generatePdfFromImages(
        files.map((f) => f.file),
        {
          pageSize,
          quality,
          onProgress: setProgress,
        }
      )

      saveAs(blob, 'converted.pdf')
    } catch (error) {
      console.error('Conversion error:', error)
      throw error
    } finally {
      setIsConverting(false)
      setProgress(0)
    }
  }, [files, pageSize, quality])

  return {
    files,
    isConverting,
    progress,
    pageSize,
    quality,
    addFiles,
    removeFile,
    reorderFiles,
    clearFiles,
    setPageSize,
    setQuality,
    convert,
  }
}
