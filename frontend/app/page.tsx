'use client'

import { QRScanner } from '@/components/qr-scanner'

export default function Page() {
	return (
		<div className="pt-20">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-7xl mx-auto">
					<QRScanner />
				</div>
			</div>
		</div>
	)
}
