/**
 * Sanity Client Configuration
 * 
 * This file sets up the connection between the React frontend and Sanity CMS.
 * It provides utilities for fetching content and generating image URLs.
 */

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity project credentials
// These can be overridden via environment variables (VITE_SANITY_PROJECT_ID, VITE_SANITY_DATASET)
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'ijgeixey'
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

/**
 * Sanity Client
 * 
 * Used to fetch content from Sanity CMS.
 * Example: client.fetch(`*[_type == "post"]`)
 */
export const client = createClient({
  projectId,
  dataset,
  useCdn: import.meta.env.PROD, // Use CDN in production for faster reads, disabled in dev for fresh data
  apiVersion: '2024-01-01',     // API version date - keeps queries consistent
})

// Image URL builder instance
const builder = imageUrlBuilder(client)

/**
 * Generate optimized image URLs from Sanity image assets
 * 
 * @param {object} source - Sanity image reference object
 * @returns {ImageUrlBuilder} - Chainable builder for image transformations
 * 
 * Example usage:
 *   urlFor(post.mainImage).width(800).height(400).url()
 *   urlFor(author.avatar).width(100).fit('crop').url()
 */
export function urlFor(source) {
  return builder.image(source)
}

// Export config for reference elsewhere in the app
export const config = { projectId, dataset }
