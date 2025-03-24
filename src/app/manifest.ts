import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lap Counter',
    short_name: 'Laps',
    description: 'An app for tracking individual participant laps in a race',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#ff8989',
    orientation: 'portrait',
    icons: [
      {
        src: '/images/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/images/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'New Runner',
        short_name: 'Add',
        description: 'Quickly add a new runner',
        url: '/add',
      },
      {
        name: 'Track a lap',
        short_name: 'Track',
        description: "Quickly track a runner's lap by their runner number",
        url: '/tracker',
      },
    ],
  }
}
