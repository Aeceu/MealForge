/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
		"./hooks/**/*.{js,jsx,ts,tsx}",
		"./redux/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				"dark-shade": "#151210",
				"light-shade": "#BBA78D",
				"gray-shade": "#0a7ea4",
			},
		},
	},
	plugins: [],
};
