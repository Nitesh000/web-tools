import { useState, useCallback } from 'react'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import {
  loadPdf,
  generateThumbnails,
  renderAllPagesToImages,
} from '../lib/pdf'
import type { PdfPage, OutputFormat } from '../lib/pdf'
import { QUALITY_PRESETS } from '../lib/image'
import type { QualityPreset } from '../lib/image'

interface UsePdfToImageReturn {
  pdfFile: File | null
  pages: PdfPage[]
  selectedPages: number[]
  isLoading: boolean
  isConverting: boolean
  progress: number
  outputFormat: OutputFormat
  quality: QualityPreset
  loadPdfFile: (file: File) => Promise<void>
  clearPdf: () => void
  togglePageSelection: (pageNumber: number) => void
  selectAllPages: () => void
  deselectAllPages: () => void
  setOutputFormat: (format: OutputFormat) => void
  setQuality: (quality: QualityPreset) => void
  convertSelected: () => Promise<void>
  convertAll: () => Promise<void>
}

export function usePdfToImage(): UsePdfToImageReturn {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null)
  const [pages, setPages] = useState<PdfPage[]>([])
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('jpg')
  const [quality, setQuality] = useState<QualityPreset>('high')

  const loadPdfFile = useCallback(async (file: File) => {
    if (!file.type.includes('pdf')) {
      throw new Error('Please select a PDF file')
    }

    setIsLoading(true)
    setProgress(0)

    try {
      const pdf = await loadPdf(file)
      const thumbnails = await generateThumbnails(pdf, setProgress)

      setPdfFile(file)
      setPdfDoc(pdf)
      setPages(thumbnails)
      setSelectedPages(thumbnails.map((p) => p.pageNumber))
    } catch (error) {
      console.error('Error loading PDF:', error)
      throw error
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }, [])

  const clearPdf = useCallback(() => {
    setPdfFile(null)
    setPdfDoc(null)
    setPages([])
    setSelectedPages([])
  }, [])

  const togglePageSelection = useCallback((pageNumber: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNumber)
        ? prev.filter((p) => p !== pageNumber)
        : [...prev, pageNumber].sort((a, b) => a - b)
    )
  }, [])

  const selectAllPages = useCallback(() => {
    setSelectedPages(pages.map((p) => p.pageNumber))
  }, [pages])

  const deselectAllPages = useCallback(() => {
    setSelectedPages([])
  }, [])

  const downloadImages = useCallback(
    async (pagesToConvert: number[]) => {
      if (!pdfDoc || pagesToConvert.length === 0) return

      setIsConverting(true)
      setProgress(0)

      try {
        const scale = quality === 'high' ? 2 : 1
        const imageQuality = QUALITY_PRESETS[quality].quality

        const images = await renderAllPagesToImages(
          pdfDoc,
          { format: outputFormat, quality: imageQuality, scale },
          setProgress
        )

        const filteredImages = images.filter((_, index) =>
          pagesToConvert.includes(index + 1)
        )

        if (filteredImages.length === 1) {
          saveAs(filteredImages[0].blob, filteredImages[0].filename)
        } else {
          const zip = new JSZip()
          filteredImages.forEach((image) => {
            zip.file(image.filename, image.blob)
          })
          const zipBlob = await zip.generateAsync({ type: 'blob' })
          saveAs(zipBlob, 'pdf-images.zip')
        }
      } catch (error) {
        console.error('Conversion error:', error)
        throw error
      } finally {
        setIsConverting(false)
        setProgress(0)
      }
    },
    [pdfDoc, outputFormat, quality]
  )

  const convertSelected = useCallback(() => {
    return downloadImages(selectedPages)
  }, [downloadImages, selectedPages])

  const convertAll = useCallback(() => {
    return downloadImages(pages.map((p) => p.pageNumber))
  }, [downloadImages, pages])

  return {
    pdfFile,
    pages,
    selectedPages,
    isLoading,
    isConverting,
    progress,
    outputFormat,
    quality,
    loadPdfFile,
    clearPdf,
    togglePageSelection,
    selectAllPages,
    deselectAllPages,
    setOutputFormat,
    setQuality,
    convertSelected,
    convertAll,
  }
}
