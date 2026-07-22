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
import NeulandPalm from '@/components/neuland-palm'
import { Button } from '@/components/ui/button'

export default function LearnMorePage() {
	return (
		<div className="bg-background pt-20">
			<div className="container mx-auto px-4 py-12">
				<div className="mx-auto max-w-5xl space-y-16">
					<section className="space-y-4 text-center">
						<div className="mx-auto inline-flex h-24 w-24 items-center justify-center bg-primary text-primary-foreground">
							<NeulandPalm size={56} color="currentColor" />
						</div>
						<h1 className="text-5xl font-bold text-foreground">
							Neuland ID Verificator
						</h1>
						<p className="text-lg text-muted-foreground">
							Cryptographically signed digital membership cards
						</p>
						<div className="mt-4">
							<Button asChild className="px-8 py-4 text-lg font-semibold group">
								<Link href="/">
									Start Scanning
									<ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
								</Link>
							</Button>
						</div>
					</section>

					<section className="space-y-6">
						<h2 className="text-3xl font-bold text-center text-foreground">
							Features
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div className="text-center p-6 border border-border bg-card transition-all duration-300 ease-in-out  hover:border-primary/40">
								<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center bg-primary/10">
									<CheckCircle className="h-6 w-6 text-primary" />
								</div>
								<h4 className="font-semibold text-foreground mb-2">
									Real-time Verification
								</h4>
								<p className="text-xs text-muted-foreground">
									Instant validation of member passes with immediate feedback on
									authenticity and validity status
								</p>
							</div>
							<div className="text-center p-6 border border-border bg-card transition-all duration-300 ease-in-out  hover:border-primary/40">
								<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center bg-primary/10">
									<BarChart3 className="h-6 w-6 text-primary" />
								</div>
								<h4 className="font-semibold text-foreground mb-2">
									Comprehensive Analytics
								</h4>
								<p className="text-xs text-muted-foreground">
									Track scan history, attendance patterns, and export detailed
									reports for event management
								</p>
							</div>
							<div className="text-center p-6 border border-border bg-card transition-all duration-300 ease-in-out  hover:border-primary/40">
								<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center bg-primary/10">
									<Info className="h-6 w-6 text-primary" />
								</div>
								<h4 className="font-semibold text-foreground mb-2">
									Detailed Member Info
								</h4>
								<p className="text-xs text-muted-foreground">
									View complete member profiles including name, ID, membership
									type, and check-in history
								</p>
							</div>
							<div className="text-center p-6 border border-border bg-card transition-all duration-300 ease-in-out  hover:border-primary/40">
								<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center bg-primary/10">
									<ShieldX className="h-6 w-6 text-primary" />
								</div>
								<h4 className="font-semibold text-foreground mb-2">
									Advanced Security
								</h4>
								<p className="text-xs text-muted-foreground">
									Cryptographic signature verification prevents fraud and
									ensures only valid Neuland members gain access
								</p>
							</div>
							<div className="text-center p-6 border border-border bg-card transition-all duration-300 ease-in-out  hover:border-primary/40">
								<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center bg-primary/10">
									<Zap className="h-6 w-6 text-primary" />
								</div>
								<h4 className="font-semibold text-foreground mb-2">
									Duplicate Detection
								</h4>
								<p className="text-xs text-muted-foreground">
									Automatically identify and flag members who have already
									checked in to prevent double entries
								</p>
							</div>
							<div className="text-center p-6 border border-border bg-card transition-all duration-300 ease-in-out  hover:border-primary/40">
								<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center bg-primary/10">
									<Users className="h-6 w-6 text-primary" />
								</div>
								<h4 className="font-semibold text-foreground mb-2">
									Multi-Platform Support
								</h4>
								<p className="text-xs text-muted-foreground">
									Works with Apple Wallet, Android Wallet, and direct QR codes
									for maximum member convenience
								</p>
							</div>
							<div className="text-center p-6 border border-border bg-card transition-all duration-300 ease-in-out  hover:border-primary/40">
								<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center bg-primary/10">
									<Lock className="h-6 w-6 text-primary" />
								</div>
								<h4 className="font-semibold text-foreground mb-2">
									Offline Capability
								</h4>
								<p className="text-xs text-muted-foreground">
									Verify passes even without internet connection using locally
									stored cryptographic keys
								</p>
							</div>
							<div className="text-center p-6 border border-border bg-card transition-all duration-300 ease-in-out  hover:border-primary/40">
								<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center bg-primary/10">
									<ArrowRight className="h-6 w-6 text-primary" />
								</div>
								<h4 className="font-semibold text-foreground mb-2">
									CSV Export
								</h4>
								<p className="text-xs text-muted-foreground">
									Export scan data to CSV format for integration with other
									Neuland management systems
								</p>
							</div>
						</div>
					</section>

					<section className="space-y-6">
						<h2 className="text-3xl font-bold text-center text-foreground">
							How It Works
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div className="text-center p-6 border border-border bg-card transition-all duration-300 ease-in-out  hover:border-primary/40">
								<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-primary/10">
									<span className="text-xl font-bold text-primary">1</span>
								</div>
								<h4 className="font-semibold text-foreground mb-2">
									Scan Neuland ID
								</h4>
								<p className="text-sm text-muted-foreground">
									Point your camera at any member's Neuland ID to capture it
								</p>
							</div>
							<div className="text-center p-6 border border-border bg-card transition-all duration-300 ease-in-out  hover:border-primary/40">
								<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-primary/10">
									<span className="text-xl font-bold text-primary">2</span>
								</div>
								<h4 className="font-semibold text-foreground mb-2">
									Verify Security
								</h4>
								<p className="text-sm text-muted-foreground">
									Our system verifies the digital signature using a secure
									public key to ensure the Neuland ID is authentic and hasn't
									been tampered with
								</p>
							</div>
							<div className="text-center p-6 border border-border bg-card transition-all duration-300 ease-in-out  hover:border-primary/40">
								<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-primary/10">
									<span className="text-xl font-bold text-primary">3</span>
								</div>
								<h4 className="font-semibold text-foreground mb-2">
									View Details
								</h4>
								<p className="text-sm text-muted-foreground">
									See member information and check-in status instantly
								</p>
							</div>
						</div>
						<p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
							Each QR code contains encrypted member data that can only be
							verified with our secure system. This prevents fraud and ensures
							only valid members can access events.
						</p>
					</section>

					<section className="space-y-8">
						<h2 className="text-3xl font-bold text-center text-foreground">
							Why Neuland Uses Digital Verification
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div className="text-center space-y-4 transition-all duration-300 ease-in-out  hover:border-primary/40 p-6 ">
								<div className="mx-auto flex h-16 w-16 items-center justify-center bg-primary/10">
									<Zap className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-bold text-foreground">
									Lightning Fast
								</h3>
								<p className="text-muted-foreground">
									No more waiting in long lines. Scan and verify member passes
									in seconds, keeping your events flowing smoothly.
								</p>
							</div>
							<div className="text-center space-y-4 transition-all duration-300 ease-in-out  hover:border-primary/40 p-6 ">
								<div className="mx-auto flex h-16 w-16 items-center justify-center bg-primary/10">
									<Users className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-bold text-foreground">
									Seamless Experience
								</h3>
								<p className="text-muted-foreground">
									Members simply show their phone - no physical cards to carry,
									lose, or forget. Always accessible and always secure.
								</p>
							</div>
							<div className="text-center space-y-4 transition-all duration-300 ease-in-out  hover:border-primary/40 p-6 ">
								<div className="mx-auto flex h-16 w-16 items-center justify-center bg-primary/10">
									<Lock className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-bold text-foreground">
									Unbreakable Security
								</h3>
								<p className="text-muted-foreground">
									Cryptographic signatures make it impossible to forge or
									duplicate passes. Every scan is verified using secure
									cryptographic keys.
								</p>
							</div>
						</div>
					</section>

					<section className="text-center space-y-4">
						<h2 className="text-3xl font-bold text-foreground">
							Ready to Start?
						</h2>
						<p className="text-muted-foreground">
							Begin scanning Neuland IDs to verify their authenticity
						</p>
						<Button asChild className="px-8 py-4 text-lg font-semibold group">
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
