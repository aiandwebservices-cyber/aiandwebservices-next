import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Colony by AIandWEBservices',
    short_name: 'Colony',
    description: 'Operations dashboard for AI-powered small businesses',
    start_url: '/colony',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      { src: '/colony-icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/colony-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
