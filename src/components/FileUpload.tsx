import { useRef } from 'react'
import { DocumentIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface UploadedFile {
  file: string
  fileName: string
  fileSize: string
}

interface FileUploadProps {
  accept?: string
  uploadedFile: UploadedFile | null
  onFileSelect: (file: UploadedFile) => void
  onFileRemove: () => void
  variant?: 'document' | 'image'
  helpText?: string
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export default function FileUpload({ 
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  uploadedFile,
  onFileSelect,
  onFileRemove,
  variant = 'document',
  helpText = 'PDF, DOC, DOCX, JPG, PNG (max 10MB)'
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onFileSelect({
          file: reader.result as string,
          fileName: file.name,
          fileSize: formatFileSize(file.size)
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = () => {
    onFileRemove()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const Icon = variant === 'image' ? PhotoIcon : DocumentIcon

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {uploadedFile ? (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <Icon className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">{uploadedFile.fileName}</p>
              <p className="text-xs text-gray-500">{uploadedFile.fileSize}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <Icon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Click to upload</p>
          <p className="text-xs text-gray-400 mt-1">{helpText}</p>
        </button>
      )}
    </div>
  )
}

export type { UploadedFile }
