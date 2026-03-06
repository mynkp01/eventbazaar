const { yellow } = require("@mui/material/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xxs: "320px",
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      // backgroundImage: {
      //   "backGradient": "url('./src/assets/others/backgroundGradient')",
      // },
      screens: {
        "xxs-h": { 'raw': '(min-height: 320px)' },
        "xs-h": { 'raw': '(min-height: 480px)' },
        "sm-h": { 'raw': '(min-height: 640px)' },
        "md-h": { 'raw': '(min-height: 768px)' },
        "lg-h": { 'raw': '(min-height: 1024px)' },
        "xl-h": { 'raw': '(min-height: 1280px)' },
        "2xl-h": { 'raw': '(min-height: 1536px)' },
      },
      fontFamily: {
        jost: ['Jost', 'sans-serif'],
      },
      colors: {
        customer: {
          primary: {
            100: "#024288",
          },
          secondary: {
            100: "#E3FCEA",
          },
        },
        primary: {
          20: "#FFFFFF",
          50: "#EFEFEF",
          100: "#FCFCFC",
          150: "#9DA0B6",
          200: "#F4F4F4",
          300: "#F7F7F7",
          400: "#9A9FA5",
          500: "#6F767E",
          600: "#33383F",
          700: "#A4A4A4",
          800: "#1A1D1F",
          900: "#C5C5C5",
          1000: "#FFFCF6",
        },
        plans: {
          // lite: (opacity = 1) => `rgba(255,180,80,${opacity})`,
          lite: (opacity = 1) => `rgba(111,175,115,${opacity})`,
          premium: (opacity = 1) => `rgba(111,175,115,${opacity})`,
          enterprise: (opacity = 1) => `rgba(27,94,131,${opacity})`,
          verticalDisabled: (opacity = 1) => `rgba(243,243,243,${opacity})`,
        },
        green: {
          10: "#FDFFFB",
          20: "#17E071",
          50: "#B5E4CA",
          100: "#23C55E",
          200: "#83BF6E",
          300: "#27A376",
          400: "#5E8C3A",
          500: "#5F7A69",
          600: "#AAFE69",
          700: "#4e7330",
          800: "#74C273",
        },
        blue: {
          50: "#B1E5FC",
          100: "#2A85FF",
          300: "#2F78EE",
          400: "#024288",
          900: "#274760"
        },
        orange: {
          100: "#FFBC99",
        },
        purple: {
          100: "#CABDFF",
          500: "#8E59FF",
        },
        yellow: {
          100: "#FFD88D",
          200: "#FFA800",
          300: "#FFC554",
        },
        red: {
          300: "#E03137",
        },
        grey: {
          50: "#7B7B7B",
          100: "#818181",
          200: "#545454",
          300: "#E6E7EC",
          400: "#4A4A4A",
          500: "#FAFBFC",
          600: "#A7A7A7",
          700: "#565656",
          800: "#C2C2C2",
          900: "#979696",
          1000: "#867E7E",
          1100: "#585858",
          1200: "#6F6F6F",
          1300: "#9F9F9F"
        },
        black: {
          DEFAULT: "#000000",
          50: "#040D08",
          100: "#111637",
          200: "#0E0E0E",
          300: "#21201F",
          400: "#202020",
          500: "#18181B",
          600: "#333333"
        },
        white: {
          DEFAULT: "#ffffff",
          50: "#F0F0F0",
          100: "#E4E4E7",
          200: "#E2E2E2",
          300: "#F7FFF0"
        },
      },
      boxShadow: {
        inner:
          "inset 0 1px 1px rgba(255, 255, 255, 1), inset 0 -2px 1px rgba(0, 0, 0, 0.05)",
        bottom:
          "0 4px 8px -4px rgba(0, 0, 0, 0.25), 0 2px 0px 0px rgba(255, 255, 255, 0.25), 0 -1px 1px 0px rgba(0, 0, 0, 0.04)",
        switchButton:
          "0px 4px 8px -4px rgba(0, 0, 0, 0.25), 0px 2px 2px 0px rgba(255, 255, 255, 0.25), 0px -1px 1px 0px rgba(0, 0, 0, 0.04)",
        dropdownInner:
          "inset 0 1px 1px rgba(255, 255, 255, 1), inset 0 -2px 1px rgba(0, 0, 0, 0.05)",
        loginContainerShadow:
          "10px 24px 57px 0px #0000001A, 39px 96px 103px 0px #00000017, 87px 216px 140px 0px #0000000D, 155px 384px 166px 0px #00000003, 242px 600px 181px 0px #00000000",
      },
    },
  },
  plugins: [],
};
