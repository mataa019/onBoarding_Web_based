# Cloudinary Setup Guide

## 📋 Quick Setup (5 minutes)

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free (25GB storage, 25GB bandwidth/month)
3. Verify your email

### 2. Get Your Credentials

After logging in:
1. Go to **Dashboard**
2. Copy your **Cloud Name** (e.g., `dg8abc123`)
3. Go to **Settings → Upload**
4. Click **Add upload preset**
5. Set:
   - **Upload preset name**: `onboard_projects` (or any name you want)
   - **Signing Mode**: **Unsigned**
   - **Folder**: `projects` (optional, for organization)
6. Click **Save**

### 3. Update Your `.env` File

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=dg8abc123
VITE_CLOUDINARY_UPLOAD_PRESET=onboard_projects
```

### 4. Restart Your Dev Server

```powershell
# Stop the current dev server (Ctrl+C)
npm run dev
```

---

## 🚀 Usage Examples

### Basic Usage in Projects.tsx

```typescript
import { cloudinaryService } from '../utils/cloudinary'
import { useAuth } from '../context/AuthContext'

export function Project() {
  const { api } = useAuth()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // 1. Upload images to Cloudinary
      const imageFiles = images.filter(img => img instanceof File)
      const imageUrls = await cloudinaryService.uploadMultipleImages(
        imageFiles, 
        'projects'  // folder name in Cloudinary
      )
      
      // 2. Create project with image URLs
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      
      const newProject = await api.createProject({
        name: formData.name,
        description: formData.description,
        githubUrl: formData.githubUrl,
        tags: tagsArray,
        imageUrls: imageUrls  // Cloudinary URLs
      })
      
      console.log('Project created:', newProject)
      
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }
  
  // ... rest of component
}
```

### Upload with Progress Tracking

```typescript
const [uploadProgress, setUploadProgress] = useState({ completed: 0, total: 0 })

const handleSubmitWithProgress = async (e: React.FormEvent) => {
  e.preventDefault()
  
  try {
    const imageFiles = images.filter(img => img instanceof File)
    
    // Upload with progress callback
    const imageUrls = await cloudinaryService.uploadWithProgress(
      imageFiles,
      'projects',
      (completed, total) => {
        setUploadProgress({ completed, total })
        console.log(`Uploaded ${completed}/${total} images`)
      }
    )
    
    // Create project...
    
  } catch (error) {
    console.error('Upload failed:', error)
  }
}
```

### Single Image Upload (Avatar, Logo, etc)

```typescript
const uploadAvatar = async (file: File) => {
  try {
    const imageUrl = await cloudinaryService.uploadImage(file, 'avatars')
    console.log('Avatar uploaded:', imageUrl)
    return imageUrl
  } catch (error) {
    console.error('Avatar upload failed:', error)
  }
}
```

---

## 🔧 Advanced Configuration

### Enable Automatic Image Optimization

In `cloudinary.ts`, the service already includes:
```typescript
formData.append('transformation', 'q_auto,f_auto')
```

This automatically:
- ✅ Optimizes quality
- ✅ Converts to best format (WebP, AVIF)
- ✅ Reduces file size by 50-80%

### Set Image Size Limits

In Cloudinary dashboard:
1. Go to **Settings → Upload**
2. Edit your upload preset
3. Set **Incoming Transformations**:
   - Width: `1920` (max width)
   - Height: `1080` (max height)
   - Crop: `limit` (only resize if larger)

---

## 📝 API Flow

```
Frontend (React)
    ↓
1. User selects images
    ↓
2. Upload to Cloudinary
   cloudinaryService.uploadMultipleImages(files)
    ↓
3. Get URLs back
   ["https://res.cloudinary.com/dg8abc123/image/upload/v1234/projects/abc.jpg"]
    ↓
4. Send to backend
   api.createProject({ ..., imageUrls: [...] })
    ↓
5. Backend saves URLs in database
    ↓
Done! Images served via Cloudinary CDN
```

---

## ❓ Troubleshooting

### "Cloudinary is not configured" Error
- Check `.env` file has correct values
- Restart dev server after editing `.env`
- Verify no typos in variable names

### "Upload failed: 401 Unauthorized"
- Make sure Upload Preset is set to **Unsigned**
- Check Cloud Name is correct

### "File too large"
- Default limit is 10MB per image
- Compress images before upload
- Or increase limit in `cloudinary.ts`

### Images not showing
- Check browser console for CORS errors
- Verify URLs are being saved correctly in database
- Test URL directly in browser

---

## 🎯 Best Practices

1. **Always use folders** - Organize by feature:
   - `projects/` - Project images
   - `avatars/` - User avatars
   - `documents/` - Document previews

2. **Validate before upload**:
   ```typescript
   if (file.size > 10 * 1024 * 1024) {
     alert('Image must be less than 10MB')
     return
   }
   ```

3. **Handle errors gracefully**:
   ```typescript
   try {
     const urls = await cloudinaryService.uploadMultipleImages(files)
   } catch (error) {
     setError('Failed to upload images. Please try again.')
   }
   ```

4. **Show upload progress** for better UX

5. **Don't delete images immediately** - Keep URLs for undo functionality

---

## 🔒 Security Notes

- ✅ Upload presets are public (by design)
- ✅ Users can only upload, not delete
- ❌ Image deletion should be handled by **backend only**
- ✅ Cloudinary has rate limiting built-in
- ✅ Use folders to isolate user content

---

## 💰 Free Tier Limits

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **API Requests**: Unlimited

Perfect for development and small projects!
