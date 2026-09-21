import { useCallback } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { UploadCloud, ChevronUp, ChevronDown, X, Loader2, FileDown } from 'lucide-react'
import { useImageToPdf } from '../../../hooks/useImageToPdf'
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
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-slate-600 hover:border-blue-500 hover:bg-slate-700/50'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-12 h-12 mx-auto mb-4 text-slate-400" strokeWidth={1.5} />
        <p className="text-lg font-medium text-white mb-2">
          {isDragActive ? 'Drop your images here' : 'Drag & drop images here'}
        </p>
        <p className="text-slate-400">or click to browse • JPG, PNG, WebP, GIF</p>
      </div>

      {/* Image List */}
      {files.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <p className="text-slate-300">{files.length} image{files.length !== 1 ? 's' : ''} selected</p>
            <button
              onClick={clearFiles}
              className="px-3 py-1.5 text-sm bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg"
              >
                <img
                  src={file.preview}
                  alt={file.file.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{file.file.name}</p>
                  <p className="text-sm text-slate-400">
                    {(file.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveImage(index, 'down')}
                    disabled={index === files.length - 1}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Settings */}
          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-700">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Page Size
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as 'a4' | 'letter' | 'fit')}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="a4">A4 (210 x 297 mm)</option>
                <option value="letter">Letter (8.5 x 11 in)</option>
                <option value="fit">Fit to Image</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Quality
              </label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as 'high' | 'low')}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="high">High Quality (larger PDF)</option>
                <option value="low">Low Quality (smaller PDF)</option>
              </select>
            </div>
          </div>

          {/* Conversion Progress */}
          {isConverting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Creating PDF...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Convert Button */}
          <button
            onClick={async () => {
              try {
                await convert()
                showToast('PDF downloaded', 'success')
              } catch (error) {
                showToast(error instanceof Error ? error.message : 'Failed to create PDF', 'error')
              }
            }}
            disabled={files.length === 0 || isConverting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isConverting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating PDF...
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                Create PDF from {files.length} Image{files.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </>
      )}
    </div>
  )
}

export default ImageToPdf
