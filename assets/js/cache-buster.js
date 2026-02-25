// Cache Buster Utility
// Update this version number whenever you update assets (JSON files, images, etc.)
// Format: YYYYMMDD or increment number
const CACHE_VERSION = '20260225'; // Update this when deploying changes

/**
 * Adds cache-busting parameter to a URL
 * @param {string} url - The URL to add cache-busting to
 * @returns {string} - URL with cache-busting parameter
 */
function bustCache(url) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${CACHE_VERSION}`;
}

/**
 * Fetch with cache busting
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @returns {Promise} - Fetch promise
 */
function fetchWithCacheBust(url, options = {}) {
    return fetch(bustCache(url), options);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { bustCache, fetchWithCacheBust, CACHE_VERSION };
}
