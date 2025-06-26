'use client'

import type { VerificationResult } from '@/lib/qr-verifier'

interface DebugInfoProps {
	info: NonNullable<VerificationResult['debugInfo']>
}

export function DebugInfo({ info }: DebugInfoProps) {
	return (
		<details className="group">
			<summary className="cursor-pointer p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
				<span className="font-medium text-gray-900 dark:text-white">
					Technical Details
				</span>
			</summary>
			<div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
				<div className="grid grid-cols-2 gap-4 text-xs">
					<div>
						<span className="font-medium text-gray-600 dark:text-gray-400">
							Base45 Decoded:
						</span>
						<p className="text-gray-800 dark:text-gray-200">
							{info.base45DecodedLength} bytes
						</p>
					</div>
					<div>
						<span className="font-medium text-gray-600 dark:text-gray-400">
							Decompressed:
						</span>
						<p className="text-gray-800 dark:text-gray-200">
							{info.decompressedLength} bytes
						</p>
					</div>
					<div>
						<span className="font-medium text-gray-600 dark:text-gray-400">
							CBOR Data:
						</span>
						<p className="text-gray-800 dark:text-gray-200">
							{info.cborLength} bytes
						</p>
					</div>
					<div>
						<span className="font-medium text-gray-600 dark:text-gray-400">
							Signature:
						</span>
						<p className="text-gray-800 dark:text-gray-200">
							{info.signatureLength} bytes
						</p>
					</div>
				</div>

				{info.validationChecks && (
					<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
						<h4 className="font-medium text-gray-900 dark:text-white mb-2">
							Validation Checks
						</h4>
						<div className="grid grid-cols-2 gap-4 text-xs">
							{info.validationChecks.appOnlyCheck !== undefined && (
								<div>
									<span className="font-medium text-gray-600 dark:text-gray-400">
										App-only Check:
									</span>
									<p
										className={`font-medium ${info.validationChecks.appOnlyCheck ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
									>
										{info.validationChecks.appOnlyCheck ? 'Passed' : 'Failed'}
									</p>
								</div>
							)}
							{info.validationChecks.strictValidation && (
								<div>
									<span className="font-medium text-gray-600 dark:text-gray-400">
										Strict Validation:
									</span>
									<p className="text-green-600 dark:text-green-400 font-medium">
										Enabled
									</p>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</details>
	)
}
