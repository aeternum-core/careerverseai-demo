/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cosmic: {
          dark: "#030014",
          card: "rgba(13, 8, 38, 0.5)",
          border: "rgba(99, 102, 241, 0.15)",
          neonCyan: "#06b6d4",
          neonPink: "#ec4899",
          neonPurple: "#8b5cf6",
          neonGreen: "#10b981",
        }
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(to bottom, #030014, #0b0726, #12093a)',
        'cosmic-glow': 'radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(6, 182, 212, 0.4)',
        'neon-pink': '0 0 15px rgba(236, 72, 153, 0.4)',
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
      }
    },
  },
  plugins: [],
}
