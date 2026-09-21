import { defineConfig, type ViteDevServer, type PreviewServer, type Connect } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Cross-origin isolation (SharedArrayBuffer) is only needed on the background remover page.
// Applying it site-wide would break Google AdSense, since COEP:require-corp blocks
// cross-origin ad iframes/scripts that don't send a matching CORP/CORS header.
function crossOriginIsolatePlugin() {
  return {
    name: 'cross-origin-isolate-background-remover',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(((req, res, next) => {
        if (req.url?.startsWith('/background-remover')) {
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
        }
        next()
      }) as Connect.NextHandleFunction)
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use(((req, res, next) => {
        if (req.url?.startsWith('/background-remover')) {
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
        }
        next()
      }) as Connect.NextHandleFunction)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), crossOriginIsolatePlugin()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Dedupe react-helmet-async to ensure single instance
      'react-helmet-async': path.resolve(__dirname, 'node_modules/react-helmet-async'),
    },
    dedupe: ['react', 'react-dom', 'react-helmet-async'],
  },

  ssr: {
    noExternal: [
      'file-saver',
      'jszip',
      'jspdf',
      'pdfjs-dist',
      'browser-image-compression',
      '@imgly/background-removal',
      'gif.js',
      'qrcode',
      'react-colorful',
      'zustand'
    ],
  },

  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: {
      reduceInlineStyles: false,
    },
    dirStyle: 'nested',
    includeAllRoutes: true,
  },

  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name || ''
          if (/\.(gif|jpe?g|png|svg|webp|avif)$/i.test(info)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(info)) {
            return 'assets/fonts/[name]-[hash][extname]'
          }
          if (/\.css$/i.test(info)) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    },
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500
  },

  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    },
    open: true,
    cors: true
  },

  preview: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    }
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'clsx'
    ],
    exclude: ['@imgly/background-removal']
  },

  esbuild: {
    legalComments: 'none',
    treeShaking: true
  }
})
