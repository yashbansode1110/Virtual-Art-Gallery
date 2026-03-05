import API_BASE_URL from '../config'

/**
 * Convert relative image URL to full URL with backend domain
 * Example: /uploads/image.jpg → https://virtual-art-gallery-backend.onrender.com/uploads/image.jpg
 */
export const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) return ''
  
  // If URL already includes http/https, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl
  }
  
  // Get backend URL without /api
  const baseUrl = API_BASE_URL.replace('/api', '')
  
  // Combine with image URL
  return `${baseUrl}${imageUrl}`
}
