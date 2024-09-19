/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
		"./hooks/**/*.{js,jsx,ts,tsx}",
		"./redux/**/*.{js,jsx,ts,tsx}",
		"./utils/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				main: "#B25A1C",

				dark: {
					DEFAULT: "#151210",
					light: "#201D1C",
				},

				light: {
					DEFAULT: "#FFEDD5",
					dark: "#BBA78D",
				},

				gray: "#3A3A3A",
			},
			fontFamily: {
				chunk: ["Chunk", "sans-serif"],
				chunkp: ["Chunk-Print", "sans-serif"],
				pthin: ["Poppins-Thin", "sans-serif"],
				pextralight: ["Poppins-ExtraLight", "sans-serif"],
				plight: ["Poppins-Light", "sans-serif"],
				pregular: ["Poppins-Regular", "sans-serif"],
				pmedium: ["Poppins-Medium", "sans-serif"],
				psemibold: ["Poppins-SemiBold", "sans-serif"],
				pbold: ["Poppins-Bold", "sans-serif"],
				pextrabold: ["Poppins-ExtraBold", "sans-serif"],
				pblack: ["Poppins-Black", "sans-serif"],
				makeba: ["Makeba", "sans-serif"],
			},
		},
	},
	plugins: [],
};
