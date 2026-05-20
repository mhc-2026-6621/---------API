/** @type {import('next').NextConfig} */
const nextConfig = {
	poweredByHeader: false,
	onDemandEntries: {
		maxInactiveAge: 60 * 1000,
		pagesBufferLength: 2,
	},
};

module.exports = nextConfig;
