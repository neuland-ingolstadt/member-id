'use client'

import { useEffect, useMemo, useState } from 'react'

function createSeededRandom(seed: number) {
	let currentSeed = seed
	return () => {
		currentSeed = (currentSeed * 9301 + 49297) % 233280
		return currentSeed / 233280
	}
}

export function AmbientBackground() {
	const gridSize = 70
	const gridCols = 30
	const gridRows = 20

	const random = createSeededRandom(54321)

	const [currentLine, setCurrentLine] = useState<{
		type: 'horizontal' | 'vertical'
		position: number
		key: number
	}>(() => {
		const isHorizontal = random() < 0.5
		return {
			type: isHorizontal ? 'horizontal' : 'vertical',
			position: isHorizontal
				? (Math.floor(random() * (gridRows - 4)) + 2) * gridSize
				: (Math.floor(random() * (gridCols - 4)) + 2) * gridSize,
			key: 0
		}
	})

	const movementDuration = 3.5
	const fixedPause = 8
	const totalCycleTime = movementDuration + fixedPause

	useEffect(() => {
		const interval = setInterval(() => {
			const isHorizontal = Math.random() < 0.5
			setCurrentLine({
				type: isHorizontal ? 'horizontal' : 'vertical',
				position: isHorizontal
					? (Math.floor(Math.random() * (gridRows - 4)) + 2) * gridSize
					: (Math.floor(Math.random() * (gridCols - 4)) + 2) * gridSize,
				key: Date.now()
			})
		}, totalCycleTime * 1000)

		return () => clearInterval(interval)
	}, [totalCycleTime])

	const specialPoints = useMemo(() => {
		const rng = createSeededRandom(12345)
		return Array.from({ length: 20 }, (_, i) => {
			const col = Math.floor(rng() * (gridCols - 4)) + 2
			const row = Math.floor(rng() * (gridRows - 4)) + 2
			return {
				x: col * gridSize,
				y: row * gridSize,
				id: i
			}
		})
	}, [])

	return (
		<div
			className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
			style={{ backgroundColor: 'var(--ambient-background)' }}
			aria-hidden="true"
		>
			<div className="absolute bottom-0 left-0 hidden h-32 w-32 md:block">
				<div className="absolute bottom-0 left-0 h-0.5 w-20 bg-terminal-cyan/40" />
				<div className="absolute bottom-0 left-0 h-20 w-0.5 bg-terminal-cyan/40" />
				<div className="absolute bottom-6 left-6 h-0.5 w-12 bg-terminal-cyan/25" />
				<div className="absolute bottom-6 left-6 h-12 w-0.5 bg-terminal-cyan/25" />
			</div>

			<div className="absolute bottom-0 right-0 hidden h-32 w-32 md:block">
				<div className="absolute bottom-0 right-0 h-0.5 w-20 bg-terminal-cyan/40" />
				<div className="absolute bottom-0 right-0 h-20 w-0.5 bg-terminal-cyan/40" />
				<div className="absolute bottom-6 right-6 h-0.5 w-12 bg-terminal-cyan/25" />
				<div className="absolute bottom-6 right-6 h-12 w-0.5 bg-terminal-cyan/25" />
			</div>

			<div className="absolute left-0 top-1/4 h-96 w-0.5 origin-top rotate-45 bg-terminal-cyan/15" />
			<div className="absolute right-0 top-1/4 h-96 w-0.5 origin-top -rotate-45 bg-terminal-cyan/15" />
			<div className="absolute bottom-1/4 left-0 h-96 w-0.5 origin-bottom -rotate-45 bg-terminal-cyan/15" />
			<div className="absolute bottom-1/4 right-0 h-96 w-0.5 origin-bottom rotate-45 bg-terminal-cyan/15" />

			<div
				className="absolute inset-0"
				style={{
					backgroundImage: `
						linear-gradient(var(--ambient-grid-line) 1px, transparent 1px),
						linear-gradient(90deg, var(--ambient-grid-line) 1px, transparent 1px)
					`,
					backgroundSize: '70px 70px'
				}}
			/>

			{specialPoints.map((point) => (
				<div
					key={point.id}
					className="absolute pointer-events-none"
					style={{
						left: `${point.x}px`,
						top: `${point.y}px`,
						transform: 'translate(-50%, -50%)'
					}}
				>
					<div className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-terminal-text/15" />
					<div className="absolute h-0.5 w-8 -translate-x-1/2 -translate-y-1/2 bg-terminal-text/10" />
					<div className="absolute h-8 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-terminal-text/10" />
				</div>
			))}

			{currentLine.type === 'horizontal' ? (
				<div
					key={currentLine.key}
					className="grid-line-horizontal"
					style={{
						top: `${currentLine.position}px`,
						animationDuration: `${movementDuration}s`,
						animationIterationCount: '1'
					}}
				/>
			) : (
				<div
					key={currentLine.key}
					className="grid-line-vertical"
					style={{
						left: `${currentLine.position}px`,
						animationDuration: `${movementDuration}s`,
						animationIterationCount: '1'
					}}
				/>
			)}
		</div>
	)
}
