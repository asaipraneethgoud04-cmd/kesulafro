/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-tint": "#a04015",
        "on-tertiary": "#ffffff",
        "error-container": "#ffdad6",
        "secondary-fixed": "#ffdcc0",
        "outline-variant": "#ddc0b6",
        "surface-container-low": "#fff1ec",
        "surface-bright": "#fff8f6",
        "surface": "#fff8f6",
        "surface-container-highest": "#f3ded8",
        "surface-dim": "#ead6cf",
        "secondary": "#80552c",
        "on-secondary": "#ffffff",
        "surface-container": "#feeae3",
        "inverse-on-surface": "#ffede7",
        "tertiary": "#49522a",
        "tertiary-container": "#616a40",
        "on-surface-variant": "#57423b",
        "on-primary-fixed-variant": "#802a00",
        "on-primary-container": "#ffddd1",
        "tertiary-fixed-dim": "#c1cc99",
        "on-secondary-container": "#784f26",
        "secondary-fixed-dim": "#f4bb8a",
        "inverse-surface": "#3a2e2a",
        "on-surface": "#241915",
        "primary-fixed": "#ffdbce",
        "primary-container": "#aa471c",
        "on-primary-fixed": "#370e00",
        "surface-variant": "#f3ded8",
        "inverse-primary": "#ffb59a",
        "outline": "#8a7269",
        "secondary-container": "#fdc391",
        "surface-container-lowest": "#ffffff",
        "on-tertiary-fixed": "#171e00",
        "on-secondary-fixed": "#2d1600",
        "on-secondary-fixed-variant": "#653e17",
        "primary": "#8a3004",
        "error": "#ba1a1a",
        "on-error-container": "#93000a",
        "background": "#fff8f6",
        "on-primary": "#ffffff",
        "on-tertiary-container": "#e0eab5",
        "primary-fixed-dim": "#ffb59a",
        "on-tertiary-fixed-variant": "#424a24",
        "on-background": "#241915",
        "surface-container-high": "#f8e4dd",
        "on-error": "#ffffff",
        "tertiary-fixed": "#dee8b3",
        "accent": "#115e59",
        "accent-light": "#ccfbf1",
        "on-accent": "#ffffff",
        "section-dark": "#576037"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      maxWidth: {
        "container": "1200px",
      },
      spacing: {
        "container-max": "1200px",
        "margin-mobile": "16px",
        "gutter": "30px",
        "unit": "8px",
        "section-gap": "80px"
      },
      fontFamily: {
        "sans": ["Aquavit", "sans-serif"],
        "serif": ["Aquavit", "sans-serif"],
        "headline-md": ["Aquavit", "sans-serif"],
        "headline-lg": ["Aquavit", "sans-serif"],
        "body-lg": ["Aquavit", "sans-serif"],
        "label-md": ["Aquavit", "sans-serif"],
        "display-lg-mobile": ["Aquavit", "sans-serif"],
        "display-lg": ["Aquavit", "sans-serif"],
        "body-md": ["Aquavit", "sans-serif"]
      },
      fontSize: {
        // Utility scale (pixel-precise)
        "xs":   ["14px", { lineHeight: "20px" }],           // Small — 14px all
        "sm":   ["16px", { lineHeight: "24px" }],           // Small desktop — 16px
        "base": ["18px", { lineHeight: "28px" }],           // Body — 18px desktop
        "lg":   ["20px", { lineHeight: "30px" }],           // Body Large tablet
        "xl":   ["22px", { lineHeight: "32px" }],           // Body Large desktop
        "2xl":  ["24px", { lineHeight: "34px" }],           // H3 mobile — 24px
        "3xl":  ["28px", { lineHeight: "38px" }],           // H3 desktop — 28px
        "4xl":  ["32px", { lineHeight: "42px" }],           // H2 mobile — 32px
        "5xl":  ["48px", { lineHeight: "56px" }],           // H2 desktop — 48px
        "6xl":  ["72px", { lineHeight: "78px", letterSpacing: "-0.02em" }], // H1 desktop — 72px

        // Named semantic tokens
        "headline-lg":      ["48px", { lineHeight: "56px", fontWeight: "700" }],           // H2 desktop
        "headline-md":      ["32px", { lineHeight: "40px", fontWeight: "700" }],           // H2 mobile / H3 large
        "body-lg":          ["20px", { lineHeight: "30px", fontWeight: "400" }],           // Body Large
        "label-md":         ["16px", { lineHeight: "22px", letterSpacing: "0.05em", fontWeight: "600" }], // Label / Small
        "display-lg-mobile":["44px", { lineHeight: "52px", fontWeight: "700" }],           // H1 mobile
        "display-lg":       ["72px", { lineHeight: "78px", letterSpacing: "-0.02em", fontWeight: "700" }], // H1 desktop
        "body-md":          ["18px", { lineHeight: "28px", fontWeight: "400" }]            // Body
      },
      keyframes: {
        "scroll-up": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" }
        },
        "scroll-down": {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" }
        },
        "scroll-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "shimmer": {
          "0%": { transform: "translateX(-150%) skewX(-15deg)" },
          "10%": { transform: "translateX(150%) skewX(-15deg)" },
          "100%": { transform: "translateX(150%) skewX(-15deg)" }
        }
      },
      animation: {
        "scroll-up": "scroll-up 10s linear infinite",
        "scroll-down": "scroll-down 10s linear infinite",
        "scroll-left": "scroll-left 10s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 8s linear infinite"
      }
    },
  },
  plugins: [],
}
