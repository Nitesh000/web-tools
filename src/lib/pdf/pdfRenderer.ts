import * as pdfjs from 'pdfjs-dist'

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export type OutputFormat = 'jpg' | 'png' | 'webp'

export interface PdfPage {
  pageNumber: number
  thumbnail: string
  width: number
  height: number
}

export interface RenderOptions {
  format: OutputFormat
  quality: number
  scale: number
}

const MIME_TYPES: Record<OutputFormat, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

export async function loadPdf(file: File): Promise<pdfjs.PDFDocumentProxy> {
  const arrayBuffer = await file.arrayBuffer()
  return pdfjs.getDocument({ data: arrayBuffer }).promise
}

export async function getPdfPageCount(pdf: pdfjs.PDFDocumentProxy): Promise<number> {
  return pdf.numPages
}

export async function renderPdfPageToCanvas(
  pdf: pdfjs.PDFDocumentProxy,
  pageNumber: number,
  scale: number
): Promise<HTMLCanvasElement> {
  const page = await pdf.getPage(pageNumber)
  const viewport = page.getViewport({ scale })

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!

  canvas.width = viewport.width
  canvas.height = viewport.height

  await page.render({
    canvasContext: context,
    viewport,
  }).promise

  return canvas
}

export async function generateThumbnails(
  pdf: pdfjs.PDFDocumentProxy,
  onProgress?: (progress: number) => void
): Promise<PdfPage[]> {
  const pageCount = pdf.numPages
  const thumbnails: PdfPage[] = []

  for (let i = 1; i <= pageCount; i++) {
    const canvas = await renderPdfPageToCanvas(pdf, i, 0.3)
    thumbnails.push({
      pageNumber: i,
      thumbnail: canvas.toDataURL('image/jpeg', 0.7),
      width: canvas.width,
      height: canvas.height,
    })
    onProgress?.(((i) / pageCount) * 100)
  }

  return thumbnails
}

export async function renderPageToImage(
  pdf: pdfjs.PDFDocumentProxy,
  pageNumber: number,
  options: RenderOptions
): Promise<Blob> {
  const canvas = await renderPdfPageToCanvas(pdf, pageNumber, options.scale)
  const mimeType = MIME_TYPES[options.format]

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create blob'))
        }
      },
      mimeType,
      options.quality
    )
  })
}

export async function renderAllPagesToImages(
  pdf: pdfjs.PDFDocumentProxy,
  options: RenderOptions,
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; filename: string }[]> {
  const pageCount = pdf.numPages
  const images: { blob: Blob; filename: string }[] = []

  for (let i = 1; i <= pageCount; i++) {
    const blob = await renderPageToImage(pdf, i, options)
    const extension = options.format
    images.push({
      blob,
      filename: `page-${i}.${extension}`,
    })
    onProgress?.((i / pageCount) * 100)
  }

  return images
}
