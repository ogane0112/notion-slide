import type { Config } from "tailwindcss";

const config: Config = {
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
        // Notion風のカラーパレット
        notion: {
          text: {
            DEFAULT: "var(--notion-text)",
            light: "var(--notion-text-light)",
          },
          bg: {
            DEFAULT: "var(--notion-background)",
            hover: "var(--notion-background-hover)",
            gray: "var(--notion-background-gray)",
          },
          border: "var(--notion-border)",
          accent: {
            DEFAULT: "var(--notion-accent)",
            light: "var(--notion-accent-light)",
          },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--notion-text)',
            '--tw-prose-headings': 'var(--notion-text)',
            maxWidth: 'none',
            color: 'var(--notion-text)',
            lineHeight: '1.6',
            p: {
              marginTop: '0.75em',
              marginBottom: '0.75em',
            },
            h1: {
              fontSize: '2.5rem',
              marginTop: '2rem',
              marginBottom: '1rem',
              fontWeight: '700',
            },
            h2: {
              fontSize: '2rem',
              marginTop: '1.75rem',
              marginBottom: '0.75rem',
              fontWeight: '600',
            },
            h3: {
              fontSize: '1.5rem',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
              fontWeight: '600',
            },
            pre: {
              backgroundColor: 'var(--notion-background-gray)',
              padding: '1rem',
              borderRadius: '0.375rem',
            },
            code: {
              color: 'var(--notion-text)',
              backgroundColor: 'var(--notion-background-gray)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
      spacing: {
        'slide': '56.25%', // 16:9アスペクト比
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
