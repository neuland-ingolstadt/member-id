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
import { NeulandPalm } from '@/components/neuland-palm'
import { Button } from '@/components/ui/button'
import { TerminalPanel } from '@/components/ui/terminal-panel'

const FEATURES = [
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
] as const

const STEPS = [
	{
		step: '01',
		title: 'Scan Neuland ID',
		description: "Point your camera at any member's Neuland ID to capture it"
	},
	{
		step: '02',
		title: 'Verify Security',
		description:
			"Our system verifies the digital signature using a secure public key to ensure the Neuland ID is authentic and hasn't been tampered with"
	},
	{
		step: '03',
		title: 'View Details',
		description: 'See member information and check-in status instantly'
	}
] as const

const BENEFITS = [
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
] as const

export default function LearnMorePage() {
	return (
		<main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
			<div className="space-y-10">
				<section className="text-center space-y-4">
					<NeulandPalm className="mx-auto h-20 w-auto text-terminal-text" />
					<p className="font-mono text-xs uppercase tracking-[0.2em] text-terminal-lightGreen">
						Member ID Verification
					</p>
					<h1 className="text-2xl font-bold tracking-tight text-terminal-text sm:text-3xl">
						Neuland ID Verificator
					</h1>
					<p className="text-sm text-terminal-text/60">
						Cryptographically signed digital membership cards
					</p>
					<Button asChild>
						<Link href="/">
							Start Scanning
							<ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
						</Link>
					</Button>
				</section>

				<section className="space-y-5">
					<h2 className="font-mono text-xs uppercase tracking-[0.2em] text-terminal-lightGreen">
						Features
					</h2>
					<TerminalPanel title="Capabilities">
						<div className="grid grid-cols-1 gap-px bg-terminal-window-border sm:grid-cols-2 lg:grid-cols-4">
							{FEATURES.map((feature) => (
								<div
									key={feature.title}
									className="relative min-h-[160px] bg-terminal-window p-5"
								>
									<div className="absolute top-4 right-4 flex size-9 items-center justify-center border border-terminal-window-border bg-terminal-card">
										<feature.icon className="size-4 text-terminal-text/70" />
									</div>
									<h3 className="pr-12 font-mono text-sm font-semibold text-terminal-lightGreen">
										{feature.title}
									</h3>
									<p className="mt-2 pr-12 text-xs leading-relaxed text-terminal-text/50">
										{feature.description}
									</p>
								</div>
							))}
						</div>
					</TerminalPanel>
				</section>

				<section className="space-y-5">
					<h2 className="font-mono text-xs uppercase tracking-[0.2em] text-terminal-lightGreen">
						How It Works
					</h2>
					<TerminalPanel title="Verification Flow">
						<ol className="space-y-4 p-5">
							{STEPS.map((item) => (
								<li key={item.step} className="flex items-start gap-3">
									<span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-terminal-cyan/80">
										{item.step}
									</span>
									<div>
										<p className="font-mono text-sm font-semibold text-terminal-lightGreen">
											{item.title}
										</p>
										<p className="mt-0.5 text-xs leading-relaxed text-terminal-text/50">
											{item.description}
										</p>
									</div>
								</li>
							))}
						</ol>
					</TerminalPanel>
					<p className="text-center text-xs text-terminal-text/45">
						Each QR code contains encrypted member data that can only be
						verified with our secure system. This prevents fraud and ensures
						only valid members can access events.
					</p>
				</section>

				<section className="space-y-5">
					<h2 className="font-mono text-xs uppercase tracking-[0.2em] text-terminal-lightGreen">
						Why Digital Verification
					</h2>
					<TerminalPanel title="Benefits">
						<div className="grid grid-cols-1 gap-px bg-terminal-window-border md:grid-cols-3">
							{BENEFITS.map((benefit) => (
								<div
									key={benefit.title}
									className="relative min-h-[160px] bg-terminal-window p-5"
								>
									<div className="absolute top-4 right-4 flex size-9 items-center justify-center border border-terminal-window-border bg-terminal-card">
										<benefit.icon className="size-4 text-terminal-text/70" />
									</div>
									<h3 className="pr-12 font-mono text-sm font-semibold text-terminal-lightGreen">
										{benefit.title}
									</h3>
									<p className="mt-2 pr-12 text-xs leading-relaxed text-terminal-text/50">
										{benefit.description}
									</p>
								</div>
							))}
						</div>
					</TerminalPanel>
				</section>

				<section className="text-center space-y-4">
					<h2 className="text-xl font-bold">Ready to Start?</h2>
					<p className="text-sm text-terminal-text/60">
						Begin scanning Neuland IDs to verify their authenticity
					</p>
					<Button asChild>
						<Link href="/">
							Get Started
							<ArrowRight />
						</Link>
					</Button>
				</section>
			</div>
		</main>
	)
}
