/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development'

const nextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
	},
	// Static export is for production builds only. In `next dev` we keep a
	// server so /api can be rewritten to the local Rust backend (same as nginx).
	...(!isDev && { output: 'export' }),
	reactCompiler: true,
	poweredByHeader: false,
	...(isDev && {
		rewrites: async () => [
			{
				source: '/api/:path*',
				destination: `${process.env.BACKEND_URL ?? 'http://127.0.0.1:8000'}/:path*`,
			},
		],
	}),
}

export default nextConfig
