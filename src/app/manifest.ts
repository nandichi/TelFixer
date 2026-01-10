import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TelFixer - Refurbished Elektronica & Reparatie',
    short_name: 'TelFixer',
    description: 'Hoogwaardige refurbished telefoons, laptops en tablets met garantie.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF9F7',
    theme_color: '#1B4D3E',
    icons: [
      {
        src: '/telfixer-logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
