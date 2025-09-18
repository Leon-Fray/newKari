// Utility functions for local file storage
// These functions help manage files stored in localStorage

/**
 * Retrieve a file from localStorage using its reference key
 * @param fileKey - The reference key stored in the database
 * @returns The base64 data URL or null if not found
 */
export const getFileFromLocalStorage = (fileKey: string): string | null => {
  try {
    return localStorage.getItem(fileKey)
  } catch (error) {
    console.error('Error retrieving file from localStorage:', error)
    return null
  }
}

/**
 * Remove a file from localStorage
 * @param fileKey - The reference key to remove
 * @returns boolean indicating success
 */
export const removeFileFromLocalStorage = (fileKey: string): boolean => {
  try {
    localStorage.removeItem(fileKey)
    return true
  } catch (error) {
    console.error('Error removing file from localStorage:', error)
    return false
  }
}

/**
 * Check if a file exists in localStorage
 * @param fileKey - The reference key to check
 * @returns boolean indicating if file exists
 */
export const fileExistsInLocalStorage = (fileKey: string): boolean => {
  try {
    return localStorage.getItem(fileKey) !== null
  } catch (error) {
    console.error('Error checking file in localStorage:', error)
    return false
  }
}

/**
 * Get all practitioner files for a specific user
 * @param userId - The user ID
 * @returns Object with profile and id image data URLs
 */
export const getPractitionerFiles = (userId: string): {
  profilePicture?: string | null
  idImage?: string | null
} => {
  try {
    const profileKey = Object.keys(localStorage).find(key => 
      key.startsWith(`practitioner_${userId}_profile_`)
    )
    const idKey = Object.keys(localStorage).find(key => 
      key.startsWith(`practitioner_${userId}_id_`)
    )

    return {
      profilePicture: profileKey ? localStorage.getItem(profileKey) : null,
      idImage: idKey ? localStorage.getItem(idKey) : null
    }
  } catch (error) {
    console.error('Error retrieving practitioner files:', error)
    return {}
  }
}

/**
 * Clean up old practitioner files (optional utility for maintenance)
 * @param userId - The user ID
 * @param keepLatest - Whether to keep only the latest files (default: true)
 */
export const cleanupPractitionerFiles = (userId: string, keepLatest: boolean = true): void => {
  try {
    const userFiles = Object.keys(localStorage).filter(key => 
      key.startsWith(`practitioner_${userId}_`)
    )

    if (keepLatest) {
      // Group by type and keep only the latest
      const profileFiles = userFiles.filter(key => key.includes('_profile_'))
      const idFiles = userFiles.filter(key => key.includes('_id_'))

      // Sort by timestamp (extracted from key) and remove older ones
      const sortAndCleanup = (files: string[]) => {
        if (files.length <= 1) return
        
        const sorted = files.sort((a, b) => {
          const timestampA = parseInt(a.split('_').pop() || '0')
          const timestampB = parseInt(b.split('_').pop() || '0')
          return timestampB - timestampA
        })

        // Remove all but the latest
        sorted.slice(1).forEach(key => localStorage.removeItem(key))
      }

      sortAndCleanup(profileFiles)
      sortAndCleanup(idFiles)
    } else {
      // Remove all files for this user
      userFiles.forEach(key => localStorage.removeItem(key))
    }
  } catch (error) {
    console.error('Error cleaning up practitioner files:', error)
  }
}
