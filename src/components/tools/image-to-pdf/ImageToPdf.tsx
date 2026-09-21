import { useCallback } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { UploadCloud, ChevronUp, ChevronDown, X, FileDown } from 'lucide-react'
import { useImageToPdf } from '../../../hooks/useImageToPdf'
import { Button } from '../../common/Button'
import { Select } from '../../common/Select'
import { useToast } from '../../common/Toast'

export function ImageToPdf() {
  const { showToast } = useToast()
  const {
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
  } = useImageToPdf()

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        showToast(`Skipped ${fileRejections.length} unsupported file(s)`, 'error')
      }
      if (acceptedFiles.length > 0) {
        addFiles(acceptedFiles)
      }
    },
    [addFiles, showToast]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
    },
    multiple: true,
  })

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < files.length) {
      reorderFiles(index, newIndex)
    }
  }

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
            : 'border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {isDragActive ? 'Drop your images here' : 'Drag & drop images here'}
        </p>
        <p className="text-gray-500 dark:text-gray-400">or click to browse • JPG, PNG, WebP, GIF</p>
      </div>

      {/* Image List */}
      {files.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <p className="text-gray-700 dark:text-gray-300">{files.length} image{files.length !== 1 ? 's' : ''} selected</p>
            <Button size="sm" variant="outline" onClick={clearFiles} className="!border-red-300 !text-red-600 hover:!bg-red-50 dark:!border-red-700 dark:!text-red-400 dark:hover:!bg-red-900/20">
              Clear All
            </Button>
          </div>

          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <img
                  src={file.preview}
                  alt={file.file.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{file.file.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(file.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveImage(index, 'down')}
                    disabled={index === files.length - 1}
                    className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Settings */}
          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Select
              label="Page Size"
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as 'a4' | 'letter' | 'fit')}
            >
              <option value="a4">A4 (210 x 297 mm)</option>
              <option value="letter">Letter (8.5 x 11 in)</option>
              <option value="fit">Fit to Image</option>
            </Select>
            <Select
              label="Quality"
              value={quality}
              onChange={(e) => setQuality(e.target.value as 'high' | 'low')}
            >
              <option value="high">High Quality (larger PDF)</option>
              <option value="low">Low Quality (smaller PDF)</option>
            </Select>
          </div>

          {/* Conversion Progress */}
          {isConverting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>Creating PDF...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Convert Button */}
          <Button
            size="lg"
            fullWidth
            onClick={async () => {
              try {
                await convert()
                showToast('PDF downloaded', 'success')
              } catch (error) {
                showToast(error instanceof Error ? error.message : 'Failed to create PDF', 'error')
              }
            }}
            disabled={files.length === 0 || isConverting}
            isLoading={isConverting}
            leftIcon={!isConverting ? <FileDown className="w-5 h-5" /> : undefined}
          >
            {isConverting ? 'Creating PDF...' : `Create PDF from ${files.length} Image${files.length !== 1 ? 's' : ''}`}
          </Button>
        </>
      )}
    </div>
  )
}

export default ImageToPdf
