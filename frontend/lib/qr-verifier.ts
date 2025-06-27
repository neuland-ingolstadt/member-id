export interface QRPayload {
	sub: string
	name: string
	iat: number
	exp: number
	type: string
}

export enum QRType {
	APP = 'app',
	APPLE_WALLET = 'apple_wallet',
	ANDROID_WALLET = 'android_wallet'
}

export interface VerificationResult {
	success: boolean
	payload: QRPayload | null
	error?: string
	debugInfo?: {
		base45DecodedLength: number
		decompressedLength: number
		cborLength: number
		signatureLength: number
		validationChecks?: {
			appOnlyCheck?: boolean
			strictValidation?: boolean
		}
	}
}

export interface VerificationSettings {
	onlyAllowAppQRCodes?: boolean
	strictValidation?: boolean
}

import { decode as base45DecodeLib } from 'base45'
import { decode as cborDecode } from 'cborg'
import { inflate } from 'pako'

let cachedPublicKey: string | null = null
let publicKeyPromise: Promise<string> | null = null
let publicKeyError: string | null = null

export function clearPublicKeyCache(): void {
	cachedPublicKey = null
	publicKeyPromise = null
	publicKeyError = null
}

export function isPublicKeyAvailable(): boolean {
	return cachedPublicKey !== null && publicKeyError === null
}

export function getPublicKeyError(): string | null {
	return publicKeyError
}

async function fetchPublicKey(): Promise<string> {
	if (cachedPublicKey) {
		return cachedPublicKey
	}

	if (publicKeyPromise) {
		return publicKeyPromise
	}

	publicKeyPromise = (async () => {
		try {
			const response = await fetch('/api/public-key', {
				method: 'GET',
				headers: {
					Accept: 'text/plain'
				}
			})

			if (!response.ok) {
				throw new Error(response.statusText)
			}

			const publicKey = await response.text()
			const trimmedKey = publicKey.trim()

			if (!/^[0-9a-fA-F]+$/.test(trimmedKey)) {
				throw new Error('Invalid public key format: not a valid hex string')
			}

			cachedPublicKey = trimmedKey
			publicKeyError = null
			return trimmedKey
		} catch (error) {
			publicKeyPromise = null
			const errorMessage = `Failed to fetch public key: ${error instanceof Error ? error.message : 'Unknown error'}`
			publicKeyError = errorMessage
			throw new Error(errorMessage)
		}
	})()

	return publicKeyPromise
}

let initializationPromise: Promise<void> | null = null

export async function initializePublicKey(): Promise<void> {
	if (initializationPromise) {
		return initializationPromise
	}

	initializationPromise = (async () => {
		try {
			await fetchPublicKey()
			console.log('Successfully initialized public key from backend')
		} catch (error) {
			console.error('Failed to initialize public key:', error)
		}
	})()

	return initializationPromise
}

export async function verifyQRCode(
	qrString: string,
	settings?: VerificationSettings
): Promise<VerificationResult> {
	if (!isPublicKeyAvailable()) {
		return {
			success: false,
			payload: null,
			error:
				'Public key not available. Please check your connection and try again.'
		}
	}

	try {
		if (
			!qrString ||
			typeof qrString !== 'string' ||
			qrString.trim().length === 0
		) {
			throw new Error('Invalid Member ID: empty or null string')
		}

		const cleanQrString = qrString.trim()

		if (cleanQrString.length < 10) {
			throw new Error('Invalid Member ID: string too short')
		}

		const base45Decoded = base45DecodeLib(cleanQrString)

		if (!base45Decoded || base45Decoded.length === 0) {
			throw new Error('Base45 decoding failed: invalid or empty result')
		}

		const decompressed = zlibDecompress(base45Decoded)

		if (decompressed.length < 64) {
			throw new Error(
				`Data too short to contain signature. Length: ${decompressed.length}, required: >= 64`
			)
		}

		const cborData = decompressed.slice(0, -64)
		const signatureBytes = decompressed.slice(-64)

		const payload = await parseCBOR(cborData)
		console.log('Parsed payload:', payload)

		// Apply validation settings
		const validationChecks: {
			appOnlyCheck?: boolean
			strictValidation?: boolean
		} = {}

		// Check if only app QR codes are allowed
		if (settings?.onlyAllowAppQRCodes) {
			validationChecks.appOnlyCheck = payload.type === QRType.APP
			if (!validationChecks.appOnlyCheck) {
				return {
					success: false,
					payload: null,
					error: `Only app Member IDs are allowed. Found: ${payload.type}`,
					debugInfo: {
						base45DecodedLength: base45Decoded.length,
						decompressedLength: decompressed.length,
						cborLength: cborData.length,
						signatureLength: signatureBytes.length,
						validationChecks
					}
				}
			}
		}

		// Apply strict validation if enabled
		if (settings?.strictValidation) {
			validationChecks.strictValidation = true

			// Additional strict validation checks
			const now = Math.floor(Date.now() / 1000)
			const issuedAt = payload.iat
			const expiresAt = payload.exp

			// Check if the QR code was issued in the future (clock skew tolerance)
			if (issuedAt > now + 300) {
				// 5 minutes tolerance
				return {
					success: false,
					payload: null,
					error: 'Member ID issued in the future (possible clock skew)',
					debugInfo: {
						base45DecodedLength: base45Decoded.length,
						decompressedLength: decompressed.length,
						cborLength: cborData.length,
						signatureLength: signatureBytes.length,
						validationChecks
					}
				}
			}

			// Check if the QR code expires too far in the future (suspicious)
			if (expiresAt > now + 86400 * 365) {
				// 1 year
				return {
					success: false,
					payload: null,
					error: 'Member ID expires too far in the future',
					debugInfo: {
						base45DecodedLength: base45Decoded.length,
						decompressedLength: decompressed.length,
						cborLength: cborData.length,
						signatureLength: signatureBytes.length,
						validationChecks
					}
				}
			}

			// Check if the QR code has already expired (with some tolerance)
			if (expiresAt < now - 300) {
				// 5 minutes tolerance
				return {
					success: false,
					payload: null,
					error: 'Member ID has expired',
					debugInfo: {
						base45DecodedLength: base45Decoded.length,
						decompressedLength: decompressed.length,
						cborLength: cborData.length,
						signatureLength: signatureBytes.length,
						validationChecks
					}
				}
			}
		}

		const signatureValid = await verifySignature(cborData, signatureBytes)

		const now = Math.floor(Date.now() / 1000)
		const isExpired = payload.exp < now

		const result: VerificationResult = {
			success: signatureValid && !isExpired,
			payload,
			error: !signatureValid
				? 'Invalid signature'
				: isExpired
					? 'Signature expired'
					: undefined,
			debugInfo: {
				base45DecodedLength: base45Decoded.length,
				decompressedLength: decompressed.length,
				cborLength: cborData.length,
				signatureLength: signatureBytes.length,
				validationChecks:
					Object.keys(validationChecks).length > 0
						? validationChecks
						: undefined
			}
		}

		return result
	} catch (error) {
		return {
			success: false,
			payload: null,
			error:
				error instanceof Error
					? error.message
					: 'Unknown error during QR verification'
		}
	}
}

