import type { Metadata } from 'next'
import { Noto_Sans, Noto_Sans_Mono } from 'next/font/google'
import type React from 'react'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { AmbientBackground } from '@/components/ambient-background'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

const notoSansMono = Noto_Sans_Mono({
	variable: '--font-mono',
	subsets: ['latin'],
	display: 'swap'
})

const notoSans = Noto_Sans({
	variable: '--font-sans',
	subsets: ['latin'],
	display: 'swap'
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
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta name="color-scheme" content="dark light" />
				<meta
					name="theme-color"
					content="#020302"
					media="(prefers-color-scheme: dark)"
				/>
				<meta
					name="theme-color"
					content="#f5f8f5"
					media="(prefers-color-scheme: light)"
				/>
			</head>
			<body
				className={`${notoSansMono.variable} ${notoSans.variable} min-h-screen font-mono antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<Navbar />
					<AmbientBackground />
					<div className="container relative z-10 mx-auto px-4 pt-24 md:px-12 xl:px-20">
						{children}
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	)
}
