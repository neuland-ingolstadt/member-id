import type { Metadata } from 'next'
import { Noto_Sans, Noto_Sans_Mono } from 'next/font/google'
import type React from 'react'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

const notoSans = Noto_Sans({
	variable: '--font-sans',
	subsets: ['latin'],
	display: 'swap'
})

const notoSansMono = Noto_Sans_Mono({
	variable: '--font-mono',
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
			<body
				className={`${notoSans.variable} ${notoSansMono.variable} min-h-screen bg-background font-sans antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Navbar />
					{children}
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	)
}