function hexToBytes(hex: string): Uint8Array {
	const clean = hex.startsWith('0x') ? hex.slice(2) : hex

	if (clean.length % 2 !== 0) {
		throw new Error(`Invalid hex string length: ${clean.length} (must be even)`)
	}

	const arr = new Uint8Array(clean.length / 2)
	for (let i = 0; i < arr.length; i++) {
		const hexPair = clean.slice(i * 2, i * 2 + 2)
		const byte = parseInt(hexPair, 16)
		if (Number.isNaN(byte)) {
			throw new Error(
				`Invalid hex characters at position ${i * 2}: "${hexPair}"`
			)
		}
		arr[i] = byte
	}

	return arr
}

function zlibDecompress(data: Uint8Array): Uint8Array {
	try {
		if (!data || data.length === 0) {
			throw new Error('No data to decompress')
		}

		const result = inflate(data)

		if (!result || result.length === 0) {
			throw new Error('Decompression resulted in empty data')
		}

		return result
	} catch (error) {
		throw new Error(
			`Zlib decompression failed: ${error instanceof Error ? error.message : 'Unknown error'}`
		)
	}
}

async function verifySignature(
	data: Uint8Array,
	signature: Uint8Array
): Promise<boolean> {
	try {
		if (signature.length !== 64) {
			return false
		}

		if (!cachedPublicKey) {
			throw new Error('Public key not available')
		}

		const keyBytes = hexToBytes(cachedPublicKey)

		const cryptoKey = await crypto.subtle.importKey(
			'raw',
			keyBytes,
			{ name: 'ECDSA', namedCurve: 'P-256' },
			false,
			['verify']
		)

		const result = await crypto.subtle.verify(
			{ name: 'ECDSA', hash: 'SHA-256' },
			cryptoKey,
			signature,
			data
		)

		return result
	} catch (error) {
		throw new Error(
			`Signature verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
		)
	}
}

async function parseCBOR(data: Uint8Array): Promise<QRPayload> {
	try {
		const decoded = cborDecode(data)

		if (!decoded || typeof decoded !== 'object') {
			throw new Error('Invalid CBOR payload - not an object')
		}

		const decodedObj = decoded as Record<string, unknown>
		const { sub, name, iat, exp, t } = decodedObj

		if (!sub || typeof sub !== 'string') {
			throw new Error("Missing or invalid 'sub' field")
		}
		if (!name || typeof name !== 'string') {
			throw new Error("Missing or invalid 'name' field")
		}
		if (typeof iat !== 'number') {
			throw new Error("Missing or invalid 'iat' field")
		}
		if (typeof exp !== 'number') {
			throw new Error("Missing or invalid 'exp' field")
		}
		if (!t || typeof t !== 'string') {
			throw new Error("Missing or invalid 't' field")
		}

		let type: string
		switch (t) {
			case 'a':
				type = QRType.APP
				break
			case 'wi':
				type = QRType.APPLE_WALLET
				break
			case 'wa':
				type = QRType.ANDROID_WALLET
				break
			default:
				throw new Error(`Invalid type code: ${t}`)
		}

		return { sub, name, iat, exp, type }
	} catch (error) {
		throw new Error(
			`CBOR parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
		)
	}
}
