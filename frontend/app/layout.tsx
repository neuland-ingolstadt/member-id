import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import Script from 'next/script'
import type React from 'react'
import './globals.css'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { PageShell } from '@/components/page-shell'
import { clientShellScript } from '@/lib/client-shell'

const ibmPlexSans = IBM_Plex_Sans({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['400', '500', '600', '700']
})

const ibmPlexMono = IBM_Plex_Mono({
	subsets: ['latin'],
	variable: '--font-mono',
	weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
	title: 'Neuland Ingolstadt Member ID Verification',
	description:
		'Scan and verify Member IDs of Neuland Ingolstadt e.V. member passes.'
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
		>
			<body className="min-h-screen bg-terminal-bg font-sans text-terminal-text antialiased">
				<Script id="client-shell" strategy="beforeInteractive">
					{clientShellScript}
				</Script>
				<PageShell>
					<Navbar />
					{children}
					<Footer />
				</PageShell>
			</body>
		</html>
	)
}
