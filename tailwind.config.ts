import typography from "@tailwindcss/typography"
import daisyui from "daisyui"
import type { Config } from "tailwindcss"

const config: Config = {
  daisyui: {
    themes: [
      {
        rosepine: {
          primary: "#F6C177",
          secondary: "#25233A",
          tertiary: "#A3DBE4",
          accent: "#D1B4F4",
          neutral: "#191724",
          "base-content": "#FEFCFA",
          "base-100": "#1f1d2e",
          info: "#31748f",
          success: "#9ccfd8",
          warning: "#f6c177",
          error: "#eb6f92",
          "--rounded-box": "0.75rem",
          "--rounded-btn": "6.25rem",
          "--rounded-badge": "6.25rem",
          // '--tab-radius': '0.5rem'
        },
      },
    ],
  },
  content: ["./src/**/*.{html,js,svelte,ts,astro}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1240px",
      },
    },
    fontFamily: {
      "work-sans": ["Work Sans", "sans-serif"],
    },
    extend: {
      colors: {
        mint: "#A3DBE4",
        peach: "#F2BEBC",
        tertiary: "#D1B4F4",
        "bg-light": "#2C3041",
      },
      backgroundImage: {
        "secret-sauce":
          "linear-gradient(180deg, #ECBCB4 0%, #CE8991 39%, #8E3E60 76.5%, #471E48 100%)",
      },
    },
  },
  plugins: [daisyui, typography],
}

export default config
