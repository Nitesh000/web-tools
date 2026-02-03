import { HelmetProvider } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'
import type { RouteRecord } from 'vite-react-ssg'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { Navbar } from './components/layouts/Navbar'

// Pages - direct imports for SSG pre-rendering
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFound'

// Tool pages
import BackgroundRemoverPage from './pages/BackgroundRemoverPage'
import ImageCompressorPage from './pages/ImageCompressorPage'
import FormatConverterPage from './pages/FormatConverterPage'
import VideoToGifPage from './pages/VideoToGifPage'
import QRGeneratorPage from './pages/QRGeneratorPage'
import PasswordGeneratorPage from './pages/PasswordGeneratorPage'
import TextCaseConverterPage from './pages/TextCaseConverterPage'
import ColorPickerPage from './pages/ColorPickerPage'
import JSONFormatterPage from './pages/JSONFormatterPage'
import InvoiceGeneratorPage from './pages/InvoiceGeneratorPage'
import JSONViewerPage from './pages/JSONViewerPage'
import MarkdownEditorPage from './pages/MarkdownEditorPage'
import PdfToImagePage from './pages/PdfToImagePage'
import ImageToPdfPage from './pages/ImageToPdfPage'

// Blog pages
import BlogPage from './pages/BlogPage'
import BlogArticlePage from './pages/BlogArticlePage'

// Static pages
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

// Root layout component
function Root() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <Outlet />
        </div>
      </ErrorBoundary>
    </HelmetProvider>
  )
}

// SSG routes configuration
export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Root />,
    children: [
      // Home
      { index: true, element: <HomePage /> },

      // Tool Pages
      { path: 'background-remover', element: <BackgroundRemoverPage /> },
      { path: 'image-compressor', element: <ImageCompressorPage /> },
      { path: 'format-converter', element: <FormatConverterPage /> },
      { path: 'video-to-gif', element: <VideoToGifPage /> },
      { path: 'qr-generator', element: <QRGeneratorPage /> },
      { path: 'password-generator', element: <PasswordGeneratorPage /> },
      { path: 'text-case-converter', element: <TextCaseConverterPage /> },
      { path: 'color-picker', element: <ColorPickerPage /> },
      { path: 'json-formatter', element: <JSONFormatterPage /> },
      { path: 'invoice-generator', element: <InvoiceGeneratorPage /> },
      { path: 'json-viewer', element: <JSONViewerPage /> },
      { path: 'markdown-editor', element: <MarkdownEditorPage /> },
      { path: 'pdf-to-image', element: <PdfToImagePage /> },
      { path: 'image-to-pdf', element: <ImageToPdfPage /> },

      // Blog
      { path: 'blog', element: <BlogPage /> },
      { path: 'blog/:slug', element: <BlogArticlePage /> },

      // Static Pages
      { path: 'about', element: <AboutPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },

      // 404
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
