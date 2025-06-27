import { QRType } from '@/lib/qr-verifier'

export function getQRTypeDisplayName(type: string): string {
	switch (type) {
		case QRType.APP:
			return 'App Member ID'
		case QRType.APPLE_WALLET:
			return 'Apple Wallet Pass'
		case QRType.ANDROID_WALLET:
			return 'Android Wallet Pass'
		default:
			return type
	}
}
