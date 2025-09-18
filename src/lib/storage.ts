import { supabase } from './supabaseClient'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name
 * @param path - The path where the file should be stored
 * @returns Promise<UploadResult>
 */
export const uploadFile = async (
  file: File,
  bucket: string,
  path: string
): Promise<UploadResult> => {
  try {
    // Generate a unique filename to avoid conflicts
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const fullPath = `${path}/${fileName}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return {
        success: false,
        error: error.message
      }
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fullPath)

    return {
      success: true,
      url: urlData.publicUrl
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Delete a file from Supabase Storage
 * @param bucket - The storage bucket name
 * @param path - The path of the file to delete
 * @returns Promise<boolean>
 */
export const deleteFile = async (bucket: string, path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

/**
 * Upload practitioner profile picture
 * @param file - The image file
 * @param userId - The user ID
 * @returns Promise<UploadResult>
 */
export const uploadProfilePicture = async (
  file: File,
  userId: string
): Promise<UploadResult> => {
  return uploadFile(file, 'practitioner-images', `profile-pictures/${userId}`)
}

/**
 * Upload practitioner ID image
 * @param file - The image file
 * @param userId - The user ID
 * @returns Promise<UploadResult>
 */
export const uploadIdImage = async (
  file: File,
  userId: string
): Promise<UploadResult> => {
  return uploadFile(file, 'practitioner-images', `id-images/${userId}`)
}

/**
 * Extract file path from Supabase Storage URL
 * @param url - The public URL
 * @returns The file path
 */
export const extractFilePathFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const bucketIndex = pathParts.findIndex(part => part === 'storage')
    if (bucketIndex !== -1 && pathParts[bucketIndex + 1] === 'v1') {
      return pathParts.slice(bucketIndex + 4).join('/')
    }
    return ''
  } catch {
    return ''
  }
}
