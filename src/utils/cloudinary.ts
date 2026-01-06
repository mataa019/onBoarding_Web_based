/**
 * Cloudinary Configuration and Upload Utilities
 * 
 * Setup Instructions:
 * 1. Sign up at https://cloudinary.com (Free tier: 25GB storage, 25GB bandwidth/month)
 * 2. Go to Settings > Upload > Add upload preset
 * 3. Set "Signing Mode" to "Unsigned"
 * 4. Copy your Cloud Name and Upload Preset name
 * 5. Add to your .env file:
 *    VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *    VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
 */

interface CloudinaryResponse {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
}

// Allowed file types for documents
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
]

class CloudinaryService {
  private cloudName: string
  private uploadPreset: string

  constructor() {
    this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
    this.uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''

    if (!this.cloudName || !this.uploadPreset) {
      console.warn('Cloudinary credentials not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env')
    }
  }

  /**
   * Get the upload URL for a specific resource type
   */
  private getUploadUrl(resourceType: 'image' | 'raw' | 'auto' = 'auto'): string {
    return `https://api.cloudinary.com/v1_1/${this.cloudName}/${resourceType}/upload`
  }

  /**
   * Upload a single image to Cloudinary
   * @param file - The image file to upload
   * @param folder - Optional folder name in Cloudinary (e.g., 'projects', 'avatars')
   * @returns Promise with the uploaded image URL
   */
  async uploadImage(file: File, folder?: string): Promise<string> {
    if (!this.cloudName || !this.uploadPreset) {
      throw new Error('Cloudinary is not configured. Please add credentials to .env')
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed')
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 10MB')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', this.uploadPreset)
    
    if (folder) {
      formData.append('folder', folder)
    }

    // Note: Don't add 'transformation' param for unsigned uploads - configure in preset instead

    try {
      console.log('Uploading to Cloudinary:', { cloudName: this.cloudName, uploadPreset: this.uploadPreset, folder })
      
      const response = await fetch(this.getUploadUrl('image'), {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Cloudinary error response:', errorData)
        const errorMessage = errorData.error?.message || errorData.message || 'Failed to upload image'
        throw new Error(errorMessage)
      }

      const data: CloudinaryResponse = await response.json()
      return data.secure_url
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cloudinary upload failed: ${error.message}`)
      }
      throw new Error('Cloudinary upload failed: Unknown error')
    }
  }

  /**
   * Upload a document file (PDF, Word, Excel, etc.) to Cloudinary
   * @param file - The document file to upload
   * @param folder - Optional folder name in Cloudinary (e.g., 'documents')
   * @returns Promise with the uploaded file URL
   */
  async uploadFile(file: File, folder?: string): Promise<string> {
    if (!this.cloudName || !this.uploadPreset) {
      throw new Error('Cloudinary is not configured. Please add credentials to .env')
    }

    // Validate file type - allow images and documents
    const isImage = file.type.startsWith('image/')
    const isDocument = ALLOWED_DOCUMENT_TYPES.includes(file.type)
    
    if (!isImage && !isDocument) {
      throw new Error('File type not allowed. Allowed types: images, PDF, Word, Excel, PowerPoint, text files')
    }

    // Validate file size (20MB limit for documents)
    const maxSize = 20 * 1024 * 1024 // 20MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 20MB')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', this.uploadPreset)
    
    if (folder) {
      formData.append('folder', folder)
    }

    // Use 'raw' for documents, 'image' for images
    const resourceType = isImage ? 'image' : 'raw'

    try {
      console.log('Uploading file to Cloudinary:', { 
        cloudName: this.cloudName, 
        uploadPreset: this.uploadPreset, 
        folder,
        fileType: file.type,
        resourceType 
      })
      
      const response = await fetch(this.getUploadUrl(resourceType), {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Cloudinary error response:', errorData)
        const errorMessage = errorData.error?.message || errorData.message || 'Failed to upload file'
        throw new Error(errorMessage)
      }

      const data: CloudinaryResponse = await response.json()
      return data.secure_url
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cloudinary upload failed: ${error.message}`)
      }
      throw new Error('Cloudinary upload failed: Unknown error')
    }
  }

  /**
   * Upload multiple images to Cloudinary
   * @param files - Array of image files to upload
   * @param folder - Optional folder name in Cloudinary
   * @param allowPartialSuccess - If true, returns successful uploads even if some fail
   * @returns Promise with array of uploaded image URLs
   */
  async uploadMultipleImages(
    files: File[], 
    folder?: string,
    allowPartialSuccess: boolean = false
  ): Promise<string[]> {
    if (files.length === 0) {
      return []
    }

    // Upload all images in parallel
    const uploadPromises = files.map(file => this.uploadImage(file, folder))
    
    const results = await Promise.allSettled(uploadPromises)
    
    const successfulUrls: string[] = []
    const failedUploads: { index: number; fileName: string; error: string }[] = []
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfulUrls.push(result.value)
      } else {
        failedUploads.push({
          index: index + 1,
          fileName: files[index].name,
          error: result.reason?.message || 'Unknown error'
        })
      }
    })
    
    if (failedUploads.length > 0) {
      const failedNames = failedUploads.map(f => f.fileName).join(', ')
      const errorMessage = `Failed to upload ${failedUploads.length} image(s): ${failedNames}`
      
      if (!allowPartialSuccess || successfulUrls.length === 0) {
        throw new Error(errorMessage)
      }
      
      // Log warning but continue with successful uploads
      console.warn(errorMessage)
    }
    
    return successfulUrls
  }

  /**
   * Check if Cloudinary is configured
   */
  isConfigured(): boolean {
    return !!(this.cloudName && this.uploadPreset)
  }

  /**
   * Get Cloudinary cloud name
   */
  getCloudName(): string {
    return this.cloudName
  }
}

// Export singleton instance
export const cloudinaryService = new CloudinaryService()

// Export class for testing or custom instances
export { CloudinaryService }
