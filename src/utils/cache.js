import LRUCache from 'lru-cache'
import logger from './logger.js'

// Cache configuration
const CACHE_TTL = 15 * 60 * 1000 // 15 minutes
const MAX_CACHE_ITEMS = 500

const cache = new LRUCache({
  max: MAX_CACHE_ITEMS,
  ttl: CACHE_TTL
})

// Cache utilities
export const generateCacheKey = (operation, params = {}) => {
  return `mezcla_${operation}_${JSON.stringify(params)}`
}

export const getCachedData = (key) => {
  const data = cache.get(key)
  if (data) {
    logger.debug('Cache hit', { key })
    return data
  }
  logger.debug('Cache miss', { key })
  return null
}

export const setCachedData = (key, data) => {
  cache.set(key, data)
  logger.debug('Cache set', { key })
}

export const invalidateCache = (pattern = null) => {
  if (pattern) {
    const keys = Array.from(cache.keys())
    keys.forEach(key => {
      if (key.includes(pattern)) {
        cache.delete(key)
        logger.debug('Cache invalidated', { key })
      }
    })
  } else {
    cache.clear()
    logger.debug('Cache cleared')
  }
}

export default {
  generateCacheKey,
  getCachedData,
  setCachedData,
  invalidateCache
}
