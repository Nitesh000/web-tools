import { useCallback } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { FileUp, FileText, Download, Check } from 'lucide-react'
import { usePdfToImage } from '../../../hooks/usePdfToImage'
import { Button } from '../../common/Button'
import { Select } from '../../common/Select'
import { useToast } from '../../common/Toast'

export function PdfToImage() {
  const { showToast } = useToast()
  const {
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
  } = usePdfToImage()

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        showToast('Please select a valid PDF file', 'error')
        return
      }
      if (acceptedFiles.length > 0) {
        try {
          await loadPdfFile(acceptedFiles[0])
        } catch (error) {
          showToast(error instanceof Error ? error.message : 'Could not read that PDF', 'error')
        }
      }
    },
    [loadPdfFile, showToast]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  })

  return (
    <div className="space-y-6">
      {/* File Upload / File Info */}
      {!pdfFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
              : 'border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500'
          }`}
        >
          <input {...getInputProps()} />
          <FileUp className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
          </p>
          <p className="text-gray-500 dark:text-gray-400">or click to browse files</p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-red-500 dark:text-red-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{pdfFile.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(pdfFile.size / 1024 / 1024).toFixed(2)} MB • {pages.length} pages
              </p>
            </div>
          </div>
          <Button size="sm" variant="secondary" onClick={clearPdf}>
            Remove
          </Button>
        </div>
      )}

      {/* Loading Progress */}
      {isLoading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
            <span>Loading PDF...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Page Grid */}
      {pages.length > 0 && !isLoading && (
        <>
          <div className="flex gap-2 justify-between items-center">
            <p className="text-gray-700 dark:text-gray-300">
              {selectedPages.length} of {pages.length} pages selected
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={selectAllPages}>
                Select All
              </Button>
              <Button size="sm" variant="secondary" onClick={deselectAllPages}>
                Deselect All
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {pages.map((page) => (
              <button
                key={page.pageNumber}
                onClick={() => togglePageSelection(page.pageNumber)}
                className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                  selectedPages.includes(page.pageNumber)
                    ? 'border-blue-500 ring-2 ring-blue-500/50'
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                }`}
              >
                <img
                  src={page.thumbnail}
                  alt={`Page ${page.pageNumber}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-medium">{page.pageNumber}</span>
                </div>
                {selectedPages.includes(page.pageNumber) && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Settings */}
          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Select
              label="Output Format"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as 'jpg' | 'png' | 'webp')}
            >
              <option value="jpg">JPG - Best for photos</option>
              <option value="png">PNG - Best for graphics</option>
              <option value="webp">WebP - Modern format</option>
            </Select>
            <Select
              label="Quality"
              value={quality}
              onChange={(e) => setQuality(e.target.value as 'high' | 'low')}
            >
              <option value="high">High Quality (larger files)</option>
              <option value="low">Low Quality (smaller files)</option>
            </Select>
          </div>

          {/* Conversion Progress */}
          {isConverting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>Converting...</span>
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
                await convertSelected()
                showToast('Images downloaded', 'success')
              } catch (error) {
                showToast(error instanceof Error ? error.message : 'Conversion failed', 'error')
              }
            }}
            disabled={selectedPages.length === 0 || isConverting}
            isLoading={isConverting}
            leftIcon={!isConverting ? <Download className="w-5 h-5" /> : undefined}
          >
            {isConverting ? 'Converting...' : `Convert ${selectedPages.length} Page${selectedPages.length !== 1 ? 's' : ''} to Images`}
          </Button>
        </>
      )}
    </div>
  )
}

export default PdfToImage
