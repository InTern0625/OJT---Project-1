import { TooltipProvider } from '@/components/ui/tooltip'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import ThemeProvider from '@/providers/ThemeProvider'
import { VercelToolbar } from '@vercel/toolbar/next'
import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const Toaster = dynamic(
  () => import('@/components/ui/toaster').then((mod) => mod.Toaster),
  {
    ssr: true,
  },
)

const ConfirmationDialog = dynamic(
  () => import('@/components/confirmation-dialog/confirmation-dialog'),
  {
    ssr: true,
  },
)

const defaultUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

const shouldInjectToolbar = process.env.NODE_ENV !== 'production'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: '%s - WiseCare',
    default: 'WiseCare Employee Portal',
  },
  description: 'WiseCare Employee Portal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={inter.className}
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning={true}
    >
      <body className="bg-background text-foreground">
        <NextTopLoader showSpinner={false} height={2} color="#2acf80" />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>
            <ReactQueryProvider>
              <div>
                {children}
                <Toaster />
                <ConfirmationDialog />
              </div>
              {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </ReactQueryProvider>
          </TooltipProvider>
        </ThemeProvider>
        {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  )
}
