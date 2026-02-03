import { jsPDF } from 'jspdf'
import { compressImage, fileToBase64, getImageDimensions } from '../image'
import type { QualityPreset } from '../image'

export type PageSize = 'a4' | 'letter' | 'fit'

interface PdfGeneratorOptions {
  pageSize: PageSize
  quality: QualityPreset
  onProgress?: (progress: number) => void
}

const PAGE_DIMENSIONS = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
}

export async function generatePdfFromImages(
  files: File[],
  options: PdfGeneratorOptions
): Promise<Blob> {
  const { pageSize, quality, onProgress } = options

  // Process images
  const processedImages: { data: string; width: number; height: number }[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const compressed = await compressImage(file, quality)
    const base64 = await fileToBase64(compressed)
    const dimensions = await getImageDimensions(compressed)

    processedImages.push({
      data: base64,
      width: dimensions.width,
      height: dimensions.height,
    })

    onProgress?.(((i + 1) / files.length) * 50)
  }

  // Create PDF
  let pdf: jsPDF

  if (pageSize === 'fit') {
    // First image determines initial page size
    const firstImage = processedImages[0]
    pdf = new jsPDF({
      orientation: firstImage.width > firstImage.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [firstImage.width, firstImage.height],
    })
  } else {
    pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: pageSize,
    })
  }

  for (let i = 0; i < processedImages.length; i++) {
    const image = processedImages[i]

    if (i > 0) {
      if (pageSize === 'fit') {
        pdf.addPage([image.width, image.height], image.width > image.height ? 'landscape' : 'portrait')
      } else {
        pdf.addPage()
      }
    }

    if (pageSize === 'fit') {
      pdf.addImage(image.data, 'JPEG', 0, 0, image.width, image.height)
    } else {
      // Calculate dimensions to fit page while maintaining aspect ratio
      const pageDims = PAGE_DIMENSIONS[pageSize]
      const margin = 10 // mm
      const maxWidth = pageDims.width - margin * 2
      const maxHeight = pageDims.height - margin * 2

      const imgRatio = image.width / image.height
      const pageRatio = maxWidth / maxHeight

      let finalWidth: number
      let finalHeight: number

      if (imgRatio > pageRatio) {
        finalWidth = maxWidth
        finalHeight = maxWidth / imgRatio
      } else {
        finalHeight = maxHeight
        finalWidth = maxHeight * imgRatio
      }

      const x = (pageDims.width - finalWidth) / 2
      const y = (pageDims.height - finalHeight) / 2

      pdf.addImage(image.data, 'JPEG', x, y, finalWidth, finalHeight)
    }

    onProgress?.(50 + ((i + 1) / processedImages.length) * 50)
  }

  return pdf.output('blob')
}
