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
import NeulandLogo from '@/components/neuland-logo'
import { TerminalWindow } from '@/components/terminal-window'

const features = [
	{
		icon: CheckCircle,
		title: 'Real-time Verification',
		description:
			'Instant validation of member passes with immediate feedback on authenticity and validity status'
	},
	{
		icon: BarChart3,
		title: 'Comprehensive Analytics',
		description:
			'Track scan history, attendance patterns, and export detailed reports for event management'
	},
	{
		icon: Info,
		title: 'Detailed Member Info',
		description:
			'View complete member profiles including name, ID, membership type, and check-in history'
	},
	{
		icon: ShieldX,
		title: 'Advanced Security',
		description:
			'Cryptographic signature verification prevents fraud and ensures only valid Neuland members gain access'
	},
	{
		icon: Zap,
		title: 'Duplicate Detection',
		description:
			'Automatically identify and flag members who have already checked in to prevent double entries'
	},
	{
		icon: Users,
		title: 'Multi-Platform Support',
		description:
			'Works with Apple Wallet, Android Wallet, and direct QR codes for maximum member convenience'
	},
	{
		icon: Lock,
		title: 'Offline Capability',
		description:
			'Verify passes even without internet connection using locally stored cryptographic keys'
	},
	{
		icon: ArrowRight,
		title: 'CSV Export',
		description:
			'Export scan data to CSV format for integration with other Neuland management systems'
	}
]

const steps = [
	{
		n: '01',
		title: 'Scan Neuland ID',
		description: "Point your camera at any member's Neuland ID to capture it"
	},
	{
		n: '02',
		title: 'Verify Security',
		description:
			"Our system verifies the digital signature using a secure public key to ensure the Neuland ID is authentic and hasn't been tampered with"
	},
	{
		n: '03',
		title: 'View Details',
		description: 'See member information and check-in status instantly'
	}
]

const reasons = [
	{
		icon: Zap,
		title: 'Lightning Fast',
		description:
			'No more waiting in long lines. Scan and verify member passes in seconds, keeping your events flowing smoothly.'
	},
	{
		icon: Users,
		title: 'Seamless Experience',
		description:
			'Members simply show their phone - no physical cards to carry, lose, or forget. Always accessible and always secure.'
	},
	{
		icon: Lock,
		title: 'Unbreakable Security',
		description:
			'Cryptographic signatures make it impossible to forge or duplicate passes. Every scan is verified using secure cryptographic keys.'
	}
]

export default function LearnMorePage() {
	return (
		<div className="space-y-16 pb-8 font-mono">
			<section className="space-y-6">
				<p className="mb-1 text-sm text-terminal-text/50">
					<span className="text-terminal-cyan">neuland@verify</span>
					<span className="text-terminal-text/40">:</span>
					<span className="text-terminal-lightGreen">~</span>
					<span className="text-terminal-text/40">$</span> man member-id
				</p>
				<div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
					<NeulandLogo className="h-14 w-auto text-terminal-text sm:h-16" />
					<div>
						<h1 className="text-3xl font-bold text-terminal-text sm:text-4xl">
							Member ID Verificator
						</h1>
						<p className="mt-2 text-terminal-text/60">
							Cryptographically signed digital membership cards
							<span className="blinking-cursor ml-1">_</span>
						</p>
					</div>
				</div>
				<Link
					href="/"
					className="inline-flex items-center gap-2 border border-terminal-window-border bg-terminal-window px-5 py-2.5 font-semibold text-terminal-text no-underline transition-all duration-200 hover:border-terminal-cyan/50"
				>
					<span className="text-terminal-cyan">$</span> ./scan
					<ArrowRight className="h-4 w-4 text-terminal-cyan transition-transform group-hover:translate-x-1" />
				</Link>
			</section>

			<section>
				<h2 className="mb-6 text-2xl font-bold text-terminal-text">Features</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					{features.map((feature) => {
						const Icon = feature.icon
						return (
							<div
								key={feature.title}
								className="group border border-terminal-window-border bg-terminal-window p-5 transition-colors hover:border-terminal-cyan/40"
							>
								<div className="mb-3 inline-flex border border-terminal-cyan/30 bg-terminal-cyan/10 p-2 text-terminal-cyan">
									<Icon className="h-5 w-5" />
								</div>
								<h3 className="mb-2 font-semibold text-terminal-text">
									{feature.title}
								</h3>
								<p className="text-xs text-terminal-text/50">
									{feature.description}
								</p>
							</div>
						)
					})}
				</div>
			</section>

			<section>
				<h2 className="mb-6 text-2xl font-bold text-terminal-text">
					How It Works
				</h2>
				<TerminalWindow title="neuland@verify:~/pipeline">
					<div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
						{steps.map((step) => (
							<div key={step.n} className="space-y-3">
								<div className="font-mono text-3xl font-bold text-terminal-cyan/40">
									{step.n}
								</div>
								<h3 className="font-semibold text-terminal-text">
									{step.title}
								</h3>
								<p className="text-sm text-terminal-text/50">
									{step.description}
								</p>
							</div>
						))}
					</div>
					<p className="border-t border-terminal-window-border px-6 py-4 text-center text-sm text-terminal-text/40">
						Each QR code contains encrypted member data that can only be
						verified with our secure system. This prevents fraud and ensures
						only valid members can access events.
					</p>
				</TerminalWindow>
			</section>

			<section>
				<h2 className="mb-6 text-2xl font-bold text-terminal-text">
					Why Neuland Uses Digital Verification
				</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{reasons.map((reason) => {
						const Icon = reason.icon
						return (
							<div
								key={reason.title}
								className="border border-terminal-window-border bg-terminal-window p-6 transition-colors hover:border-terminal-cyan/40"
							>
								<div className="mb-4 inline-flex border border-terminal-cyan/30 bg-terminal-cyan/10 p-3 text-terminal-cyan">
									<Icon className="h-6 w-6" />
								</div>
								<h3 className="mb-2 text-xl font-bold text-terminal-text">
									{reason.title}
								</h3>
								<p className="text-terminal-text/60">{reason.description}</p>
							</div>
						)
					})}
				</div>
			</section>

			<section className="border border-terminal-window-border bg-terminal-window p-8 text-center">
				<h2 className="mb-2 text-2xl font-bold text-terminal-text">
					Ready to Start?
				</h2>
				<p className="mb-6 text-terminal-text/60">
					Begin scanning Neuland IDs to verify their authenticity
				</p>
				<Link
					href="/"
					className="inline-flex items-center gap-2 border border-terminal-cyan/40 bg-terminal-cyan px-6 py-3 font-semibold text-terminal-onAccent no-underline transition-colors hover:bg-terminal-highlight"
				>
					Get Started
					<ArrowRight className="h-4 w-4" />
				</Link>
			</section>
		</div>
	)
}
