export function getRelativeTime(date: Date): string {
	const now = new Date()
	const diffInMs = date.getTime() - now.getTime()
	const diffInSeconds = Math.floor(diffInMs / 1000)
	const diffInMinutes = Math.floor(diffInSeconds / 60)
	const diffInHours = Math.floor(diffInMinutes / 60)
	const diffInDays = Math.floor(diffInHours / 24)
	const diffInMonths = Math.floor(diffInDays / 30)
	const diffInYears = Math.floor(diffInDays / 365)

	const isPast = diffInMs < 0
	const absDiffInMs = Math.abs(diffInMs)

	if (absDiffInMs < 60000) {
		return isPast ? 'just now' : 'in a moment'
	} else if (absDiffInMs < 3600000) {
		return isPast
			? `${Math.abs(diffInMinutes)} minutes ago`
			: `in ${diffInMinutes} minutes`
	} else if (absDiffInMs < 86400000) {
		return isPast
			? `${Math.abs(diffInHours)} hours ago`
			: `in ${diffInHours} hours`
	} else if (absDiffInMs < 2592000000) {
		return isPast ? `${Math.abs(diffInDays)} days ago` : `in ${diffInDays} days`
	} else if (absDiffInMs < 31536000000) {
		return isPast
			? `${Math.abs(diffInMonths)} months ago`
			: `in ${diffInMonths} months`
	} else {
		return isPast
			? `${Math.abs(diffInYears)} years ago`
			: `in ${diffInYears} years`
	}
}
