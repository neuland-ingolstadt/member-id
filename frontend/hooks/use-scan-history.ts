"use client";

import { useCallback, useEffect, useState } from "react";
import type { VerificationResult } from "@/lib/qr-verifier";

export interface ScanRecord {
	id: string;
	qrData: string;
	timestamp: number;
	result: VerificationResult;
	isDuplicate: boolean;
}

export interface ScanStats {
	totalScans: number;
	validScans: number;
	invalidScans: number;
	duplicateScans: number;
	uniqueScans: number;
}

// Use a more restrictive key that's less likely to conflict with other apps
const STORAGE_KEY = "_mbr_id_scan_data_v1";

export function useScanHistory() {
	const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
	const [stats, setStats] = useState<ScanStats>({
		totalScans: 0,
		validScans: 0,
		invalidScans: 0,
		duplicateScans: 0,
		uniqueScans: 0,
	});

	// Load scan history from localStorage on mount
	useEffect(() => {
		if (typeof window !== "undefined") {
			try {
				const stored = localStorage.getItem(STORAGE_KEY);
				if (stored) {
					const parsedHistory = JSON.parse(stored) as ScanRecord[];
					setScanHistory(parsedHistory);
					updateStats(parsedHistory);
				}
			} catch (error) {
				console.error("Failed to load scan history from localStorage:", error);
			}
		}
	}, []);

	// Save scan history to localStorage whenever it changes
	useEffect(() => {
		if (typeof window !== "undefined" && scanHistory.length > 0) {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(scanHistory));
			} catch (error) {
				console.error("Failed to save scan history to localStorage:", error);
			}
		}
	}, [scanHistory]);

	const updateStats = useCallback((history: ScanRecord[]) => {
		const totalScans = history.length;
		const validScans = history.filter((scan) => scan.result.success).length;
		const invalidScans = history.filter((scan) => !scan.result.success).length;
		const duplicateScans = history.filter((scan) => scan.isDuplicate).length;
		const uniqueScans = totalScans - duplicateScans;

		setStats({
			totalScans,
			validScans,
			invalidScans,
			duplicateScans,
			uniqueScans,
		});
	}, []);
	
	const getScanByUserId = useCallback(
		(userId: string) => {
			// Sort the scan history by timestamp (ascending) so we get the oldest scan first
			const userScans = scanHistory
				.filter(
					(scan) => 
						scan.result.success && 
						scan.result.payload && 
						scan.result.payload.sub === userId
				)
				.sort((a, b) => a.timestamp - b.timestamp);
			
			// Return the oldest scan (first in the sorted array)
			return userScans.length > 0 ? userScans[0] : undefined;
		},
		[scanHistory]
	);

	const addScan = useCallback(
		(qrData: string, result: VerificationResult): { isDuplicate: boolean; scanRecord: ScanRecord; originalScan: ScanRecord | null } => {
			const trimmedData = result.success ? '[QR data truncated for security]' : qrData.trim();
			
			// Check for duplicates based on user ID (sub)
			// Only consider as duplicate if the current scan has a valid payload with a sub field
			let isDuplicate = false;
			let originalScan: ScanRecord | null = null;
			
			if (result.success && result.payload && result.payload.sub) {
				// Find the oldest scan with this user ID by using the getScanByUserId function
				// which sorts by timestamp and returns the oldest one
				originalScan = getScanByUserId(result.payload.sub) || null;
				
				// Mark as duplicate if we found an original scan
				isDuplicate = originalScan !== null;
			}
			
			const scanRecord: ScanRecord = {
				id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				qrData: trimmedData,
				timestamp: Date.now(),
				result,
				isDuplicate,
			};

			setScanHistory((prev) => {
				const newHistory = [scanRecord, ...prev];
				updateStats(newHistory);
				return newHistory;
			});

			return { isDuplicate, scanRecord, originalScan };
		},
		[scanHistory, updateStats, getScanByUserId]
	);

	const clearHistory = useCallback(() => {
		setScanHistory([]);
		setStats({
			totalScans: 0,
			validScans: 0,
			invalidScans: 0,
			duplicateScans: 0,
			uniqueScans: 0,
		});
		if (typeof window !== "undefined") {
			localStorage.removeItem(STORAGE_KEY);
		}
	}, []);

	const removeScan = useCallback((scanId: string) => {
		setScanHistory((prev) => {
			const newHistory = prev.filter((scan) => scan.id !== scanId);
			updateStats(newHistory);
			return newHistory;
		});
	}, [updateStats]);

	const getScanByQRData = useCallback(
		(qrData: string) => {
			return scanHistory.find((scan) => scan.qrData === qrData.trim());
		},
		[scanHistory]
	);

	return {
		scanHistory,
		stats,
		addScan,
		clearHistory,
		removeScan,
		getScanByQRData,
		getScanByUserId,
	};
}
