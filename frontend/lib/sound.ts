class SoundManager {
	private audioContext: AudioContext | null = null
	private gainNode: GainNode | null = null
	private oscillator: OscillatorNode | null = null

	constructor() {
		// Initialize audio context on first user interaction
		if (typeof window !== 'undefined') {
			this.initAudioContext = this.initAudioContext.bind(this)
		}
	}

	private initAudioContext() {
		if (this.audioContext) return

		try {
			this.audioContext =
				new // biome-ignore lint/suspicious/noExplicitAny: yeah
				(window.AudioContext || (window as any).webkitAudioContext)()
			this.gainNode = this.audioContext.createGain()
			this.gainNode.connect(this.audioContext.destination)
		} catch (error) {
			console.warn('Audio context not supported:', error)
		}
	}

	playScanSound(
		volume: number = 0.7,
		frequency: number = 800,
		duration: number = 150
	) {
		if (!this.audioContext || !this.gainNode) {
			// Try to initialize on first play
			this.initAudioContext()
			if (!this.audioContext || !this.gainNode) return
		}

		try {
			// Resume audio context if suspended
			if (this.audioContext.state === 'suspended') {
				this.audioContext.resume()
			}

			// Create oscillator
			this.oscillator = this.audioContext.createOscillator()
			this.oscillator.type = 'sine'
			this.oscillator.frequency.setValueAtTime(
				frequency,
				this.audioContext.currentTime
			)

			// Set volume
			this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
			this.gainNode.gain.exponentialRampToValueAtTime(
				0.01,
				this.audioContext.currentTime + duration / 1000
			)

			// Connect and play
			this.oscillator.connect(this.gainNode)
			this.oscillator.start(this.audioContext.currentTime)
			this.oscillator.stop(this.audioContext.currentTime + duration / 1000)

			// Clean up
			this.oscillator.onended = () => {
				this.oscillator = null
			}
		} catch (error) {
			console.warn('Failed to play scan sound:', error)
		}
	}

	playSuccessSound(volume: number = 0.7) {
		// Play a pleasant ascending chord for successful verification
		this.playScanSound(volume, 523, 100) // C5
		setTimeout(() => this.playScanSound(volume, 659, 100), 100) // E5
		setTimeout(() => this.playScanSound(volume, 784, 200), 200) // G5
	}

	playDuplicateSound(volume: number = 0.7) {
		// Play a warning sound for duplicates
		this.playScanSound(volume, 400, 150) // Lower frequency
		setTimeout(() => this.playScanSound(volume, 350, 200), 150) // Even lower
	}

	playErrorSound(volume: number = 0.7) {
		// Play descending tones for errors
		this.playScanSound(volume, 400, 150)
		setTimeout(() => this.playScanSound(volume, 300, 150), 150)
		setTimeout(() => this.playScanSound(volume, 200, 200), 300)
	}

	dispose() {
		if (this.oscillator) {
			this.oscillator.stop()
			this.oscillator.disconnect()
		}
		if (this.gainNode) {
			this.gainNode.disconnect()
		}
		if (this.audioContext) {
			this.audioContext.close()
		}
	}
}

export const soundManager = new SoundManager()
