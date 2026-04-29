import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class", '[data-theme="dark"]'],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--ui-border))',
  			input: 'hsl(var(--ui-input))',
  			ring: 'hsl(var(--ui-ring))',
  			background: 'hsl(var(--ui-background))',
  			foreground: 'hsl(var(--ui-foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--ui-primary))',
  				foreground: 'hsl(var(--ui-primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--ui-secondary))',
  				foreground: 'hsl(var(--ui-secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--ui-destructive))',
  				foreground: 'hsl(var(--ui-destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--ui-muted))',
  				foreground: 'hsl(var(--ui-muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--ui-accent))',
  				foreground: 'hsl(var(--ui-accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--ui-popover))',
  				foreground: 'hsl(var(--ui-popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--ui-card))',
  				foreground: 'hsl(var(--ui-card-foreground))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			aurora: {
  				from: {
  					backgroundPosition: '50% 50%, 50% 50%'
  				},
  				to: {
  					backgroundPosition: '350% 50%, 350% 50%'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			aurora: 'aurora 60s linear infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
