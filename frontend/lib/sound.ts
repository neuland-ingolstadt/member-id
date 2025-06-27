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
		volume: number = 0.3,
		frequency: number = 800,
		duration: number = 150,
		waveform: OscillatorType = 'sine'
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
			this.oscillator.type = waveform
			this.oscillator.frequency.setValueAtTime(
				frequency,
				this.audioContext.currentTime
			)

			// Set volume with smoother envelope
			this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
			this.gainNode.gain.linearRampToValueAtTime(
				volume,
				this.audioContext.currentTime + 0.01
			)
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

	playSuccessSound(volume: number = 0.5) {
		// Success: Bright ping sound (like a notification)
		this.playScanSound(volume, 800, 100, 'sine')
		setTimeout(() => this.playScanSound(volume, 1000, 80, 'sine'), 50)
	}

	playDuplicateSound(volume: number = 0.35) {
		// Duplicate: Quick double beep (like a warning)
		this.playScanSound(volume, 600, 60, 'square')
		setTimeout(() => this.playScanSound(volume, 600, 60, 'square'), 120)
	}

	playErrorSound(volume: number = 0.35) {
		// Error: Low buzz sound (like an error alert)
		this.playScanSound(volume, 200, 200, 'sawtooth')
		setTimeout(() => this.playScanSound(volume, 150, 200, 'sawtooth'), 100)
	}

	playScanStartSound(volume: number = 0.3) {
		// Start: Gentle chime (like a bell)
		this.playScanSound(volume, 440, 120, 'triangle')
		setTimeout(() => this.playScanSound(volume, 660, 100, 'triangle'), 80)
	}

	playScanEndSound(volume: number = 0.3) {
		// End: Soft click sound (like a button press)
		this.playScanSound(volume, 300, 50, 'sine')
		setTimeout(() => this.playScanSound(volume, 200, 50, 'sine'), 30)
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
