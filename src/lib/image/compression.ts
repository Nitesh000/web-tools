import imageCompression from 'browser-image-compression'

export type QualityPreset = 'high' | 'low'

export const QUALITY_PRESETS = {
  high: { maxSizeMB: 2, maxWidthOrHeight: 4096, quality: 0.92 },
  low: { maxSizeMB: 0.5, maxWidthOrHeight: 1200, quality: 0.7 },
} as const

export async function compressImage(
  file: File,
  preset: QualityPreset
): Promise<File> {
  const options = {
    maxSizeMB: QUALITY_PRESETS[preset].maxSizeMB,
    maxWidthOrHeight: QUALITY_PRESETS[preset].maxWidthOrHeight,
    useWebWorker: true,
    initialQuality: QUALITY_PRESETS[preset].quality,
  }

  try {
    return await imageCompression(file, options)
  } catch (error) {
    console.error('Compression error:', error)
    return file
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
