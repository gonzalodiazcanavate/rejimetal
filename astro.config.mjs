// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Manrope',
      cssVariable: '--font-manrope',
      weights: [400, 500, 600, 700, 800],
      styles: ['normal'],
    },
    {
      provider: fontProviders.google(),
      name: 'Rajdhani',
      cssVariable: '--font-rajdhani',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
    },
  ],
});