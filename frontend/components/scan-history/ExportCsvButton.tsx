'use client'

import { Download } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip'
import type { ScanRecord } from '@/hooks/use-scan-history'
import { useToast } from '@/hooks/use-toast'
import { getQRTypeDisplayName } from './utils'

interface ExportCsvButtonProps {
	scanHistory: ScanRecord[]
}

export function ExportCsvButton({ scanHistory }: ExportCsvButtonProps) {
	const [isExporting, setIsExporting] = useState(false)
	const { toast } = useToast()

	const escapeCsvField = (
		value: string | number | null | undefined
	): string => {
		if (value === null || value === undefined) return '""'
		const stringValue = String(value)
		return `"${stringValue.replace(/"/g, '""')}"`
	}

	const generateCSV = () => {
		const headers = [
			'Timestamp',
			'Local Time',
			'Status',
			'Error',
			'Name',
			'User ID',
			'QR Type',
			'Issued At',
			'Expires At',
			'Already Verified',
			'QR Data'
		]

		let csvContent = `${headers.join(',')}\n`

		scanHistory.forEach((scan) => {
			const timestamp = new Date(scan.timestamp).toISOString()
			const localTime = new Date(scan.timestamp).toLocaleString()
			const status = scan.result.success ? 'Valid' : 'Invalid'
			const error = scan.result.error || ''
			const name = scan.result.payload?.name || ''
			const id = scan.result.payload?.sub || ''

			let qrType = ''
			if (scan.result.payload?.type) {
				qrType = getQRTypeDisplayName(scan.result.payload.type)
			}

			let issuedAt = ''
			let expiresAt = ''
			if (scan.result.payload) {
				issuedAt = scan.result.payload.iat
					? new Date(scan.result.payload.iat * 1000).toISOString()
					: ''
				expiresAt = scan.result.payload.exp
					? new Date(scan.result.payload.exp * 1000).toISOString()
					: ''
			}

			const isDuplicate = scan.isDuplicate ? 'Yes' : 'No'

			const rowValues = [
				escapeCsvField(timestamp),
				escapeCsvField(localTime),
				escapeCsvField(status),
				escapeCsvField(error),
				escapeCsvField(name),
				escapeCsvField(id),
				escapeCsvField(qrType),
				escapeCsvField(issuedAt),
				escapeCsvField(expiresAt),
				escapeCsvField(isDuplicate),
				escapeCsvField(scan.qrData)
			]

			csvContent += `${rowValues.join(',')}\n`
		})

		return csvContent
	}

	const downloadCSV = () => {
		if (scanHistory.length === 0) {
			toast({
				title: 'No data to export',
				description: 'There are no scan records to export.',
				variant: 'destructive'
			})
			return
		}

		setIsExporting(true)

		try {
			const csvContent = generateCSV()
			const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
			const url = URL.createObjectURL(blob)

			const link = document.createElement('a')
			const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
			const filename = `scan-history-${timestamp}.csv`
			link.setAttribute('href', url)
			link.setAttribute('download', filename)
			link.style.visibility = 'hidden'

			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)

			URL.revokeObjectURL(url)

			toast({
				title: 'CSV Export Successful',
				description: `${scanHistory.length} scan records exported to ${filename}`,
				variant: 'default'
			})
		} catch (error) {
			console.error('Error exporting CSV:', error)
			toast({
				title: 'Export Failed',
				description: 'An error occurred while exporting the scan history.',
				variant: 'destructive'
			})
		} finally {
			setIsExporting(false)
		}
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						onClick={downloadCSV}
						disabled={isExporting}
						className="h-8 gap-1.5"
					>
						{isExporting ? (
							<>
								<div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary"></div>
								<span className="hidden sm:inline">Exporting...</span>
							</>
						) : (
							<>
								<Download className="h-4 w-4" />
								<span className="hidden sm:inline">Export CSV</span>
							</>
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Download scan history as CSV</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
