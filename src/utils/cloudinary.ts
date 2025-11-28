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

interface CloudinaryError {
  message: string
  http_code: number
}

class CloudinaryService {
  private cloudName: string
  private uploadPreset: string
  private uploadUrl: string

  constructor() {
    this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
    this.uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''
    this.uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`

    if (!this.cloudName || !this.uploadPreset) {
      console.warn('Cloudinary credentials not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env')
    }
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

    // Optional: Add transformation for automatic optimization
    formData.append('transformation', 'q_auto,f_auto')

    try {
      const response = await fetch(this.uploadUrl, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error: CloudinaryError = await response.json()
        throw new Error(error.message || 'Failed to upload image')
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
   * @returns Promise with array of uploaded image URLs
   */
  async uploadMultipleImages(files: File[], folder?: string): Promise<string[]> {
    if (files.length === 0) {
      return []
    }

    // Upload all images in parallel
    const uploadPromises = files.map(file => this.uploadImage(file, folder))
    
    try {
      return await Promise.all(uploadPromises)
    } catch (error) {
      throw new Error('One or more images failed to upload')
    }
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
