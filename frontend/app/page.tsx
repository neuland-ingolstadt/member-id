'use client'

import { QRScanner } from '@/components/qr-scanner'

export default function Page() {
	return (
		<main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
			<QRScanner />
		</main>
	)
}
