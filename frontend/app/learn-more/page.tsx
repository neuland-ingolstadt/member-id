import {
	ArrowRight,
	BarChart3,
	CheckCircle,
	Info,
	Lock,
	ShieldX,
	Users,
	Zap
} from 'lucide-react'
import Link from 'next/link'
import SvgIcon from '@/components/neuland-palm'
import { Button } from '@/components/ui/button'

export default function LearnMorePage() {
	return (
		<div className="pt-20 bg-background">
			<div className="container mx-auto px-4 py-12">
				<div className="max-w-5xl mx-auto space-y-16">
					<section className="text-center space-y-4">
						<div className="inline-flex w-24 h-24 items-center justify-center bg-gradient-to-br from-purple-700 to-purple-900 text-white rounded-3xl shadow-xl mx-auto">
							<SvgIcon size={64} color="currentColor" className="pr-1" />
						</div>
						<h1 className="text-5xl font-bold text-gray-900 dark:text-white">
							Neuland ID Verificator
						</h1>
						<p className="text-lg text-gray-600 dark:text-gray-300">
							Cryptographically signed digital membership cards
						</p>
						<div className="mt-4">
							<Button
								asChild
								className="px-8 py-4 text-lg font-semibold dark:text-black group"
							>
								<Link href="/">
									Start Scanning
									<ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
								</Link>
							</Button>
						</div>
					</section>

					<section className="space-y-6">
						<h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
							Features
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div className="text-center p-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-green-500/20 hover:border-green-500/30 border border-transparent">
								<div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
									<CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
								</div>
								<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
									Real-time Verification
								</h4>
								<p className="text-xs text-gray-600 dark:text-gray-400">
									Instant validation of member passes with immediate feedback on
									authenticity and validity status
								</p>
							</div>
							<div className="text-center p-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/30 border border-transparent">
								<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
									<BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
								</div>
								<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
									Comprehensive Analytics
								</h4>
								<p className="text-xs text-gray-600 dark:text-gray-400">
									Track scan history, attendance patterns, and export detailed
									reports for event management
								</p>
							</div>
							<div className="text-center p-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/30 border border-transparent">
								<div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
									<Info className="h-6 w-6 text-purple-600 dark:text-purple-400" />
								</div>
								<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
									Detailed Member Info
								</h4>
								<p className="text-xs text-gray-600 dark:text-gray-400">
									View complete member profiles including name, ID, membership
									type, and check-in history
								</p>
							</div>
							<div className="text-center p-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-orange-500/20 hover:border-orange-500/30 border border-transparent">
								<div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
									<ShieldX className="h-6 w-6 text-orange-600 dark:text-orange-400" />
								</div>
								<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
									Advanced Security
								</h4>
								<p className="text-xs text-gray-600 dark:text-gray-400">
									Cryptographic signature verification prevents fraud and
									ensures only valid Neuland members gain access
								</p>
							</div>
							<div className="text-center p-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-red-500/20 hover:border-red-500/30 border border-transparent">
								<div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
									<Zap className="h-6 w-6 text-red-600 dark:text-red-400" />
								</div>
								<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
									Duplicate Detection
								</h4>
								<p className="text-xs text-gray-600 dark:text-gray-400">
									Automatically identify and flag members who have already
									checked in to prevent double entries
								</p>
							</div>
							<div className="text-center p-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-indigo-500/20 hover:border-indigo-500/30 border border-transparent">
								<div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
									<Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
								</div>
								<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
									Multi-Platform Support
								</h4>
								<p className="text-xs text-gray-600 dark:text-gray-400">
									Works with Apple Wallet, Android Wallet, and direct QR codes
									for maximum member convenience
								</p>
							</div>
							<div className="text-center p-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-teal-500/20 hover:border-teal-500/30 border border-transparent">
								<div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
									<Lock className="h-6 w-6 text-teal-600 dark:text-teal-400" />
								</div>
								<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
									Offline Capability
								</h4>
								<p className="text-xs text-gray-600 dark:text-gray-400">
									Verify passes even without internet connection using locally
									stored cryptographic keys
								</p>
							</div>
							<div className="text-center p-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-pink-500/20 hover:border-pink-500/30 border border-transparent">
								<div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
									<ArrowRight className="h-6 w-6 text-pink-600 dark:text-pink-400" />
								</div>
								<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
									CSV Export
								</h4>
								<p className="text-xs text-gray-600 dark:text-gray-400">
									Export scan data to CSV format for integration with other
									Neuland management systems
								</p>
							</div>
						</div>
					</section>

					<section className="space-y-6">
						<h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
							How It Works
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div className="text-center p-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/30 border border-transparent">
								<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
									<span className="text-xl font-bold text-blue-600 dark:text-blue-400">
										1
									</span>
								</div>
								<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
									Scan Neuland ID
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Point your camera at any member's Neuland ID to capture it
								</p>
							</div>
							<div className="text-center p-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-green-500/20 hover:border-green-500/30 border border-transparent">
								<div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
									<span className="text-xl font-bold text-green-600 dark:text-green-400">
										2
									</span>
								</div>
								<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
									Verify Security
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Our system verifies the digital signature using a secure
									public key to ensure the Neuland ID is authentic and hasn't
									been tampered with
								</p>
							</div>
							<div className="text-center p-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/30 border border-transparent">
								<div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
									<span className="text-xl font-bold text-purple-600 dark:text-purple-400">
										3
									</span>
								</div>
								<h4 className="font-semibold text-gray-900 dark:text-white mb-2">
									View Details
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									See member information and check-in status instantly
								</p>
							</div>
						</div>
						<p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-2xl mx-auto">
							Each QR code contains encrypted member data that can only be
							verified with our secure system. This prevents fraud and ensures
							only valid members can access events.
						</p>
					</section>

					<section className="space-y-8">
						<h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
							Why Neuland Uses Digital Verification
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div className="text-center space-y-4 transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-red-500/20 hover:border-red-500/30 border border-transparent p-6 rounded-xl">
								<div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto">
									<Zap className="h-8 w-8 text-red-600 dark:text-red-400" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 dark:text-white">
									Lightning Fast
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									No more waiting in long lines. Scan and verify member passes
									in seconds, keeping your events flowing smoothly.
								</p>
							</div>
							<div className="text-center space-y-4 transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/30 border border-transparent p-6 rounded-xl">
								<div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto">
									<Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 dark:text-white">
									Seamless Experience
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									Members simply show their phone - no physical cards to carry,
									lose, or forget. Always accessible and always secure.
								</p>
							</div>
							<div className="text-center space-y-4 transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-green-500/20 hover:border-green-500/30 border border-transparent p-6 rounded-xl">
								<div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto">
									<Lock className="h-8 w-8 text-green-600 dark:text-green-400" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 dark:text-white">
									Unbreakable Security
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									Cryptographic signatures make it impossible to forge or
									duplicate passes. Every scan is verified using secure
									cryptographic keys.
								</p>
							</div>
						</div>
					</section>

					<section className="text-center space-y-4">
						<h2 className="text-3xl font-bold text-gray-900 dark:text-white">
							Ready to Start?
						</h2>
						<p className="text-gray-600 dark:text-gray-300">
							Begin scanning Neuland IDs to verify their authenticity
						</p>
						<Button
							asChild
							className="px-8 py-4 text-lg font-semibold dark:text-black group"
						>
							<Link href="/">
								Get Started
								<ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
							</Link>
						</Button>
					</section>
				</div>
			</div>
		</div>
	)
}
