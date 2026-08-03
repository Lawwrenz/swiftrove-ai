import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// Custom plugin to handle ?import&react syntax (alias to ?react)
const svgImportPlugin = () => ({
  name: 'svg-import-alias',
  resolveId(id: string) {
    // Transform ?import&react to ?react for vite-plugin-svgr
    if (id.includes('?import&react')) {
      return id.replace('?import&react', '?react');
    }
    return null;
  },
});

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    tailwindcss(),
    svgImportPlugin(),
    svgr({
      // Support named ReactComponent export (for ?react syntax)
      svgrOptions: {
        exportType: 'named',
        namedExport: 'ReactComponent',
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg?react',
    }),
  ],
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://quzodsrzehanlqgezyro.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1em9kc3J6ZWhhbmxxZ2V6eXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwMjIwODksImV4cCI6MjEwMDU5ODA4OX0.UZnlC751o7PkG9vo5J9UEgALMFlfkm8-BHgG-uSYrQs'),
  },
  server: {
    allowedHosts: true as const,
    hmr: {
      clientPort: 443,
      timeout: 5000,
      overlay: true,
    },
  },
}))
