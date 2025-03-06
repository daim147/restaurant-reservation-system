/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#4f46e5', // Indigo-600 as primary color
				danger: '#dc2626', // Red-600 for danger
				success: '#16a34a', // Green-600 for success
			},
		},
	},
	plugins: [],
};
