'use client'

import { QRScanner } from '@/components/qr-scanner'

export default function Page() {
	return (
		<div className="pb-4">
			<div className="mb-6 font-mono">
				<p className="mb-1 text-sm text-terminal-text/50">
					<span className="text-terminal-cyan">neuland@verify</span>
					<span className="text-terminal-text/40">:</span>
					<span className="text-terminal-lightGreen">~</span>
					<span className="text-terminal-text/40">$</span> ./member-id --scan
				</p>
				<h1 className="text-2xl font-bold text-terminal-text sm:text-3xl">
					Member ID Verificator
				</h1>
				<p className="mt-1 text-sm text-terminal-text/60">
					Scan cryptographically signed Neuland membership passes
					<span className="blinking-cursor ml-1">_</span>
				</p>
			</div>
			<QRScanner />
		</div>
	)
}
