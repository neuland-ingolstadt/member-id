'use client'

import type { VerificationResult } from '@/lib/qr-verifier'

interface DebugInfoProps {
	info: NonNullable<VerificationResult['debugInfo']>
}

export function DebugInfo({ info }: DebugInfoProps) {
	return (
		<details className="group">
			<summary className="cursor-pointer border border-terminal-window-border bg-terminal-card p-4 font-mono text-sm uppercase tracking-[0.14em] text-terminal-text/70 transition-colors hover:border-terminal-cyan/40 hover:text-terminal-text">
				Technical Details
			</summary>
			<div className="mt-4 border border-terminal-window-border bg-terminal-window p-4">
				<div className="grid grid-cols-2 gap-4 text-xs">
					<div>
						<span className="font-medium text-terminal-text/50">
							Base45 Decoded:
						</span>
						<p className="text-terminal-text/80">
							{info.base45DecodedLength} bytes
						</p>
					</div>
					<div>
						<span className="font-medium text-terminal-text/50">
							Decompressed:
						</span>
						<p className="text-terminal-text/80">
							{info.decompressedLength} bytes
						</p>
					</div>
					<div>
						<span className="font-medium text-terminal-text/50">
							CBOR Data:
						</span>
						<p className="text-terminal-text/80">{info.cborLength} bytes</p>
					</div>
					<div>
						<span className="font-medium text-terminal-text/50">
							Signature:
						</span>
						<p className="text-terminal-text/80">
							{info.signatureLength} bytes
						</p>
					</div>
				</div>

				{info.validationChecks && (
					<div className="mt-4 border-t border-terminal-window-border pt-4">
						<h4 className="mb-2 font-mono text-sm font-medium text-terminal-lightGreen">
							Validation Checks
						</h4>
						<div className="grid grid-cols-2 gap-4 text-xs">
							{info.validationChecks.appOnlyCheck !== undefined && (
								<div>
									<span className="font-medium text-terminal-text/50">
										App-only Check:
									</span>
									<p
										className={`font-medium ${info.validationChecks.appOnlyCheck ? 'text-terminal-cyan' : 'text-destructive'}`}
									>
										{info.validationChecks.appOnlyCheck ? 'Passed' : 'Failed'}
									</p>
								</div>
							)}
							{info.validationChecks.strictValidation && (
								<div>
									<span className="font-medium text-terminal-text/50">
										Strict Validation:
									</span>
									<p className="font-medium text-terminal-cyan">Enabled</p>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</details>
	)
}
